import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";

const router: IRouter = Router();
const ai = new GoogleGenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" });

router.post("/validate", async (req, res) => {
  const { idea } = req.body as { idea?: string };
  if (!idea || typeof idea !== "string" || !idea.trim()) {
    res.status(400).json({ error: "idea is required" });
    return;
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a YouTube content strategist. Analyze this video idea for demand, competition, and audience fit: "${idea.trim()}"

Respond ONLY with valid JSON matching this exact shape:
{ "score": <number 0-100>, "label": <"High Potential" | "Medium Potential" | "Low Potential">, "reasoning": <1-2 sentence string>, "suggestion": <1 short actionable improvement string> }`,
      config: { responseMimeType: "application/json" },
    });

    const raw = result.text ?? "{}";
    const parsed = JSON.parse(raw) as {
      score: number;
      label: string;
      reasoning: string;
      suggestion: string;
    };

    res.json({
      score: Math.max(0, Math.min(100, Number(parsed.score) || 50)),
      label: parsed.label || "Medium Potential",
      reasoning: parsed.reasoning || "",
      suggestion: parsed.suggestion || "",
    });
  } catch (err) {
    console.error("validate error", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;
