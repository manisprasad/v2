import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAssessmentPromptCall = async (reference, type = "MCQ", numberOfQuestions = 5, difficulty = "medium", language) => {
   console.log(language, type, numberOfQuestions, difficulty);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        let jsonStructure = '';
        let prompt = '';
        
        if (type === "MIX") {
            const mcqStructure = `{
                "id": "mcq_number",
                "type": "MCQ",
                "question": "the_question_text",
                "options": ["option_a", "option_b", "option_c", "option_d"],
                "correctAnswer": "the_correct_option",
                "explanation": "brief_explanation_of_answer",
                "reference": "specific_part_of_content_this_relates_to"
            }`;
        
            const shortAnswerStructure = `{
                "id": "short_number",
                "type": "SHORT_ANSWER",
                "question": "the_question_text",
                "correctAnswer": "the_correct_answer",
                "explanation": "brief_explanation_of_answer",
                "reference": "specific_part_of_content_this_relates_to"
            }`;
        
            const longAnswerStructure = `{
                "id": "long_number",
                "type": "LONG_ANSWER",
                "question": "the_question_text",
                "correctAnswer": "the_correct_answer",
                "explanation": "comprehensive_explanation_covering_key_points",
                "reference": "specific_part_of_content_this_relates_to"
            }`;
        
            prompt = `
                You are an expert assessment creator. Create a ${difficulty} difficulty mixed assessment based on the following content:
                
                ${reference}
                
                Generate 15 questions total:
                - 5 multiple choice questions (MCQ) with 4 options each and only one correct option
                - 5 short answer questions that require 1-2 sentence responses
                - 5 long answer questions that require paragraph-length responses (3-5 sentences)
                
                Format your response as a structured JSON array of this format:
                [[{question1}, {question2}, ...], {title : title of content, description: description of content, tags: array of tags related to the content, category: array of name of categories related to the content}]
                Do not include any additional explanation.
                
                Each question should follow one of these structures based on its type:
        
                For MCQ questions:
                ${mcqStructure}
        
                For Short Answer questions:
                ${shortAnswerStructure}
        
                For Long Answer questions:
                ${longAnswerStructure}
        
                Ensure all questions are directly relevant to the content, varied in topic coverage, and appropriate for ${difficulty} difficulty level.
                Generate the assessment in ${language} only, regardless of the language of the reference content.
            `;
        } else {
            jsonStructure = getJsonStructureByType(type);
        
            prompt = `
                You are an expert assessment creator. Create a ${difficulty} difficulty assessment with ${numberOfQuestions} ${type} questions based on the following content:
        
                ${reference}
        
                ${getQuestionFormatInstructions(type)}
        
                Format your response as a structured JSON array of this format:
                [[{question1}, {question2}, ...], {title : title of content, description: description of content, tags: array of tags related to the content, category: array of name of categories related to the content}]
                Do not include any additional explanation.
                
                Each question should have the following structure:
                ${jsonStructure}
                
                Metadata should include:
                {
                    "title": "title_of_the_assessment",
                    "description": "brief_summary_of_the_assessment",
                    "tags": ["tag1", "tag2", ...],
                    "category": ["category1", "category2", ...]
                }
        
                Ensure questions are directly relevant to the content, varied in topic coverage, and appropriate for ${difficulty} difficulty level.
                Generate the assessment in ${language} only, regardless of the language of the reference content.
            `;
        }
        
        const result = await model.generateContent(prompt);
        const response =  result.response;
        // console.log(response.text());
        return response.text();
    } catch (error) {
        console.error('Error generating assessment:', error);
        throw new Error('Failed to generate assessment. Please try again later.');
    }
};

// Helper: JSON structure generator
// enum: ["MCQ", "TF", "SHORT_ANSWER", "LONG_ANSWER", "ESSAY", "FILL_IN_BLANK", "MATCHING", "ASSERTION_REASONING"],
function getJsonStructureByType(type) {
    switch (type.toUpperCase()) {
        case "MCQ":
            return `{
                "id": "unique_number",
                "type": "MCQ",
                "question": "the_question_text",
                "options": ["option_a", "option_b", "option_c", "option_d"],
                "correctAnswer": "the_correct_option",
                "explanation": "brief_explanation_of_answer",
                "reference": "specific_part_of_content_this_relates_to"
            }`;
        case "TF":
            return `{
                "id": "unique_number",
                "type": "TF",
                "question": "the_question_text",
                "options": ["True", "False"],
                "correctAnswer": "True or False",
                "explanation": "brief_explanation_of_answer",
                "reference": "specific_part_of_content_this_relates_to"
            }`;
        case "FILL_IN_BLANK":
            return `{
                "id": "unique_number",
                "type": "FILL_IN_BLANK",
                "question": "the_question_text_with_blank",
                "correctAnswer": "the_correct_answer",
                "explanation": "brief_explanation_of_answer",
                "reference": "specific_part_of_content_this_relates_to"
            }`;
        case "ASSERTION_REASONING":
            return `{
                "id": "unique_number",
                "type": "ASSERTION_REASONING",
                "question": "Assertion: [assertion statement]\\nReason: [reason statement]",
                "options": [
                    "Both assertion and reason are true, and the reason correctly explains the assertion",
                    "Both assertion and reason are true, but the reason does not explain the assertion",
                    "The assertion is true but the reason is false",
                    "The assertion is false but the reason is true"
                ],
                "correctAnswer": "the_correct_option",
                "explanation": "brief_explanation_of_the_relationship_between_assertion_and_reason",
                "reference": "specific_part_of_content_this_relates_to"
            }`;
        case "SHORT_ANSWER":
            return `{
                "id": "unique_number",
                "type": "SHORT_ANSWER",
                "question": "the_question_text",
                "correctAnswer": "the_correct_answer",
                "explanation": "brief_explanation_of_answer",
                "reference": "specific_part_of_content_this_relates_to"
            }`;
        case "LONG_ANSWER":
            return `{
                "id": "unique_number",
                "type": "LONG_ANSWER",
                "question": "the_question_text",
                "correctAnswer": "the_correct_answer",
                "explanation": "comprehensive_explanation_covering_key_points",
                "reference": "specific_part_of_content_this_relates_to"
            }`;
        default:
            return `{
                "id": "unique_number",
                "type": "${type.toUpperCase()}",
                "question": "the_question_text",
                "correctAnswer": "the_correct_answer",
                "explanation": "",
                "reference": "specific_part_of_content_this_relates_to"
            }`;
    }
}


// Helper: Prompt instructions based on type
function getQuestionFormatInstructions(type) {
    switch (type.toUpperCase()) {
        case "MCQ":
            return "Create multiple choice questions with 4 options per question. Ensure only one option is correct.";
        case "TF":
            return "Create true/false questions where the answer is either true or false. Ensure there are always two options: 'true' and 'false'.";
        case "SHORT_ANSWER":
            return "Create questions that require a short (1-2 sentence) response. Include model answers.";
        case "LONG_ANSWER":
            return "Create questions that require paragraph-length responses (3-5 sentences). Include comprehensive model answers that cover the key points.";
        case "ESSAY":
            return "Create open-ended questions that require detailed responses. Include key points that should be covered in a good response.";
        case "FILL_IN_BLANK":
            return "Create fill-in-the-blank questions where students need to provide the missing word or phrase.";
        case "MATCHING":
            return "Create matching questions where students need to match items from two different columns.";
        case "ASSERTION_REASONING":
            return "Create assertion-reasoning questions. Each question consists of an assertion (a statement) and a reason (supporting explanation). Students must evaluate both statements and their relationship, choosing from options: A) Both assertion and reason are true, and the reason correctly explains the assertion. B) Both are true, but reason doesn't explain assertion. C) Assertion true, reason false. D) Assertion false, reason true.";
        default:
            return "Create multiple choice questions with 4 options per question. Ensure only one option is correct.";
    }
}

export default generateAssessmentPromptCall;

