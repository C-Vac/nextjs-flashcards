import express from "express";
import cors from "cors";
import {
  generateFlashcardsHandler,
  suggestImprovementsHandler,
} from "./utils.js";

const generateFlashcardsRoute = express.Router();
const suggestImprovementsRoute = express.Router();

generateFlashcardsRoute.post("/", generateFlashcardsHandler);
suggestImprovementsRoute.post("/", suggestImprovementsHandler);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/generate-flashcards", generateFlashcardsRoute);
app.use("/api/suggest-improvements", suggestImprovementsRoute);

app.listen(PORT, () => {
  console.log(`AI Backend running on port ${PORT}`);
});
