'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { NextPage } from 'next';

// --- Interfaces ---
interface Card {
    id?: string | number; // Optional ID from original JSON, index can be fallback
    front: string;
    back: string;
    tags?: string[]; // Make tags optional for broader compatibility
}

interface TagScore {
    correct: number;
    incorrect: number;
}

type TagScores = Record<string, TagScore>;

interface Deck {
    id: string;
    name: string;
    cards: Card[];
    tagScores: TagScores;
}

type AllDecks = Record<string, Deck>;

type View = 'viewer' | 'stats' | 'manage_decks' | 'settings';

// --- Default Data (will be loaded if no data exists) ---
const createDefaultDeck = (): Deck => ({
    id: 'default_deck_1',
    name: 'Sample React/Web Dev Deck',
    cards: [
        { id: 1, front: "What is React?", back: "A JavaScript library for building user interfaces.", tags: ["react", "frontend", "javascript"] },
        { id: 2, front: "What is useState?", back: "A React Hook that lets you add state to functional components.", tags: ["react", "hooks"] },
        { id: 3, front: "What is Tailwind CSS?", back: "A utility-first CSS framework.", tags: ["css", "frontend", "styling"] },
        { id: 4, front: "What is TypeScript?", back: "A typed superset of JavaScript.", tags: ["javascript", "typing"] },
        { id: 5, front: "Purpose of useEffect?", back: "To perform side effects in functional components.", tags: ["react", "hooks", "side-effects"] },
        { id: 6, front: "What is JSX?", back: "A syntax extension for JavaScript, used with React.", tags: ["react", "javascript"] },
        { id: 7, front: "CSS Box Model (Order)", back: "Content, Padding, Border, Margin", tags: ["css", "frontend", "styling"] },
        { id: 8, front: "What is 'git clone'?", back: "Command to create a local copy of a remote repository.", tags: ["git", "version-control"] },
        { id: 9, front: "What is 'git push'?", back: "Command to upload local repository content to a remote repository.", tags: ["git", "version-control"] },
        // Your Machine Learning Deck - incorporate it here or upload it
        // { id: 10, front: "What is Supervised Learning?", back: "Predict output Y from input X (Regression/Classification).", tags: ["Supervised Learning", "Core Concept"] },
        // ... add more ML cards or keep separate for upload demo
    ],
    tagScores: { /* 'strong-tag': { correct: 10, incorrect: 0 } */ } // Example initial score
});

// --- LocalStorage Keys ---
const LS_ALL_DECKS_KEY = 'flashcard_allDecks';
const LS_SELECTED_DECK_ID_KEY = 'flashcard_selectedDeckId';

// --- Helper: Generate Unique ID ---
const generateDeckId = () => `deck_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

// --- The App Component ---
const FlashcardApp: NextPage = () => {
    // --- State ---
    const [allDecks, setAllDecks] = useState<AllDecks>({});
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
    const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
    const [currentShuffledIndex, setCurrentShuffledIndex] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [view, setView] = useState<View>('viewer');
    const [editingDeckId, setEditingDeckId] = useState<string | null>(null); // Track which deck name is being edited
    const [tempDeckName, setTempDeckName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

    // --- Persistence ---
    useEffect(() => {
        // Load data on initial mount
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

    useEffect(() => {
        // Save decks whenever they change
        if (Object.keys(allDecks).length > 0) {
            localStorage.setItem(LS_ALL_DECKS_KEY, JSON.stringify(allDecks));
        } else {
            // Clear if empty to avoid storing "{}"
            localStorage.removeItem(LS_ALL_DECKS_KEY);
        }
    }, [allDecks]);

    useEffect(() => {
        // Save selected deck ID whenever it changes
        if (selectedDeckId) {
            localStorage.setItem(LS_SELECTED_DECK_ID_KEY, selectedDeckId);
        } else {
            localStorage.removeItem(LS_SELECTED_DECK_ID_KEY);
        }
    }, [selectedDeckId]);

    // --- Derived State (Current Deck Data) ---
    const currentDeck = useMemo(() => {
        if (!selectedDeckId || !allDecks[selectedDeckId]) return null;
        return allDecks[selectedDeckId];
    }, [allDecks, selectedDeckId]);

    const cards = useMemo(() => currentDeck?.cards ?? [], [currentDeck]);
    const tagScores = useMemo(() => currentDeck?.tagScores ?? {}, [currentDeck]);
    const deckName = useMemo(() => currentDeck?.name ?? 'No Deck Selected', [currentDeck]);

    // --- Shuffling Logic (Adapted) ---
    const getTagPerformance = useCallback((tag: string): number => {
        const score = tagScores[tag] || { correct: 0, incorrect: 0 };
        const total = score.correct + score.incorrect;
        if (total === 0) return 0.5; // Neutral score for unseen tags
        return score.correct / total;
    }, [tagScores]); // Depends on the tagScores of the *current* deck

    const getCardWeakness = useCallback((card: Card): number => {
        if (!card.tags || card.tags.length === 0) return 0.5; // Neutral for untagged cards
        const performances = card.tags.map(getTagPerformance);
        return Math.min(...performances); // Weakness is determined by the weakest tag
    }, [getTagPerformance]);

    const shuffleDeck = useCallback(() => {
        if (!cards || cards.length === 0) {
            setShuffledIndices([]);
            setCurrentShuffledIndex(0);
            return;
        }
        const indices = cards.map((_, index) => index);
        indices.sort((indexA, indexB) => {
            const cardA = cards[indexA];
            const cardB = cards[indexB];
            const weaknessA = getCardWeakness(cardA);
            const weaknessB = getCardWeakness(cardB);
            // Primary sort: weakness ascending (weakest first)
            // Secondary sort: random shuffle for cards with equal weakness
            if (weaknessA !== weaknessB) {
                return weaknessA - weaknessB;
            } else {
                return Math.random() - 0.5;
            }
        });
        setShuffledIndices(indices);
        setCurrentShuffledIndex(0);
        setIsFlipped(false);
        console.log("Shuffled. Weakest first based on tags:", indices.map(i => cards[i]?.front ?? 'N/A'));
    }, [cards, getCardWeakness]); // Depends on the cards of the *current* deck

    useEffect(() => {
        // Re-shuffle when the selected deck changes or cards within it change
        // console.log("Deck changed or cards updated, shuffling...");
        shuffleDeck();
    }, [selectedDeckId, cards, shuffleDeck]); // Ensure cards is a dependency

    // --- Card Navigation & Scoring (Adapted) ---
    const currentCardIndex = shuffledIndices[currentShuffledIndex];
    const currentCard = cards[currentCardIndex];

    const handleAnswer = (isCorrect: boolean) => {
        if (!currentCard || !selectedDeckId) return;

        setAllDecks(prevAllDecks => {
            const deckToUpdate = prevAllDecks[selectedDeckId];
            if (!deckToUpdate) return prevAllDecks; // Should not happen if selectedDeckId is valid

            const newScores = { ...(deckToUpdate.tagScores || {}) };
            (currentCard.tags ?? []).forEach(tag => {
                const score = newScores[tag] || { correct: 0, incorrect: 0 };
                if (isCorrect) {
                    score.correct += 1;
                } else {
                    score.incorrect += 1;
                }
                newScores[tag] = { ...score }; // Ensure new object for state update
            });

            const updatedDeck = { ...deckToUpdate, tagScores: newScores };
            return { ...prevAllDecks, [selectedDeckId]: updatedDeck };
        });

        goToNextCard();
    };

    const goToNextCard = () => {
        if (shuffledIndices.length === 0) return;
        setIsFlipped(false);
        // Trigger re-shuffle if it's the last card and user wraps around (optional)
        // if (currentShuffledIndex === shuffledIndices.length - 1) {
        //     shuffleDeck();
        // } else {
        setCurrentShuffledIndex(prev => (prev + 1) % shuffledIndices.length);
        // }
    };

    const goToPrevCard = () => {
        if (shuffledIndices.length === 0) return;
        setIsFlipped(false);
        setCurrentShuffledIndex(prev => (prev - 1 + shuffledIndices.length) % shuffledIndices.length);
    };

    // --- Deck Management Logic ---
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result;
                if (typeof content !== 'string') throw new Error("Failed to read file content.");

                const parsedCards: Card[] = JSON.parse(content);

                // Basic validation
                if (!Array.isArray(parsedCards) || parsedCards.some(c => !c.front || !c.back)) {
                    throw new Error("Invalid JSON format. Expected an array of objects with 'front' and 'back' properties.");
                }

                // Ensure tags is an array if present
                const validatedCards = parsedCards.map((card, index) => ({
                    ...card,
                    id: card.id ?? `card_${index}`, // Assign index-based ID if missing
                    tags: Array.isArray(card.tags) ? card.tags : [], // Default to empty array if tags missing/invalid
                }));


                const newDeckId = generateDeckId();
                const newDeckName = file.name.replace(/\.[^/.]+$/, "") || `Uploaded Deck ${Object.keys(allDecks).length + 1}`; // Use filename as name
                const newDeck: Deck = {
                    id: newDeckId,
                    name: newDeckName,
                    cards: validatedCards,
                    tagScores: {}, // Initialize empty scores
                };

                setAllDecks(prev => ({ ...prev, [newDeckId]: newDeck }));
                setSelectedDeckId(newDeckId); // Select the newly uploaded deck
                setView('viewer'); // Switch back to viewer
                alert(`Deck "${newDeckName}" uploaded successfully with ${validatedCards.length} cards!`);

            } catch (error) {
                console.error("Error processing JSON file:", error);
                alert(`Error uploading file: ${error instanceof Error ? error.message : "Unknown error"}`);
            } finally {
                // Reset file input value to allow uploading the same file again
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.onerror = () => {
            alert("Error reading file.");
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    const handleSelectDeck = (deckId: string) => {
        if (allDecks[deckId]) {
            setSelectedDeckId(deckId);
            setView('viewer'); // Go to viewer when selecting a deck
            // Shuffle will be triggered by useEffect dependency change
        }
    };

    const handleDeleteDeck = (deckId: string) => {
        if (!allDecks[deckId]) return;
        const deckToDeleteName = allDecks[deckId].name;
        if (window.confirm(`Are you sure you want to delete the deck "${deckToDeleteName}"? This cannot be undone.`)) {
            setAllDecks(prev => {
                const newState = { ...prev };
                delete newState[deckId];
                return newState;
            });
            // If the deleted deck was selected, select another one or null
            if (selectedDeckId === deckId) {
                const remainingIds = Object.keys(allDecks).filter(id => id !== deckId);
                setSelectedDeckId(remainingIds[0] || null);
                // If no decks left, viewer will show "No Deck Selected"
            }
        }
    };

    const handleDeckNameEdit = (deckId: string) => {
        setTempDeckName(allDecks[deckId]?.name ?? '');
        setEditingDeckId(deckId);
    };

    const handleDeckNameSave = () => {
        if (!editingDeckId || !tempDeckName.trim()) return;
        setAllDecks(prev => {
            const deckToUpdate = prev[editingDeckId];
            if (!deckToUpdate) return prev;
            return { ...prev, [editingDeckId]: { ...deckToUpdate, name: tempDeckName.trim() } };
        });
        setEditingDeckId(null);
        setTempDeckName('');
    };

    const handleDeckNameCancel = () => {
        setEditingDeckId(null);
        setTempDeckName('');
    };

    // --- Stats (Adapted) ---
    const sortedTags = useMemo(() => {
        return Object.entries(tagScores) // Uses tagScores derived from currentDeck
            .map(([tag, score]) => ({
                tag,
                ...score,
                performance: (score.correct + score.incorrect) === 0 ? 0.5 : score.correct / (score.correct + score.incorrect),
                total: score.correct + score.incorrect
            }))
            .sort((a, b) => a.performance - b.performance); // Weakest first
    }, [tagScores]); // Depends only on current deck's scores

    const resetTagScore = (tag: string) => {
        if (!selectedDeckId) return;
        setAllDecks(prevAllDecks => {
            const deckToUpdate = prevAllDecks[selectedDeckId];
            if (!deckToUpdate || !deckToUpdate.tagScores || !deckToUpdate.tagScores[tag]) return prevAllDecks;

            const newScores = { ...deckToUpdate.tagScores };
            delete newScores[tag]; // Remove the specific tag score

            const updatedDeck = { ...deckToUpdate, tagScores: newScores };
            return { ...prevAllDecks, [selectedDeckId]: updatedDeck };
        });
    };

    // --- Settings (Adapted) ---
    const resetCurrentDeckScores = () => {
        if (!selectedDeckId || !currentDeck) return;
        if (window.confirm(`Are you sure you want to reset all tag scores for the deck "${deckName}"?`)) {
            setAllDecks(prevAllDecks => {
                const deckToUpdate = prevAllDecks[selectedDeckId];
                if (!deckToUpdate) return prevAllDecks; // Should not happen

                const updatedDeck = { ...deckToUpdate, tagScores: {} }; // Reset scores to empty object
                return { ...prevAllDecks, [selectedDeckId]: updatedDeck };
            });
        }
    };

    const clearAllData = () => {
        if (window.confirm("DELETE ALL DATA?\n\nAre you sure you want to clear all decks and scores? This cannot be undone.")) {
            setAllDecks({});
            setSelectedDeckId(null);
            localStorage.removeItem(LS_ALL_DECKS_KEY);
            localStorage.removeItem(LS_SELECTED_DECK_ID_KEY);
            // Optionally load default deck again after clearing
            // const defaultDeck = createDefaultDeck();
            // setAllDecks({ [defaultDeck.id]: defaultDeck });
            // setSelectedDeckId(defaultDeck.id);
            alert("All data cleared.");
            setView('manage_decks'); // Go to manage decks view after clearing
        }
    };

    // --- Render ---
    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
                {/* Header & Deck Name Display (Viewer only shows current deck name) */}
                <div className="mb-6 pb-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-700 truncate text-center sm:text-left">
                        {view === 'viewer' || view === 'stats' ? `Studying: ${deckName}` : 'Flashcard App'}
                        {currentDeck && <span className='text-sm font-normal text-gray-500 ml-2'>({cards.length} cards)</span>}
                        {!currentDeck && view === 'viewer' && <span className='text-lg font-normal text-red-500'> (No deck selected)</span>}
                    </h1>
                    <nav className="flex space-x-2 sm:space-x-3 flex-wrap justify-center">
                        <button
                            onClick={() => setView('viewer')}
                            className={`px-3 py-1 rounded text-sm sm:text-base ${view === 'viewer' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
                        >
                            Viewer
                        </button>
                        <button
                            onClick={() => setView('stats')}
                            className={`px-3 py-1 rounded text-sm sm:text-base ${view === 'stats' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
                        >
                            Stats
                        </button>
                        <button
                            onClick={() => setView('manage_decks')}
                            className={`px-3 py-1 rounded text-sm sm:text-base ${view === 'manage_decks' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
                        >
                            Manage Decks
                        </button>
                        <button
                            onClick={() => setView('settings')}
                            className={`px-3 py-1 rounded text-sm sm:text-base ${view === 'settings' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
                        >
                            Settings
                        </button>
                    </nav>
                </div>

                {/* --- Content Area --- */}

                {/* Viewer View */}
                {view === 'viewer' && (
                    <div>
                        {!currentDeck && (
                            <div className="text-center py-10">
                                <p className="text-xl text-gray-500 mb-4">No deck selected.</p>
                                <button
                                    onClick={() => setView('manage_decks')}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Go to Manage Decks
                                </button>
                            </div>
                        )}
                        {currentDeck && currentCard && (
                            <div className="flex flex-col items-center">
                                {/* Card Flip Container */}
                                <div
                                    className="perspective w-full max-w-md h-64 mb-4 cursor-pointer group"
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    role="button" // Accessibility
                                    tabIndex={0} // Accessibility
                                    onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setIsFlipped(!isFlipped)} // Accessibility
                                >
                                    <div
                                        className={`relative w-full h-full rounded-lg shadow-md transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                                    >
                                        {/* Front */}
                                        <div className="absolute w-full h-full backface-hidden bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center p-6 text-center overflow-auto">
                                            <p className="text-lg sm:text-xl text-blue-800">{currentCard.front}</p>
                                        </div>
                                        {/* Back */}
                                        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-green-100 border border-green-200 rounded-lg flex items-center justify-center p-6 text-center overflow-auto">
                                            <p className="text-lg sm:text-xl text-green-800">{currentCard.back}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                                >
                                    Flip Card
                                </button>

                                {/* Answer Buttons */}
                                <div className="flex space-x-4 mb-4">
                                    <button
                                        onClick={() => handleAnswer(false)}
                                        className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
                                    >
                                        Incorrect
                                    </button>
                                    <button
                                        onClick={() => handleAnswer(true)}
                                        className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium"
                                    >
                                        Correct
                                    </button>
                                </div>

                                {/* Navigation & Info */}
                                <div className="flex items-center space-x-4 mb-4">
                                    <button
                                        onClick={goToPrevCard}
                                        disabled={shuffledIndices.length <= 1}
                                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Prev
                                    </button>
                                    <span className="text-gray-600 text-sm">
                                        Card {currentShuffledIndex + 1} of {shuffledIndices.length}
                                    </span>
                                    <button
                                        onClick={goToNextCard}
                                        disabled={shuffledIndices.length <= 1}
                                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Next
                                    </button>
                                </div>

                                <div className="text-xs text-gray-500 mb-4 max-w-md text-center break-words">
                                    Tags: {(currentCard.tags ?? []).join(', ') || 'None'}
                                </div>

                                <button
                                    onClick={shuffleDeck}
                                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                                >
                                    Shuffle Deck (Weakest First)
                                </button>
                            </div>
                        )}
                        {currentDeck && !currentCard && cards.length === 0 && (
                            <p className="text-center text-gray-500 py-10">This deck has no cards.</p>
                        )}
                    </div>
                )}

                {/* Stats View */}
                {view === 'stats' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tag Performance for "{deckName}"</h2>
                        {!currentDeck && <p className="text-gray-500">Please select a deck to view stats.</p>}
                        {currentDeck && sortedTags.length > 0 ? (
                            <ul className="space-y-2">
                                {sortedTags.map(({ tag, correct, incorrect, performance, total }) => (
                                    <li key={tag} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                                        <div>
                                            <span className="font-medium text-gray-800 mr-2">{tag}</span>
                                            <span className={`text-sm px-2 py-0.5 rounded ${performance < 0.4 ? 'bg-red-100 text-red-700' : performance > 0.7 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {Math.round(performance * 100)}%
                                            </span>
                                            <span className="text-xs text-gray-500 ml-2">({correct}/{total})</span>
                                        </div>
                                        <button
                                            onClick={() => resetTagScore(tag)}
                                            className="text-xs text-red-500 hover:text-red-700 ml-4"
                                            title={`Reset score for tag: ${tag}`}
                                        >
                                            Reset
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : currentDeck && (
                            <p className="text-gray-500">No tag scores recorded yet for this deck. Review some cards!</p>
                        )}
                    </div>
                )}

                {/* Manage Decks View */}
                {view === 'manage_decks' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Manage Decks</h2>

                        {/* Upload Section */}
                        <div className="mb-6 p-4 border border-dashed border-gray-300 rounded bg-gray-50 text-center">
                            <h3 className="text-lg font-medium mb-2 text-gray-600">Upload New Deck</h3>
                            <p className="text-sm text-gray-500 mb-3">Select a JSON file containing an array of flashcards (objects with 'front' and 'back', optionally 'tags').</p>
                            <input
                                type="file"
                                accept=".json,application/json"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                                className="hidden" // Hide default input, style the button instead
                                id="file-upload-input"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
                            >
                                Choose JSON File...
                            </button>
                        </div>

                        {/* Deck List Section */}
                        <h3 className="text-lg font-medium mb-3 text-gray-600">Available Decks</h3>
                        {Object.keys(allDecks).length > 0 ? (
                            <ul className="space-y-3">
                                {Object.values(allDecks).map((deck) => (
                                    <li key={deck.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white rounded border border-gray-200 shadow-sm gap-2">
                                        {editingDeckId === deck.id ? (
                                            // Edit Mode
                                            <div className="flex items-center space-x-2 flex-grow">
                                                <input
                                                    type="text"
                                                    value={tempDeckName}
                                                    onChange={(e) => setTempDeckName(e.target.value)}
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm font-medium flex-grow"
                                                    autoFocus
                                                />
                                                <button onClick={handleDeckNameSave} className="text-green-600 hover:text-green-800 text-sm p-1">✓ Save</button>
                                                <button onClick={handleDeckNameCancel} className="text-red-600 hover:text-red-800 text-sm p-1">✗ Cancel</button>
                                            </div>
                                        ) : (
                                            // Display Mode
                                            <div className="flex-grow flex items-center">
                                                <span className={`font-medium text-gray-800 mr-2 ${deck.id === selectedDeckId ? 'text-blue-600' : ''}`}>{deck.name}</span>
                                                <span className="text-xs text-gray-500">({deck.cards.length} cards)</span>
                                                {deck.id === selectedDeckId && <span className="text-xs font-bold text-blue-600 ml-2">(Selected)</span>}
                                            </div>
                                        )}

                                        {/* Actions (only show if not editing this specific deck) */}
                                        {editingDeckId !== deck.id && (
                                            <div className="flex space-x-2 items-center flex-shrink-0 mt-2 sm:mt-0">
                                                <button
                                                    onClick={() => handleSelectDeck(deck.id)}
                                                    disabled={deck.id === selectedDeckId}
                                                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Select
                                                </button>
                                                <button
                                                    onClick={() => handleDeckNameEdit(deck.id)}
                                                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                                                >
                                                    Rename
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDeck(deck.id)}
                                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-5">No decks available. Upload one using the button above!</p>
                        )}
                    </div>
                )}

                {/* Settings View */}
                {view === 'settings' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Settings</h2>
                        <div className="space-y-6">
                            {/* Reset Scores for Current Deck */}
                            <div className="p-4 border border-gray-200 rounded bg-gray-50">
                                <h3 className="font-medium mb-2 text-gray-600">Reset Current Deck Progress</h3>
                                {currentDeck ? (
                                    <>
                                        <p className="text-sm text-gray-500 mb-3">This will reset correct/incorrect counts for all tags in the deck: "{deckName}".</p>
                                        <button
                                            onClick={resetCurrentDeckScores}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                        >
                                            Reset Scores for "{deckName}"
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500">Select a deck first to reset its scores.</p>
                                )}
                            </div>

                            {/* Clear All Data */}
                            <div className="p-4 border border-red-300 rounded bg-red-50">
                                <h3 className="font-medium mb-2 text-red-700">Danger Zone</h3>
                                <p className="text-sm text-red-600 mb-3">This will permanently delete ALL decks and ALL progress from your browser's storage.</p>
                                <button
                                    onClick={clearAllData}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
                                >
                                    Clear All Data
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer/Info (Optional) */}
            <footer className="text-center text-xs text-gray-400 mt-6">
                Flashcard App - Data stored in browser localStorage.
            </footer>

            {/* Global Styles for Flip Animation */}
            <style jsx global>{`
                .perspective { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
};

export default FlashcardApp;
