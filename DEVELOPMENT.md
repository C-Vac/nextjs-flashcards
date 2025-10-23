# Development Guide for the Flashcard App

This document outlines the architecture, setup, and development guidelines for the Flashcard App, with a particular focus on integrating AI agent capabilities.

## 1. Project Overview

The Study Tools Monorepo is a web-based application designed to help users learn and memorize information through flashcards and other study applets. It supports deck management, tag-based scoring, adaptive shuffling, and AI-powered flashcard generation. The project integrates a Next.js frontend with a Node.js/Express AI backend using Ollama for LLM interactions, aiming for dynamic content generation, personalized learning paths, and intuitive user interactions.

## 2. Architectural Overview

The application follows a client-server architecture, with a Next.js frontend and a Node.js/Express AI backend.

### 2.1. Frontend (Next.js/React)

*   **Technology:** Next.js (React), TypeScript, Tailwind CSS.
*   **Responsibilities:**
    *   User Interface (UI) and User Experience (UX).
    *   Handling user interactions (e.g., card flipping, answering, deck management).
    *   Displaying flashcards, stats, settings, and AI-generated content.
    *   Communicating with the AI Backend for AI-powered features.
*   **Key Components:**
    *   `apps/flashcard-app/src/app/page.tsx`: Main entry point for the application.
    *   `apps/flashcard-app/src/components/App.tsx`: The core Flashcard application component.
    *   `apps/flashcard-app/src/types/flashcard.d.ts`: TypeScript interface definitions for core data structures (Card, Deck, etc.).
    *   New views for AI features (e.g., GenerateFlashcards.tsx).

### 2.2. AI Backend

*   **Technology:** Node.js with Express, integrated with Ollama for local LLM inference.
*   **Responsibilities:**
    *   Exposing RESTful API endpoints for AI functionalities (e.g., `/api/generate-flashcards`, `/api/suggest-improvements`).
    *   Orchestrating calls to Ollama for LLM interactions.
    *   Pre-processing user input and post-processing AI output.
    *   Handling data validation and error handling for AI interactions.
*   **Data Flow (Example for AI-driven Flashcard Generation):**
    1.  User inputs text/topic into the frontend.
    2.  Frontend sends a request to the AI Backend API (e.g., `POST /api/generate-flashcards`).
    3.  Backend receives the request, prepares the prompt, and calls Ollama.
    4.  Ollama processes the prompt and returns generated flashcard data (front, back, tags).
    5.  Backend receives AI output, validates/formats it, and sends it back to the frontend.
    6.  Frontend displays the newly generated flashcards to the user.

### 2.3. AI Models

*   **Integration:** Uses Ollama for local LLM models (e.g., Llama2). Assumes Ollama is installed and running on the server.
*   **Future Goal:** Support for additional models and cloud-based options if needed.

## 3. Setup Instructions

### 3.1. Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   Git
*   Ollama (install from ollama.ai and ensure it's running)

### 3.2. Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd study-tools
    ```
2.  **Install dependencies for all apps:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Set up Ollama:**
    Pull a model, e.g., `ollama pull llama2`.
4.  **Run the AI Backend:**
    ```bash
    cd apps/ai-backend
    npm install
    npm run dev
    ```
5.  **Run the Frontend:**
    ```bash
    cd apps/flashcard-app
    npm run dev
    # or yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 4. AI Agent Integration Guidelines

When developing new AI features, consider the following:

*   **Modularity:** Keep AI-related logic separate from core UI components. Use custom hooks or dedicated utility functions.
*   **Backend-First for AI:** All complex AI interactions (model calls, heavy processing) should go through the dedicated AI Backend service. The frontend should only consume the backend's API.
*   **Error Handling:** Implement robust error handling for AI API calls, providing clear feedback to the user.
*   **Scalability:** Design AI features with scalability in mind, considering potential future increases in usage or model complexity.
*   **User Feedback:** Provide clear visual feedback to the user during AI processing (e.g., loading indicators).

## 5. User Stories (Prioritized for Initial Sprint)

Here are the user stories guiding our initial AI integration efforts:

*   **US-1: AI-Powered Flashcard Generation from Text**
    *   **Description:** As a user, I want to paste a block of text (e.g., lecture notes, article) and have the AI automatically generate a set of flashcards (front, back, and relevant tags) from it, so I can quickly create study materials without manual effort.
*   **US-2: AI-Powered Flashcard Generation from Topic**
    *   **Description:** As a user, I want to provide a specific topic or concept (e.g., "Quantum Entanglement," "React Hooks") and have the AI generate a set of comprehensive flashcards related to that topic, so I can explore new subjects and build foundational knowledge efficiently.
*   **US-3: AI-Suggested Card Improvements**
    *   **Description:** As a user, I want to select an existing flashcard and ask the AI to suggest alternative phrasing for the front or back to improve clarity, conciseness, or accuracy, so my study materials are of higher quality.

Further user stories will be prioritized in subsequent sprints.

### 5.1. Detailed AI Integration Plans for User Stories

#### US-1: AI-Powered Flashcard Generation from Text
*   **Frontend Interaction:** Users access a new "AI Generate" view with a text area for pasting content. A "Generate Flashcards" button triggers the backend API call.
*   **Backend Processing (`POST /api/generate-flashcards-from-text`):**
    1.  Receives the raw text input from the frontend.
    2.  Performs initial text cleaning and chunking if necessary.
    3.  Constructs a detailed prompt for Ollama, instructing it to identify key concepts, definitions, and relationships and format them as flashcards (front, back, and relevant tags).
    4.  Calls Ollama for generation.
    5.  Parses the response, extracting the generated flashcard data.
    6.  Validates the structure and content.
    7.  Returns the structured flashcard data to the frontend.
*   **AI Model Role:** Extracts information, synthesizes questions/answers, and suggests tags based on the provided text.

#### US-2: AI-Powered Flashcard Generation from Topic
*   **Frontend Interaction:** In the "AI Generate" view, users provide a topic or concept via an input field. A "Generate Flashcards" button initiates the process.
*   **Backend Processing (`POST /api/generate-flashcards-from-topic`):**
    1.  Receives the topic/concept string from the frontend.
    2.  Constructs a prompt for Ollama, asking it to generate comprehensive flashcards (front, back, and relevant tags) on the given topic.
    3.  Calls Ollama.
    4.  Parses and validates the output.
    5.  Returns the structured flashcard data to the frontend.
*   **AI Model Role:** Acts as a knowledge base, generating educational content and structuring it into flashcards for a specified topic.

#### US-3: AI-Suggested Card Improvements
*   **Frontend Interaction:** Users have an "Improve Card" option in the viewer or manage decks view. Clicking this sends the current flashcard's content to the backend.
*   **Backend Processing (`POST /api/suggest-card-improvements`):**
    1.  Receives the existing flashcard's front and back content from the frontend.
    2.  Constructs a prompt for Ollama, requesting suggestions for alternative phrasing to improve clarity, conciseness, or accuracy.
    3.  Calls Ollama.
    4.  Parses the response, which will contain suggested improvements.
    5.  Returns the suggestions to the frontend.
*   **AI Model Role:** Analyzes existing text for potential improvements in phrasing, offering alternatives to enhance learning efficacy.


## Immediate Actions

The new directory tree and strategy for linking components from the external packages to the individual apps is as follows:

1. **Set up npm workspaces in the root package.json:**
   ```
   {
     "name": "study-tools-monorepo",
     "workspaces": ["apps/*", "packages/*"],
     ...
   }
   ```

2. **In each app's package.json (e.g., apps/flashcard-app/package.json):**
   Add dependencies like:
   ```
   "dependencies": {
     "@packages/ui-components": "workspace:*",
     "@packages/flashcard-types": "workspace:*",
     "@packages/ai-utils": "workspace:*"
   }
   ```

3. **In the root tsconfig.json or each app's tsconfig.json:**
   Add path mappings:
   ```
   "compilerOptions": {
     "baseUrl": ".",
     "paths": {
       "@packages/ui-components": ["packages/ui-components/src"],
       "@packages/flashcard-types": ["packages/flashcard-types/index.ts"],
       "@packages/ai-utils": ["packages/ai-utils/src"]
     }
   }
   ```

4. **Update imports in the code:**
   - Set up a path alias using `@` for convenient imports of ui components.
   - In apps/flashcard-app/src/components/App.tsx, change imports from "@/components/ui/button" to "@ui/button".
   - Similarly for other components and types.

This allows the apps to import from the shared packages without external dependencies, keeping everything internal to the monorepo.

---

Final structure should resemble this:

```
study-tools/
├── README.md
├── DEVELOPMENT.md
├── package.json (monorepo root package.json)
├── .gitignore
├── cards-schema.json
├── components.json
├── eslint.config.mjs
├── postcss.config.mjs
├── notes/
│   └── ML_Fundamentals.md
├── apps/
│   ├── flashcard-app/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── favicon.ico
│   │   │   │   ├── globals.css
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── api/
│   │   │   │       └── decks/
│   │   │   │           └── route.ts
│   │   │   ├── components/
│   │   │   │   ├── App.tsx
│   │   │   │   ├── ui/
│   │   │   │   │   ├── alert-dialog.tsx
│   │   │   │   │   ├── badge.tsx
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── flip-card.tsx
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   ├── separator.tsx
│   │   │   │   │   └── tabs.tsx
│   │   │   │   └── views/
│   │   │   │       ├── ManageDecks.tsx
│   │   │   │       ├── Settings.tsx
│   │   │   │       ├── Stats.tsx
│   │   │   │       └── Viewer.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useDeckManagement.ts
│   │   │   │   └── useFlashcardPersistence.ts
│   │   │   ├── lib/
│   │   │   │   └── utils.ts
│   │   │   ├── styles/
│   │   │   │   └── flip.css
│   │   │   └── types/
│   │   │       └── flashcard.d.ts
│   │   ├── public/
│   │   │   ├── file.svg
│   │   │   ├── globe.svg
│   │   │   ├── next.svg
│   │   │   ├── vercel.svg
│   │   │   ├── window.svg
│   │   │   └── decks/
│   │   │       ├── another_midterm_version.json
│   │   │       ├── architecture.json
│   │   │       ├── cram_midterm.json
│   │   │       ├── functions.json
│   │   │       ├── ML_Cram.json
│   │   │       └── ping_traceroute.json
│   │   ├── next.config.ts
│   │   └── package.json
│   └── ai-backend/
│       ├── src/
│       │   ├── index.js
│       │   ├── routes/
│       │   │   ├── generateFlashcards.js
│       │   │   └── suggestImprovements.js
│       │   ├── utils/
│       │   │   └── ollamaClient.js
│       │   └── prompts/
│       │       └── generate_flashcards.txt
│       └── package.json
└── packages/
    ├── ui-components/
    │   └── src/
    │       ├── alert-dialog.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── flip-card.tsx
    │       ├── Header.tsx
    │       ├── input.tsx
    │       ├── separator.tsx
    │       └── tabs.tsx
    ├── flashcard-types/
    │   └── index.ts (moved from src/types/flashcard.d.ts)
    └── ai-utils/
        └── src/
            ├── ollamaClient.js
            └── promptBuilders.js
```