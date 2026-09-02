import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";

const router: IRouter = Router();
const ai = new GoogleGenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" });

router.post("/metadata", async (req, res) => {
  const { title } = req.body as { title?: string };
  if (!title || typeof title !== "string" || !title.trim()) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a YouTube SEO expert. Generate complete video metadata for this title: "${title.trim()}"

Respond ONLY with valid JSON:
{
  "description": "<SEO-optimized video description, 120-180 words, natural tone, ends with a call to action>",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5", "#Tag6"],
  "tags": ["keyword phrase 1", "keyword phrase 2", "keyword phrase 3", "keyword phrase 4", "keyword phrase 5", "keyword phrase 6", "keyword phrase 7", "keyword phrase 8"]
}

Rules:
- hashtags: exactly 6, each starts with #, PascalCase, relevant to the video
- tags: exactly 8, lowercase multi-word keyword phrases for YouTube Studio`,
      config: { responseMimeType: "application/json" },
    });

    const raw = result.text ?? "{}";
    const parsed = JSON.parse(raw) as {
      description: string;
      hashtags: string[];
      tags: string[];
    };

    res.json({
      description: parsed.description || "",
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.slice(0, 6) : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8) : [],
    });
  } catch (err) {
    console.error("metadata error", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;
