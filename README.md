# AI Resume Analyzer (AIRA)

AIRA is a professional-grade full-stack web application designed to analyze resumes using advanced generative AI. It provides deep insights into ATS compatibility, skill distribution, and strategic career improvements.

## 🚀 Features

- **Deep Text Analysis**: Uses Gemini 1.5/3 Pro LLMs to parse and understand complex professional summaries.
- **ATS Compatibility Scoring**: Get an instant score (0-100) based on industry-standard keyword and structural patterns.
- **Skill Domain Mapping**: Automatically categorizes detected skills into Languages, Frontend, Backend, Databases, DevOps, Cloud, and Architecture.
- **Gap Detection**: Identifies critical missing skills required for your target roles or seniority levels.
- **Data Visualization**: 
  - **ATS Gauge**: Visual representation of compatibility.
  - **Skill Radar Chart**: Shows your domain coverage.
  - **Category Strength Bar Graph**: Highlights your strongest professional pillars.
- **AI Insights**:
  - Strengths & Weaknesses breakdown.
  - Actionable improvement suggestions.
  - Hiring recommendation & AI confidence score.

## 🛠 Tech Stack

### Frontend
- **React 19**
- **Vite**
- **Tailwind CSS 4**
- **Recharts** (Skill visualization)
- **Framer Motion** (Smooth transitions)
- **Lucide React** (Modern iconography)

### Backend
- **Node.js**
- **Express.js**
- **@google/genai** (Gemini AI Integration)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-resume-analyzer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file (or update `.env.example` in this environment) with your Gemini API Key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

## 🏃 Driving the Application

### Development Mode
Runs both the Express server and Vite frontend concurrently.
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

## 🔌 API Reference

### Analyze Resume
Processes resume text and returns structured analysis.

- **Endpoint**: `POST /api/analyze`
- **Payload**:
  ```json
  {
    "resumeText": "Passionate software engineer with 5 years of experience in React, Node.js...",
    "targetRole": "Senior Full Stack Developer"
  }
  ```
- **Response**:
  ```json
  {
    "atsScore": 85,
    "skills": { ... },
    "allSkills": [ ... ],
    "missingSkills": [ ... ],
    "suggestions": [ ... ],
    "insights": { ... }
  }
  ```

## 📝 Usage Tips
- For best results, paste the full text of your resume including your professional summary, experience sections, and skill list.
- Providing a **Target Role** helps the AI tailor suggestions and identify gaps specific to that career path.
