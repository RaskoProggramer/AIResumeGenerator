require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ✅ Serve frontend from ../public
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContentch?key=${process.env.GEMINI_API_KEY}`;

app.post("/api/generate", async (req, res) => {
   const {
    name, jobTitle, experienceYears, skills, education,
    experience, strengths, weaknesses, jobDescription
  } = req.body;
  
   const prompt = `Generate a concise, professional resume summary (no longer than 5 sentences) for ${name}, a ${jobTitle} with ${experienceYears} years of experience.
                    Include key skills: ${skills}. Background: ${education}. Experience highlights: ${experience}. Strengths: ${strengths}. Weaknesses: ${weaknesses}. 
                    Tailor it to match this job description: ${jobDescription}. Do not provide options or explanations — return only a single paragraph summary.`;



  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const aiText = response.data.candidates[0].content.parts[0].text;
    res.json({ summary: aiText });
    document.getElementById("summary").value = data.summary;

  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));