"use client";

import { Button } from "@ui";
import { Badge } from "@ui";
import { FlipCard } from "@ui";
import type { Card as CardType, Deck, View } from "@types";
import { CheckCircle2, XCircle, Shuffle, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

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
      <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-xl text-gray-500 mb-6 font-medium">No deck selected to study.</p>
        <Button onClick={() => onSetView("manage_decks")} size="lg" className="rounded-xl shadow-sm">
          Go to Manage Decks
        </Button>
      </div>
    );
  }

  if (currentCard) {
    return (
      <div className="flex flex-col items-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Flashcard Progress Indicators */}
        <div className="w-full flex justify-between items-center mb-6 text-sm font-medium text-gray-400">
          <div className="flex items-center gap-1">
            <span className="text-gray-900 font-bold">{currentShuffledIndex + 1}</span>
            <span>/</span>
            <span>{shuffledIndices.length}</span>
          </div>
          <Button onClick={onShuffle} variant="ghost" size="sm" className="text-gray-500 hover:text-indigo-600 gap-1.5 rounded-lg -mr-3">
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">Shuffle (Weakest First)</span>
          </Button>
        </div>

        <FlipCard
          front={currentCard.front}
          back={currentCard.back}
          isFlipped={isFlipped}
          onFlip={onFlip}
        />

        {/* Action Controls */}
        <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-2 mb-8 transition-all duration-300">
          {!isFlipped ? (
            <Button 
              onClick={onFlip} 
              size="lg" 
              className="w-full sm:w-auto min-w-[200px] h-14 rounded-xl text-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reveal Answer
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => onAnswer(false)} 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto h-14 rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 flex-1 max-w-[200px]"
              >
                <XCircle className="w-6 h-6 mr-2" />
                Incorrect
              </Button>
              <Button 
                onClick={() => onAnswer(true)} 
                size="lg" 
                className="w-full sm:w-auto h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg flex-1 max-w-[200px]"
              >
                <CheckCircle2 className="w-6 h-6 mr-2" />
                Correct
              </Button>
            </>
          )}
        </div>

        {/* Navigation & Tags */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-6 gap-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={onPrev}
              disabled={shuffledIndices.length <= 1}
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={onNext}
              disabled={shuffledIndices.length <= 1}
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-1.5 max-w-[60%]">
            {(currentCard.tags ?? []).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none font-normal text-xs px-2.5 py-0.5">
                #{tag}
              </Badge>
            ))}
            {(!currentCard.tags || currentCard.tags.length === 0) && (
              <span className="text-xs text-gray-400 italic">No tags</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentDeck.cards.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-xl text-gray-500 font-medium">This deck has no cards.</p>
        <p className="text-gray-400 mt-2">Edit this deck or add cards to begin studying.</p>
      </div>
    );
  }

  return null;
}
