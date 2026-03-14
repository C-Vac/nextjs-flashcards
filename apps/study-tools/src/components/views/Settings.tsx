"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RotateCcw, Trash2, ShieldAlert, Info } from "lucide-react";

interface SettingsProps {
  currentDeck: { name: string } | null;
  onResetCurrentDeckScores: () => void;
  onClearAllData: () => void;
}

export function Settings({ currentDeck, onResetCurrentDeckScores, onClearAllData }: SettingsProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your application data and preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Reset Scores for Current Deck */}
        <Card className="border-gray-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-indigo-600" />
              Reset Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {currentDeck ? (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="max-w-md">
                  <p className="font-medium text-gray-900">Reset scores for &quot;{currentDeck.name}&quot;</p>
                  <p className="text-sm text-gray-500 mt-1">
                    This will clear all correct and incorrect counts for this specific deck. Your cards will remain untouched.
                  </p>
                </div>
                <Button 
                  onClick={onResetCurrentDeckScores} 
                  variant="outline"
                  className="rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 shrink-0"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Deck Scores
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl text-indigo-700">
                <Info className="w-5 h-5" />
                <p className="text-sm font-medium">Select a deck from the Viewer or Decks tab to reset its progress.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clear All Data */}
        <Card className="border-rose-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-rose-50/50 border-b border-rose-100">
            <CardTitle className="text-lg flex items-center gap-2 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="max-w-md">
                <p className="font-medium text-rose-900">Factory Reset</p>
                <p className="text-sm text-rose-600/70 mt-1">
                  Permanently delete all decks, cards, and study progress from your browser storage. This action cannot be undone.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="rounded-xl bg-rose-600 hover:bg-rose-700 shadow-sm shrink-0"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl border-rose-100">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-gray-900">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      This will wipe your entire local database. You will lose all your custom decks and statistics forever.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="rounded-xl border-gray-200">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={onClearAllData}
                      className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
                    >
                      Yes, Clear Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}