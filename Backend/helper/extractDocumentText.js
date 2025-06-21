import axios from 'axios';
import { extractTextFromPdfFile } from './pdfToText.js';
import { extractTextFromPptFile } from './pptToText.js';

/**
 * Extracts text from a document URL (PDF/PPT/PPTX)
 * @param {string} documentUrl - URL to the document
 * @returns {Promise<{text: string, metadata: Object}>} The extracted text and document metadata
 */
const extractDocumentText = async (documentUrl) => {
    // Fetch the document from the URL
    let documentBuffer;
    try {
        const response = await axios({
            method: 'GET',
            url: documentUrl,
            responseType: 'arraybuffer'
        });

        documentBuffer = Buffer.from(response.data);
        console.log(`Downloaded document: ${documentBuffer.length} bytes`);
    } catch (fetchError) {
        throw new Error(`Failed to fetch document: ${fetchError.message}`);
    }

    // Determine file type from URL
    const urlLower = documentUrl.toLowerCase();
    let documentText;
    let documentMetadata = {};

    // Extract text based on detected file type
    if (urlLower.endsWith('.pdf')) {
        console.log('Processing PDF document...');
        const pdfResult = await extractTextFromPdfFile(documentBuffer, false);
        documentText = pdfResult.allText;
        documentMetadata = {
            pageCount: pdfResult.pageCount,
            documentType: 'PDF',
            cloudinaryUrl: documentUrl
        };
    }
    else if (urlLower.endsWith('.ppt') || urlLower.endsWith('.pptx')) {
        console.log('Processing PowerPoint document...');
        const pptResult = await extractTextFromPptFile(documentBuffer);
        documentText = pptResult.allText;
        documentMetadata = {
            slideCount: pptResult.slideCount,
            title: pptResult.title,
            documentType: urlLower.endsWith('.ppt') ? 'PPT' : 'PPTX',
            cloudinaryUrl: documentUrl
        };
    } else {
        throw new Error('Unsupported document type. Only PDF, PPT, and PPTX are supported.');
    }

    // Get filename from URL
    const urlParts = documentUrl.split('/');
    const fileName = urlParts[urlParts.length - 1].split('?')[0] || 'document';
    documentMetadata.fileName = fileName;

    // Validate that we have enough text to work with
    if (!documentText || documentText.length < 100) {
        throw new Error('Document contains insufficient text for processing (minimum 100 characters required)');
    }

    return {
        text: documentText,
        metadata: documentMetadata
    };
};

export default extractDocumentText;
