import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const Planet = ({ distanceFromSun, color, size, orbitSpeed }) => {
    const planetRef = useRef();

    // Animate the planet's orbit around the Sun
    useFrame(({ clock }) => {
        if (planetRef.current) {
            const time = clock.getElapsedTime() * orbitSpeed;
            planetRef.current.position.x = distanceFromSun * Math.cos(time);
            planetRef.current.position.z = distanceFromSun * Math.sin(time);
        }
    });

    return (
        <mesh ref={planetRef}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

Planet.defaultProps = {
    distanceFromSun: 10,  // Default distance from the Sun
    color: 'blue',
    size: 1,              // Planet size
    orbitSpeed: 0.1       // Orbit speed multiplier
};

export default Planet;
