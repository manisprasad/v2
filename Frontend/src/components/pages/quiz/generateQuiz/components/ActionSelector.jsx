import { FileText, Download, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchLearnData } from "../../../../../services/learn/learnService";
import LoadingOverlay from "./LoadingOverlay";

const ActionSelector = ({ inputType, url, onActionSelect, file, cloudinaryUrl, cloudinaryData }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|embed|shorts|watch)\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleLearnClick = async () => {
    setIsLoading(true);
    try {
      if ((inputType === 'mp3-local' || inputType === 'mp4-local' || inputType === 'document') && file) {
        // Handle file upload for learning
        const { uploadToCloudinary, getResourceType } = await import('../../../../../utils/cloudinaryUtils');
        
        // Upload to Cloudinary with appropriate resource type
        const resourceType = getResourceType(file);
        const cloudinaryResult = await uploadToCloudinary(file, {
          folder: 'assessments/media',
          resourceType
        });
        console.log('File uploaded to Cloudinary: Action Selector', cloudinaryResult);

        if (cloudinaryResult.url) {
          // Fetch learnID and other Metadata
          const LearnResponse = await fetchLearnData(
            cloudinaryResult.original_filename, 
            cloudinaryResult.url, 
            (inputType === 'mp3-local' ? 'audio' : inputType === 'mp4-local' ? 'video' : inputType)
          );
          navigate(`/attemptquiz/learn/${inputType}/${LearnResponse.data._id}`);
        }
      } else if (url) {
        // Handle URL-based inputs
        const title = url.split('/');
        const LearnResponse = await fetchLearnData(
          title[title.length - 1], 
          url, 
          inputType === 'mp3-url' ? 'audio' : inputType === 'mp4-url' ? 'video' : inputType
        );
        navigate(`/attemptquiz/learn/${inputType}/${LearnResponse.data._id}`);
      }
    } catch (error) {
      console.error("Error during learn processing:", error);
      // You may want to add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  const videoId = getYouTubeVideoId(url);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {isLoading && <LoadingOverlay loading={isLoading} isLearning={true} />}
      
      <h3 className="text-xl font-semibold text-white col-span-full text-center mb-2">
        What would you like to do with this content?
      </h3>

      {inputType === "youtube" && videoId && (
        <div className="col-span-full flex justify-center">
          <iframe
            className="rounded-lg"
            width="560"
            height="315"
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Learn Option */}
      <div
        className="bg-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/50 rounded-xl p-6 text-center cursor-pointer transition-all shadow-md"
        onClick={handleLearnClick}
      >
        <div className="bg-gradient-to-br from-cyan-500 to-indigo-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5">
          <FileText className="h-10 w-10 text-white" />
        </div>
        <h4 className="text-xl font-bold text-slate-200 mb-2">
          Learn
        </h4>
        <p className="text-slate-400 mb-4">
          Get Instant Summary or Ask Any Doubt
        </p>
        <div className="flex justify-center">
          <span className="inline-flex items-center bg-cyan-600/30 text-cyan-300 px-3 py-1 rounded-full text-sm font-medium">
            Choose Options <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>

      {/* Take Assessment Option */}
      <div
        className="bg-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/50 rounded-xl p-6 text-center cursor-pointer transition-all shadow-md"
        onClick={() => onActionSelect("take")}
      >
        <div className="bg-gradient-to-br from-cyan-500 to-indigo-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5">
          <FileText className="h-10 w-10 text-white" />
        </div>
        <h4 className="text-xl font-bold text-slate-200 mb-2">
          Attempt Assessment
        </h4>
        <p className="text-slate-400 mb-4">
          Configure and take a custom assessment based on your content
        </p>
        <div className="flex justify-center">
          <span className="inline-flex items-center bg-cyan-600/30 text-cyan-300 px-3 py-1 rounded-full text-sm font-medium">
            Choose Options <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>

      {/* Download Assessment Option */}
      <div
        className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 border border-cyan-700/30 hover:border-cyan-500/70 rounded-xl p-6 text-center cursor-pointer transition-all shadow-lg"
        onClick={() => onActionSelect("download")}
      >
        {/* Background glow effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-600/20 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-cyan-500/30">
            <Download className="h-10 w-10 text-white" />
          </div>
          <h4 className="text-xl font-bold text-slate-100 mb-2">
            Download Assessment
          </h4>
          <p className="text-slate-300 mb-4">
            Get a comprehensive mixed assessment as PDF with multiple question types
          </p>
          <div className="flex justify-center">
            <span className="inline-flex items-center bg-cyan-600/30 text-cyan-300 px-3 py-1 rounded-full text-sm font-medium">
              Download PDF <Download className="w-3 h-3 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionSelector;