import { useState, useRef, useCallback } from "react";
import { AllDecks, Deck, Card, View } from "@/types/flashcard";

interface DeckFile {
  filename: string;
  content: Card[];
}

interface UseDeckManagementProps {
  allDecks: AllDecks;
  setAllDecks: React.Dispatch<React.SetStateAction<AllDecks>>;
  selectedDeckId: string | null;
  setSelectedDeckId: React.Dispatch<React.SetStateAction<string | null>>;
  generateDeckId: () => string;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

interface UseDeckManagementResult {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  editingDeckId: string | null;
  tempDeckName: string;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectDeck: (deckId: string) => void;
  handleDeleteDeck: (deckId: string) => void;
  handleDeckNameEdit: (deckId: string) => void;
  handleDeckNameSave: () => void;
  handleDeckNameCancel: () => void;
  setTempDeckName: React.Dispatch<React.SetStateAction<string>>;
  discoverDecks: () => Promise<void>;
}

export const useDeckManagement = ({
  allDecks,
  setAllDecks,
  selectedDeckId,
  setSelectedDeckId,
  generateDeckId,
  setView,
}: UseDeckManagementProps): UseDeckManagementResult => {
  const [editingDeckId, setEditingDeckId] = useState<string | null>(null); // Track which deck name is being edited
  const [tempDeckName, setTempDeckName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content !== "string")
            throw new Error("Failed to read file content.");

          const parsedCards: Card[] = JSON.parse(content);

          // Basic validation
          if (
            !Array.isArray(parsedCards) ||
            parsedCards.some((c) => !c.front || !c.back)
          ) {
            throw new Error(
              "Invalid JSON format. Expected an array of objects with 'front' and 'back' properties.",
            );
          }

          // Ensure tags is an array if present
          const validatedCards = parsedCards.map((card, index) => ({
            ...card,
            id: card.id ?? `card_${index}`, // Assign index-based ID if missing
            tags: Array.isArray(card.tags) ? card.tags : [], // Default to empty array if tags missing/invalid
          }));

          const newDeckId = generateDeckId();
          const newDeckName =
            file.name.replace(/\.[^/.]+$/, "") ||
            `Uploaded Deck ${Object.keys(allDecks).length + 1}`; // Use filename as name
          const newDeck: Deck = {
            id: newDeckId,
            name: newDeckName,
            cards: validatedCards,
            tagScores: {}, // Initialize empty scores
          };

          setAllDecks((prev) => ({ ...prev, [newDeckId]: newDeck }));
          setSelectedDeckId(newDeckId); // Select the newly uploaded deck
          setView("viewer"); // Switch back to viewer
          alert(
            `Deck "${newDeckName}" uploaded successfully with ${validatedCards.length} cards!`,
          );
        } catch (error) {
          console.error("Error processing JSON file:", error);
          alert(
            `Error uploading file: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          );
        } finally {
          // Reset file input value to allow uploading the same file again
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };
      reader.onerror = () => {
        alert("Error reading file.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsText(file);
    },
    [allDecks, generateDeckId, setAllDecks, setSelectedDeckId, setView],
  );

  const handleSelectDeck = useCallback(
    (deckId: string) => {
      if (allDecks[deckId]) {
        setSelectedDeckId(deckId);
        setView("viewer"); // Go to viewer when selecting a deck
        // Shuffle will be triggered by useEffect dependency change
      }
    },
    [allDecks, setSelectedDeckId, setView],
  );

  const handleDeleteDeck = useCallback(
    (deckId: string) => {
      if (!allDecks[deckId]) return;
      const deckToDeleteName = allDecks[deckId].name;
      if (
        window.confirm(
          `Are you sure you want to delete the deck "${deckToDeleteName}"? This cannot be undone.`,
        )
      ) {
        setAllDecks((prev) => {
          const newState = { ...prev };
          delete newState[deckId];
          return newState;
        });
        // If the deleted deck was selected, select another one or null
        if (selectedDeckId === deckId) {
          const remainingIds = Object.keys(allDecks).filter(
            (id) => id !== deckId,
          );
          setSelectedDeckId(remainingIds[0] || null);
          // If no decks left, viewer will show "No Deck Selected"
        }
      }
    },
    [allDecks, selectedDeckId, setAllDecks, setSelectedDeckId],
  );

  const handleDeckNameEdit = useCallback(
    (deckId: string) => {
      setTempDeckName(allDecks[deckId]?.name ?? "");
      setEditingDeckId(deckId);
    },
    [allDecks],
  );

  const handleDeckNameSave = useCallback(() => {
    if (!editingDeckId || !tempDeckName.trim()) return;
    setAllDecks((prev) => {
      const deckToUpdate = prev[editingDeckId];
      if (!deckToUpdate) return prev;
      return {
        ...prev,
        [editingDeckId]: { ...deckToUpdate, name: tempDeckName.trim() },
      };
    });
    setEditingDeckId(null);
    setTempDeckName("");
  }, [editingDeckId, tempDeckName, setAllDecks]);

  const handleDeckNameCancel = useCallback(() => {
    setEditingDeckId(null);
    setTempDeckName("");
  }, []);

  const discoverDecks = useCallback(async () => {
    try {
      // Fetch list of JSON files from API
      const response = await fetch("/api/decks");
      if (!response.ok) throw new Error("Failed to fetch deck list");
      const jsonFiles: string[] = await response.json();

      let loadedCount = 0;
      for (const filename of jsonFiles) {
        try {
          // Fetch each JSON file
          const deckResponse = await fetch(`/decks/${filename}`);
          if (!deckResponse.ok) continue; // Skip if file not found
          const content: Card[] = await deckResponse.json();

          // Validate content
          if (
            !Array.isArray(content) ||
            content.some((c) => !c.front || !c.back)
          ) {
            console.warn(`Skipping invalid deck: ${filename}`);
            continue;
          }

          // Validate and assign IDs
          const validatedCards = content.map((card, index) => ({
            ...card,
            id: card.id ?? `card_${index}`,
            tags: Array.isArray(card.tags) ? card.tags : [],
          }));

          // Check if deck already exists
          const deckName = filename.replace(/\.[^/.]+$/, "");
          const existingDeckId = Object.keys(allDecks).find(
            (id) => allDecks[id].name === deckName,
          );
          if (existingDeckId) {
            console.log(`Deck "${deckName}" already exists, skipping.`);
            continue;
          }

          // Create new deck
          const newDeckId = generateDeckId();
          const newDeck: Deck = {
            id: newDeckId,
            name: deckName,
            cards: validatedCards,
            tagScores: {},
          };

          setAllDecks((prev) => ({ ...prev, [newDeckId]: newDeck }));
          loadedCount++;
        } catch (error) {
          console.error(`Error loading deck ${filename}:`, error);
        }
      }
      alert(`Discovered and loaded ${loadedCount} decks!`);
    } catch (error) {
      console.error("Error discovering decks:", error);
      alert("Failed to discover decks.");
    }
  }, [allDecks, generateDeckId, setAllDecks]);

  return {
    fileInputRef,
    editingDeckId,
    tempDeckName,
    handleFileUpload,
    handleSelectDeck,
    handleDeleteDeck,
    handleDeckNameEdit,
    handleDeckNameSave,
    handleDeckNameCancel,
    setTempDeckName,
    discoverDecks,
  };
};
