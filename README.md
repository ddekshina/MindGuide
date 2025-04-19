# 🧠 MindGuide

**MindGuide** is an AI-powered decision-making assistant that helps users with personal and professional growth through guided conversations.

---
## How It Works

**Initial Question:** The application starts with a general question about the user's area of focus.
**Conversation Flow:**
1. User responds to questions
2. Responses are sent to the Gemini API
3. The API generates the next relevant question
4. After 5 exchanges, a final recommendation is generated


**Decision Output:** The application displays a personalized recommendation with action steps and relevant resources.

---
## Web UI
![Create Next App - Personal - Microsoft​ Edge 19-04-2025 22_56_01](https://github.com/user-attachments/assets/0508f51d-5cd9-4547-9d2f-1f88b87b6f86)
![Create Next App - Personal - Microsoft​ Edge 19-04-2025 22_54_14](https://github.com/user-attachments/assets/f9674e29-87d5-43fe-a888-43d4ecb72ceb)
![Create Next App - Personal - Microsoft​ Edge 19-04-2025 22_54_30](https://github.com/user-attachments/assets/97da7e4d-b131-4e0e-b27e-e25e97998d5b)

---

## 🧱 Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Lucide
- **AI**: Gemini API
- **Tooling**: ESLint, PostCSS, SWC, npm

---
## Getting Started
### Prerequisites

- Node.js 18+ and npm/yarn
- A Google AI Studio API key (for Gemini models)

### Installation

Clone the repository:
```
git clone https://github.com/yourusername/mindguide.git
cd mindguide
```
Install dependencies:
```
npm install
# or
yarn install
```
Create a .env.local file in the root directory with your Google AI API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
```
Run the development server:
```
npm run dev
# or
yarn dev
```
Open http://localhost:3000 with your browser to see the application.

