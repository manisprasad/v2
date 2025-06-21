import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronRight, ChevronLeft } from "lucide-react"
import axios from "axios";
import { submitQuiz } from "../../../services/quiz/QuizService";
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const QuizAttempt = () => {
    const { assessmentId } = useParams()
    const navigate = useNavigate()
    const [quizData, setQuizData] = useState(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedOptions, setSelectedOptions] = useState({})
    const [timeSpent, setTimeSpent] = useState(0)
    const [timer, setTimer] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    console.log("selected options are", selectedOptions)

    console.log("quiz data is :", quizData)
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await axios.get(`${REACT_APP_BACKEND_URL}/api/v1/assessmentFetch/${assessmentId}`, {
                    withCredentials: true
                })
                console.log(response)
                setQuizData(response.data.assessment)
            } catch (error) {
                console.error('Error fetching quiz data:', error)
            }
        }
        fetchQuizData()
    }, [assessmentId])

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTimeSpent((prevTime) => prevTime + 1)
        }, 1000)

        setTimer(timerInterval)

        return () => clearInterval(timerInterval)
    }, [])

    const handleOptionSelect = (questionId, option) => {
        setSelectedOptions({
            ...selectedOptions,
            [questionId]: option,
        })
    }

    const handleNextQuestion = async() => { // kya pankaj bhai async to bana dete isko kitna problem hua mujhe
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        } else {
            // End quiz
            clearInterval(timer)
            const submissionBody = {
                answers: Object.keys(selectedOptions).map(questionId => ({
                    questionId,
                    userAnswer: selectedOptions[questionId]
                })),
                timeTaken: timeSpent
            }
            console.log(submissionBody)
            setIsSubmitting(true)
            const response  = await submitQuiz(assessmentId, submissionBody)
            setIsSubmitting(false)
            //only navigate if the response is successful 
            if(response) navigate(`/quizResults/${assessmentId}`, { state: submissionBody })
        }
    }

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1)
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? "0" + secs : secs}`
    }

    if (!quizData) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-300 text-lg">Loading Assessment...</p>
                </div>
            </div>
        )
    }

    const currentQuestion = quizData.questions[currentQuestionIndex]
    const isAnswered = selectedOptions[currentQuestion.id]
    if(isSubmitting) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-300 text-lg">Submitting your answers...</p>
            </div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-800">
                {/* Quiz Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-b border-slate-700">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100"> {quizData.title}</h2>
                            <p className="text-slate-400 text-sm mt-1">
                                {quizData.type} • {quizData.difficulty.toUpperCase()} • {quizData.questions.length} questions • {quizData.assessmentLang}
                            </p>
                        </div>
                        <div className="bg-slate-800 px-4 py-2 rounded-lg">
                            <span className="text-slate-400 text-sm">Time: </span>
                            <span className="text-cyan-400 font-mono">{formatTime(timeSpent)}</span>
                        </div>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-800">
                    <div
                        className="h-1 bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
                    ></div>
                </div>

                {/* Question Content  */}
                <div className="p-6">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                                Question {currentQuestionIndex + 1}/{quizData.questions.length}
                            </span>
                        </div>
                        <h3 className="text-xl font-medium text-slate-100">
                            {currentQuestion.question.split('\n').map((line, index) => (
                                <span key={index} className="block">{line}</span>
                            ))}
                        </h3>
                    </div>

                    {/* Options */}
                    {/* Dynamic Input Rendering Based on Type */}
                    <div className="space-y-3 mb-8">
                        {(() => {
                            const type = currentQuestion.type

                            if (type === "MCQ" || type === "TF" || type === "ASSERTION_REASONING") {
                                return currentQuestion.options.map((option, index) => {
                                    const isSelected = selectedOptions[currentQuestion.id] === option
                                    return (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-lg cursor-pointer border ${isSelected
                                                    ? "border-cyan-500 bg-cyan-500/10"
                                                    : "border-slate-700 bg-slate-800 hover:border-cyan-500/50"
                                                } transition-all`}
                                            onClick={() => handleOptionSelect(currentQuestion.id, option)}
                                        >
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mr-3">
                                                    <div
                                                        className={`w-6 h-6 rounded-full flex items-center justify-center border ${isSelected ? "border-cyan-500 bg-cyan-500/20" : "border-slate-600"
                                                            }`}
                                                    >
                                                        <span className="text-sm">{String.fromCharCode(65 + index)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-slate-200">{option}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            } else if (type === "SHORT_ANSWER" || type === "FILL_IN_BLANK") {
                                return (
                                    <textarea
                                        rows={3}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg text-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        placeholder="Type your answer here..."
                                        value={selectedOptions[currentQuestion.id] || ""}
                                        onChange={(e) => handleOptionSelect(currentQuestion.id, e.target.value)}
                                    />
                                )
                            } else if (type === "LONG_ANSWER" || type === "ESSAY") {
                                return (
                                    <textarea
                                        rows={6}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg text-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        placeholder="Write a detailed answer here..."
                                        value={selectedOptions[currentQuestion.id] || ""}
                                        onChange={(e) => handleOptionSelect(currentQuestion.id, e.target.value)}
                                    />
                                )
                            } else {
                                return (
                                    <div className="text-slate-400 text-sm italic">
                                        This question type is not yet supported: <span className="text-pink-500">{type}</span>
                                    </div>
                                )
                            }
                        })()}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                        <button
                            className="px-4 py-2 flex items-center gap-1 text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>
                        <button
                            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center gap-1"
                            onClick={handleNextQuestion}
                            disabled={!isAnswered}
                        >
                            {currentQuestionIndex === quizData.questions.length - 1 ? "Finish Assessment" : "Next Question"}
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuizAttempt
