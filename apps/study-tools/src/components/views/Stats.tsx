"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, RotateCcw, Target, Zap } from "lucide-react";
import { useMemo } from "react";

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

export function Stats({
  currentDeck,
  sortedTags,
  onResetTagScore,
}: StatsProps) {
  const avgPerformance = useMemo(() => {
    if (sortedTags.length === 0) return 0;
    const sum = sortedTags.reduce((acc, curr) => acc + curr.performance, 0);
    return sum / sortedTags.length;
  }, [sortedTags]);

  const totalReviews = useMemo(() => {
    return sortedTags.reduce((acc, curr) => acc + curr.total, 0);
  }, [sortedTags]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Stats</h2>
          <p className="text-sm text-gray-500 mt-1">Analyze your strengths and weaknesses by tag.</p>
        </div>
      </div>

      {!currentDeck ? (
        <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
          <p className="text-xl text-gray-500 font-medium">No deck selected to view statistics.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-none bg-indigo-50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-indigo-600 mb-2">
                  <Target className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Average</span>
                </div>
                <div className="text-3xl font-bold text-indigo-900">
                  {Math.round(avgPerformance * 100)}%
                </div>
              </CardContent>
            </Card>
            <Card className="border-none bg-emerald-50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-emerald-600 mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Total Reviews</span>
                </div>
                <div className="text-3xl font-bold text-emerald-900">
                  {totalReviews}
                </div>
              </CardContent>
            </Card>
            <Card className="border-none bg-amber-50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-amber-600 mb-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Active Tags</span>
                </div>
                <div className="text-3xl font-bold text-amber-900">
                  {sortedTags.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Tag List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Tag Breakdown
            </h3>

            {sortedTags.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {sortedTags.map(({ tag, correct, incorrect, performance, total }) => (
                  <div
                    key={tag}
                    className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${performance < 0.4 ? "bg-rose-50 text-rose-600" : performance > 0.7 ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                          {performance < 0.4 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{tag}</p>
                          <p className="text-xs text-gray-500">{correct} correct / {total} total</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className={`text-lg font-bold ${performance < 0.4 ? "text-rose-600" : performance > 0.7 ? "text-emerald-600" : "text-blue-600"}`}>
                            {Math.round(performance * 100)}%
                          </span>
                        </div>
                        <Button
                          onClick={() => onResetTagScore(tag)}
                          variant="ghost"
                          size="icon"
                          className="rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 h-9 w-9"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          performance < 0.4 
                          ? "bg-rose-500" 
                          : performance > 0.7 
                            ? "bg-emerald-500" 
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${performance * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No stats recorded yet.</p>
                <p className="text-sm text-gray-400 mt-1">Study some cards to see your performance here.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
