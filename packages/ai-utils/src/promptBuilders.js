const fs = require('fs');
const path = require('path');

const promptsDir = path.join(__dirname, './prompts');

function buildPromptForText(text) {
  const promptTemplate = fs.readFileSync(path.join(promptsDir, 'generate_flashcards.txt'), 'utf8');
  return `${promptTemplate}\n\nText: ${text}`;
}

function buildPromptForTopic(topic) {
  const promptTemplate = fs.readFileSync(path.join(promptsDir, 'generate_flashcards.txt'), 'utf8');
  return `${promptTemplate}\n\nTopic: ${topic}`;
}

function buildPromptForImprovements(front, back) {
  return `Suggest improvements for the following flashcard:

Front: ${front}
Back: ${back}

Provide alternative phrasing for front and back to improve clarity, conciseness, or accuracy. Respond in JSON format: {"front": "improved front", "back": "improved back"}`;
}

module.exports = {
  buildPromptForText,
  buildPromptForTopic,
  buildPromptForImprovements
};