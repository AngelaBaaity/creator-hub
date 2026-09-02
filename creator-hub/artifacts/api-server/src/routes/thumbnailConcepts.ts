import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";

const router: IRouter = Router();
const ai = new GoogleGenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" });

router.post("/thumbnail-concepts", async (req, res) => {
  const { title } = req.body as { title?: string };
  if (!title || typeof title !== "string" || !title.trim()) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a world-class YouTube thumbnail designer. For the video title below, generate exactly 3 distinct visual thumbnail concepts. Each concept must be highly specific, visual, and immediately actionable for a designer or editor.

Video title: "${title.trim()}"

Rules:
- Make each concept a genuinely DIFFERENT visual approach (e.g. one bold text-based, one reaction/face-based, one split-screen or comparison)
- Describe the layout, key visual elements, text overlays, color palette/mood, and any props or expressions
- Be concrete: describe what the viewer literally SEES, not abstract ideas
- Keep each description to 1–2 punchy sentences

Respond ONLY with valid JSON:
{
  "concepts": [
    "concept 1 description",
    "concept 2 description",
    "concept 3 description"
  ]
}`,
      config: { responseMimeType: "application/json" },
    });

    const raw = result.text ?? "{}";
    const parsed = JSON.parse(raw) as { concepts?: string[] };
    const concepts = Array.isArray(parsed.concepts) ? parsed.concepts.slice(0, 3) : [];

    res.json({ concepts });
  } catch (err) {
    console.error("thumbnail-concepts error", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;
