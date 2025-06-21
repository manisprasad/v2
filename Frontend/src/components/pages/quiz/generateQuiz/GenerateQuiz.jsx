import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    generateQuizFromYoutube,
    generateQuizFromMedia,
    generateQuizFromDocument,
    generateQuizFromMediaUrl
} from '../../../../services/quiz/QuizService';
import { generateAssessmentPDF } from '../../../../utils/pdfUtils';
import toast from 'react-hot-toast';

// Import components
import InputTypeSelector from './components/InputTypeSelector';
import FileUploader from './components/FileUploader';
import UrlInputField from './components/UrlInputField';
import ActionSelector from './components/ActionSelector';
import ConfigurationOptions from './components/ConfigurationOptions';
import DownloadInfo from './components/DownloadInfo';
import ErrorMessage from './components/ErrorMessage';
import LoadingOverlay from './components/LoadingOverlay';
import { FileText, Youtube, Video, Music } from "lucide-react";
import { fetchLearnData } from "../../../../services/learn/learnService";

const GenerateQuiz = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Input Types definition - Move this BEFORE the useEffect that uses it


    const difficultyLevels = [
        { id: "easy", name: "Easy" },
        { id: "medium", name: "Medium " },
        { id: "hard", name: "Hard" }
    ];

    const questionCounts = [
        { id: "5", name: "5 Questions" },
        { id: "10", name: "10 Questions" }
    ];

    const questionTypes = [
        { id: "MCQ", name: "Multiple Choice Questions" },
        { id: "TF", name: "True/False Questions" },
        { id: "ASSERTION_REASONING", name: "Assertion and Reasoning Questions" },
        { id: "SHORT_ANSWER", name: "Short Answer Questions" },
        { id: "LONG_ANSWER", name: "Long Answer Questions" },
        { id: "ESSAY", name: "Essay Questions" },
        { id: "FILL_IN_BLANK", name: "Fill in the Blank Questions" },
        { id: "MATCHING", name: "Matching Questions" }
    ];

    // create object woth below values and id as above
    // "English", 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi'
    const languageOptions = [
        { id: "English", name: "English" },
        { id: "Hindi", name: "Hindi" },
        { id: "Tamil", name: "Tamil" },
        // { id: "Telugu", name: "Telugu" },
        // { id: "Kannada", name: "Kannada" },
        { id: "Malayalam", name: "Malayalam" },
        // { id: "Bengali", name: "Bengali" },
        // { id: "Marathi", name: "Marathi" },
        // { id: "Gujarati", name: "Gujarati" },
        // { id: "Punjabi", name: "Punjabi" }
    ]
    // State management

    const [selectedInput, setSelectedInput] = useState(null);
    const [language, setLanguage] = useState(languageOptions[0]);
    const [file, setFile] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [difficulty, setDifficulty] = useState(difficultyLevels[0]);
    const [questionCount, setQuestionCount] = useState(questionCounts[0]);
    const [questionType, setQuestionType] = useState(questionTypes[0]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
    const [cloudinaryData, setCloudinaryData] = useState(null);
    const [showOptionsStep, setShowOptionsStep] = useState(false);
    const [assessmentAction, setAssessmentAction] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isLearning, setIsLearning] = useState(false);


    console.log(selectedInput);
    console.log(inputValue)

    const fileInputRef = useRef(null);


    // Input Types definition
    const inputTypes = [
        {
            id: "youtube",
            name: "YouTube URL",
            description: "Generate questions from YouTube video URL",
            icon: <Youtube className="h-5 w-5" />,
            placeholder: "Paste YouTube URL here...",
            acceptsFile: false,
        },
        {
            id: "mp4-local",
            name: "MP4 Video",
            description: "Generate questions from videos uploaded from local",
            icon: <Video className="h-5 w-5" />,
            placeholder: "Upload MP4 video file",
            acceptsFile: true,
            fileType: "video/mp4",
        },
        {
            id: "mp4-url",
            name: "MP4 URL",
            description: "Generate questions from MP4 URL uploaded online",
            icon: <Video className="h-5 w-5" />,
            placeholder: "Paste MP4 video URL here...",
            acceptsFile: false,
        },
        {
            id: "mp3-local",
            name: "MP3 Audio",
            description: "Generate questions from MP3 audio uploaded from local",
            icon: <Music className="h-5 w-5" />,
            placeholder: "Upload MP3 audio file",
            acceptsFile: true,
            fileType: "audio/mpeg",
        },
        {
            id: "mp3-url",
            name: "MP3 URL",
            description: "Generate questions from MP3 URL uploaded online",
            icon: <Music className="h-5 w-5" />,
            placeholder: "Paste MP3 audio URL here...",
            acceptsFile: false,
        },
        {
            id: "document",
            name: "PDF/PPT/TXT",
            description: "Extract and analyze text content from local upload",
            icon: <FileText className="h-5 w-5" />,
            placeholder: "Upload document file",
            acceptsFile: true,
            fileType: ".pdf,.ppt,.pptx,.txt",
        },
    ];



    // Check if coming from learn page
    const [fromLearn, setFromLearn] = useState(false);
    const [learnId, setLearnId] = useState(null);

    // Add a dummy default input for when no input is selected but we need to render components
    // that expect selectedInput to exist
    const defaultInput = {
        id: "default",
        name: "Default Input",
        description: "Default input type",
        icon: null,
        placeholder: "",
        acceptsFile: false
    };

    // Set up component based on navigation state
    useEffect(() => {
        if (location.state?.fromLearn && location.state?.learnId) {
            // Set basic state for learn mode
            setFromLearn(true);
            setLearnId(location.state.learnId);
            setShowOptionsStep(true);

            try {
                if (location.state.contentType) {
                    const contentType = location.state.contentType;
                    let matchedInput = null;

                    // Find matching input type
                    if (contentType === 'youtube') {
                        matchedInput = inputTypes.find(input => input.id === 'youtube');
                        setInputValue(location.state.contentUrl || "");
                    } else if (contentType === 'document') {
                        matchedInput = inputTypes.find(input => input.id === 'document');
                    } else if (contentType === 'video' || contentType === 'mp4-local') {
                        matchedInput = inputTypes.find(input => input.id === 'mp4-local');
                    } else if (contentType === 'audio' || contentType === 'mp3-local') {
                        matchedInput = inputTypes.find(input => input.id === 'mp3-local');
                    }

                    // Safely set selected input with fallback
                    setSelectedInput(matchedInput || inputTypes[0] || defaultInput);

                    if (location.state.contentUrl) {
                        setCloudinaryUrl(location.state.contentUrl);
                    }
                } else {
                    // If no content type, use the first input type
                    setSelectedInput(inputTypes[0] || defaultInput);
                }
            } catch (err) {
                console.error("Error setting up from learn:", err);
                // Set a default input type as fallback
                setSelectedInput(defaultInput);
            }
        }
    }, [location.state]);


    // Event handlers
    const handleInputTypeSelect = (inputType) => {
        setSelectedInput(inputType);
        setError("");
        setFile(null);
        setInputValue("");
        setShowOptionsStep(false);
        setAssessmentAction(null);
    };

    const handleDifficultySelect = (difficultyLevel) => {
        setDifficulty(difficultyLevel);
    };

    const handleQuestionCountSelect = (count) => {
        setQuestionCount(count);
    };

    const handleLanguageSelect = (lang) => {
        setLanguage(lang);
    };

    const handleQuestionTypeSelect = (type) => {
        setQuestionType(type);
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const maxSize = selectedInput.id === "document" ? 25 * 1024 * 1024 : 100 * 1024 * 1024;
            if (selectedFile.size > maxSize) {
                setError(`File size exceeds ${selectedInput.id === "document" ? "25MB" : "100MB"} limit`);
                setFile(null);
                return;
            }

            setFile(selectedFile);
            setError("");
            setCloudinaryUrl(null);

            if ((selectedInput.id === "mp4-local" || selectedInput.id === "mp3-local") &&
                process.env.REACT_APP_USE_CLOUDINARY === "true") {
                try {
                    setIsUploading(true);
                    setUploadProgress(0);

                    const progressInterval = setInterval(() => {
                        setUploadProgress(prev => Math.min(prev + 5, 90));
                    }, 200);

                    const { uploadToCloudinary, getResourceType } = await import('../../../../utils/cloudinaryUtils');

                    const resourceType = getResourceType(selectedFile);
                    const uploadResult = await uploadToCloudinary(selectedFile, {
                        folder: 'assessments/media',
                        resourceType
                    });

                    clearInterval(progressInterval);
                    setUploadProgress(100);
                    setCloudinaryUrl(uploadResult.url);
                    setCloudinaryData(uploadResult);
                } catch (error) {
                    setError(`Upload failed: ${error.message}. Will use direct upload when generating quiz.`);
                } finally {
                    setIsUploading(false);
                }
            }
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setError("");
    };

    const handleContinue = () => {
        if (!selectedInput) {
            setError("Please select an input type");
            return;
        }

        if (selectedInput.acceptsFile && !file) {
            setError("Please upload a file");
            return;
        }

        if (!selectedInput.acceptsFile && !inputValue) {
            setError("Please enter a valid input");
            return;
        }

        setError("");
        setShowOptionsStep(true);
    };

    const handleActionSelect = (action) => {
        setAssessmentAction(action);
    };

    const triggerFileInput = (e) => {
        if (e?.target?.files?.length) {
            handleFileChange(e);
        } else {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = async () => {
        if (!selectedInput && !fromLearn) {
            setError("Please select an input type");
            return;
        }

        if (selectedInput && selectedInput.acceptsFile && !file && !fromLearn) {
            setError("Please upload a file");
            return;
        }

        if (selectedInput && !selectedInput.acceptsFile && !inputValue && !fromLearn) {
            setError("Please enter a valid input");
            return;
        }

        if (assessmentAction === "take") {
            if (!difficulty) {
                setError("Please select a difficulty level");
                return;
            }

            if (!questionCount) {
                setError("Please select number of questions");
                return;
            }

            if (!questionType) {
                setError("Please select question type");
                return;
            }
        }

        setLoading(true);
        setError(null);

        setIsDownloading(assessmentAction === "download");

        try {
            let data;
            const quizType = assessmentAction === "download" ? "MIX" : questionType?.id || "MCQ";
            const quizCount = assessmentAction === "download" ? "15" : questionCount?.id || "5";
            const quizDifficulty = assessmentAction === "download" ? "medium" : difficulty?.id || "medium";
            const languageName = language?.name || "English";

            if (fromLearn && learnId) {
                if (!selectedInput || selectedInput.id === "youtube") {
                    data = await generateQuizFromYoutube(
                        inputValue || "",
                        quizCount,
                        quizDifficulty,
                        quizType,
                        languageName,
                        learnId
                    );
                } else if (selectedInput.id === "mp4-local" || selectedInput.id === "mp3-local" ||
                    selectedInput.id === "mp4-url" || selectedInput.id === "mp3-url") {
                    data = await generateQuizFromMediaUrl(
                        cloudinaryUrl || inputValue || "",
                        quizCount,
                        quizDifficulty,
                        quizType,
                        languageName,
                        {
                            deleteAfterProcessing: false,
                            cloudinaryPublicId: cloudinaryData?.public_id
                        },
                        learnId
                    );
                } else if (selectedInput.id === "document") {
                    // For document type from learn, we might not have a file
                    // Pass learnId to let the service handle it
                    data = await generateQuizFromDocument(
                        file, // This might be null, service will handle it
                        quizCount,
                        quizDifficulty,
                        quizType,
                        languageName,
                        learnId
                    );
                }
            } else {
                if (selectedInput.id === "youtube") {
                    data = await generateQuizFromYoutube(inputValue, quizCount, quizDifficulty, quizType, languageName);
                }
                else if (selectedInput.id === "mp4-local" || selectedInput.id === "mp3-local") {
                    if (cloudinaryUrl && cloudinaryData) {
                        data = await generateQuizFromMediaUrl(
                            cloudinaryUrl,
                            quizCount,
                            quizDifficulty,
                            quizType,
                            languageName,
                            {
                                deleteAfterProcessing: true,
                                cloudinaryPublicId: cloudinaryData.public_id,
                                resourceType: cloudinaryData.resource_type || 'video'
                            }
                        );
                    } else {
                        data = await generateQuizFromMedia(
                            file,
                            quizCount,
                            quizDifficulty,
                            languageName,
                            quizType,
                            true
                        );
                    }
                }
                else if (selectedInput.id === "mp4-url" || selectedInput.id === "mp3-url") {
                    data = await generateQuizFromMediaUrl(inputValue, quizCount, quizDifficulty, quizType, languageName);
                }
                else if (selectedInput.id === "document") {
                    data = await generateQuizFromDocument(file, quizCount, quizDifficulty, quizType, languageName);
                }
                else {
                    throw new Error("Unsupported input type");
                }
            }

            if (assessmentAction === "download") {
                try {
                    let questions;
                    if (data.questions) {
                        questions = data.questions;
                    } else if (data.assessment) {
                        questions = typeof data.assessment === 'string'
                            ? JSON.parse(data.assessment)
                            : data.assessment;
                    } else if (typeof data === 'string') {
                        questions = JSON.parse(data);
                    }

                    // const sourceTitle = (selectedInput?.acceptsFile && file)
                    //     ? file.name.split('.')[0]
                    //     : (inputValue ? inputValue.substring(0, 30) : "Assessment");

                    generateAssessmentPDF(questions[0], questions[1]?.title || "", languageName);

                    toast.success('Assessment successfully downloaded!', {
                        icon: '📄',
                        duration: 6000,
                        style: {
                            borderRadius: '10px',
                            background: '#0f172a',
                            color: '#fff',
                            border: '1px solid rgba(6, 182, 212, 0.5)',
                            padding: '16px',
                            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)'
                        },
                        iconTheme: {
                            primary: '#06b6d4',
                            secondary: '#fff',
                        },
                    });
                } catch (pdfError) {
                    setError(`PDF generation failed: ${pdfError.message}. Redirecting to quiz page.`);

                    toast.error('Failed to download PDF', {
                        duration: 5000,
                        style: {
                            borderRadius: '10px',
                            background: '#0f172a',
                            color: '#fff',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                        },
                    });
                }
            } else if (assessmentAction === "take") {
                navigate(`/attemptquiz/${data.assessmentId}`);
            }
        } catch (err) {
            setError(err.message);
            toast.error(`Error: ${err.message}`, {
                style: {
                    borderRadius: '10px',
                    background: '#0f172a',
                    color: '#fff',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                },
            });
        } finally {
            setLoading(false);
            setIsDownloading(false);
        }
    };

    // Update ActionSelector component rendering to handle null selectedInput
    const renderActionSelector = () => {
        if (!selectedInput) return null;
        
        return (
            <ActionSelector
                inputType={selectedInput?.id || "default"}
                url={inputValue}
                onActionSelect={handleActionSelect}
                file={file}
                cloudinaryUrl={cloudinaryUrl}
                cloudinaryData={cloudinaryData}
            />
        );
    };

    return (
        <section className="py-16 bg-slate-900 -mt-2 min-h-screen">
            <LoadingOverlay loading={loading} isDownloading={isDownloading} isLearning={isLearning} />

            <div className="container mx-auto px-6 -mt-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {fromLearn ? "Configure Your Assessment" : "Upload Your Content"}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-indigo-600 mx-auto mb-6"></div>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="bg-slate-950 rounded-xl p-8 border border-cyan-900/30 shadow-lg">
                        {!showOptionsStep && !fromLearn && (
                            <>
                                <InputTypeSelector
                                    inputTypes={inputTypes}
                                    selectedInput={selectedInput}
                                    onSelect={handleInputTypeSelect}
                                />

                                {selectedInput && (
                                    <>
                                        <div className="mb-6">
                                            <label className="block text-slate-300 mb-2 font-medium">
                                                {selectedInput.acceptsFile ? "Upload File" : "Enter Input"}
                                            </label>

                                            {selectedInput.acceptsFile ? (
                                                <FileUploader
                                                    file={file}
                                                    error={error}
                                                    isUploading={isUploading}
                                                    uploadProgress={uploadProgress}
                                                    cloudinaryUrl={cloudinaryUrl}
                                                    fileInputRef={fileInputRef}
                                                    selectedInput={selectedInput}
                                                    onTriggerFileInput={triggerFileInput}
                                                />
                                            ) : (
                                                <UrlInputField
                                                    selectedInput={selectedInput}
                                                    inputValue={inputValue}
                                                    onChange={handleInputChange}
                                                    error={error}
                                                />
                                            )}

                                            <ErrorMessage error={error} />
                                        </div>

                                        <button
                                            className={`w-full py-4 ${isUploading
                                                ? "bg-slate-700 cursor-not-allowed"
                                                : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700"
                                                } text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all`}
                                            onClick={handleContinue}
                                            disabled={isUploading}
                                        >
                                            {isUploading ? "Uploading..." : "Continue"}
                                        </button>
                                    </>
                                )}
                            </>
                        )}

                        {showOptionsStep && (
                            <>
                                {!assessmentAction ? (
                                    fromLearn ? (
                                        <div className="mb-8">
                                            <h3 className="text-xl font-semibold text-white mb-4">Choose Assessment Type</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => handleActionSelect("take")}
                                                    className="flex flex-col items-center justify-center p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all"
                                                >
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center mb-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="text-lg font-medium text-white mb-2">Take Assessment</h4>
                                                    <p className="text-sm text-slate-400 text-center">
                                                        Take an interactive quiz based on the content
                                                    </p>
                                                </button>

                                                <button
                                                    onClick={() => handleActionSelect("download")}
                                                    className="flex flex-col items-center justify-center p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all"
                                                >
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mb-3">
                                                        <svg xmlns="http://www.w3.org/20000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="text-lg font-medium text-white mb-2">Download PDF</h4>
                                                    <p className="text-sm text-slate-400 text-center">
                                                        Generate and download a PDF assessment
                                                    </p>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        renderActionSelector()
                                    )
                                ) : (
                                    <>
                                        {assessmentAction === "take" && (
                                            <ConfigurationOptions
                                                difficulty={difficulty || difficultyLevels[0]}
                                                questionCount={questionCount || questionCounts[0]}
                                                questionType={questionType || questionTypes[0]}
                                                difficultyLevels={difficultyLevels}
                                                questionCounts={questionCounts}
                                                questionTypes={questionTypes}
                                                onDifficultySelect={handleDifficultySelect}
                                                onQuestionCountSelect={handleQuestionCountSelect}
                                                onQuestionTypeSelect={handleQuestionTypeSelect}
                                                onLanguageSelect={handleLanguageSelect}
                                                language={language || languageOptions[0]}
                                                languageOptions={languageOptions}
                                            />
                                        )}

                                        {assessmentAction === "download" && 
                                            <DownloadInfo 
                                                language={language || languageOptions[0]} 
                                                onLanguageSelect={handleLanguageSelect} 
                                            />
                                        }

                                        <div className="flex gap-4">
                                            <button
                                                className="py-4 px-6 bg-slate-800 text-white font-bold rounded-lg transition-all"
                                                onClick={() => setAssessmentAction(null)}
                                            >
                                                Back
                                            </button>
                                            <button
                                                className={`flex-1 py-4 ${loading
                                                    ? "bg-slate-700 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700"
                                                    } text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all`}
                                                onClick={handleSubmit}
                                                disabled={loading}
                                            >
                                                {loading ? "Generating..." : assessmentAction === "download" ? "Download Assessment" : assessmentAction === "take" ? "Take Assessment" : "Start Learning"}
                                            </button>
                                        </div>
                                    </>
                                )}

                                <ErrorMessage error={error} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GenerateQuiz;