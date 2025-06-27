import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function listModels() {
  try {
    const response = await openai.models.list();
    console.log("Available models:", response.data.map(m => m.id));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
