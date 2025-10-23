"use client";

import { useState } from "react";
import { Button } from "@packages/ui-components";
import { Card } from "@packages/ui-components";
import { Input } from "@packages/ui-components";
import { Separator } from "@packages/ui-components";
import type { View } from "@packages/flashcard-types";

const AIGenerate = ({ onSetView }: { onSetView: (view: View) => void }) => {
  const [textInput, setTextInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<any[]>([]);

  const handleGenerateFromText = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3001/api/generate-flashcards/from-text",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textInput }),
        }
      );
      const data = await response.json();
      setGeneratedCards(data.cards);
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
      const response = await fetch(
        "http://localhost:3001/api/generate-flashcards/from-topic",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: topicInput }),
        }
      );
      const data = await response.json();
      setGeneratedCards(data.cards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">AI Flashcard Generation</h2>
      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Generate from Text</h3>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste your lecture notes or article here..."
            className="w-full h-32 p-2 border rounded"
          />
          <Button
            onClick={handleGenerateFromText}
            disabled={loading}
            className="mt-2"
          >
            {loading ? "Generating..." : "Generate Flashcards"}
          </Button>
        </Card>
        <Separator />
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Generate from Topic</h3>
          <Input
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter a topic, e.g., 'Quantum Physics'"
          />
          <Button
            onClick={handleGenerateFromTopic}
            disabled={loading}
            className="mt-2"
          >
            {loading ? "Generating..." : "Generate Flashcards"}
          </Button>
        </Card>
      </div>
      {generatedCards.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Generated Flashcards</h3>
          {generatedCards.map((card, index) => (
            <Card key={index} className="p-4">
              <p>
                <strong>Front:</strong> {card.front}
              </p>
              <p>
                <strong>Back:</strong> {card.back}
              </p>
              <p>
                <strong>Tags:</strong> {card.tags.join(", ")}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIGenerate;
