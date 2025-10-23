const express = require('express');
const { generateFlashcardsFromText, generateFlashcardsFromTopic } = require('@packages/ai-utils');

const router = express.Router();

router.post('/from-text', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const flashcards = await generateFlashcardsFromText(text);
    res.json({ cards: flashcards });
  } catch (error) {
    console.error('Error generating flashcards from text:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/from-topic', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    const flashcards = await generateFlashcardsFromTopic(topic);
    res.json({ cards: flashcards });
  } catch (error) {
    console.error('Error generating flashcards from topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;