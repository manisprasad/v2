import extractDocumentText from "../extractDocumentText.js";
import extractYouTubeTranscript from "../extractYouTubeTranscript.js";
import extractMediaTranscript from "../extractMediaTranscript.js";

const uploadLearnHelper = async ({title, cloudinaryContentUrl, contentType}) => {
    try {

        // extract transcript based on content type
        let transcript = '';
        
        try {
            switch (contentType) {
                case 'youtube':
                    transcript = await extractYouTubeTranscript(cloudinaryContentUrl);
                    break;
                case 'video':
                    transcript = await extractMediaTranscript(cloudinaryContentUrl, contentType);
                    console.log("Transcript extracted successfully:", transcript);
                    break;
                case 'audio':
                    transcript = await extractMediaTranscript(cloudinaryContentUrl, contentType);
                    // console.log("Transcript extracted successfully:", transcript);
                    break;
                case 'document':
                    transcript = await extractDocumentText(cloudinaryContentUrl);
                    break;
                default:
                    console.log(`No transcript extraction available for content type: ${contentType}`);
                    break;
            }
        } catch (extractionError) {
            console.error(`Failed to extract transcript: ${extractionError.message}`);
            // Continue with empty transcript
        }

        transcript = transcript.text;

        const learnMaterial = {
            title,
            contentType,
            cloudinaryContentUrl,
            transcript
        };

        return learnMaterial;

    } catch (error) {
        console.error("Error uploading learn material:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export { uploadLearnHelper };