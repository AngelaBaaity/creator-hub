import { Router } from "express";
import { GoogleGenAI } from "@google/genai";

const router = Router();
const ai = new GoogleGenAI({ apiKey: process.env.OPENAI_API_KEY! });

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrendItem {
  id: string;
  platform: string;
  sourceColor: string;
  sourceBg: string;
  title: string;
  change: string;
  status: string;
  statusColor: string;
  statusDot: string;
  url: string;
  thumbnail: string;
  angles: string[];
}

// ─── In-memory cache (30 min) ─────────────────────────────────────────────────

let cache: { data: TrendItem[]; expires: number } | null = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ytStats(views: number): { status: string; statusColor: string; statusDot: string; change: string } {
  if (views >= 5_000_000) return { status: "Viral",        statusColor: "text-red-500",   statusDot: "bg-red-500",   change: `+${(views / 1_000_000).toFixed(1)}M views` };
  if (views >= 1_000_000) return { status: "Trending Fast",statusColor: "text-green-500", statusDot: "bg-green-500", change: `+${(views / 1_000_000).toFixed(1)}M views` };
  if (views >= 500_000)   return { status: "Peaking",      statusColor: "text-yellow-500",statusDot: "bg-yellow-400",change: `+${Math.round(views / 1_000)}K views` };
  if (views >= 100_000)   return { status: "Rising",       statusColor: "text-sky-500",   statusDot: "bg-sky-400",   change: `+${Math.round(views / 1_000)}K views` };
  return                         { status: "Stable",       statusColor: "text-gray-400",  statusDot: "bg-gray-300",  change: `+${Math.round(views / 1_000)}K views` };
}

function redditStats(score: number): { status: string; statusColor: string; statusDot: string; change: string } {
  if (score >= 50_000) return { status: "Viral",        statusColor: "text-red-500",   statusDot: "bg-red-500",   change: `+${Math.round(score / 1_000)}K pts` };
  if (score >= 10_000) return { status: "Trending Fast",statusColor: "text-green-500", statusDot: "bg-green-500", change: `+${Math.round(score / 1_000)}K pts` };
  if (score >= 5_000)  return { status: "Trending",     statusColor: "text-sky-500",   statusDot: "bg-sky-400",   change: `+${score.toLocaleString()} pts` };
  if (score >= 1_000)  return { status: "Rising",       statusColor: "text-sky-500",   statusDot: "bg-sky-400",   change: `+${score.toLocaleString()} pts` };
  return                      { status: "Stable",       statusColor: "text-gray-400",  statusDot: "bg-gray-300",  change: `+${score.toLocaleString()} pts` };
}

// ─── Data fetchers ────────────────────────────────────────────────────────────

async function fetchYouTubeTrending() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=5&regionCode=US&key=${key}`,
  );
  if (!res.ok) return [];
  const data = (await res.json()) as {
    items?: {
      id: string;
      snippet: { title: string; channelTitle: string; thumbnails?: { medium?: { url: string } } };
      statistics: { viewCount?: string };
    }[];
  };
  return (data.items ?? []).map((item) => ({
    id: item.id,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    views: parseInt(item.statistics.viewCount ?? "0", 10),
    thumbnail: item.snippet.thumbnails?.medium?.url ?? "",
  }));
}

async function fetchRedditTrending() {
  const res = await fetch("https://www.reddit.com/r/videos/hot.json?limit=4", {
    headers: { "User-Agent": "CreatorHubAI/1.0" },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as {
    data?: {
      children?: { data: { id: string; title: string; score: number; permalink: string } }[];
    };
  };
  return (data.data?.children ?? [])
    .filter((c) => !c.data.title.startsWith("["))
    .slice(0, 4)
    .map((c) => ({
      id: c.data.id,
      title: c.data.title.length > 85 ? c.data.title.slice(0, 85) + "…" : c.data.title,
      score: c.data.score,
      url: `https://reddit.com${c.data.permalink}`,
    }));
}

async function generateAngles(titles: string[]): Promise<string[][]> {
  const prompt = `You are a YouTube content strategist. For each trending topic below, write exactly 3 short high-CTR video title angles (max 12 words each, conversational, curiosity-driven). Reply ONLY with valid JSON matching this shape exactly: {"angles":[["a1","a2","a3"],...]} — one inner array per topic, same order, no extra keys.

Topics:
${titles.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;

  try {
    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(resp.text ?? "{}") as { angles?: string[][] };
    return parsed.angles ?? titles.map(() => []);
  } catch {
    return titles.map(() => []);
  }
}

// ─── Route ────────────────────────────────────────────────────────────────────

router.get("/trends", async (_req, res) => {
  try {
    if (cache && Date.now() < cache.expires) {
      return res.json({ trends: cache.data, cached: true });
    }

    const [ytItems, redditItems] = await Promise.all([
      fetchYouTubeTrending(),
      fetchRedditTrending(),
    ]);

    const allTitles = [
      ...ytItems.map((i) => i.title),
      ...redditItems.map((i) => i.title),
    ];

    const allAngles = await generateAngles(allTitles);

    const trends: TrendItem[] = [
      ...ytItems.map((item, i) => {
        const stats = ytStats(item.views);
        return {
          id: `yt-${item.id}`,
          platform: "YouTube",
          sourceColor: "text-[#ff0000]",
          sourceBg: "bg-[#fff0f0]",
          title: item.title,
          url: `https://youtube.com/watch?v=${item.id}`,
          thumbnail: item.thumbnail,
          angles: allAngles[i] ?? [],
          ...stats,
        };
      }),
      ...redditItems.map((item, i) => {
        const stats = redditStats(item.score);
        return {
          id: `reddit-${item.id}`,
          platform: "Reddit",
          sourceColor: "text-orange-500",
          sourceBg: "bg-orange-50",
          title: item.title,
          url: item.url,
          thumbnail: "",
          angles: allAngles[ytItems.length + i] ?? [],
          ...stats,
        };
      }),
    ];

    cache = { data: trends, expires: Date.now() + 30 * 60 * 1000 };
    res.json({ trends, cached: false });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

export default router;
