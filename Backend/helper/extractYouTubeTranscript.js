import axios from 'axios';
import ytdl from '@distube/ytdl-core';
import fetchYouTubeAudio from './fetchYouTubeAudio.js';
import transcribeAudioVideo from './transcribeAudioVideo.js';

/**
 * Extracts transcript from a YouTube video using multiple methods
 * @param {string} videoUrl - The YouTube video URL
 * @returns {Promise<{text: string, videoId: string}>} The extracted transcript text and video ID
 */
const extractYouTubeTranscript = async (videoUrl) => {
    // Extract video ID
    const videoId = ytdl.getURLVideoID(videoUrl);
    let transcript;

    // Try Python service first
    try {
        const response = await axios.get(`https://yt-transcript-testing.vercel.app/api/transcript/${videoId}`, { timeout: 15000 });
        transcript = response.data.transcript;
        transcript = transcript.map((obj) => obj.text).join('\n');
        console.log("anupam python script worked successfully")
    } catch (error) {
        console.log('anupam Transcript python service failed, moving to manish python service');

        try {
            const pythonResponse = await axios.get(`https://transcript-scrape.vercel.app/api/getTranscript/${videoId}`, { timeout: 15000 });
            transcript = pythonResponse.data.transcript;
            transcript = transcript.map((obj) => obj.text).join('\n');
        } catch (fallbackError) {
            console.log('Both services failed:', fallbackError.message);
        }
    }

    // If Python service failed, extract manually
    if (!transcript) {
        const audioPath = await fetchYouTubeAudio(videoUrl);
        const transcriptionResult = await transcribeAudioVideo(audioPath);
        transcript = transcriptionResult.text;
    }

    return { text: transcript, videoId };
};

export default extractYouTubeTranscript;
