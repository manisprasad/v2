import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateFlashCardsHelper = async (content) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
        You are a flashcard generator. Based on the content provided, create a list of flashcards designed to reinforce key knowledge and concepts.

        Each flashcard should be structured as an object with a "question" and an "answer" field, like this:
        {
            question: "What is ...?",
            answer: "..."
        }

        IMPORTANT: Return ONLY a valid JavaScript array containing these objects. DO NOT include any markdown code blocks or additional text.
        DO NOT wrap your response in backticks or "\`\`\`javascript" tags.
        The response must be a valid JavaScript array that can be directly parsed with JSON.parse() after wrapping in parentheses.

        Format example:
        [
            {
                "question": "What is the capital of France?",
                "answer": "Paris"
            },
            {
                "question": "What is the largest planet in our solar system?",
                "answer": "Jupiter"
            }
        ]

        Guidelines:
        - Focus on important facts, definitions, and key ideas from the content.
        - Keep questions clear and direct.
        - Make answers accurate and concise.
        - Aim for questions that help with understanding and memory retention.
        - Use double quotes for all string values, not single quotes.
        - generate a minimum of 5 flashcards and a maximum of 11 flashcards.

        Content to convert into flashcards:
        \n\n${content}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let responseText = response.text();
        
        // Remove markdown code block formatting if present
        let cleanedResponse = responseText.replace(/```javascript|```json|```|\s*```/g, "").trim();
        
        // Try to parse the response as JSON
        try {
            // If the text might be a valid JavaScript array but not valid JSON
            // (like having unquoted property names), wrap it in parentheses and evaluate
            if (cleanedResponse.startsWith("[") && cleanedResponse.endsWith("]")) {
                // Attempt to fix common issues with the response
                cleanedResponse = cleanedResponse
                    .replace(/(\s*,\s*})/g, ' }') // Remove trailing commas in objects
                    .replace(/(\s*,\s*])/g, ' ]') // Remove trailing commas in arrays
                    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Ensure property names are quoted
                    .replace(/:\s*['"]([^'"]*)['"](\s*[,}])/g, ':"$1"$2'); // Ensure string values use double quotes
                
                // Now try to parse it as JSON
                return JSON.parse(cleanedResponse);
            } else {
                throw new Error("Response is not a valid array format");
            }
        } catch (parseError) {
            console.error("Error parsing flashcards response:", parseError);
            console.log("Raw response:", responseText);
            console.log("Cleaned response:", cleanedResponse);
            throw new Error("Failed to parse flashcards from AI response");
        }
    } catch (error) {
        console.error("Error generating flashcards:", error);
        throw error;
    }
};

export { generateFlashCardsHelper };