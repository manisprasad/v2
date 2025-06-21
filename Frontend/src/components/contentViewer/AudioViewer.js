import React, { useEffect, useRef } from 'react';

const AudioViewer = ({ fileUrl }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
        }
    }, [fileUrl]);

    return (
        <>
            <audio ref={audioRef} controls>
                <source src={fileUrl} />
            </audio>
        </>
    );
};

export default AudioViewer;
