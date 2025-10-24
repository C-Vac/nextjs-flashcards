import { readFileSync } from "fs";
import { join } from "path";

const promptsDir = join(process.cwd(), "prompts");

export function buildPromptForText(text) {
  const promptTemplate = readFileSync(
    join(promptsDir, "generate_flashcards.txt"),
    "utf8"
  );
  return `${promptTemplate}\n\nText: ${text}`;
}

export function buildPromptForTopic(topic) {
  const promptTemplate = readFileSync(
    join(promptsDir, "generate_flashcards.txt"),
    "utf8"
  );
  return `${promptTemplate}\n\nTopic: ${topic}`;
}

export function buildPromptForImprovements(front, back) {
  return `Suggest improvements for the following flashcard:

Front: ${front}
Back: ${back}

Provide alternative phrasing for front and back to improve clarity, conciseness, or accuracy. Respond in JSON format: {"front": "improved front", "back": "improved back"}`;
}

export default {
  buildPromptForText,
  buildPromptForTopic,
  buildPromptForImprovements,
};
