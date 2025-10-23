# Development Guide for the Flashcard App

This document outlines the architecture, setup, and development guidelines for the Flashcard App, with a particular focus on integrating AI agent capabilities.

## 1. Project Overview

The Flashcard App is a web-based application designed to help users learn and memorize information through flashcards. It supports deck management, tag-based scoring, and an adaptive shuffling algorithm. The project is undergoing a significant overhaul to integrate advanced AI agent capabilities, aiming for dynamic content generation, personalized learning paths, and intuitive user interactions.

## 2. Architectural Overview

The application follows a client-server architecture, with a Next.js frontend and a planned backend service for AI functionalities.

### 2.1. Frontend (Next.js/React)

*   **Technology:** Next.js (React), TypeScript, Tailwind CSS.
*   **Responsibilities:**
    *   User Interface (UI) and User Experience (UX).
    *   Handling user interactions (e.g., card flipping, answering, deck management).
    *   Displaying flashcards, stats, and settings.
    *   Communicating with the AI Backend for AI-powered features.
*   **Key Components:**
    *   `src/app/page.tsx`: Main entry point for the application.
    *   `src/components/NewApp.tsx`: The core Flashcard application component, which will be refactored into smaller, more manageable components and hooks.
    *   `src/types/flashcard.d.ts`: TypeScript interface definitions for core data structures (Card, Deck, etc.).

### 2.2. AI Backend (Planned)

*   **Technology:** Node.js with Express. This choice is driven by because GG said so.
*   **Responsibilities:**
    *   Exposing RESTful API endpoints for AI functionalities (e.g., `/api/generate-flashcards`, `/api/suggest-tags`).
    *   Orchestrating calls to various AI models (local or cloud-based).
    *   Pre-processing user input for AI models and post-processing AI output.
    *   Handling data validation and error handling for AI interactions.
    *   Managing API keys and credentials for external AI services.
*   **Data Flow (Example for AI-driven Flashcard Generation):**
    1.  User inputs text/topic into the frontend.
    2.  Frontend sends a request to the AI Backend API (e.g., `POST /api/generate-flashcards`).
    3.  Backend receives the request, prepares the prompt, and calls the AI Model API.
    4.  AI Model processes the prompt and returns generated flashcard data (front, back, tags).
    5.  Backend receives AI output, validates/formats it, and sends it back to the frontend.
    6.  Frontend displays the newly generated flashcards to the user.

### 2.3. AI Models

*   **Integration:** The architecture will support integration with various AI models. Initially, this may involve cloud-based LLM APIs (e.g., Google Gemini).
*   **Future Goal:** Transition to local models for 95% of inference requests, as per project goals.

## 3. Setup Instructions

### 3.1. Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   Git

### 3.2. Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd study-tools
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Run the development server:**
    ```bash
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
*   **Frontend Interaction:** Users will access a dedicated "Generate from Text" interface. A text area will allow pasting content. A "Generate Flashcards" button will trigger the backend API call.
*   **Backend Processing (`POST /api/generate-flashcards-from-text`):**
    1.  Receives the raw text input from the frontend.
    2.  Performs initial text cleaning and chunking if necessary to fit within AI model token limits.
    3.  Constructs a detailed prompt for the AI model, instructing it to identify key concepts, definitions, and relationships within the text and format them as flashcards (front, back, and relevant tags).
    4.  Calls the integrated AI model (e.g., Google Gemini API).
    5.  Parses the AI model's response, extracting the generated flashcard data.
    6.  Validates the structure and content of the generated flashcards.
    7.  Returns the structured flashcard data to the frontend.
*   **AI Model Role:** Extracts information, synthesizes questions/answers, and suggests tags based on the provided text.

#### US-2: AI-Powered Flashcard Generation from Topic
*   **Frontend Interaction:** Users will use a "Generate from Topic" interface, providing a topic or concept via an input field. A "Generate Flashcards" button will initiate the process.
*   **Backend Processing (`POST /api/generate-flashcards-from-topic`):**
    1.  Receives the topic/concept string from the frontend.
    2.  Constructs a prompt for the AI model, asking it to generate comprehensive flashcards (front, back, and relevant tags) on the given topic, covering foundational knowledge, key terms, and important details.
    3.  Calls the integrated AI model.
    4.  Parses and validates the AI model's output.
    5.  Returns the structured flashcard data to the frontend.
*   **AI Model Role:** Acts as a knowledge base, generating educational content and structuring it into flashcards for a specified topic.

#### US-3: AI-Suggested Card Improvements
*   **Frontend Interaction:** Users will have an "Improve Card" option when viewing an existing flashcard. Clicking this will send the current flashcard's front and back content to the backend.
*   **Backend Processing (`POST /api/suggest-card-improvements`):**
    1.  Receives the existing flashcard's front and back content from the frontend.
    2.  Constructs a prompt for the AI model, requesting suggestions for alternative phrasing to improve clarity, conciseness, or accuracy of both the front and back of the card.
    3.  Calls the integrated AI model.
    4.  Parses the AI model's response, which will contain suggested improvements.
    5.  Returns the suggestions to the frontend.
*   **AI Model Role:** Analyzes existing text for potential improvements in phrasing, offering alternatives to enhance learning efficacy.
