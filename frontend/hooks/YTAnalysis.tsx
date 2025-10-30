"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { YTResponse } from "@/types/yt";
import { isValidYouTubeUrl, postPredict } from "@/lib/api";

const LS_KEY = "yt_analysis_latest_v1";

export type AnalysisState =
  | { status: "idle" }
  | { status: "validating" }
  | { status: "analyzing" }
  | { status: "done"; data: YTResponse }
  | { status: "error"; error: string };

export function useYouTubeAnalysis() {
  const [state, setState] = useState<AnalysisState>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const data = JSON.parse(raw) as YTResponse;
        return { status: "done", data };
      }
    } catch {}
    return { status: "idle" };
  });

  const abortRef = useRef<AbortController | null>(null);

  const dispatchEvent = (name: string, detail?: any) => {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    } catch {}
  };

  const startAnalysis = useCallback(async (videoUrl: string) => {
    if (!isValidYouTubeUrl(videoUrl)) {
      const msg = "Invalid YouTube URL";
      setState({ status: "error", error: msg });
      dispatchEvent("ytAnalysisUpdated", { status: "error", error: msg });
      return Promise.reject(new Error(msg));
    }

    setState({ status: "validating" });
    dispatchEvent("ytAnalysisStarted", { url: videoUrl });

    setState({ status: "analyzing" });
    dispatchEvent("ytAnalysisUpdated", { status: "analyzing" });

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    const maxAttempts = 3;
    let attempt = 0;
    let lastErr: any = null;

    while (attempt < maxAttempts) {
      attempt++;
      try {
        const res = await postPredict(videoUrl);
        const payload = res.data as YTResponse;
        try {
          localStorage.setItem(LS_KEY, JSON.stringify(payload));
        } catch {}
        setState({ status: "done", data: payload });
        dispatchEvent("ytAnalysisUpdated", { status: "done", data: payload });
        return payload;
      } catch (err: any) {
        lastErr = err;
        const code = err?.response?.status;
        if (code === 429) {
          const wait = 1000 * Math.pow(2, attempt);
          await new Promise((r) => setTimeout(r, wait));
          continue;
        } else {
          break;
        }
      }
    }

    const message = lastErr?.response?.data?.detail || lastErr?.message || "Unknown error";
    setState({ status: "error", error: message });
    dispatchEvent("ytAnalysisUpdated", { status: "error", error: message });
    return Promise.reject(new Error(message));
  }, []);

  const clearStored = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setState({ status: "idle" });
    dispatchEvent("ytAnalysisUpdated", { status: "idle" });
  }, []);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return { state, startAnalysis, clearStored };
}
