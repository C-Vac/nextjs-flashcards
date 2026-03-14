"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { View, Card as CardType } from "@/types";
import { Sparkles, FileText, Type, Loader2, Save, X, Plus, Wand2 } from "lucide-react";

interface AIGenerateProps {
  onSetView: (view: View) => void;
}

const AIGenerate = ({ onSetView }: AIGenerateProps) => {
  const [textInput, setTextInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<CardType[]>([]);

  const handleGenerateFromText = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });
      const data = await response.json();
      if (data.cards) setGeneratedCards(data.cards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromTopic = async () => {
    if (!topicInput.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicInput }),
      });
      const data = await response.json();
      if (data.cards) setGeneratedCards(data.cards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearGenerated = () => {
    setGeneratedCards([]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          AI Generation
        </h2>
        <p className="text-sm text-gray-500 mt-1">Transform your notes or topics into high-quality flashcards instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* From Text */}
        <Card className="border-indigo-100 shadow-sm overflow-hidden flex flex-col h-full">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 py-4">
            <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
              <FileText className="w-5 h-5 text-indigo-600" />
              From Context
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-grow flex flex-col">
            <p className="text-sm text-gray-500 mb-4">Paste lecture notes, articles, or any text to extract key concepts.</p>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your content here..."
              className="w-full flex-grow min-h-[200px] p-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none outline-none text-sm leading-relaxed"
            />
            <Button
              onClick={handleGenerateFromText}
              disabled={loading || !textInput.trim()}
              className="mt-6 w-full rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200/50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Wand2 className="w-5 h-5 mr-2" />}
              Generate from Text
            </Button>
          </CardContent>
        </Card>

        {/* From Topic */}
        <Card className="border-blue-100 shadow-sm overflow-hidden flex flex-col h-full">
          <CardHeader className="bg-blue-50/50 border-b border-blue-100 py-4">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
              <Type className="w-5 h-5 text-blue-600" />
              By Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-grow flex flex-col">
            <p className="text-sm text-gray-500 mb-4">Enter a subject and let the AI build a comprehensive study deck for you.</p>
            <div className="space-y-4 flex-grow">
              <Input
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g., Cellular Biology or React Hooks"
                className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white px-4"
              />
              <div className="p-6 rounded-2xl bg-blue-50/30 border border-blue-100/50 border-dashed text-center">
                <Sparkles className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                <p className="text-xs text-blue-600/70 leading-relaxed italic">
                  &quot;The best way to learn a new topic is to teach it to an AI and have it quiz you back.&quot;
                </p>
              </div>
            </div>
            <Button
              onClick={handleGenerateFromTopic}
              disabled={loading || !topicInput.trim()}
              className="mt-6 w-full rounded-xl h-12 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200/50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              Build Topic Deck
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Generated Preview */}
      {generatedCards.length > 0 && (
        <div className="space-y-6 pt-4 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-indigo-600" />
              Generated Flashcards
              <Badge variant="outline" className="ml-2 font-mono">{generatedCards.length}</Badge>
            </h3>
            <div className="flex gap-2">
              <Button onClick={clearGenerated} variant="ghost" size="sm" className="rounded-lg text-gray-500">
                <X className="w-4 h-4 mr-2" />
                Discard
              </Button>
              <Button className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save as New Deck
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedCards.map((card, index) => (
              <Card key={index} className="border-gray-100 hover:border-indigo-200 transition-colors rounded-2xl overflow-hidden group">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Front</span>
                    <p className="mt-1 font-semibold text-gray-800">{card.front}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Back</span>
                    <p className="mt-1 text-gray-600 text-sm leading-relaxed">{card.back}</p>
                  </div>
                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {card.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-500 border-none font-normal text-[10px]">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGenerate;
