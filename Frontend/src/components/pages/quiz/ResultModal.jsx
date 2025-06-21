import React from "react";
import { X } from "lucide-react";
import generateScoreCardPDF from "../../../utils/quiz/scoreCardpdf";

const ResultModal = ({ quizData, onClose }) => {
    const handleDownload = (isScoreCard) =>
        generateScoreCardPDF(quizData, isScoreCard);

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
            style={{
                animation: "modalFadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                willChange: "opacity",
            }}>
            <style jsx>{`
                @keyframes modalFadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes modalScaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.98) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>

            <div
                className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 w-[90%] max-w-md space-y-5 transform transition-all duration-100 relative"
                style={{
                    animation: "modalScaleIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    willChange: "transform, opacity",
                    transformOrigin: "center bottom",
                }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-800 transition-colors duration-200 text-slate-400 hover:text-slate-200"
                    aria-label="Close modal">
                    <X size={24} />
                </button>

                <div className="text-center space-y-1 pt-2">
                    <h2 className="text-2xl font-semibold text-slate-100">
                        Download Report
                    </h2>
                    <p className="text-sm text-slate-400">
                        Choose your preferred format
                    </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                    <button
                        onClick={() => handleDownload(true)}
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white font-medium py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-cyan-500/20">
                        Score Card
                    </button>

                    <button
                        onClick={() => handleDownload(false)}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl border border-slate-600 transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-lg hover:shadow-indigo-500/10">
                        Assessment Only
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
