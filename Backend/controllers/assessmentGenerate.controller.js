import axios from 'axios';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ytdl from '@distube/ytdl-core';
import fetchYouTubeAudio from '../helper/fetchYouTubeAudio.js';
import transcribeAudioVideo from '../helper/transcribeAudioVideo.js';
import generateAssessmentPromptCall from '../helper/generateAssessmentPromptCall.js';
import { extractTextFromPdfFile } from '../helper/pdfToText.js';
import { extractTextFromPptFile } from '../helper/pptToText.js';
import { saveAssessment } from '../helper/saveAssessment.js';
import User from "../models/user.model.js";
import Learn from "../models/learn.model.js";
import { uploadBufferToCloudinary } from '../helper/cloudinaryHelper.js';
import { console } from 'inspector';
// Import new helper functions
import extractYouTubeTranscript from '../helper/extractYouTubeTranscript.js';
import extractMediaTranscript from '../helper/extractMediaTranscript.js';
import extractDocumentText from '../helper/extractDocumentText.js';


// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOAD_DIR = path.resolve(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer storage
const storage = multer.memoryStorage();

// Create a more flexible file filter
const mediaFileFilter = (req, file, cb) => {
    // List of acceptable file types
    const videoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
    const audioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/x-m4a', 'audio/webm'];

    // Accept any video or audio file
    if ([...videoTypes, ...audioTypes].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only video or audio files are allowed'), false);
    }
};

// Add document file filter for PDFs and PPTs
const documentFileFilter = (req, file, cb) => {
    // List of acceptable document types
    const documentTypes = [
        'application/pdf',                     // PDF
        'application/vnd.ms-powerpoint',       // PPT
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' // PPTX
    ];

    if (documentTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and PowerPoint files are allowed'), false);
    }
};

// Export a single multer middleware that accepts both video and audio
const mediaUpload = multer({
    storage, // Use the memory storage
    fileFilter: mediaFileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB max for all media
});

// Create document upload middleware
const documentUpload = multer({
    storage, // Use the memory storage
    fileFilter: documentFileFilter,
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB max for documents
});

// Create a fields array for multiple possible field names
const mediaFields = [
    { name: 'media', maxCount: 1 },
    { name: 'file', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'audioFile', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 }
];

// Create fields array for document upload
const documentFields = [
    { name: 'document', maxCount: 1 },
    { name: 'file', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
    { name: 'ppt', maxCount: 1 },
    { name: 'pptx', maxCount: 1 }
];

/**
 * Generate assessment from YouTube video
 */
const generateAssessmentFromYoutube = async (req, res) => {
    console.log("i am king of the world");
    process.stdout.write('');
    try {
        const { videoUrl, numberOfQuestions = 5, difficulty = 'medium', type = 'MCQ', language } = req.body;
        
        if (!videoUrl) {
            return res.status(400).json({
                success: false,
                message: 'YouTube URL is required'
            });
        }

        // Use the helper function to extract transcript
        const { text: transcript, videoId } = await extractYouTubeTranscript(videoUrl);

        if (!transcript) {
            return res.status(400).json({
                success: false,
                message: 'Failed to extract transcript'
            });
        }

        // Generate assessment
        const assessmentJson = await generateAssessmentPromptCall(transcript, type, numberOfQuestions, difficulty, language);
        let assessment;

        try {
            // Try to extract JSON from the response
            const match = assessmentJson.match(/\[[\s\S]*\]/);
            assessment = match ? JSON.parse(match[0]) : JSON.parse(assessmentJson);
        } catch (error) {
            assessment = { rawResponse: assessmentJson };
        }

        // Save to database if user ID is available
        let savedAssessment = null;
        const userId = req.user?._id;

        try {
            savedAssessment = await saveAssessment(
                assessment,
                {
                    videoId,
                    type,
                    difficulty,
                    language,
                    source: 'youtube',
                    transcript: JSON.stringify(transcript)
                },
                { userId }
            );

            // Add assessment to user's created assessments
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { assessmentCreated: savedAssessment._id } }
            );
        } catch (dbError) {
            console.error('Failed to save to database:', dbError);
            // Continue even if database save fails
        }

        res.status(200).json({
            success: true,
            videoId,
            assessment,
            metadata: { type, difficulty, questionCount: numberOfQuestions },
            // Include assessment ID if saved successfully
            ...(savedAssessment && { assessmentId: savedAssessment._id })
        });

    } catch (error) {
        console.error('Error generating YouTube assessment:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating assessment',
            error: error.message
        });
    }
};

/**
 * Generate assessment from media URL (direct URL or Cloudinary URL)
 */
const generateAssessmentFromMediaUrl = async (req, res) => {
    const timeoutId = setTimeout(() => {
        res.status(504).json({ success: false, message: 'Request timed out' });
    }, 300000); // 5 minutes timeout

    try {
        const {
            mediaUrl,
            numberOfQuestions = 5,
            difficulty = 'medium',
            type = 'MCQ',
            language,
            deleteAfterProcessing = false,
            cloudinaryPublicId = null,
            resourceType = 'video'  // Default resource type for media
        } = req.body;

        if (!mediaUrl) {
            clearTimeout(timeoutId);
            return res.status(400).json({
                success: false,
                message: 'Media URL is required'
            });
        }

        console.log(`Processing media from URL: ${mediaUrl}`);

        // Use helper function to extract transcript
        const { text: transcript } = await extractMediaTranscript(mediaUrl);

        console.log(`Generating ${numberOfQuestions} ${difficulty} ${type} questions...`);
        const assessmentJson = await generateAssessmentPromptCall(transcript, type, numberOfQuestions, difficulty, language);

        // Parse result
        let assessment;
        try {
            const match = assessmentJson.match(/\[[\s\S]*\]/);
            assessment = match ? JSON.parse(match[0]) : JSON.parse(assessmentJson);
        } catch (error) {
            assessment = { rawResponse: assessmentJson };
        }

        // Save to database if user ID is available
        let savedAssessment = null;
        const userId = req.user?._id;

        try {
            // Extract filename from URL if possible
            const urlParts = mediaUrl.split('/');
            const fileName = urlParts[urlParts.length - 1].split('?')[0] || 'media-file';

            savedAssessment = await saveAssessment(
                assessment,
                {
                    fileName,
                    type,
                    difficulty,
                    language,
                    source: 'media-url',
                    transcript: JSON.stringify(transcript)
                },
                { userId }
            );

            // Add assessment to user's created assessments
            if (userId) {
                await User.findByIdAndUpdate(
                    userId,
                    { $addToSet: { assessmentCreated: savedAssessment._id } }
                );
            }
        } catch (dbError) {
            console.error('Failed to save to database:', dbError);
            // Continue even if database save fails
        }

        // Delete from Cloudinary if requested
        if (deleteAfterProcessing && cloudinaryPublicId) {
            try {
                await deleteFromCloudinary(cloudinaryPublicId, resourceType);
                console.log(`Deleted media from Cloudinary: ${cloudinaryPublicId}`);
            } catch (deleteError) {
                console.error('Failed to delete from Cloudinary:', deleteError);
                // Continue even if deletion fails
            }
        }

        clearTimeout(timeoutId);
        res.status(200).json({
            success: true,
            mediaUrl,
            assessment,
            metadata: {
                type,
                difficulty,
                questionCount: numberOfQuestions,
                transcriptLength: transcript.length
            },
            // Include assessment ID if saved successfully
            ...(savedAssessment && { assessmentId: savedAssessment._id })
        });

    } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error generating assessment from media URL:', error);

        res.status(500).json({
            success: false,
            message: 'Error generating assessment',
            error: error.message
        });
    }
};

/**
 * Modified to handle media files - Now only uses Cloudinary + AssemblyAI approach
 */
const generateAssessmentFromMedia = async (req, res) => {
    // If the request contains a mediaUrl instead of a file, redirect to the URL handler

    try {
        if (req.body.mediaUrl) {
            return generateAssessmentFromMediaUrl(req, res);
        }

        return res.status(200).json({
            success: false,
            message: 'Media URL or file is required'
        });

    } catch (error) {
        console.error('Error generating assessment from media URL:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating assessment',
            error: error.message
        });

    }
};

/**
 * Generate assessment from uploaded document (PDF/PowerPoint)
 */
const generateAssessmentFromDocument = async (req, res) => {
    // If the request contains a documentUrl, redirect to the URL handler
    try {

        if (req.body.documentUrl) {
            return generateAssessmentFromDocumentUrl(req, res);

        }

        res.status(400).json({
            success: false,
            message: 'Document URL is required'
        });

    } catch (error) {
        console.error('Error generating assessment from document URL:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating assessment',
            error: error.message
        });
    }
};

/**
 * Generate assessment from document URL (PDF/PPT from Cloudinary or other source)
 */
const generateAssessmentFromDocumentUrl = async (req, res) => {
    console.log("I was here in document URL");
    const timeoutId = setTimeout(() => {
        res.status(504).json({ success: false, message: 'Request timed out' });
    }, 180000); // 3 minutes timeout

    try {
        const {
            documentUrl,
            numberOfQuestions = 5,
            difficulty = 'medium',
            type = 'MCQ',
            language,
            deleteAfterProcessing = false,
            cloudinaryPublicId = null,
            resourceType = 'raw'  // Default resource type for documents
        } = req.body;
        console.log(req.body);

        if (!documentUrl) {
            clearTimeout(timeoutId);
            return res.status(400).json({
                success: false,
                message: 'Document URL is required'
            });
        }

        // Use helper function to extract document text and metadata
        const { text: documentText, metadata: documentMetadata } = await extractDocumentText(documentUrl);

        console.log(`Document text extracted, length: ${documentText.length} characters`);
        console.log(`Generating ${numberOfQuestions} ${difficulty} ${type} questions...`);

        // Generate assessment
        const assessmentJson = await generateAssessmentPromptCall(documentText, type, numberOfQuestions, difficulty, language);

        // Parse result
        let assessment;
        try {
            const match = assessmentJson.match(/\[[\s\S]*\]/);
            assessment = match ? JSON.parse(match[0]) : JSON.parse(assessmentJson);
        } catch (error) {
            console.error('Failed to parse assessment JSON:', error);
            assessment = { rawResponse: assessmentJson };
        }

        // Save to database if user ID is available
        let savedAssessment = null;
        const userId = req.user?._id;

        try {
            // For documents, use document metadata
            const title = documentMetadata.title || `${documentMetadata.documentType} Assessment`;

            savedAssessment = await saveAssessment(
                assessment,
                {
                    ...documentMetadata,
                    type,
                    difficulty,
                    language,
                    transcript: JSON.stringify(documentText)
                },
                {
                    userId,
                    title,
                    description: `Assessment based on ${documentMetadata.documentType} document with ${documentMetadata.pageCount || documentMetadata.slideCount || 'multiple'} pages.`
                }
            );

            // Add assessment to user's created assessments
            if (userId) {
                await User.findByIdAndUpdate(
                    userId,
                    { $addToSet: { assessmentCreated: savedAssessment._id } }
                );
            }
        } catch (dbError) {
            console.error('Failed to save to database:', dbError);
            // Continue even if database save fails
        }

        // Delete from Cloudinary if requested
        if (deleteAfterProcessing && cloudinaryPublicId) {
            try {
                await deleteFromCloudinary(cloudinaryPublicId, resourceType);
                console.log(`Deleted document from Cloudinary: ${cloudinaryPublicId}`);
            } catch (deleteError) {
                console.error('Failed to delete from Cloudinary:', deleteError);
                // Continue even if deletion fails
            }
        }

        clearTimeout(timeoutId);
        res.status(200).json({
            success: true,
            fileName: documentMetadata.fileName,
            documentType: documentMetadata.documentType,
            assessment,
            metadata: {
                ...documentMetadata,
                type,
                difficulty,
                questionCount: numberOfQuestions,
                textLength: documentText.length
            },
            ...(savedAssessment && { assessmentId: savedAssessment._id })
        });
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error generating assessment from document URL:', error);

        res.status(500).json({
            success: false,
            message: 'Error generating assessment from document',
            error: error.message
        });
    }
};


const generateAssessmentFromLearn = async (req, res) => {
    try {
        const { numberOfQuestions = 5, difficulty = 'medium', type = 'MCQ', language = 'English' } = req.body;
        const { learnId } = req.params;

        if (!learnId) {
            return res.status(400).json({
                success: false,
                message: 'Learn ID is required'
            });
        }

        // Fetch learn content from the database
        const learnContent = await Learn.findById(learnId).lean();
        
        if (!learnContent) {
            return res.status(404).json({
                success: false,
                message: 'Learn content not found'
            });
        }

        // Get the transcript or content to use for assessment generation
        // First try to use the transcript, then notes, then summary as fallback
        const contentToUse = learnContent.transcript || 
                             learnContent.notes || 
                             learnContent.summary || 
                             '';

        if (!contentToUse) {
            return res.status(400).json({
                success: false,
                message: 'No content available to generate assessment'
            });
        }

        // Generate assessment from the learn data
        const assessmentJson = await generateAssessmentPromptCall(contentToUse, type, numberOfQuestions, difficulty, language);

        // Parse result
        let assessment;
        try {
            const match = assessmentJson.match(/\[[\s\S]*\]/); 
            assessment = match ? JSON.parse(match[0]) : JSON.parse(assessmentJson);
        } catch (error) {
            console.error('Failed to parse assessment JSON:', error);
            assessment = { rawResponse: assessmentJson };
        }

        // Save to database if user ID is available
        let savedAssessment = null;
        const userId = req.user?._id;

        try {
            // For learn content, use content title and metadata
            const title = learnContent.title || `Learn Content Assessment`;

            savedAssessment = await saveAssessment(
                assessment,
                {
                    type,
                    difficulty,
                    language,
                    source: 'learn',
                    learnId: learnId,
                    contentType: learnContent.contentType
                },
                {
                    userId,
                    title,
                    description: `Assessment based on ${learnContent.contentType || 'learning'} content: ${title}`
                }
            );

            // Add assessment to user's created assessments
            if (userId) {
                await User.findByIdAndUpdate(
                    userId,
                    { $addToSet: { assessmentCreated: savedAssessment._id } }
                );
            }
        } catch (dbError) {
            console.error('Failed to save to database:', dbError);
            // Continue even if database save fails
        }

        res.status(200).json({
            success: true,
            learnId,
            assessment,
            metadata: { 
                type, 
                difficulty, 
                questionCount: numberOfQuestions,
                title: learnContent.title,
                contentType: learnContent.contentType
            },
            ...(savedAssessment && { assessmentId: savedAssessment._id })
        });

    } catch (error) {
        console.error('Error generating assessment from Learn:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating assessment',
            error: error.message
        });
    }
};


/**
 * Helper function to delete media from Cloudinary
 * @param {string} publicId - The Cloudinary public ID to delete
 * @param {string} resourceType - Optional resource type (defaults to 'video' which handles both audio/video)
 */
const deleteFromCloudinary = async (publicId, resourceType = 'video') => {
    if (!publicId) {
        console.warn('No public ID provided for Cloudinary deletion');
        return null;
    }

    try {
        // Import the cloudinary library if not already imported
        const cloudinary = (await import('cloudinary')).v2;

        // Configure cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        console.log(`Attempting to delete from Cloudinary: ${publicId} (type: ${resourceType})`);

        // Delete the resource
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true  // Invalidate any CDN caches
        });

        console.log(`Cloudinary deletion result for ${publicId}:`, result);
        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

// Export the functions
export {
    generateAssessmentFromYoutube,
    generateAssessmentFromMedia,
    generateAssessmentFromMediaUrl,
    generateAssessmentFromDocument,
    generateAssessmentFromDocumentUrl,
    generateAssessmentFromLearn,
    mediaFields,
    documentFields,
    mediaUpload,
    documentUpload,
    deleteFromCloudinary  // Export for use in other controllers if needed
};