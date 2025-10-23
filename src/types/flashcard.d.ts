// src/types/flashcard.d.ts

export interface Card {
  id?: string | number; // Optional ID from original JSON, index can be fallback
  front: string;
  back: string;
  tags?: string[]; // Make tags optional for broader compatibility
}

export interface TagScore {
  correct: number;
  incorrect: number;
}

export type TagScores = Record<string, TagScore>;

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  tagScores: TagScores;
}

export type AllDecks = Record<string, Deck>;

export type View = "viewer" | "stats" | "manage_decks" | "settings";
