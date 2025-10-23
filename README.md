# Study Tools Monorepo

A monorepo for educational tools built with Next.js, React, and Tailwind CSS. The project includes a flashcard application with AI-powered features and plans for additional study applets.

## Features

*   **Flashcard App:**
    *   Study flashcards using a simple interface.
    *   Mark cards as correct or incorrect.
    *   Shuffle decks based on tag performance (shows weaker tags more often).
    *   View basic statistics on tag performance.
    *   Upload your own decks in JSON format.
    *   Manage multiple decks (select, rename, delete).
*   **AI-Powered Flashcard Generation:**
    *   Generate flashcards from text input (e.g., lecture notes).
    *   Generate flashcards from a topic or query using AI.
    *   Suggest improvements to existing flashcards.
*   **Future Applets:**
    *   Note-taking tools.
    *   Quiz generators.
    *   Adaptive learning sessions.

**Important:** The flashcard app stores all data (decks, cards, scores) directly in your web browser's `localStorage`. The AI backend requires Ollama to be installed on the server.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js:** (LTS version recommended). You can download it from [nodejs.org](https://nodejs.org/). Verify installation by running `node -v` in your terminal.
*   **npm** (comes with Node.js) or **yarn:** Verify installation with `npm -v` or `yarn -v`.
*   **Git:** Needed to clone the repository. Verify installation with `git --version`.
*   **Ollama:** Required for AI features. Install from [ollama.ai](https://ollama.ai/) and ensure it's running on your server.

## Getting Started

Follow these steps to get the project running on your local machine:

1.  **Clone the Repository:**
    Open your terminal or command prompt and run:
    ```bash
    git clone <repository-url>
    cd study-tools
    ```

2.  **Install Dependencies:**
    Install the necessary Node.js packages for all apps:
    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Set Up Ollama:**
    Ensure Ollama is installed and running. Pull a model, e.g., `ollama pull llama2`.

4.  **Run the AI Backend:**
    Start the AI backend service:
    ```bash
    cd apps/ai-backend
    npm install
    npm run dev
    ```

5.  **Run the Frontend:**
    In a new terminal, start the Next.js development server:
    ```bash
    cd apps/flashcard-app
    npm run dev
    # OR
    yarn dev
    ```

6.  **Open the App:**
    Open your web browser and navigate to [http://localhost:3000](http://localhost:3000). You should see the flashcard application with AI features.

## How to Use

1.  **Initial View:** The app might start with a default sample deck.
2.  **Studying:**
    *   The "Viewer" tab shows the current card.
    *   Click the card or the "Flip Card" button to see the back.
    *   Click "Correct" or "Incorrect" to record your answer and move to the next card.
    *   The deck is shuffled to show cards with tags you get wrong more often first. Click "Shuffle Deck" to reshuffle anytime.
3.  **Uploading Your Deck (e.g., ML Concepts):**
    *   Go to the "Manage Decks" tab.
    *   Click "Choose JSON File...".
    *   Select the JSON file containing your flashcards (from the `decks` folder).
    *   The deck will be uploaded, added to the list, and automatically selected for studying.
4.  **Managing Decks:**
    *   In "Manage Decks", you can see all uploaded decks.
    *   Click "Select" to choose a different deck to study.
    *   Click "Rename" to change a deck's name.
    *   Click "Delete" to remove a deck (and its scores) permanently *from this browser*.
5.  **Viewing Stats:**
    *   The "Stats" tab shows your performance (correct/incorrect percentage) for each tag within the *currently selected* deck. Weakest tags are listed first.
    *   You can reset the score for individual tags here.
6.  **Settings:**
    *   The "Settings" tab allows you to reset all scores for the currently selected deck or clear *all* data (all decks, all scores) stored by the app in your browser. **Use with caution!**

## Data Storage Notice

*   All your decks and study progress are saved *only* in your browser's `localStorage`.
*   This means the data is tied to the specific browser you are using on your specific computer.
*   If you clear your browser's data/cache/storage, **you will lose all your flashcards and progress.**
*   Data will not sync across different browsers or different computers.
     *   Using Incognito or Private Browsing mode will likely mean data is lost when you close the window.

## Project Structure

This is a monorepo with the following structure:

*   `apps/flashcard-app/`: The main Next.js frontend application.
*   `apps/ai-backend/`: The Node.js/Express backend for AI features, using Ollama.
*   `packages/`: Shared libraries (e.g., UI components, types).

## AI-Powered Features

The application now includes AI-powered flashcard generation using a dedicated backend service with Ollama.

*   **Generate from Text:** Paste lecture notes or articles to automatically create flashcards.
*   **Generate from Topic:** Provide a topic (e.g., "Quantum Physics") to generate comprehensive flashcards.
*   **Improve Cards:** Get AI suggestions to enhance existing flashcards.

These features are integrated into the main app as new views. The AI backend handles LLM interactions.

For more details on AI integration, refer to the [`DEVELOPMENT.md`](./DEVELOPMENT.md) guide.

---

Happy studying!

