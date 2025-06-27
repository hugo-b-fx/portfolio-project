// routes/chat.js
import express from "express";
import { OpenAI } from "openai";

const router = express.Router();
const USE_FAKE_API = false;

router.post("/", async (req, res) => {
  const { messages } = req.body;

  if (USE_FAKE_API) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return res.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: "This is a fake AI response for testing.",
          },
        },
      ],
    });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    res.json(completion);
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

export default router;
