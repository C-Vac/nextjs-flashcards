"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AllDecks } from "@/types/flashcard";
import type { ChangeEvent } from "react";

interface ManageDecksProps {
  allDecks: AllDecks;
  selectedDeckId: string | null;
  editingDeckId: string | null;
  tempDeckName: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelectDeck: (id: string) => void;
  onDeleteDeck: (id: string) => void;
  onDeckNameEdit: (id: string) => void;
  onDeckNameSave: () => void;
  onDeckNameCancel: () => void;
  onTempDeckNameChange: (name: string) => void;
  onDiscoverDecks: () => void;
}

export function ManageDecks({
  allDecks,
  selectedDeckId,
  editingDeckId,
  tempDeckName,
  fileInputRef,
  onFileUpload,
  onSelectDeck,
  onDeleteDeck,
  onDeckNameEdit,
  onDeckNameSave,
  onDeckNameCancel,
  onTempDeckNameChange,
  onDiscoverDecks,
}: ManageDecksProps) {
  return (
    <div>
      <CardHeader>
        <CardTitle>Manage Decks</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Upload Section */}
        <div className="mb-6 p-4 border border-dashed border-gray-300 rounded bg-gray-50 text-center">
          <h3 className="text-lg font-medium mb-2 text-gray-600">Upload New Deck</h3>
          <p className="text-sm text-gray-500 mb-3">
            Select a JSON file containing an array of flashcards (objects with 'front' and 'back', optionally 'tags').
          </p>
          <Input
            type="file"
            accept=".json,application/json"
            onChange={onFileUpload}
            ref={fileInputRef}
            className="hidden"
            id="file-upload-input"
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            Choose JSON File...
          </Button>
        </div>

        {/* Discovery Section */}
        <div className="mb-6 p-4 border border-dashed border-blue-300 rounded bg-blue-50 text-center">
          <h3 className="text-lg font-medium mb-2 text-blue-600">Discover Decks</h3>
          <p className="text-sm text-blue-500 mb-3">
            Automatically discover and load flashcard decks from the ./decks directory.
          </p>
          <Button onClick={onDiscoverDecks} variant="secondary">
            Discover Decks
          </Button>
        </div>

        {/* Deck List Section */}
        <h3 className="text-lg font-medium mb-3 text-gray-600">Available Decks</h3>
        {Object.keys(allDecks).length > 0 ? (
          <ul className="space-y-3">
            {Object.values(allDecks).map((deck) => (
              <li key={deck.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white rounded border border-gray-200 shadow-sm gap-2">
                {editingDeckId === deck.id ? (
                  <div className="flex items-center space-x-2 flex-grow">
                    <Input
                      type="text"
                      value={tempDeckName}
                      onChange={(e) => onTempDeckNameChange(e.target.value)}
                      className="flex-grow"
                      autoFocus
                    />
                    <Button onClick={onDeckNameSave} size="sm" variant="default">
                      Save
                    </Button>
                    <Button onClick={onDeckNameCancel} size="sm" variant="destructive">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex-grow flex items-center">
                    <span className={`font-medium text-gray-800 mr-2 ${deck.id === selectedDeckId ? "text-blue-600" : ""}`}>
                      {deck.name}
                    </span>
                    <Badge variant="outline">{deck.cards.length} cards</Badge>
                    {deck.id === selectedDeckId && (
                      <Badge variant="default" className="ml-2">Selected</Badge>
                    )}
                  </div>
                )}

                {editingDeckId !== deck.id && (
                  <div className="flex space-x-2 items-center flex-shrink-0 mt-2 sm:mt-0">
                    <Button
                      onClick={() => onSelectDeck(deck.id)}
                      disabled={deck.id === selectedDeckId}
                      size="sm"
                      variant="default"
                    >
                      Select
                    </Button>
                    <Button
                      onClick={() => onDeckNameEdit(deck.id)}
                      size="sm"
                      variant="secondary"
                    >
                      Rename
                    </Button>
                    <Button
                      onClick={() => onDeleteDeck(deck.id)}
                      size="sm"
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-5">
            No decks available. Upload one using the button above!
          </p>
        )}
      </CardContent>
    </div>
  );
}