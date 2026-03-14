"use client";

import { Button } from "./button";
import { Badge } from "./badge";
import type { View, Deck } from "@/types";
import { BookOpen, BarChart2, FolderOpen, Settings, Sparkles } from "lucide-react";

interface HeaderProps {
  view: View;
  currentDeck: Deck | null;
  onSetView: (view: View) => void;
}

export function Header({ view, currentDeck, onSetView }: HeaderProps) {
  const deckName = currentDeck?.name ?? "No Deck Selected";
  const cardCount = currentDeck?.cards.length ?? 0;

  return (
    <div className="mb-8 pb-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          {view === "viewer" || view === "stats" ? (
            <>
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <span className="truncate max-w-[200px] sm:max-w-xs">{deckName}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <span>Study Tools</span>
            </>
          )}
        </h1>
        {currentDeck && (view === "viewer" || view === "stats") && (
          <div className="mt-1 flex items-center">
            <Badge variant="secondary" className="font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
              {cardCount} cards
            </Badge>
          </div>
        )}
        {!currentDeck && view === "viewer" && (
          <div className="mt-1 text-sm font-medium text-rose-500">
            No deck selected
          </div>
        )}
      </div>

      <nav className="flex items-center bg-gray-50/80 p-1 rounded-xl border border-gray-100 shadow-sm overflow-x-auto max-w-full">
        <Button
          onClick={() => onSetView("viewer")}
          variant={view === "viewer" ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 rounded-lg px-4 ${view === "viewer" ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Study</span>
        </Button>
        <Button
          onClick={() => onSetView("stats")}
          variant={view === "stats" ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 rounded-lg px-4 ${view === "stats" ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
        >
          <BarChart2 className="w-4 h-4" />
          <span className="hidden sm:inline">Stats</span>
        </Button>
        <Button
          onClick={() => onSetView("manage_decks")}
          variant={view === "manage_decks" ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 rounded-lg px-4 ${view === "manage_decks" ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
        >
          <FolderOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Decks</span>
        </Button>
        <Button
          onClick={() => onSetView("ai_generate")}
          variant={view === "ai_generate" ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 rounded-lg px-4 ${view === "ai_generate" ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI Generate</span>
        </Button>
        <Button
          onClick={() => onSetView("settings")}
          variant={view === "settings" ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 rounded-lg px-4 ${view === "settings" ? "bg-gray-800 text-white hover:bg-gray-900 shadow-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </nav>
    </div>
  );
}

