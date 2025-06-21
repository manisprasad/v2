import Learn from "../../models/learn.model.js";
import { uploadLearnHelper } from "../../helper/learn/uploadLearnHelper.js";
import { generateSummaryHelper } from "../../helper/learn/generateSummaryHelper.js";
import { generateNotesHelper } from "../../helper/learn/generateNotesHelper.js";
import { generateFlashCardsHelper } from "../../helper/learn/generateFlashCardsHelper.js";
import { talkToContent } from "../../helper/learn/talkToContent.js";

const uploadLearn = async (req, res) => {
    try {
        // extract form data
        console.log(req.body);
        const { title, cloudinaryContentUrl, contentType } = req.body;
        const userId = req.user._id;

        const { transcript } = await uploadLearnHelper({ title, cloudinaryContentUrl, contentType });

        const learnMaterial = new Learn({
            title,
            transcript,
            cloudinaryContentUrl,
            contentType,
            userId,
        });
        await learnMaterial.save();

        // Create a response object with the ID as string
        const responseData = learnMaterial.toObject();
        responseData._id = responseData._id.toString();

        console.log("Learn material uploaded successfully:", responseData);
        res.status(201).json({
            message: "Learn material uploaded successfully",
            data: responseData,
            status: 201,
            success: true,
        });

    } catch (error) {
        console.error("Error uploading learn material:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const generateNotes = async (req, res) => {
    try {
        const { learnId } = req.body;
        // Find the learn material by ID
        const learnMaterialDb = await Learn.findById(learnId);
        if (!learnMaterialDb) {
            return res.status(404).json({ message: "Learn material not found" });
        }

        // Check if notes already exist
        if (learnMaterialDb.notes) {
            console.log("Notes already exist, returning existing notes");
            return res.status(200).json({
                message: "Notes already exist",
                data: learnMaterialDb.notes,
                status: 200,
                success: true,
            });
        }

        // Notes don't exist, generate them
        const content = learnMaterialDb.transcript;
        const notes = await generateNotesHelper(content);
        if (!notes) {
            return res.status(500).json({ message: "Failed to generate notes" });
        }

        // Save the generated notes
        console.log("Notes generated successfully:", notes);
        await Learn.findByIdAndUpdate(learnId, { notes });

        res.status(200).json({
            message: "Notes generated successfully",
            data: notes,
            status: 200,
            success: true,
        });
    } catch (error) {
        console.error("Error generating notes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const generateSummary = async (req, res) => {
    try {
        const { learnId } = req.body;
        // Find the learn material by ID
        const learnMaterialDb = await Learn.findById(learnId);
        if (!learnMaterialDb) {
            return res.status(404).json({ message: "Learn material not found" });
        }

        // Check if summary already exists
        if (learnMaterialDb.summary) {
            console.log("Summary already exists, returning existing summary");
            return res.status(200).json({
                message: "Summary already exists",
                data: learnMaterialDb.summary,
                status: 200,
                success: true,
            });
        }

        // Summary doesn't exist, generate it
        const content = learnMaterialDb.transcript;
        const summary = await generateSummaryHelper(content);
        if (!summary) {
            return res.status(500).json({ message: "Failed to generate summary" });
        }

        // Save the generated summary
        console.log("Summary generated successfully:", summary);
        await Learn.findByIdAndUpdate(learnId, { summary });

        res.status(200).json({
            message: "Summary generated successfully",
            data: summary,
            status: 200,
            success: true,
        });
    } catch (error) {
        console.error("Error generating summary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const generateFlashcards = async (req, res) => {
    try {
        const { learnId } = req.body;
        // Find the learn material by ID
        const learnMaterialDb = await Learn.findById(learnId);
        if (!learnMaterialDb) {
            return res.status(404).json({ message: "Learn material not found" });
        }

        // Check if flashcards already exist
        if (learnMaterialDb.flashCards && learnMaterialDb.flashCards.length > 0) {
            console.log("Flash Cards already exist, returning existing cards");
            return res.status(200).json({
                message: "Flash Cards already exist",
                data: learnMaterialDb.flashCards,
                status: 200,
                success: true,
            });
        }

        // Flashcards don't exist, generate them
        try {
            const content = learnMaterialDb.transcript;
            const flashCards = await generateFlashCardsHelper(content);
            if (!flashCards || !Array.isArray(flashCards)) {
                return res.status(500).json({ 
                    message: "Failed to generate Flash Cards or invalid format returned", 
                    success: false 
                });
            }

            // Save the generated flashcards
            console.log("Flash Cards generated successfully:", flashCards);
            await Learn.findByIdAndUpdate(learnId, { flashCards });

            res.status(200).json({
                message: "Flash Cards generated successfully",
                data: flashCards,
                status: 200,
                success: true,
            });
        } catch (aiError) {
            console.error("AI processing error:", aiError);
            return res.status(500).json({ 
                message: "Error processing Flash Cards with AI", 
                error: aiError.message,
                success: false 
            });
        }
    } catch (error) {
        console.error("Error generating Flash Cards:", error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message,
            success: false 
        });
    }
};


const askContent = async (req, res) => {
    try {
        const { learnId, newMessages, oldMessages } = req.body;

        // validate above
        if (!learnId) {
            return res.status(400).json({ message: "Learn ID is required" });
        }
        if (!newMessages || !newMessages) {
            return res.status(400).json({ message: "New or Old message is missing" });
        }

        // Find the learn material by ID
        const learnMaterialDb = await Learn.findById(learnId);
        if (!learnMaterialDb) {
            return res.status(404).json({ message: "Learn material not found" });
        }

        // Extract transcript from the learn material
        const content = learnMaterialDb.transcript;

        if (!content) {
            return res.status(404).json({ message: "Transcript not found" });
        }

        // Call the talkToContent function with the content and messages
        const response = await talkToContent(content, newMessages, oldMessages);
        if (!response) {
            return res.status(500).json({ message: "Failed to generate response" });
        }

        // Send the generated response as a response
        console.log("Response generated successfully:", response);

        res.status(200).json({
            message: "Response generated successfully",
            data: response,
            status: 200,
            success: true,
        });
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ message: "Internal server error" });
    }




};


const getLearn = async (req, res) => {
    try {
        const learnId = req.params.learnId;
        const learnMaterialDb = await Learn.findById(learnId);
        if (!learnMaterialDb) {
            return res.status(404).json({ message: "Learn material not found" });
        }
        res.status(200).json({
            message: "Learn material fetched successfully",
            data: learnMaterialDb,
            status: 200,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching learn material:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export { uploadLearn, generateNotes, generateSummary, generateFlashcards, askContent, getLearn };