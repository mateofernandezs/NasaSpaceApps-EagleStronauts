// src/App.jsx
import React from 'react';
import ThreeScene from './components/Orrey/orrey_scene';
import IntroScreen from './components/IntroScene.jsx'; // Import the new IntroScreen component
import './App.css';

function App() {
    return (
        <>
            <IntroScreen /> {/* Show the intro screen */}
            <ThreeScene />
        </>
    );
}

export default App;
