require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const API_URL = `https://openrouter.ai/api/v1/chat/completions`;

app.post("/api/generate", async (req, res) => {
  const {
    name, jobTitle, experienceYears, skills, education,jobDescription
  } = req.body;

  const headers = {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:3000',  // optional, customize if needed
    'X-Title': 'Resume Generator App'
  };

  const prompt = `Generate a concise, professional resume summary (no longer than 5 sentences) for ${name}, a ${jobTitle} with ${experienceYears} years of experience.
          Include key skills: ${skills}. Background: ${education}. Tailor it to match this job description: ${jobDescription}. 
          Do not provide options or explanations — return only a single paragraph summary.`;

  try {
    const response = await axios.post(API_URL, {
      model: 'mistralai/mistral-small-3.2-24b-instruct:free', 
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ]
    }, { headers });

    const generatedSummary = response.data.choices[0].message.content;
    res.json({ summary: generatedSummary });

  } catch (error) {
    console.error('Error from OpenRouter API:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate resume summary' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
