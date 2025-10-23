import { useState, useEffect } from "react";
import { AllDecks, Deck, Card } from "@/types/flashcard";

// --- LocalStorage Keys ---
const LS_ALL_DECKS_KEY = "flashcard_allDecks";
const LS_SELECTED_DECK_ID_KEY = "flashcard_selectedDeckId";

// --- Helper: Generate Unique ID ---
const generateDeckId = () =>
  `deck_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

// --- Default Data ---
const createDefaultDeck = (): Deck => ({
  id: "default_deck_1",
  name: "Sample React/Web Dev Deck",
  cards: [
    {
      id: 1,
      front: "What is React?",
      back: "A JavaScript library for building user interfaces.",
      tags: ["react", "frontend", "javascript"],
    },
    {
      id: 2,
      front: "What is useState?",
      back: "A React Hook that lets you add state to functional components.",
      tags: ["react", "hooks"],
    },
    {
      id: 3,
      front: "What is Tailwind CSS?",
      back: "A utility-first CSS framework.",
      tags: ["css", "frontend", "styling"],
    },
    {
      id: 4,
      front: "What is TypeScript?",
      back: "A typed superset of JavaScript.",
      tags: ["javascript", "typing"],
    },
    {
      id: 5,
      front: "Purpose of useEffect?",
      back: "To perform side effects in functional components.",
      tags: ["react", "hooks", "side-effects"],
    },
    {
      id: 6,
      front: "What is JSX?",
      back: "A syntax extension for JavaScript, used with React.",
      tags: ["react", "javascript"],
    },
    {
      id: 7,
      front: "CSS Box Model (Order)",
      back: "Content, Padding, Border, Margin",
      tags: ["css", "frontend", "styling"],
    },
    {
      id: 8,
      front: "What is 'git clone'?",
      back: "Command to create a local copy of a remote repository.",
      tags: ["git", "version-control"],
    },
    {
      id: 9,
      front: "What is 'git push'?",
      back: "Command to upload local repository content to a remote repository.",
      tags: ["git", "version-control"],
    },
  ],
  tagScores: {
    /* 'strong-tag': { correct: 10, incorrect: 0 } */
  }, // Example initial score
});

interface UseFlashcardPersistenceResult {
  allDecks: AllDecks;
  setAllDecks: React.Dispatch<React.SetStateAction<AllDecks>>;
  selectedDeckId: string | null;
  setSelectedDeckId: React.Dispatch<React.SetStateAction<string | null>>;
  generateDeckId: () => string;
  createDefaultDeck: () => Deck;
}

export const useFlashcardPersistence = (): UseFlashcardPersistenceResult => {
  const [allDecks, setAllDecks] = useState<AllDecks>({});
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  // Load data on initial mount
  useEffect(() => {
    const savedDecks = localStorage.getItem(LS_ALL_DECKS_KEY);
    const savedSelectedId = localStorage.getItem(LS_SELECTED_DECK_ID_KEY);
    let loadedDecks: AllDecks = {};
    let loadedSelectedId: string | null = null;

    if (savedDecks) {
      try {
        loadedDecks = JSON.parse(savedDecks);
      } catch (e) {
        console.error("Failed to parse saved decks:", e);
      }
    }

    // If no decks loaded, create the default one
    if (Object.keys(loadedDecks).length === 0) {
      const defaultDeck = createDefaultDeck();
      loadedDecks = { [defaultDeck.id]: defaultDeck };
      loadedSelectedId = defaultDeck.id; // Select the default deck initially
    } else if (savedSelectedId && loadedDecks[savedSelectedId]) {
      loadedSelectedId = savedSelectedId;
    } else {
      // If saved ID is invalid or missing, select the first available deck
      loadedSelectedId = Object.keys(loadedDecks)[0] || null;
    }

    setAllDecks(loadedDecks);
    setSelectedDeckId(loadedSelectedId);
  }, []);

  // Save decks whenever they change
  useEffect(() => {
    if (Object.keys(allDecks).length > 0) {
      localStorage.setItem(LS_ALL_DECKS_KEY, JSON.stringify(allDecks));
    } else {
      // Clear if empty to avoid storing "{}"
      localStorage.removeItem(LS_ALL_DECKS_KEY);
    }
  }, [allDecks]);

  // Save selected deck ID whenever it changes
  useEffect(() => {
    if (selectedDeckId) {
      localStorage.setItem(LS_SELECTED_DECK_ID_KEY, selectedDeckId);
    } else {
      localStorage.removeItem(LS_SELECTED_DECK_ID_KEY);
    }
  }, [selectedDeckId]);

  return {
    allDecks,
    setAllDecks,
    selectedDeckId,
    setSelectedDeckId,
    generateDeckId,
    createDefaultDeck,
  };
};
