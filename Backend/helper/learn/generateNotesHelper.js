import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateNotesHelper = async (content) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
        You are an intelligent notes generator. Based on the content provided, extract the most important information and convert it into clear, well-organized notes.

        Focus on:
        - Key concepts and ideas.
        - Definitions, facts, and explanations.
        - Bullet points that are concise and easy to review.
        - Logical structure and grouping of related points.

        The notes should be helpful for someone reviewing the material later, especially for learning or studying purposes. Avoid copying large sections of text; instead, distill and rephrase in your own words for clarity and retention.

        Content to generate notes from:
        \n\n${content}
    `;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};

export { generateNotesHelper };