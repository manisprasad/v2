import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"; // Add useNavigate
import PdfViewer from "../../contentViewer/PdfViewer";
import { getNotes, getSummary, getFlashes, ask, getMetaData } from "../../../services/learn/learnService";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import "./pdfViewer.css";

export const LearnContent = () => {
    const { learnId } = useParams();
    const navigate = useNavigate(); // Add navigation hook

    const [summary, setSummary] = useState(null);
    const [flashes, setFlashes] = useState([]);
    const [notes, setNotes] = useState(null);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("summary");
    const [flashIndex, setFlashIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [contentType, setContentType] = useState(null);
    const [contentUrl, setContentUrl] = useState(null);

    console.log("contnet-url", contentUrl);
    console.log("content-Type", contentType);

    const extractYouTubeID = url =>
        (url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|embed\/))([^&?/]+)/) || [])[1] || null;

    useEffect(() => {
        const fetchLearnData = async () => {
            try {
                const [summaryResponse, flashesResponse, notesResponse, metaData] = await Promise.all([
                    getSummary(learnId),
                    getFlashes(learnId),
                    getNotes(learnId),
                    getMetaData(learnId)
                ]);
                console.log("metadata:", metaData);

                setSummary(summaryResponse.data);
                setFlashes(flashesResponse.data);
                setNotes(notesResponse.data);
                setContentUrl(metaData.data.cloudinaryContentUrl || "Original content not available");
                setContentType(metaData.data.contentType || "unknown");
            } catch (error) {
                console.error("Error fetching learn data:", error);
            }
        };

        fetchLearnData();
    }, [learnId]);

    const handleAskQuestion = async () => {
        if (!question.trim()) return;

        const userMessage = { role: 'user', content: question };
        setChatHistory(prev => [...prev, userMessage]);

        setQuestion("");
        setLoading(true);

        try {
            const newMessages = [userMessage];
            const response = await ask(learnId, newMessages, chatHistory);

            const botMessage = { role: 'assistant', content: response.data };
            setChatHistory(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { role: 'assistant', content: "Sorry, I couldn't process your request. Please try again." };
            setChatHistory(prev => [...prev, errorMessage]);
            console.error("Error asking question:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setFlashIndex(prev => Math.min(flashes.length - 1, prev + 1));
        }, 150);
    };

    const handlePrevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setFlashIndex(prev => Math.max(0, prev - 1));
        }, 150);
    };

    const flipCard = () => {
        setIsFlipped(!isFlipped);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAskQuestion();
        }
    };

    // Add function to handle assessment generation
    const handleGenerateAssessment = () => {
        navigate("/generatequiz", { 
            state: { 
                fromLearn: true,
                contentType,
                contentUrl,
                learnId,
                skipInputSelection: true // Flag to skip the input selection step
            } 
        });
    };

    return (
        <div className=" py-6">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Interactive Learning
                            <span className="ml-2 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                                Experience
                            </span>
                        </h1>
                        <p className="text-slate-400">Explore your content with AI-powered insights and interactive tools</p>
                    </div>
                    
                    {/* Add the Generate Assessment button */}
                    <button
                        onClick={handleGenerateAssessment}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg transition-all flex items-center"
                    >
                        <svg 
                            className="w-5 h-5 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                            />
                        </svg>
                        Generate Assessment
                    </button>
                </div>

                {/* Main content area with two columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left column - Content display */}
                    <div className=" rounded-2xl  shadow-black/20 w-full flex items-center flex-col justify-center h-[calc(100vh-150px)]">
                        {contentType === 'youtube' && (
                            <iframe className="border-2 border-slate-500 rounded-md" width="760" height="515" src={`https://www.youtube.com/embed/${extractYouTubeID(contentUrl)}?si=CfnugBkDBSNn7Se9`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        )}
                        {
                            (contentUrl !== null && contentType === 'document' && contentUrl?.endsWith('pdf')) && (
                                <div className="inner-border">
                                    <PdfViewer fileUrl={contentUrl} />
                                </div>

                            )
                        }

                        {
                            (contentUrl !== null &&
                                contentType === 'document' &&
                                (contentUrl?.endsWith('ppt') || contentUrl?.endsWith('pptx'))) && (
                                <iframe
                                    className="border-2 border-white"
                                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${contentUrl}`}
                                    width="100%"
                                    height="600px"
                                    frameBorder="0"
                                    title="ppt"
                                />
                            )
                        }

                        {
                            (contentUrl !== null && contentType === 'video' && contentUrl?.endsWith('mp4')) && (
                                <video src={contentUrl} controls width="100%" height="auto" />
                            )
                        }

                        {
                             (contentUrl !== null && contentType === 'audio' && contentUrl?.endsWith('mp3')) && (
                                <audio src={contentUrl} controls width="100%" height="auto" />
                            )
                        }





                    </div>

                    {/* Right column - Interactive tools */}
                    <div className="bg-slate-850 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex flex-col h-[calc(100vh-150px)]">
                        {/* Tab navigation - Reordered tabs */}
                        <div className="bg-slate-800/50 border-b border-slate-700">
                            <div className="flex overflow-x-auto p-2 space-x-2">
                                {/* Chat tab (first) */}
                                <button
                                    onClick={() => setActiveTab("askQuestion")}
                                    className={`flex items-center px-4 py-2 rounded-lg ${activeTab === "askQuestion"
                                        ? "bg-cyan-600/20 text-cyan-400 font-medium"
                                        : "text-slate-400 hover:bg-slate-700/40 hover:text-slate-200"
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    Ask AI
                                </button>

                                {/* Notes tab (second) */}
                                <button
                                    onClick={() => setActiveTab("notes")}
                                    className={`flex items-center px-4 py-2 rounded-lg ${activeTab === "notes"
                                        ? "bg-cyan-600/20 text-cyan-400 font-medium"
                                        : "text-slate-400 hover:bg-slate-700/40 hover:text-slate-200"
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Notes
                                </button>

                                {/* Flashcards tab (third) */}
                                <button
                                    onClick={() => setActiveTab("flashcards")}
                                    className={`flex items-center px-4 py-2 rounded-lg ${activeTab === "flashcards"
                                        ? "bg-cyan-600/20 text-cyan-400 font-medium"
                                        : "text-slate-400 hover:bg-slate-700/40 hover:text-slate-200"
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Flashcards
                                </button>

                                {/* Summary tab (fourth) */}
                                <button
                                    onClick={() => setActiveTab("summary")}
                                    className={`flex items-center px-4 py-2 rounded-lg ${activeTab === "summary"
                                        ? "bg-cyan-600/20 text-cyan-400 font-medium"
                                        : "text-slate-400 hover:bg-slate-700/40 hover:text-slate-200"
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Summary
                                </button>
                            </div>
                        </div>

                        {/* Tab content area */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Summary Tab */}
                            {activeTab === "summary" && (
                                <div className="bg-gradient-to-r from-slate-800 to-slate-800/30 rounded-xl p-6 border border-slate-700/50 shadow-lg">
                                    <h2 className="text-xl font-semibold text-cyan-400 mb-6 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        Key Points Summary
                                    </h2>
                                    <div className="prose prose-invert prose-cyan prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-cyan-300 max-w-none">
                                        {summary ? (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {summary}
                                            </ReactMarkdown>
                                        ) : (
                                            <div className="animate-pulse">
                                                <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
                                                <div className="h-4 bg-slate-700 rounded w-full mb-4"></div>
                                                <div className="h-4 bg-slate-700 rounded w-5/6 mb-4"></div>
                                                <div className="h-4 bg-slate-700 rounded w-4/5"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Flashcards Tab - Fixed flip animation */}
                            {activeTab === "flashcards" && (
                                <div className="bg-gradient-to-b from-slate-800 to-slate-800/30 rounded-xl p-6 border border-slate-700/50 shadow-lg">
                                    <h2 className="text-xl font-semibold text-cyan-400 mb-6 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                        </svg>
                                        Learning Flashcards
                                    </h2>

                                    {flashes.length > 0 ? (
                                        <div className="space-y-6">
                                            {/* Card progress indicator */}
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-sm text-slate-400">Card {flashIndex + 1} of {flashes.length}</div>
                                                <div className="flex space-x-1">
                                                    {flashes.map((_, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`w-2.5 h-2.5 rounded-full ${idx === flashIndex ? 'bg-cyan-500' : 'bg-slate-700'}`}
                                                            onClick={() => {
                                                                setIsFlipped(false);
                                                                setTimeout(() => setFlashIndex(idx), 150);
                                                            }}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Fixed card with proper 3D flip animation using inline styles */}
                                            <div className="relative h-64 w-full" style={{ perspective: "1000px" }}>
                                                <div
                                                    className="absolute w-full h-full transition-all duration-500 cursor-pointer"
                                                    onClick={flipCard}
                                                    style={{
                                                        transformStyle: "preserve-3d",
                                                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                                                    }}
                                                >
                                                    {/* Card front */}
                                                    <div
                                                        className="absolute w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 p-6 rounded-xl border border-slate-600 flex flex-col justify-center"
                                                        style={{ backfaceVisibility: "hidden" }}
                                                    >
                                                        <span className="text-cyan-400 text-sm font-medium mb-3">Question:</span>
                                                        <p className="text-slate-200 text-lg">{flashes[flashIndex]?.question}</p>
                                                        <div className="text-slate-400 text-xs mt-4 absolute bottom-4 left-0 w-full text-center">
                                                            Click to flip card
                                                        </div>
                                                    </div>

                                                    {/* Card back */}
                                                    <div
                                                        className="absolute w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl border border-cyan-800/30 flex flex-col justify-center"
                                                        style={{
                                                            backfaceVisibility: "hidden",
                                                            transform: "rotateY(180deg)"
                                                        }}
                                                    >
                                                        <span className="text-cyan-400 text-sm font-medium mb-3">Answer:</span>
                                                        <p className="text-slate-200 text-lg">{flashes[flashIndex]?.answer}</p>
                                                        <div className="text-slate-400 text-xs mt-4 absolute bottom-4 left-0 w-full text-center">
                                                            Click to flip back
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Navigation buttons */}
                                            <div className="flex justify-center space-x-4 mt-6">
                                                <button
                                                    onClick={handlePrevCard}
                                                    disabled={flashIndex === 0}
                                                    className={`px-4 py-2 rounded-lg flex items-center ${flashIndex === 0
                                                        ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                                                        : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                                                        } transition-colors`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={handleNextCard}
                                                    disabled={flashIndex === flashes.length - 1}
                                                    className={`px-4 py-2 rounded-lg flex items-center ${flashIndex === flashes.length - 1
                                                        ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                                                        : 'bg-cyan-600 text-white hover:bg-cyan-500'
                                                        } transition-colors`}
                                                >
                                                    Next
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-48 bg-slate-800/50 rounded-lg border border-slate-700">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                                                <p className="mt-4 text-slate-400">Loading flashcards...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Notes Tab */}
                            {activeTab === "notes" && (
                                <div className="bg-gradient-to-r from-slate-800 to-slate-800/30 rounded-xl p-6 border border-slate-700/50 shadow-lg">
                                    <h2 className="text-xl font-semibold text-cyan-400 mb-6 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                        </svg>
                                        Study Notes
                                    </h2>
                                    <div className="prose prose-invert prose-cyan prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-cyan-300 max-w-none">
                                        {notes ? (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {notes}
                                            </ReactMarkdown>
                                        ) : (
                                            <div className="animate-pulse">
                                                <div className="h-4 bg-slate-700 rounded w-2/3 mb-4"></div>
                                                <div className="h-4 bg-slate-700 rounded w-full mb-4"></div>
                                                <div className="h-4 bg-slate-700 rounded w-5/6 mb-4"></div>
                                                <div className="h-4 bg-slate-700 rounded w-4/5"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Ask Question Tab */}
                            {activeTab === "askQuestion" && (
                                <div className="flex flex-col h-full -mt-6 -mx-6">
                                    <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700">
                                        <h2 className="text-xl font-semibold text-cyan-400 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                            </svg>
                                            Axion-AI
                                        </h2>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                                        {chatHistory.length > 0 ? (
                                            chatHistory.map((message, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user'
                                                            ? 'bg-cyan-600 text-white'
                                                            : 'bg-slate-800 text-slate-200 border border-slate-700'
                                                            }`}
                                                    >
                                                        {message.role === 'assistant' && (
                                                            <div className="flex items-center mb-2">
                                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center mr-2">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                                                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-xs font-medium text-cyan-400">Axion-AI</span>
                                                            </div>
                                                        )}
                                                        <div className="prose prose-sm prose-invert max-w-none">
                                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                {message.content}
                                                            </ReactMarkdown>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center px-6 py-8 rounded-xl bg-slate-800/50 border border-slate-700/50 max-w-md">
                                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-white mb-2">Ask anything about this content</h3>
                                                    <p className="text-slate-400 mb-4">Get explanations, summaries, or dive deeper into specific topics.</p>
                                                    <div className="text-left space-y-2">
                                                        <div className="bg-slate-700/50 text-slate-300 px-3 py-2 rounded-lg text-sm">
                                                            "Can you explain the key concepts in simpler terms?"
                                                        </div>
                                                        <div className="bg-slate-700/50 text-slate-300 px-3 py-2 rounded-lg text-sm">
                                                            "What are the most important points to remember?"
                                                        </div>
                                                        <div className="bg-slate-700/50 text-slate-300 px-3 py-2 rounded-lg text-sm">
                                                            "How does this relate to [specific topic]?"
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {loading && (
                                            <div className="flex justify-start">
                                                <div className="max-w-[80%] bg-slate-800 text-slate-200 rounded-2xl p-4 border border-slate-700">
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center mr-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                                                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs font-medium text-cyan-400">Axion-AI</span>
                                                    </div>
                                                    <div className="mt-2 flex space-x-1">
                                                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
                                                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-700">
                                        <div className="relative">
                                            <textarea
                                                className="w-full bg-slate-800 text-slate-200 p-4 pr-14 rounded-xl border border-slate-700 focus:border-cyan-500 focus:ring focus:ring-cyan-500/20 focus:outline-none placeholder-slate-500 resize-none"
                                                rows={3}
                                                placeholder="Ask a question about this content..."
                                                value={question}
                                                onChange={(e) => setQuestion(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                disabled={loading}
                                            ></textarea>
                                            <button
                                                onClick={handleAskQuestion}
                                                disabled={loading || !question.trim()}
                                                className={`absolute right-3 bottom-3 p-2 rounded-lg transition-colors ${loading || !question.trim()
                                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                    : 'bg-cyan-600 text-white hover:bg-cyan-500'
                                                    }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnContent;