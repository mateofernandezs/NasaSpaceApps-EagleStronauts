import React, { useRef, useEffect } from "react";
import * as THREE from 'three';

const AsteroidScene = () => {
    const mountRef = useRef(null);
    const asteroidRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 100;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const loader = new THREE.TextureLoader();
        const texture = loader.load("/src/components/NEOs/textures/asteroidTexture.jpg");
        const geometry = new THREE.SphereGeometry(20, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 1,
            metalness: 0.3,
        });

        const asteroid = new THREE.Mesh(geometry, material);
        scene.add(asteroid);
        asteroidRef.current = asteroid;

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", handleResize);
        mount.addEventListener("mousemove", handleMouseMove);

        return () => {
            mount.removeChild(renderer.domElement);
            window.removeEventListener("resize", handleResize);
            mount.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleMouseMove = (event) => {
        const asteroid = asteroidRef.current;
        if (asteroid) {
            const { innerWidth, innerHeight } = window;
            const mouseX = (event.clientX / innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / innerHeight) * 2 + 1;

            asteroid.rotation.y = mouseX * Math.PI;
            asteroid.rotation.x = mouseY * Math.PI;
        }
    };

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            <div
                ref={mountRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                }}
            ></div>
        </div>
    );
};

export default AsteroidScene;
