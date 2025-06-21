import React, { useEffect, useRef } from 'react';

const VideoViewer = ({ fileUrl }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [fileUrl]);

    return (
        <>
            <video ref={videoRef} controls width="100%" height="auto">
                <source src={fileUrl} />
            </video>
        </>
    );
};

export default VideoViewer;
