import ollamaClient from "./ollamaClient.js";
import {
  buildPromptForText,
  buildPromptForTopic,
  buildPromptForImprovements,
} from "./promptBuilders.js";

export async function generateFlashcardsFromText(text) {
  const prompt = buildPromptForText(text);
  const response = await ollamaClient.generate(prompt);
  try {
    const parsed = JSON.parse(response);
    return parsed.cards || [];
  } catch (error) {
    throw new Error("Failed to parse AI response");
  }
}

export async function generateFlashcardsFromTopic(topic) {
  const prompt = buildPromptForTopic(topic);
  const response = await ollamaClient.generate(prompt);
  try {
    const parsed = JSON.parse(response);
    return parsed.cards || [];
  } catch (error) {
    throw new Error("Failed to parse AI response");
  }
}

export async function suggestCardImprovements(front, back) {
  const prompt = buildPromptForImprovements(front, back);
  const response = await ollamaClient.generate(prompt);
  try {
    return JSON.parse(response);
  } catch (error) {
    throw new Error("Failed to parse AI response");
  }
}

export async function generateFlashcardsHandler(req, res) {
  console.log("Received request for flashcard generation.");
  try {
    const { text, topic } = req.body;
    console.log("Request body:", { text, topic });
    let cards;
    if (text) {
      cards = await generateFlashcardsFromText(text);
    } else if (topic) {
      cards = await generateFlashcardsFromTopic(topic);
    } else {
      return res
        .status(400)
        .json({ error: "Either text or topic is required." });
    }
    res.json({ cards });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    res.status(500).json({ error: error.message });
  }
}

export async function suggestImprovementsHandler(req, res) {
  console.log("Received request for improvement suggestions.");
  try {
    const { front, back } = req.body;
    console.log("Request body:", { front, back });
    if (!front || !back) {
      return res.status(400).json({
        error: "Front and back content are required for suggestions.",
      });
    }
    const improvements = await suggestCardImprovements(front, back);
    res.json(improvements);
  } catch (error) {
    console.error("Error suggesting improvements:", error);
    res.status(500).json({ error: error.message });
  }
}

export default {
  generateFlashcardsFromText,
  generateFlashcardsFromTopic,
  suggestCardImprovements,
  generateFlashcardsHandler,
  suggestImprovementsHandler,
};
