import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const talkToContent = async (content, Newprompt, previousContext) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
        You are a smart and context-aware AI assistant having a conversation with a user.

        Use the following content as your reference for answering questions:
        ---
        ${content}
        ---

        Here is the previous conversation context:
        ${previousContext}

        Now, the user says:
        "${Newprompt}"

        Based on the reference content and the ongoing conversation, respond in a helpful and accurate way. Make sure your answer is grounded in the reference content provided, and refer back to it as needed.

        Keep the tone conversational, clear, and concise. Only reply with the assistant's message.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};

export { talkToContent };
