import express from "express";
import { uploadLearn, generateNotes, generateSummary, generateFlashcards, askContent, getLearn } from "../../controllers/assessmentLearn/assessmentLearn.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// upload the content
router.post("/upload", verifyJWT, uploadLearn); 

// generate notes
router.post("/generateNotes", verifyJWT, generateNotes);

// generate summary
router.post("/generateSummary", verifyJWT, generateSummary);

// generate flashcards
router.post("/generateFlashcards", verifyJWT, generateFlashcards);

// talk to the content
router.post("/ask", verifyJWT, askContent);

// get the learn material by id
router.get("/:learnId", verifyJWT, getLearn);



export default router;