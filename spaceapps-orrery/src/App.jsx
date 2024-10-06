// src/App.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SolarFlare from './components/Events/SolarFlare';
import Planet from './components/Planet';
import { TextureLoader } from 'three';

const App = () => {
    const texture = new TextureLoader().load('/texture/Solar.jpg');  // Load an external texture

    return (
        <Canvas style={{ width: '100vw', height: '100vh' }}>
            <OrbitControls />

            {/* Sun */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[3, 32, 32]} />
                <meshStandardMaterial emissive="yellow" />
            </mesh>

            {/* Personalized Solar Flare */}
            <SolarFlare
                speed={0.03}             // Faster expansion speed
                size={20}                 // Larger flare size before reset
                color="red"              // Custom color (e.g., red)
                opacity={0.9}            // More visible with higher opacity
                emissiveIntensity={1.5}  // Stronger emission glow
                texture={texture}        // Custom texture (optional)
            />

            {/* Planets */}
            <Planet radius={1} speed={0.01} color="red" distanceFromSun={8} />
            <Planet radius={0.5} speed={0.015} color="green" distanceFromSun={12} />
            <Planet radius={0.8} speed={0.008} color="blue" distanceFromSun={15} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 0, 0]} intensity={1} />
        </Canvas>
    );
};

export default App;
