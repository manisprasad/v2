import axios from 'axios';

/**
 * Extracts transcript from media URL using Assembly AI
 * @param {string} mediaUrl - URL to the media file
 * @returns {Promise<string>} The extracted transcript text
 */
const extractMediaTranscript = async (mediaUrl) => {
    const ASSEMBLY_API_KEY = process.env.ASSEMBLY_API_KEY;
    if (!ASSEMBLY_API_KEY) {
        throw new Error('ASSEMBLY_API_KEY is not set in environment variables');
    }

    // Submit transcription job using the URL
    const response = await axios.post(
        "https://api.assemblyai.com/v2/transcript",
        {
            audio_url: mediaUrl,
            punctuate: true,
            format_text: true,
            speaker_labels: true
        },
        { headers: { authorization: ASSEMBLY_API_KEY } }
    );

    const transcriptId = response.data.id;
    console.log(`Transcription job started with ID: ${transcriptId}`);

    // Poll for completion
    let isCompleted = false;
    let transcript = '';

    while (!isCompleted) {
        const statusResponse = await axios.get(
            `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
            { headers: { authorization: ASSEMBLY_API_KEY } }
        );

        const status = statusResponse.data.status;
        console.log(`Transcription status: ${status}`);

        if (status === "completed") {
            isCompleted = true;
            transcript = statusResponse.data.text;
        } else if (status === "failed") {
            throw new Error("Transcription failed: " + (statusResponse.data.error || "Unknown error"));
        } else {
            // Wait before checking again
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    if (!transcript) {
        throw new Error('Insufficient speech content in media');
    }

    return { 
        text: transcript,
    };
};

export default extractMediaTranscript;
