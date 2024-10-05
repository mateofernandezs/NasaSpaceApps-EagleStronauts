import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import SolarFlare from './components/Events/SolarFlare';
import Planet from './components/Planet';
import './App.css'; // Importing global styles

function SolarSystem() {
    return (
        <div className="canvas-container">
            <Canvas camera={{ position: [0, 10, 50], fov: 45 }}>
                {/* Orbit Controls allow interaction with the 3D scene */}
                <OrbitControls />

                {/* Add stars for a background effect */}
                <Stars radius={100} depth={50} count={5000} factor={4} fade />

                {/* Add lighting to illuminate the scene */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />

                {/* Sun at the center of the system */}
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[1.5, 32, 32]} /> {/* Sun size */}
                    <meshBasicMaterial color="yellow" />
                </mesh>

                {/* Solar Flare expanding from the Sun */}
                <SolarFlare speed={0.03} size={15} />

                {/* Planets orbiting around the Sun */}
                <Planet position={[10, 0, 0]} color="red" size={1} orbitSpeed={0.05} />   {/* Mercury */}
                <Planet position={[15, 0, 0]} color="orange" size={1.2} orbitSpeed={0.04} />   {/* Venus */}
                <Planet position={[20, 0, 0]} color="blue" size={1.3} orbitSpeed={0.03} />   {/* Earth */}
                <Planet position={[30, 0, 0]} color="red" size={0.8} orbitSpeed={0.02} />   {/* Mars */}
                <Planet position={[50, 0, 0]} color="yellow" size={3} orbitSpeed={0.01} />   {/* Jupiter */}
                <Planet position={[70, 0, 0]} color="tan" size={2.5} orbitSpeed={0.009} />  {/* Saturn */}
                <Planet position={[90, 0, 0]} color="lightblue" size={2.3} orbitSpeed={0.008} />  {/* Uranus */}
                <Planet position={[110, 0, 0]} color="darkblue" size={2} orbitSpeed={0.007} />  {/* Neptune */}
            </Canvas>
        </div>
    );
}

export default SolarSystem;
