const express = require('express');
const { suggestCardImprovements } = require('@packages/ai-utils');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { front, back } = req.body;
    if (!front || !back) {
      return res.status(400).json({ error: 'Front and back are required' });
    }
    const suggestions = await suggestCardImprovements(front, back);
    res.json({ suggestions });
  } catch (error) {
    console.error('Error suggesting improvements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;