"use client";

import type {
  Card,
  TagScore,
  TagScores,
  Deck,
  AllDecks,
  View,
} from "@packages/flashcard-types";
import { useFlashcardPersistence } from "@/hooks/useFlashcardPersistence";
import { useDeckManagement } from "@/hooks/useDeckManagement";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { NextPage } from "next";

import { Header } from "@packages/ui-components";
import { Viewer } from "@/components/views/Viewer";
import { Stats } from "@/components/views/Stats";
import { ManageDecks } from "@/components/views/ManageDecks";
import { Settings } from "@/components/views/Settings";
import AIGenerate from "@/components/views/AIGenerate";

const FlashcardApp: NextPage = () => {
  // --- State ---
  const {
    allDecks,
    setAllDecks,
    selectedDeckId,
    setSelectedDeckId,
    generateDeckId,
    createDefaultDeck,
  } = useFlashcardPersistence();
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [currentShuffledIndex, setCurrentShuffledIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [view, setView] = useState<View>("viewer");

  // --- Integrate useDeckManagement Hook ---
  const {
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
  } = useDeckManagement({
    allDecks,
    setAllDecks,
    selectedDeckId,
    setSelectedDeckId,
    generateDeckId,
    setView,
  });

  const currentDeck = useMemo(() => {
    if (!selectedDeckId || !allDecks[selectedDeckId]) return null;
    return allDecks[selectedDeckId];
  }, [allDecks, selectedDeckId]);

  const cards = useMemo(() => currentDeck?.cards ?? [], [currentDeck]);
  const tagScores = useMemo(() => currentDeck?.tagScores ?? {}, [currentDeck]);
  const deckName = useMemo(
    () => currentDeck?.name ?? "No Deck Selected",
    [currentDeck]
  );

  // --- Shuffling Logic ---
  const getTagPerformance = useCallback(
    (tag: string): number => {
      const score = tagScores[tag] || { correct: 0, incorrect: 0 };
      const total = score.correct + score.incorrect;
      if (total === 0) return 0.5;
      return score.correct / total;
    },
    [tagScores]
  );

  const getCardWeakness = useCallback(
    (card: Card): number => {
      if (!card.tags || card.tags.length === 0) return 0.5;
      const performances = card.tags.map(getTagPerformance);
      return Math.min(...performances);
    },
    [getTagPerformance]
  );

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
      if (weaknessA !== weaknessB) {
        return weaknessA - weaknessB;
      } else {
        return Math.random() - 0.5;
      }
    });
    setShuffledIndices(indices);
    setCurrentShuffledIndex(0);
    setIsFlipped(false);
    console.log(
      "Shuffled. Weakest first based on tags:",
      indices.map((i) => cards[i]?.front ?? "N/A")
    );
  }, [cards, getCardWeakness]);

  useEffect(() => {
    shuffleDeck();
  }, [selectedDeckId, cards, shuffleDeck]);

  // --- Card Navigation & Scoring ---
  const currentCardIndex = shuffledIndices[currentShuffledIndex];
  const currentCard = cards[currentCardIndex];

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentCard || !selectedDeckId) return;

    setAllDecks((prevAllDecks) => {
      const deckToUpdate = prevAllDecks[selectedDeckId];
      if (!deckToUpdate) return prevAllDecks;

      const newScores = { ...(deckToUpdate.tagScores || {}) };
      (currentCard.tags ?? []).forEach((tag) => {
        const score = newScores[tag] || { correct: 0, incorrect: 0 };
        if (isCorrect) {
          score.correct += 1;
        } else {
          score.incorrect += 1;
        }
        newScores[tag] = { ...score };
      });

      const updatedDeck = { ...deckToUpdate, tagScores: newScores };
      return { ...prevAllDecks, [selectedDeckId]: updatedDeck };
    });

    goToNextCard();
  };

  const goToNextCard = () => {
    if (shuffledIndices.length === 0) return;
    setIsFlipped(false);
    setCurrentShuffledIndex((prev) => (prev + 1) % shuffledIndices.length);
  };

  const goToPrevCard = () => {
    if (shuffledIndices.length === 0) return;
    setIsFlipped(false);
    setCurrentShuffledIndex(
      (prev) => (prev - 1 + shuffledIndices.length) % shuffledIndices.length
    );
  };

  // --- Stats ---
  const sortedTags = useMemo(() => {
    return Object.entries(tagScores)
      .map(([tag, score]) => ({
        tag,
        ...score,
        performance:
          score.correct + score.incorrect === 0
            ? 0.5
            : score.correct / (score.correct + score.incorrect),
        total: score.correct + score.incorrect,
      }))
      .sort((a, b) => a.performance - b.performance);
  }, [tagScores]);

  const resetTagScore = (tag: string) => {
    if (!selectedDeckId) return;
    setAllDecks((prevAllDecks) => {
      const deckToUpdate = prevAllDecks[selectedDeckId];
      if (
        !deckToUpdate ||
        !deckToUpdate.tagScores ||
        !deckToUpdate.tagScores[tag]
      )
        return prevAllDecks;

      const newScores = { ...deckToUpdate.tagScores };
      delete newScores[tag];

      const updatedDeck = { ...deckToUpdate, tagScores: newScores };
      return { ...prevAllDecks, [selectedDeckId]: updatedDeck };
    });
  };

  // --- Settings ---
  const resetCurrentDeckScores = () => {
    if (!selectedDeckId || !currentDeck) return;
    if (
      window.confirm(
        `Are you sure you want to reset all tag scores for the deck "${deckName}"?`
      )
    ) {
      setAllDecks((prevAllDecks) => {
        const deckToUpdate = prevAllDecks[selectedDeckId];
        if (!deckToUpdate) return prevAllDecks;

        const updatedDeck = { ...deckToUpdate, tagScores: {} };
        return { ...prevAllDecks, [selectedDeckId]: updatedDeck };
      });
    }
  };

  const clearAllData = () => {
    if (
      window.confirm(
        "DELETE ALL DATA?\n\nAre you sure you want to clear all decks and scores? This cannot be undone."
      )
    ) {
      setAllDecks({});
      setSelectedDeckId(null);
      alert("All data cleared.");
      setView("manage_decks");
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <Header view={view} currentDeck={currentDeck} onSetView={setView} />

        {view === "viewer" && (
          <Viewer
            currentDeck={currentDeck}
            currentCard={currentCard}
            currentShuffledIndex={currentShuffledIndex}
            shuffledIndices={shuffledIndices}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
            onAnswer={handleAnswer}
            onPrev={goToPrevCard}
            onNext={goToNextCard}
            onShuffle={shuffleDeck}
            onSetView={setView}
          />
        )}

        {view === "stats" && (
          <Stats
            currentDeck={currentDeck}
            sortedTags={sortedTags}
            onResetTagScore={resetTagScore}
          />
        )}

        {view === "manage_decks" && (
          <ManageDecks
            allDecks={allDecks}
            selectedDeckId={selectedDeckId}
            editingDeckId={editingDeckId}
            tempDeckName={tempDeckName}
            fileInputRef={fileInputRef}
            onFileUpload={handleFileUpload}
            onSelectDeck={handleSelectDeck}
            onDeleteDeck={handleDeleteDeck}
            onDeckNameEdit={handleDeckNameEdit}
            onDeckNameSave={handleDeckNameSave}
            onDeckNameCancel={handleDeckNameCancel}
            onTempDeckNameChange={setTempDeckName}
            onDiscoverDecks={discoverDecks}
          />
        )}

        {view === "settings" && (
          <Settings
            currentDeck={currentDeck}
            onResetCurrentDeckScores={resetCurrentDeckScores}
            onClearAllData={clearAllData}
          />
        )}

        {view === "ai_generate" && <AIGenerate onSetView={(v) => setView(v)} />}
      </div>

      <footer className="text-center text-xs text-gray-400 mt-6">
        Flashcard App - Data stored in browser localStorage.
      </footer>
    </div>
  );
};

export default FlashcardApp;
