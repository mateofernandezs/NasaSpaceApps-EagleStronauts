// src/components/Events/SolarFlare.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const SolarFlare = ({ speed, size }) => {
    const flareRef = useRef();

    // Animation to make the flare grow over time
    useFrame(() => {
        if (flareRef.current) {
            flareRef.current.scale.x += speed;
            flareRef.current.scale.y += speed;
            flareRef.current.scale.z += speed;

            // Reset flare size when it's too big
            if (flareRef.current.scale.x > size) {
                flareRef.current.scale.set(1, 1, 1); // reset to original size
            }
        }
    });

    return (
        <mesh ref={flareRef} position={[0, 0, 0]}>
            <sphereGeometry args={[1, 32, 32]} />  {/* Initial size of the flare */}
            <meshBasicMaterial color="orange" transparent opacity={0.7} />
        </mesh>
    );
};

SolarFlare.defaultProps = {
    speed: 0.02,   // Default speed of flare expansion
    size: 5        // Max size before resetting
};

export default SolarFlare;   