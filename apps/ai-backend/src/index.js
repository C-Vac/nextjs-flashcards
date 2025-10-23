const express = require('express');
const cors = require('cors');
const generateFlashcardsRoute = require('./routes/generateFlashcards');
const suggestImprovementsRoute = require('./routes/suggestImprovements');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/generate-flashcards', generateFlashcardsRoute);
app.use('/api/suggest-improvements', suggestImprovementsRoute);

app.listen(PORT, () => {
  console.log(`AI Backend running on port ${PORT}`);
});