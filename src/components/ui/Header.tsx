"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { View, Deck } from "@/types/flashcard";

interface HeaderProps {
  view: View;
  currentDeck: Deck | null;
  onSetView: (view: View) => void;
}

export function Header({ view, currentDeck, onSetView }: HeaderProps) {
  const deckName = currentDeck?.name ?? "No Deck Selected";
  const cardCount = currentDeck?.cards.length ?? 0;

  return (
    <div className="mb-6 pb-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-700 truncate text-center sm:text-left">
        {view === "viewer" || view === "stats"
          ? `Studying: ${deckName}`
          : "Flashcard App"}
        {currentDeck && (
          <Badge variant="outline" className="ml-2">
            ({cardCount} cards)
          </Badge>
        )}
        {!currentDeck && view === "viewer" && (
          <span className="text-lg font-normal text-red-500 ml-2">
            (No deck selected)
          </span>
        )}
      </h1>
      <nav className="flex space-x-2 sm:space-x-3 flex-wrap justify-center">
        <Button
          onClick={() => onSetView("viewer")}
          variant={view === "viewer" ? "default" : "outline"}
        >
          Viewer
        </Button>
        <Button
          onClick={() => onSetView("stats")}
          variant={view === "stats" ? "default" : "outline"}
        >
          Stats
        </Button>
        <Button
          onClick={() => onSetView("manage_decks")}
          variant={view === "manage_decks" ? "default" : "outline"}
        >
          Manage Decks
        </Button>
        <Button
          onClick={() => onSetView("settings")}
          variant={view === "settings" ? "default" : "outline"}
        >
          Settings
        </Button>
      </nav>
    </div>
  );
}