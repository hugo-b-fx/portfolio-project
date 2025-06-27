import express from "express";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { authenticateToken } from "../middleware/authMiddleware.js";
import OpenAI from "openai";
import Handlebars from "handlebars";
import Resume from "../modules/Resume.js";

const router = express.Router();

// Multer config for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Load Handlebars template file
async function loadTemplate(type, filename) {
  if (!["free", "paid"].includes(type)) {
    throw new Error("Invalid template type");
  }
  const templatePath = path.resolve(`./templates/${type}/${filename}`);
  return fs.readFile(templatePath, "utf-8");
}

// GET /resume/my — get previous resumes
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

// POST /resume — generate resume
router.post("/", authenticateToken, upload.single("photo"), async (req, res) => {
  try {
    const {
      templateType,
      templateFile,
      userPrompt,
      name,
      email,
      phone,
      experience = "[]",
      education = "[]",
      competencies = "",
      languages = "",
      interests = "",
      github = "",
    } = req.body;

    if (!templateType || !templateFile || !userPrompt || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Load & compile template
    const templateContent = await loadTemplate(templateType, templateFile);
    const template = Handlebars.compile(templateContent);

    // Generate AI summary
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `
You are an expert resume writer.
Write a professional, concise resume summary paragraph for a job applicant, in first person.

Candidate info:
- Name: ${name}
- Email: ${email}
- Interests and skills: ${userPrompt}

Make it formal, suitable for a resume, no greetings or closings.
Only return the summary.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const cleanResponse = completion.choices[0].message.content
      .replace(/(?:thank you|thanks|regards|sincerely|best).*/gi, "")
      .trim();

    // Photo URL
    let photoUrl = "";
    if (req.file) {
      photoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    // Parse JSON fields
    let parsedExperience = [], parsedEducation = [];
    try { parsedExperience = JSON.parse(experience); } catch {}
    try { parsedEducation = JSON.parse(education); } catch {}

    // Parse comma-separated lists
    const parsedCompetencies = competencies.split(",").map(s => s.trim()).filter(Boolean);
    const parsedLanguages = languages.split(",").map(s => s.trim()).filter(Boolean);
    const parsedInterests = interests.split(",").map(s => s.trim()).filter(Boolean);

    // Data for template
    const dataToFill = {
      name,
      email,
      phone,
      photoUrl,
      github,
      aiResponse: cleanResponse,
      experience: parsedExperience,
      education: parsedEducation,
      competencies: parsedCompetencies,
      languages: parsedLanguages,
      interests: parsedInterests,
    };

    const renderedResume = template(dataToFill);

    //Save to DB
    await Resume.create({
      user: req.user.userId,
      content: renderedResume,
    });

    res.json({ resumeText: renderedResume });
  } catch (error) {
    console.error("Resume generation error:", error);
    res.status(500).json({ error: "Failed to generate resume" });
  }
});

export default router;
