import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const checkUserAnswer = async (assessment, answers) => {
  try {
    if (
      assessment.type === "SHORT_ANSWER" ||
      assessment.type === "LONG_ANSWER" ||
      assessment.type === "ESSAY" ||
      assessment.type === "FILL_IN_BLANK"
    ) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

      const userAnswersStr = answers
        .map(
          (answer) =>
            `questionId: ${answer.questionId}\nuserAnswer: ${answer.userAnswer}`
        )
        .join("\n\n")

      const correctAnswersStr = assessment.questions
        .map(
          (question) =>
            `questionId: ${question.id}\ncorrectAnswer: ${question.correctAnswer}`
        )
        .join("\n\n")

        const prompt = `
        The following is an evaluation task.
        
        Given a list of user-submitted answers and a list of corresponding correct answers, assess the accuracy of each response and what to improve.
        
        Return a JSON array in the following format:
        
        [
          {
            "questionId": "...",
            "userAnswer": "...",
            "correctAnswer": "...",
            "score": check how much is answer is realted to the correct answer or in the refrence and give a score out of 10,
            "feedback": "..."
          },
          ...
        ]
        
        User Answers:
        ${userAnswersStr}
        
        Correct Answers:
        ${correctAnswersStr}

        refrence:
        ${assessment.transcript}
        
        The output must be strictly valid JSON and match the format provided. Give  clear feedback on each response.
        `
        

      const result = await model.generateContent(prompt)
      const rawResponse = result.response.text()

      // i will only consider the first json array in the response
      const jsonStart = rawResponse.indexOf("[")
      const jsonEnd = rawResponse.lastIndexOf("]")
      const jsonString = rawResponse.slice(jsonStart, jsonEnd + 1)

      const parsedResponse = JSON.parse(jsonString)
      console.log(" parsed response:", parsedResponse)
      return parsedResponse
    }
  } catch (error) {
    console.error(" Error in checkUserAnswer:", error)
    return null
  }
}
