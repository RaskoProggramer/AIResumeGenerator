
# 🧠 Intelligent Resume Generator

An AI-powered web application that generates professional resume summaries and full CV templates using Google's Gemini API. Users can preview their resume, choose from multiple templates, and export in PDF, DOCX, or HTML formats.

---

## 🚀 Features

- ✅ Upload profile picture
- ✅ Enter job and personal details
- ✅ Generate smart professional summaries using Gemini AI
- ✅ Preview CV in 3 elegant templates
- ✅ Download CV as PDF, DOCX, or HTML
- ✅ Basic ATS (Applicant Tracking System) compatibility check

---

## 🏗️ Project Structure

```
intelligent-resume-generator/
├── public/              # Frontend HTML, CSS, JS
│   └── index.html
│   └── style.css
│   └── script.js
├── server/              # Express backend using Gemini API
│   └── index.js
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **AI API:** Google Gemini (via Google AI Studio)
- **Export Tools:** `html2pdf.js`, Blob (for DOCX & HTML)

---

## 🔌 API Integration - Gemini AI

The backend uses [Google AI Studio’s Gemini API](https://makersuite.google.com/app) to generate resume summaries based on:

- Job Title
- Years of Experience
- Skills
- Optional: Job Description

**Prompt is dynamically generated and passed like:**

```txt
Generate a professional summary for a candidate applying as a {jobTitle}.
Experience: {years} years.
Skills: {skills}.
{optional job description}
```

---

## 🛠️ Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/intelligent-resume-generator.git
cd intelligent-resume-generator
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env` file in the root folder:**

```env
GOOGLE_API_KEY=your_google_api_key_here
```

> 🔑 Get your API key from [Google AI Studio](https://makersuite.google.com/app)

4. **Start the server:**

```bash
node server/index.js
```

5. **Open the app:**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build & Deployment (Free Options)

You can deploy this project using:

- **Frontend:** [GitHub Pages](https://pages.github.com/), [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/), [Railway](https://railway.app/), or [Glitch](https://glitch.com/)

> Ensure your backend is public and allows CORS for frontend access.

---

## 🚧 Known Limitations

- Gemini sometimes returns vague or overly short summaries
- No account system (all data is lost on refresh)
- No export to JSON or real-time editing

---

## 🌱 Future Enhancements

- Save resumes to user profiles (authentication)
- Add language translation
- Improve ATS scoring accuracy
- Add cover letter generator
- Integrate LinkedIn-style imports

---

## 🧠 Credits

- Built with ❤️ by [Mpho Rakgope]
- Powered by [Google Gemini API](https://ai.google.dev/)

---

## 📜 License

MIT License – free for personal and commercial use
