const ollamaClient = require("./ollamaClient");
const {
  buildPromptForText,
  buildPromptForTopic,
  buildPromptForImprovements,
} = require("./promptBuilders");

async function generateFlashcardsFromText(text) {
  const prompt = buildPromptForText(text);
  const response = await ollamaClient.generate(prompt);
  try {
    const parsed = JSON.parse(response);
    return parsed.cards || [];
  } catch (error) {
    throw new Error("Failed to parse AI response");
  }
}

async function generateFlashcardsFromTopic(topic) {
  const prompt = buildPromptForTopic(topic);
  const response = await ollamaClient.generate(prompt);
  try {
    const parsed = JSON.parse(response);
    return parsed.cards || [];
  } catch (error) {
    throw new Error("Failed to parse AI response");
  }
}

async function suggestCardImprovements(front, back) {
  const prompt = buildPromptForImprovements(front, back);
  const response = await ollamaClient.generate(prompt);
  try {
    return JSON.parse(response);
  } catch (error) {
    throw new Error("Failed to parse AI response");
  }
}

module.exports = {
  generateFlashcardsFromText,
  generateFlashcardsFromTopic,
  suggestCardImprovements,
};
