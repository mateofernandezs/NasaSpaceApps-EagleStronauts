// src/components/SolarFlare.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const SolarFlare = ({ speed, size, color }) => {
    const flareRef = useRef();

    useFrame(() => {
        if (flareRef.current) {
            flareRef.current.scale.x += speed;
            flareRef.current.scale.y += speed;
            flareRef.current.scale.z += speed;

            if (flareRef.current.scale.x > size) {
                flareRef.current.scale.set(1, 1, 1); // reset size
            }
        }
    });

    return (
        <mesh ref={flareRef} position={[0, 0, 0]}>
            <sphereGeometry args={[1, 32, 32]} /> {/* Initial flare size */}
            <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
    );
};

SolarFlare.defaultProps = {
    speed: 0.02,
    size: 5,
    color: "orange"
};

export default SolarFlare;
