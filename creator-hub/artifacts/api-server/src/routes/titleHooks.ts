import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";

const router: IRouter = Router();
const ai = new GoogleGenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" });

router.post("/title-hooks", async (req, res) => {
  const { title } = req.body as { title?: string };
  if (!title || typeof title !== "string" || !title.trim()) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a YouTube title expert. Transform this title into exactly 5 high-CTR hook variations, each with a specific hook type.

Original title: "${title.trim()}"

Hook types to use (pick the most fitting 5 from this list):
- "The Curiosity Gap" (creates information gap, makes viewer need to know)
- "The Warning" (alerts about a mistake or danger)
- "The Time-Frame" (challenge or experiment with specific duration)
- "The Challenge" (personal challenge or experiment)
- "The Contrarian" (goes against common belief)
- "The How-To" (clear instructional promise)
- "The Confession" (personal story reveal)
- "The Comparison" (versus or ranking angle)

Respond ONLY with valid JSON:
{
  "hooks": [
    { "type": "The Curiosity Gap", "title": "transformed title here" },
    { "type": "The Warning", "title": "transformed title here" },
    { "type": "The Time-Frame", "title": "transformed title here" },
    { "type": "The Challenge", "title": "transformed title here" },
    { "type": "The Contrarian", "title": "transformed title here" }
  ]
}`,
      config: { responseMimeType: "application/json" },
    });

    const raw = result.text ?? "{}";
    const parsed = JSON.parse(raw) as { hooks?: { type: string; title: string }[] };
    const hooks = Array.isArray(parsed.hooks) ? parsed.hooks.slice(0, 5) : [];

    res.json({ hooks });
  } catch (err) {
    console.error("title-hooks error", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;
