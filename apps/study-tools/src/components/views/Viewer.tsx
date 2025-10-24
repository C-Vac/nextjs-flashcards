"use client";

import { Card } from "@ui";
import { Button } from "@ui";
import { Badge } from "@ui";
import { FlipCard } from "@ui";
import type { Card as CardType, Deck, View } from "@types";

interface ViewerProps {
  currentDeck: Deck | null;
  currentCard: CardType | null;
  currentShuffledIndex: number;
  shuffledIndices: number[];
  isFlipped: boolean;
  onFlip: () => void;
  onAnswer: (isCorrect: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onSetView: (view: View) => void;
}

export function Viewer({
  currentDeck,
  currentCard,
  currentShuffledIndex,
  shuffledIndices,
  isFlipped,
  onFlip,
  onAnswer,
  onPrev,
  onNext,
  onShuffle,
  onSetView,
}: ViewerProps) {
  if (!currentDeck) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-500 mb-4">No deck selected.</p>
        <Button onClick={() => onSetView("manage_decks")}>
          Go to Manage Decks
        </Button>
      </div>
    );
  }

  if (currentCard) {
    return (
      <div className="flex flex-col items-center">
        <FlipCard
          front={currentCard.front}
          back={currentCard.back}
          isFlipped={isFlipped}
          onFlip={onFlip}
        />

        <Button onClick={onFlip} className="mb-4" variant="outline">
          Flip Card
        </Button>

        <div className="flex space-x-4 mb-4">
          <Button onClick={() => onAnswer(false)} variant="destructive">
            Incorrect
          </Button>
          <Button onClick={() => onAnswer(true)} variant="default">
            Correct
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={onPrev}
            disabled={shuffledIndices.length <= 1}
            variant="outline"
          >
            Prev
          </Button>
          <span className="text-gray-600 text-sm">
            Card {currentShuffledIndex + 1} of {shuffledIndices.length}
          </span>
          <Button
            onClick={onNext}
            disabled={shuffledIndices.length <= 1}
            variant="outline"
          >
            Next
          </Button>
        </div>

        <div className="text-xs text-gray-500 mb-4 max-w-md text-center break-words">
          Tags:{" "}
          {(currentCard.tags ?? []).map((tag) => (
            <Badge key={tag} variant="secondary" className="mr-1">
              {tag}
            </Badge>
          )) || "None"}
        </div>

        <Button onClick={onShuffle} variant="secondary">
          Shuffle Deck (Weakest First)
        </Button>
      </div>
    );
  }

  if (currentDeck.cards.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">This deck has no cards.</p>
    );
  }

  return null;
}
