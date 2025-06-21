import userAuthenticatedAxiosInstance from "../users/userAuthenticatedAxiosInstance";

const userAxiosInstance1 = userAuthenticatedAxiosInstance(
    "/api/v1/assessmentGenerate"
);
const userAxiosInstance2 = userAuthenticatedAxiosInstance(
    "/api/v1/assessmentResult"
);
const userAxiosInstance3 = userAuthenticatedAxiosInstance("/api/v1/chatbot");
const userAxiosInstance4 = userAuthenticatedAxiosInstance(
    "/api/v1/exploreAssessment"
);

const generateQuizFromYoutube = async (
    videoUrl,
    numberOfQuestions = 5,
    difficulty = "medium",
    type = "MCQ",
    language,
    learnId = null
) => {
    console.log(language)
    try {
        const response = await userAxiosInstance1.post("/youtube", {
            videoUrl,
            numberOfQuestions,
            difficulty,
            type,
            language,
            learnId
        });
        return response.data;
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw error;
    }
};

/**
 * Generate quiz from a media URL (either direct URL or Cloudinary URL)
 */
const generateQuizFromMediaUrl = async (
    mediaUrl,
    numberOfQuestions = 5,
    difficulty = "medium",
    type = "MCQ",
    language,
    options = {},
    learnId = null
) => {
    const { 
        deleteAfterProcessing = false, 
        cloudinaryPublicId = null,
        resourceType = 'video'  // Default to video for audio/video files
    } = options;
    console.log(language)
    try {
        const response = await userAxiosInstance1.post("/media-url", {
            mediaUrl,
            numberOfQuestions,
            difficulty,
            type,
            language,
            deleteAfterProcessing,
            cloudinaryPublicId,
            resourceType,
            learnId
        });
        return response.data;
    } catch (error) {
        console.error("Error generating quiz from media URL:", error);
        throw error;
    }
};

/**
 * Generate quiz from media file with Cloudinary pre-upload
 */
const generateQuizFromMedia = async (
    file,
    numberOfQuestions = 5,
    difficulty = "medium",
    language = "English",
    type = "MCQ",
    learnId = null
) => {
    try {
        // Always use Cloudinary approach - no fallback to local
        console.log('Preparing file upload to Cloudinary...');
        
        // Dynamically import to avoid bundling issues
        const { uploadToCloudinary, getResourceType } = await import('../../utils/cloudinaryUtils');
        
        // Upload to Cloudinary with appropriate resource type
        const resourceType = getResourceType(file);
        console.log(`Uploading ${file.name} (${file.size} bytes) to Cloudinary as ${resourceType}...`);
        
        const cloudinaryResult = await uploadToCloudinary(file, {
            folder: 'assessments/media',
            resourceType
        });
        
        console.log('File uploaded to Cloudinary:', cloudinaryResult);
        
        // Use the URL-based endpoint for processing
        console.log('Generating assessment from Cloudinary URL...');
        return generateQuizFromMediaUrl(
            cloudinaryResult.url,
            numberOfQuestions,
            difficulty,
            language,
            type,
            {
                deleteAfterProcessing: true,
                cloudinaryPublicId: cloudinaryResult.public_id,
                resourceType: cloudinaryResult.resource_type || resourceType
            },
            learnId
        );
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw error;
    }
};

/**
 * Generate quiz from document URL (PDF, PPT, PPTX)
 */
const generateQuizFromDocumentUrl = async (
    documentUrl,
    numberOfQuestions = 5,
    difficulty = "medium",
    language,
    type = "MCQ",
    options = {},
    learnId = null
) => {
    const { 
        deleteAfterProcessing = false, 
        cloudinaryPublicId = null,
        resourceType = 'raw'  // Default to raw for documents
    } = options;
    
    try {
        const response = await userAxiosInstance1.post("/document-url", {
            documentUrl,
            numberOfQuestions,
            language,
            difficulty,
            type,
            deleteAfterProcessing,
            cloudinaryPublicId,
            resourceType,
            learnId
        });
        return response.data;
    } catch (error) {
        console.error("Error generating quiz from document URL:", error);
        throw error;
    }
};

/**
 * Generate quiz from document file with Cloudinary pre-upload
 */
const generateQuizFromDocument = async (
    file,
    numberOfQuestions = 5,
    difficulty = "medium",
    type = "MCQ",
    language,
    learnId = null
) => {
    try {
        // Check if file is null (this can happen when coming from learn content)
        if (!file && learnId) {
            // If we have a learnId but no file, we should use the learnId directly
            console.log('No document file provided, using learnId directly');
            
            const response = await userAxiosInstance1.post(`/learnId/${learnId}`, {
                numberOfQuestions,
                difficulty,
                type,
                language
            });
            
            return response.data;
        }
        
        // Validate file existence before proceeding
        if (!file) {
            throw new Error("No document file provided");
        }
        
        // Upload document to Cloudinary first
        console.log('Preparing document upload to Cloudinary...');
        
        // Dynamically import to avoid bundling issues
        const { uploadToCloudinary } = await import('../../utils/cloudinaryUtils');
        
        // Upload to Cloudinary as auto resourceType - Add null check before accessing file properties
        console.log(`Uploading ${file.name} (${file.size} bytes) to Cloudinary...`);

        const cloudinaryResult = await uploadToCloudinary(file, {
            folder: 'assessments/documents',
            resourceType: 'auto'
        });
        
        console.log('Document uploaded to Cloudinary:', cloudinaryResult);
        
        // Use URL-based endpoint for processing
        console.log('Generating assessment from Cloudinary document URL...');
        return generateQuizFromDocumentUrl(
            cloudinaryResult.url,
            numberOfQuestions,
            difficulty,
            language,
            type,
            {
                deleteAfterProcessing: true,
                cloudinaryPublicId: cloudinaryResult.public_id,
                resourceType: cloudinaryResult.resource_type || 'raw'
            },
            learnId
        );
    } catch (error) {
        console.error("Error generating quiz from document:", error);
        throw error;
    }
};

const submitQuiz = async (assessmentId, submissionBody) => {
    try {
        const response = await userAxiosInstance2.post(
            `/submit/${assessmentId}`,
            submissionBody
        );
        return response.data;
    } catch (error) {
        console.error("Error submitting quiz:", error);
        throw error;
    }
};

const fetchQuizData = async (assessmentId) => {
    //result of quiz
    try {
        const response = await userAxiosInstance2.get(
            `/getResult/${assessmentId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        throw error;
    }
};

const askAssessment = async (assessmentId, questionData) => {
    try {
        const reference = await fetchQuizData(assessmentId);
        // console.log(reference.result);
        
        // Extract question and optional language from questionData
        const { question, language } = questionData;
        // console.log("Asking assessment with question:", question);
        
        const response = await userAxiosInstance3.post(
            `/ask-assessment/${assessmentId}`,
            {
                reference,
                question,
                language
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error asking assessment:", error);
        throw error;
    }
};

const getAllAssessments = async () => {
    try {
        const response = await userAxiosInstance4.get("/all");
        return response.data;
    } catch (error) {
        console.error("Error fetching assessments:", error);
        throw error;
    }
};

const searchAssessments = async (query, difficulty, type) => {
    try {
        let url = `/search?query=${query || ""}`;
        if (difficulty) url += `&difficulty=${difficulty}`;
        if (type) url += `&type=${type}`;

        const response = await userAxiosInstance4.get(url);
        return response.data;
    } catch (error) {
        console.error("Error searching assessments:", error);
        throw error;
    }
};

export {
    generateQuizFromYoutube,
    generateQuizFromMedia,
    generateQuizFromMediaUrl,
    generateQuizFromDocument,
    generateQuizFromDocumentUrl,
    submitQuiz,
    fetchQuizData,
    askAssessment,
    getAllAssessments,
    searchAssessments
};
