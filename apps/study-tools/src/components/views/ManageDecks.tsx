"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AllDecks } from "@/types";
import type { ChangeEvent } from "react";
import { Upload, Search, Trash2, Edit2, Check, X, Layers, Plus } from "lucide-react";

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Decks</h2>
          <p className="text-sm text-gray-500 mt-1">Upload, discover, or organize your study materials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="border-indigo-100 bg-indigo-50/30 overflow-hidden group">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload New Deck</h3>
            <p className="text-sm text-gray-600 mb-4 px-4">
              Import cards from a JSON file with front, back, and optional tags.
            </p>
            <Input
              type="file"
              accept=".json,application/json"
              onChange={onFileUpload}
              ref={fileInputRef}
              className="hidden"
              id="file-upload-input"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Choose JSON File
            </Button>
          </CardContent>
        </Card>

        {/* Discovery Section */}
        <Card className="border-blue-100 bg-blue-50/30 overflow-hidden group">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover Decks</h3>
            <p className="text-sm text-gray-600 mb-4 px-4">
              Scan your local storage for pre-made flashcard collections.
            </p>
            <Button 
              onClick={onDiscoverDecks} 
              variant="outline"
              className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Scan Directory
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Deck List Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          Available Decks
        </h3>
        
        {Object.keys(allDecks).length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {Object.values(allDecks).map((deck) => (
              <div
                key={deck.id}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl border transition-all duration-200 group ${
                  deck.id === selectedDeckId 
                  ? "border-indigo-200 bg-indigo-50/50 shadow-sm" 
                  : "border-gray-100 bg-white hover:border-indigo-100 hover:shadow-md"
                }`}
              >
                {editingDeckId === deck.id ? (
                  <div className="flex items-center space-x-2 w-full">
                    <Input
                      type="text"
                      value={tempDeckName}
                      onChange={(e) => onTempDeckNameChange(e.target.value)}
                      className="flex-grow rounded-xl border-indigo-200 focus-visible:ring-indigo-500 h-10"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button
                        onClick={onDeckNameSave}
                        size="icon"
                        className="rounded-lg bg-indigo-600 hover:bg-indigo-700 h-10 w-10 shrink-0"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={onDeckNameCancel}
                        size="icon"
                        variant="ghost"
                        className="rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 h-10 w-10 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-grow flex items-center gap-3 w-full sm:w-auto">
                      <div className={`p-2 rounded-xl shrink-0 ${deck.id === selectedDeckId ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}>
                        <Layers className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold truncate ${deck.id === selectedDeckId ? "text-indigo-900" : "text-gray-800"}`}>
                          {deck.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="bg-white/50 border-none font-medium text-[10px] uppercase tracking-wider">
                            {deck.cards.length} cards
                          </Badge>
                          {deck.id === selectedDeckId && (
                            <Badge className="bg-indigo-600 text-white border-none font-medium text-[10px] uppercase tracking-wider">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto shrink-0 overflow-x-auto pb-1 sm:pb-0">
                      <Button
                        onClick={() => onSelectDeck(deck.id)}
                        disabled={deck.id === selectedDeckId}
                        size="sm"
                        variant={deck.id === selectedDeckId ? "secondary" : "default"}
                        className={`rounded-xl h-9 px-4 font-medium transition-all ${
                          deck.id === selectedDeckId 
                          ? "bg-indigo-100 text-indigo-700 cursor-default border-none" 
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                        }`}
                      >
                        {deck.id === selectedDeckId ? "Current" : "Select"}
                      </Button>
                      <Button
                        onClick={() => onDeckNameEdit(deck.id)}
                        size="icon"
                        variant="ghost"
                        className="rounded-xl h-9 w-9 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => onDeleteDeck(deck.id)}
                        size="icon"
                        variant="ghost"
                        className="rounded-xl h-9 w-9 text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No decks available yet.</p>
            <p className="text-sm text-gray-400 mt-1">Upload a JSON file or use AI to generate one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
