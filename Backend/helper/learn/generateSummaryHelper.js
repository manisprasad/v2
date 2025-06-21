import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSummaryHelper = async (content) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
        You are an expert content summarizer. Analyze the provided content and generate a clear, concise, and informative summary.

        The content may be extensive, so focus on identifying and capturing:
        - The overall purpose or main topic.
        - Key ideas, themes, or arguments presented.
        - Important details that contribute to understanding the subject.
        - Any patterns, structures, or noteworthy elements in the content.

        Your summary should be well-structured and easy to understand, providing a comprehensive overview for someone who hasn't read the original material. Avoid unnecessary detail, but ensure completeness and clarity.

        Content to summarize is below:
        \n\n${content}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};

export { generateSummaryHelper };