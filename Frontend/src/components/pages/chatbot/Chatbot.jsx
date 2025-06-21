import React, { useState } from "react";
import { askAssessment } from "../../../services/quiz/QuizService";
import { ChevronDown, Globe } from "lucide-react";

const Chatbot = (props) => {
    const assessmentId = props.assessmentId;
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [language, setLanguage] = useState({ id: "English", name: "English" });
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

    // Languages supported for chatbot conversation
    // const languages = [
    //     { id: "English", name: "English" },
    //     { id: "Spanish", name: "Spanish" },
    //     { id: "French", name: "French" },
    //     { id: "German", name: "German" },
    //     { id: "Chinese", name: "Chinese" },
    //     { id: "Japanese", name: "Japanese" },
    //     { id: "Hindi", name: "Hindi" },
    //     { id: "Arabic", name: "Arabic" },
    //     { id: "Russian", name: "Russian" },
    //     { id: "Portuguese", name: "Portuguese" },
    // ];

    const languages = [
        { id: "English", name: "English" },
        { id: "Hindi", name: "Hindi" },
        { id: "Tamil", name: "Tamil" },
        { id: "Telugu", name: "Telugu" },
        { id: "Kannada", name: "Kannada" },
        { id: "Malayalam", name: "Malayalam" },
        { id: "Bengali", name: "Bengali" },
        { id: "Marathi", name: "Marathi" },
        { id: "Gujarati", name: "Gujarati" },
        { id: "Punjabi", name: "Punjabi" }
    ]

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const handleLanguageSelect = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        setIsLanguageDropdownOpen(false);
        
        // Add a system message showing language change
        setMessages([...messages, {
            text: `Chatbot language changed to ${selectedLanguage.name}`,
            sender: "system"
        }]);
    };

    const handleSend = async () => {
        if (inputText.trim()) {
            setMessages([...messages, { text: inputText, sender: "user" }]);
            setInputText("");

            try {
                const response = await askAssessment(
                    assessmentId, 
                    { question: inputText, language: language.id }
                );
                
                setMessages((prev) => [
                    ...prev,
                    { text: response.response, sender: "bot" },
                ]);
            } catch (error) {
                setMessages((prev) => [
                    ...prev,
                    { text: "Error fetching response from bot.", sender: "bot" },
                ]);
            }
        }
    };

    return (
        <>
            {/* Chatbot Toggle Button */}
            <button
                onClick={toggleChatbot}
                className="fixed bottom-8 right-8 p-4 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition-all max-sm:bottom-4 max-sm:right-4 z-20"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                </svg>
            </button>

            {/* Chatbot Popup */}
            {isOpen && (
                <div className="fixed bottom-8 right-8 max-sm:bottom-2 max-sm:right-2 flex flex-col items-end space-y-4 z-20">
                    <div className="border border-cyan-500/20 rounded-xl shadow-lg bg-gradient-to-br from-gray-800 to-gray-900 w-96 h-[500px] flex flex-col justify-between max-sm:w-[90vw] max-sm:h-[80vh]">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-cyan-500/20 flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold text-lg text-indigo-400">Chatbot</h4>
                                <p className="text-sm text-slate-300/80">How can I help you today?</p>
                            </div>
                            <button
                                onClick={toggleChatbot}
                                className="p-2 text-slate-300 hover:text-white"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Language Selector */}
                        <div className="px-4 py-2 border-b border-cyan-500/20 flex items-center">
                            <Globe className="h-4 w-4 text-cyan-500 mr-2" />
                            <span className="text-xs text-slate-400 mr-2">Language:</span>
                            <div className="relative flex-1">
                                <button
                                    className="flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 rounded px-2 py-1 text-sm text-slate-300"
                                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                >
                                    <span>{language.name}</span>
                                    <ChevronDown
                                        className={`h-3 w-3 transition-transform ${isLanguageDropdownOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                                
                                {isLanguageDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded shadow-lg max-h-40 overflow-y-auto">
                                        {languages.map((lang) => (
                                            <div
                                                key={lang.id}
                                                className="px-2 py-1 hover:bg-gray-600 cursor-pointer text-sm text-slate-300"
                                                onClick={() => handleLanguageSelect(lang)}
                                            >
                                                {lang.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-2">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        msg.sender === "user" ? "justify-end" : 
                                        msg.sender === "system" ? "justify-center" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`rounded-lg p-3 max-w-[80%] ${
                                            msg.sender === "user"
                                                ? "bg-indigo-500 text-white"
                                                : msg.sender === "system"
                                                ? "bg-gray-800 text-cyan-400 text-xs italic"
                                                : "bg-gray-700 text-slate-300"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-cyan-500/20">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    className="flex-1 p-2 rounded-lg bg-gray-700 text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                    placeholder={`Type a message in ${language.name}...`}
                                />
                                <button
                                    onClick={handleSend}
                                    className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;