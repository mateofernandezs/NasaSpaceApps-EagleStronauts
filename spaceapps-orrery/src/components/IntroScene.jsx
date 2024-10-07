// src/components/IntroScreen.jsx
import React, { useEffect, useState } from 'react';
import './IntroScreen.css'; // Ensure this file is still present

const IntroScreen = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false); // Hide the intro screen after 5 seconds
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`intro-screen ${visible ? 'visible' : 'hidden'}`}>
            <h1 className="intro-text">Are you ready to explore the space?</h1>
        </div>
    );
};

export default IntroScreen;
