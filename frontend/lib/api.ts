import axios from "axios";

/**
 * The backend base URL.
 * You can also set NEXT_PUBLIC_API_URL in .env if backend runs elsewhere.
 * Example: NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Reusable Axios instance.
 */
export const ytApi = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 60_000, // 60 seconds
});

/**
 * Checks if the given URL is a valid YouTube link.
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url) return false;
  const re =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]{6,}$/i;
  return re.test(url);
}

/**
 * Sends the YouTube URL to your backend `/predict/` endpoint.
 */
export async function postPredict(url: string) {
  return ytApi.post("/predict/", { url });
}
