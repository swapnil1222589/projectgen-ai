# 🚀 ProjectGen AI

> Turn a rough project idea into a complete development-ready documentation package with AI.

ProjectGen AI is a developer-first web application that helps you move from **idea → architecture → MVP → documentation → career-ready project content** in seconds.

Instead of staring at a blank README or wondering what features and technologies your project needs, describe your idea and let the AI generate a structured project roadmap.

## ✨ Features

* 🤖 **AI Project Architect** — Generate a structured project plan from a simple idea.
* 🧩 **Problem & Solution Definition** — Clearly describe the problem and proposed solution.
* 🚀 **Feature Planning** — Generate complete features and a focused MVP feature set.
* 🛠️ **Tech Stack Recommendation** — Get frontend, backend, database, and supporting tool suggestions.
* 📘 **README Generator** — Automatically create GitHub-ready Markdown documentation.
* 💼 **Resume Description Generator** — Turn project work into professional, resume-friendly bullets.
* 🎤 **Elevator Pitch** — Generate a concise project pitch.
* 🎬 **Demo Video Script** — Create a script for presenting your project.
* ☁️ **Cloud Project History** — Save generated projects to Firebase Firestore.
* 🔍 **Search Project History** — Quickly find saved roadmaps.
* 📥 **JSON Export** — Download generated project documentation as a JSON file.
* 📋 **One-Click Copy** — Copy README and resume content instantly.
* 🌙 **Dark / Light Mode** — Switch between themes.
* 📱 **Responsive UI** — Designed for desktop and mobile use.

## 🧠 How It Works

1. Enter a project idea.
2. ProjectGen AI sends the idea to the Gemini model with an architecture-focused system prompt.
3. The model returns structured JSON containing the project documentation package.
4. The generated roadmap is displayed in the dashboard.
5. Save the project to Firebase or export it as JSON.
6. Copy the generated README, resume content, pitch, or other documentation into your workflow.

## 🏗️ Generated Output

| Output             | Description                             |
| ------------------ | --------------------------------------- |
| Project Name       | A clear name for the project            |
| Problem Statement  | The real-world problem being addressed  |
| Solution           | Proposed product or technical solution  |
| Features           | Full feature set                        |
| MVP Features       | Prioritized MVP scope                   |
| Tech Stack         | Frontend, backend, database, and tools  |
| GitHub README      | Markdown documentation ready for GitHub |
| Resume Description | Resume-ready project bullets            |
| Elevator Pitch     | Short project explanation               |
| Demo Video Script  | Presentation/demo script                |

## 🛠️ Tech Stack

### Frontend

* React 18
* Vite
* Tailwind CSS utility classes
* Lucide React

### AI

* Google Gemini 2.5 Flash

### Backend / Cloud Services

* Firebase Authentication
* Firebase Firestore

### Core Web Technologies

* JavaScript
* JSX
* HTML

## 📂 Project Structure

```text
projectgen-ai/
├── App.jsx          # Main application and UI
├── main.jsx         # React entry point
├── index.html       # HTML entry point
├── package.json     # Project dependencies and scripts
└── README.md        # Documentation
```

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/swapnil1222589/projectgen-ai.git
cd projectgen-ai
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open the local Vite URL shown in your terminal.

### Production Build

Create a production build with:

```bash
npm run build
```

## 🔐 Configuration

ProjectGen AI uses:

* **Gemini** for AI-powered project generation.
* **Firebase Authentication** for user/session authentication.
* **Firebase Firestore** for storing project history.

Before deploying your own instance, configure the required Firebase runtime values and Gemini API access.

> ⚠️ Never commit a real API key or other secrets directly to a public repository. Use environment variables or your hosting provider's secret-management system.

## 📸 Main Sections

### Dashboard

A central workspace showing generated projects, AI connectivity, cloud sync status, and a quick project-generation input.

### New Project

Describe your idea and generate the full project documentation package.

### Project Vault

Browse, search, open, and delete saved project roadmaps stored in Firestore.

### About

A simple overview explaining the purpose of ProjectGen AI.

## 🎯 Use Cases

ProjectGen AI can help:

* Students turn hackathon ideas into buildable MVPs.
* Developers plan new side projects.
* Founders validate early product concepts.
* Job seekers create stronger project documentation.
* Teams quickly draft project architecture and technical documentation.
* Creators prepare demo presentations and pitches.

## 💡 Example Prompt

Try entering:

```text
Build an AI-powered platform that helps college students discover
internships, track applications, and generate personalized resumes.
```

ProjectGen AI can turn this into a structured project plan with architecture, MVP features, technology recommendations, README content, resume bullets, pitch, and demo script.

## 🔮 Future Improvements

Potential next steps include:

* User accounts and permanent authentication
* Private per-user project storage
* More AI providers and model selection
* Editable generated documentation
* Direct GitHub README publishing
* Project templates
* Team collaboration
* Export to Markdown/PDF
* Version history for generated projects
* Deployment presets for Vercel and other platforms

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Commit your work.
5. Open a pull request.

Please keep changes focused and provide a clear description of what you changed.

