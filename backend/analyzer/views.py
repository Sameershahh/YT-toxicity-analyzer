import re
import joblib
import pandas as pd
from django.conf import settings
from googleapiclient.discovery import build
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from collections import Counter


# ---------------------- Load ML model & vectorizer ----------------------
try:
    model = joblib.load("toxic_comment_model.pkl")
    vectorizer = joblib.load("tfidf_vectorizer.pkl")
    print("✅ Model and vectorizer loaded successfully.")
except Exception as e:
    model, vectorizer = None, None
    print(f"❌ Failed to load model/vectorizer: {e}")


YOUTUBE_API_KEY = getattr(settings, "YOUTUBE_API_KEY", None)


# ---------------------- Utilities ----------------------
def extract_video_id(url: str):
    """Extract YouTube video ID from URL."""
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(pattern, url)
    return match.group(1) if match else None


def fetch_youtube_comments(video_id: str, max_pages: int = 3):
    """Fetch comments from YouTube using the Data API."""
    youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
    comments = []
    next_page_token = None

    for _ in range(max_pages):
        request = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=100,
            pageToken=next_page_token,
            textFormat="plainText",
        )
        response = request.execute()

        for item in response.get("items", []):
            snippet = item["snippet"]["topLevelComment"]["snippet"]
            comments.append({
                "text": snippet.get("textDisplay", ""),
                "user": snippet.get("authorDisplayName", "Anonymous"),
            })

        next_page_token = response.get("nextPageToken")
        if not next_page_token:
            break

    return comments


# ---------------------- NEW: Toxicity categorization helper ----------------------
def categorize_toxicity(comments):
    """Lightweight keyword-based toxicity category counter."""
    categories = {
        "Insult": ["idiot", "stupid", "dumb", "ugly", "fool"],
        "Threat": ["kill", "die", "hurt", "attack", "destroy"],
        "Obscene": ["shit", "fuck", "bitch", "asshole", "crap"],
        "Identity Attack": ["racist", "gay", "black", "asian", "muslim", "jew"],
    }
    counts = Counter({c: 0 for c in categories})
    for c in comments:
        text = c.lower()
        for cat, kws in categories.items():
            if any(k in text for k in kws):
                counts[cat] += 1
    return [{"name": k, "value": v} for k, v in counts.items() if v > 0]


# ---------------------- Prediction Endpoint ----------------------
@api_view(["POST"])
def predict(request):
    """Analyze toxicity in YouTube comments given a YouTube video URL."""
    url = request.data.get("url")
    if not url:
        return Response({"error": "No URL provided"}, status=status.HTTP_400_BAD_REQUEST)

    if not YOUTUBE_API_KEY:
        return Response({"error": "Missing YouTube API key."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if not model or not vectorizer:
        return Response({"error": "Model or vectorizer not loaded."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    video_id = extract_video_id(url)
    if not video_id:
        return Response({"error": "Invalid YouTube URL."}, status=status.HTTP_400_BAD_REQUEST)

    comments_data = fetch_youtube_comments(video_id)
    if not comments_data:
        return Response({"error": "No comments found."}, status=status.HTTP_404_NOT_FOUND)

    comments_text = [c["text"] for c in comments_data]
    X = vectorizer.transform(comments_text)
    preds = model.predict(X)

    # Optional: get prediction probabilities for confidence
    try:
        probs = model.predict_proba(X).max(axis=1)
    except Exception:
        probs = [0.9] * len(preds)

    df = pd.DataFrame({
        "text": comments_text,
        "label": preds,
        "confidence": probs,
        "user": [c["user"] for c in comments_data],
    })

    total = len(df)
    toxic_mask = df["label"].astype(str).str.lower().eq("toxic") | df["label"].eq(1)
    toxic_count = toxic_mask.sum()
    toxic_ratio = round(toxic_count / total * 100, 2)

    neutral_count = ((df["label"] == "neutral") | (df["label"] == 0)).sum()
    positive_count = total - toxic_count - neutral_count

    # --- Extract top toxic words dynamically ---
    toxic_texts = " ".join(df[toxic_mask]["text"].tolist()).lower().split()
    top_toxic_words = [w for w, _ in Counter(toxic_texts).most_common(10)] if toxic_texts else []

    # --- Build response ---
    response_data = {
        "summary": {
            "totalComments": total,
            "toxicComments": int(toxic_count),
            "positiveComments": int(positive_count),
            "neutralComments": int(neutral_count),
            "toxicityRatio": toxic_ratio,
        },
        "charts": {
            "sentimentDistribution": [
                {"name": "Positive", "value": positive_count, "fill": "#22c55e"},
                {"name": "Neutral", "value": neutral_count, "fill": "#6b7280"},
                {"name": "Toxic", "value": toxic_count, "fill": "#ef4444"},
            ],
            "toxicityOverTime": [
                {"time": f"Batch {i+1}", "toxicity": round((df.iloc[:i*10+10]['label'].astype(str).str.lower().eq('toxic').mean()), 2)}
                for i in range(min(10, (total // 10) or 1))
            ],
        },
        "comments": [
            {
                "id": i,
                "text": row["text"],
                "label": (
                    "Toxic" if str(row["label"]).lower() in ["1", "toxic"]
                    else "Neutral" if str(row["label"]).lower() in ["0", "neutral"]
                    else "Positive"
                ),
                "confidence": round(float(row["confidence"]), 2),
                "user": row["user"],
            }
            for i, row in df.head(100).iterrows()
        ],
        "insights": {
            "mostToxicComment": (
                df[toxic_mask]["text"].iloc[0]
                if toxic_count > 0 else "No toxic comments detected."
            ),
            "averageToxicity": round(toxic_ratio / 100, 2),
            "topToxicWords": top_toxic_words,
            "suggestion": (
                "Excellent — very positive community!" if toxic_ratio < 5
                else "Moderate toxicity detected — consider moderating." if toxic_ratio < 20
                else "High toxicity detected — strong moderation recommended!"
            ),
        },
    }

    
    response_data["charts"]["toxicityCategories"] = categorize_toxicity(
        df[toxic_mask]["text"].tolist()
    )

    return Response(response_data, status=status.HTTP_200_OK)
