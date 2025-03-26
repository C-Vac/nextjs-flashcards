# Simple Next.js Flashcard App

A minimal flashcard application built with Next.js, React, and Tailwind CSS. It allows you to:

*   Study flashcards using a simple interface.
*   Mark cards as correct or incorrect.
*   Shuffle decks based on tag performance (shows weaker tags more often).
*   View basic statistics on tag performance.
*   Upload your own decks in JSON format.
*   Manage multiple decks (select, rename, delete).

**Important:** This app stores all data (decks, cards, scores) directly in your web browser's `localStorage`. There is no backend server or database.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js:** (LTS version recommended). You can download it from [nodejs.org](https://nodejs.org/). Verify installation by running `node -v` in your terminal.
*   **npm** (comes with Node.js) or **yarn:** Verify installation with `npm -v` or `yarn -v`.
*   **Git:** Needed to clone the repository. Verify installation with `git --version`.

## Getting Started

Follow these steps to get the project running on your local machine:

1.  **Clone the Repository:**
    Open your terminal or command prompt and run:
    ```bash
    git clone <your-github-repository-url>
    ```
    (Replace `<your-github-repository-url>` with the actual URL of your GitHub repository).

2.  **Navigate to Project Directory:**
    Change into the newly cloned folder:
    ```bash
    cd <repository-folder-name>
    ```
    (The folder name is usually the same as the repository name).

3.  **Install Dependencies:**
    Install the necessary Node.js packages using npm or yarn:
    ```bash
    npm install
    # OR
    yarn install
    ```

4.  **Run the Development Server:**
    Start the Next.js development server:
    ```bash
    npm run dev
    # OR
    yarn dev
    ```

5.  **Open the App:**
    Open your web browser and navigate to [http://localhost:3000](http://localhost:3000). You should see the flashcard application.

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
    *   Select the JSON file containing your flashcards (like the `ml_concepts.json` file we created).
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

---

Happy studying!
