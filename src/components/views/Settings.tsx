"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SettingsProps {
  currentDeck: { name: string } | null;
  onResetCurrentDeckScores: () => void;
  onClearAllData: () => void;
}

export function Settings({ currentDeck, onResetCurrentDeckScores, onClearAllData }: SettingsProps) {
  return (
    <div>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reset Scores for Current Deck */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reset Current Deck Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {currentDeck ? (
              <>
                <p className="text-sm text-gray-500 mb-3">
                  This will reset correct/incorrect counts for all tags in the deck: "{currentDeck.name}".
                </p>
                <Button onClick={onResetCurrentDeckScores} variant="destructive">
                  Reset Scores for "{currentDeck.name}"
                </Button>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Select a deck first to reset its scores.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Clear All Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-red-700">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 mb-3">
              This will permanently delete ALL decks and ALL progress from your browser's storage.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Clear All Data</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all decks and progress.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearAllData}>Yes, clear all data</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </CardContent>
    </div>
  );
}