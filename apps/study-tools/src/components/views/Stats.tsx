"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TagScores } from "@/types/flashcard";

interface StatsProps {
  currentDeck: { name: string } | null;
  sortedTags: Array<{
    tag: string;
    correct: number;
    incorrect: number;
    performance: number;
    total: number;
  }>;
  onResetTagScore: (tag: string) => void;
}

export function Stats({ currentDeck, sortedTags, onResetTagScore }: StatsProps) {
  return (
    <div>
      <CardHeader>
        <CardTitle>Tag Performance for "{currentDeck?.name || 'Unknown'}"</CardTitle>
      </CardHeader>
      <CardContent>
        {!currentDeck && (
          <p className="text-gray-500">
            Please select a deck to view stats.
          </p>
        )}
        {currentDeck && sortedTags.length > 0 ? (
          <ul className="space-y-2">
            {sortedTags.map(({ tag, correct, incorrect, performance, total }) => (
              <li key={tag} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                <div>
                  <span className="font-medium text-gray-800 mr-2">{tag}</span>
                  <Badge
                    variant={performance < 0.4 ? "destructive" : performance > 0.7 ? "default" : "secondary"}
                  >
                    {Math.round(performance * 100)}%
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">({correct}/{total})</span>
                </div>
                <Button
                  onClick={() => onResetTagScore(tag)}
                  variant="destructive"
                  size="sm"
                >
                  Reset
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          currentDeck && (
            <p className="text-gray-500">
              No tag scores recorded yet for this deck. Review some cards!
            </p>
          )
        )}
      </CardContent>
    </div>
  );
}