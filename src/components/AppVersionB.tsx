'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { NextPage } from 'next';

interface Card {
    id: number;
    front: string;
    back: string;
    tags: string[];
}

interface TagScore {
    correct: number;
    incorrect: number;
}

type TagScores = Record<string, TagScore>;

type View = 'viewer' | 'stats' | 'settings';

const defaultDeck: Card[] = [
    { id: 1, front: "What is React?", back: "A JavaScript library for building user interfaces.", tags: ["react", "frontend", "javascript"] },
    { id: 2, front: "What is useState?", back: "A React Hook that lets you add state to functional components.", tags: ["react", "hooks"] },
    { id: 3, front: "What is Tailwind CSS?", back: "A utility-first CSS framework.", tags: ["css", "frontend", "styling"] },
    { id: 4, front: "What is TypeScript?", back: "A typed superset of JavaScript.", tags: ["javascript", "typing"] },
    { id: 5, front: "Purpose of useEffect?", back: "To perform side effects in functional components.", tags: ["react", "hooks", "side-effects"] },
    { id: 6, front: "What is JSX?", back: "A syntax extension for JavaScript, used with React.", tags: ["react", "javascript"] },
    { id: 7, front: "CSS Box Model (Order)", back: "Content, Padding, Border, Margin", tags: ["css", "frontend", "styling"] },
    { id: 8, front: "What is 'git clone'?", back: "Command to create a local copy of a remote repository.", tags: ["git", "version-control"] },
    { id: 9, front: "What is 'git push'?", back: "Command to upload local repository content to a remote repository.", tags: ["git", "version-control"] },
    { id: 10, front: "Strongest Tag Example", back: "This card should appear later.", tags: ["strong-tag"] },
];

const FlashcardApp: NextPage = () => {
    const [deckName, setDeckName] = useState<string>('My First Deck');
    const [cards, setCards] = useState<Card[]>(defaultDeck);
    const [tagScores, setTagScores] = useState<TagScores>({});
    const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
    const [currentShuffledIndex, setCurrentShuffledIndex] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [view, setView] = useState<View>('viewer');
    const [editingDeckName, setEditingDeckName] = useState<boolean>(false);
    const [tempDeckName, setTempDeckName] = useState<string>('');

    // --- Persistence ---
    useEffect(() => {
        const savedName = localStorage.getItem('flashcard_deckName');
        const savedScores = localStorage.getItem('flashcard_tagScores');
        if (savedName) setDeckName(savedName);
        if (savedScores) {
            try {
                setTagScores(JSON.parse(savedScores));
            } catch (e) {
                console.error("Failed to parse tag scores:", e);
                setTagScores({});
            }
        } else {
            // Initialize strong-tag for demo
            setTagScores({ 'strong-tag': { correct: 10, incorrect: 0 } });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('flashcard_deckName', deckName);
    }, [deckName]);

    useEffect(() => {
        localStorage.setItem('flashcard_tagScores', JSON.stringify(tagScores));
    }, [tagScores]);

    // --- Shuffling ---
    const getTagPerformance = useCallback((tag: string): number => {
        const score = tagScores[tag] || { correct: 0, incorrect: 0 };
        const total = score.correct + score.incorrect;
        if (total === 0) return 0.5; // Neutral score for unseen tags
        return score.correct / total;
    }, [tagScores]);

    const getCardWeakness = useCallback((card: Card): number => {
        if (!card.tags || card.tags.length === 0) return 0.5;
        const performances = card.tags.map(getTagPerformance);
        return Math.min(...performances);
    }, [getTagPerformance]);

    const shuffleDeck = useCallback(() => {
        const indices = cards.map((_, index) => index);
        indices.sort((indexA, indexB) => {
            const cardA = cards[indexA];
            const cardB = cards[indexB];
            const weaknessA = getCardWeakness(cardA);
            const weaknessB = getCardWeakness(cardB);
            return weaknessA - weaknessB; // Sort by weakness (ascending)
        });
        setShuffledIndices(indices);
        setCurrentShuffledIndex(0);
        setIsFlipped(false);
        console.log("Shuffled. Weakest first based on tags:", indices.map(i => cards[i].front));
    }, [cards, getCardWeakness]);

    useEffect(() => {
        if (cards.length > 0 && shuffledIndices.length === 0) {
            shuffleDeck();
        }
    }, [cards, shuffleDeck, shuffledIndices.length]);

    // --- Card Navigation & Scoring ---
    const currentCardIndex = shuffledIndices[currentShuffledIndex];
    const currentCard = cards[currentCardIndex];

    const handleAnswer = (isCorrect: boolean) => {
        if (!currentCard) return;

        setTagScores(prevScores => {
            const newScores = { ...prevScores };
            currentCard.tags.forEach(tag => {
                const score = newScores[tag] || { correct: 0, incorrect: 0 };
                if (isCorrect) {
                    score.correct += 1;
                } else {
                    score.incorrect += 1;
                }
                newScores[tag] = score;
            });
            return newScores;
        });

        goToNextCard();
    };

    const goToNextCard = () => {
        setIsFlipped(false);
        setCurrentShuffledIndex(prev => (prev + 1) % shuffledIndices.length);
    };

    const goToPrevCard = () => {
        setIsFlipped(false);
        setCurrentShuffledIndex(prev => (prev - 1 + shuffledIndices.length) % shuffledIndices.length);
    };

    // --- Deck Name Editing ---
    const handleDeckNameEdit = () => {
        setTempDeckName(deckName);
        setEditingDeckName(true);
    };

    const handleDeckNameSave = () => {
        setDeckName(tempDeckName);
        setEditingDeckName(false);
    };

    const handleDeckNameCancel = () => {
        setEditingDeckName(false);
    };

    // --- Stats ---
    const sortedTags = useMemo(() => {
        return Object.entries(tagScores)
            .map(([tag, score]) => ({
                tag,
                ...score,
                performance: (score.correct + score.incorrect) === 0 ? 0.5 : score.correct / (score.correct + score.incorrect),
                total: score.correct + score.incorrect
            }))
            .sort((a, b) => a.performance - b.performance); // Weakest first
    }, [tagScores]);

    const resetTagScore = (tag: string) => {
        setTagScores(prev => {
            const newScores = { ...prev };
            delete newScores[tag];
            return newScores;
        });
    };

    // --- Settings ---
    const resetAllScores = () => {
        if (window.confirm("Are you sure you want to reset all tag scores?")) {
            setTagScores({});
        }
    };

    const clearAllData = () => {
        if (window.confirm("Are you sure you want to clear all data (deck name and scores)? This cannot be undone.")) {
            setDeckName('My First Deck');
            setTagScores({});
            localStorage.removeItem('flashcard_deckName');
            localStorage.removeItem('flashcard_tagScores');
            // In a real app, you might want to reset cards too if they were editable
        }
    };

    // --- Render ---
    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
                {/* Header & Deck Name */}
                <div className="mb-6 pb-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                    {editingDeckName ? (
                        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                            <input
                                type="text"
                                value={tempDeckName}
                                onChange={(e) => setTempDeckName(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-xl font-semibold"
                                autoFocus
                            />
                            <button onClick={handleDeckNameSave} className="text-green-600 hover:text-green-800">✓</button>
                            <button onClick={handleDeckNameCancel} className="text-red-600 hover:text-red-800">×</button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">{deckName}</h1>
                            <button onClick={handleDeckNameEdit} className="text-blue-500 hover:text-blue-700 text-sm">(Edit)</button>
                        </div>
                    )}
                    <nav className="flex space-x-3 sm:space-x-4">
                        <button
                            onClick={() => setView('viewer')}
                            className={`px-3 py-1 rounded ${view === 'viewer' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
                        >
                            Viewer
                        </button>
                        <button
                            onClick={() => setView('stats')}
                            className={`px-3 py-1 rounded ${view === 'stats' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
                        >
                            Stats
                        </button>
                        <button
                            onClick={() => setView('settings')}
                            className={`px-3 py-1 rounded ${view === 'settings' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
                        >
                            Settings
                        </button>
                    </nav>
                </div>

                {/* Content Area */}
                {view === 'viewer' && (
                    <div>
                        {currentCard ? (
                            <div className="flex flex-col items-center">
                                <div
                                    className="perspective w-full max-w-md h-64 mb-4 cursor-pointer group"
                                    onClick={() => setIsFlipped(!isFlipped)}
                                >
                                    <div
                                        className={`relative w-full h-full rounded-lg shadow-md transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                                    >
                                        {/* Front */}
                                        <div className="absolute w-full h-full backface-hidden bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center p-6 text-center">
                                            <p className="text-lg sm:text-xl text-blue-800">{currentCard.front}</p>
                                        </div>
                                        {/* Back */}
                                        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-green-100 border border-green-200 rounded-lg flex items-center justify-center p-6 text-center">
                                            <p className="text-lg sm:text-xl text-green-800">{currentCard.back}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                >
                                    Flip Card
                                </button>

                                <div className="flex space-x-4 mb-4">
                                    <button
                                        onClick={() => handleAnswer(false)}
                                        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                        Incorrect
                                    </button>
                                    <button
                                        onClick={() => handleAnswer(true)}
                                        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    >
                                        Correct
                                    </button>
                                </div>

                                <div className="flex space-x-4 mb-4">
                                    <button
                                        onClick={goToPrevCard}
                                        disabled={shuffledIndices.length <= 1}
                                        className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    <span className="text-gray-600">
                                        Card {currentShuffledIndex + 1} of {shuffledIndices.length}
                                    </span>
                                    <button
                                        onClick={goToNextCard}
                                        disabled={shuffledIndices.length <= 1}
                                        className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>

                                <div className="text-sm text-gray-500 mb-4">
                                    Tags: {currentCard.tags.join(', ')}
                                </div>

                                <button
                                    onClick={shuffleDeck}
                                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                                >
                                    Shuffle Deck (Weakest First)
                                </button>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No cards in this deck.</p>
                        )}
                    </div>
                )}

                {view === 'stats' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tag Performance</h2>
                        {sortedTags.length > 0 ? (
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
                                        >
                                            Reset
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No tag scores recorded yet. Review some cards!</p>
                        )}
                    </div>
                )}

                {view === 'settings' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Settings</h2>
                        <div className="space-y-4">
                            <div className="p-4 border border-gray-200 rounded bg-gray-50">
                                <h3 className="font-medium mb-2 text-gray-600">Reset Progress</h3>
                                <p className="text-sm text-gray-500 mb-3">This will reset the correct/incorrect counts for all tags.</p>
                                <button
                                    onClick={resetAllScores}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                >
                                    Reset All Tag Scores
                                </button>
                            </div>
                            <div className="p-4 border border-red-200 rounded bg-red-50">
                                <h3 className="font-medium mb-2 text-red-700">Clear Data</h3>
                                <p className="text-sm text-red-600 mb-3">This will permanently delete the deck name and all tag scores from your browser's storage.</p>
                                <button
                                    onClick={clearAllData}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                >
                                    Clear All Data
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                .perspective { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
};

export default FlashcardApp;
