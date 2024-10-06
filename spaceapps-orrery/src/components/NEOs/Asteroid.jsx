import React, { useRef, useEffect, useState } from "react";
import * as THREE from 'three';
import AsteroidInfo from "./neoInfo.jsx";

const AsteroidScene = () => {
    const mountRef = useRef(null);
    const asteroidRef = useRef(null);
    const [selectedAsteroid, setSelectedAsteroid] = useState(null);

    useEffect(() => {
        const mount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 100;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true; // Activar sombras
        mount.appendChild(renderer.domElement);

        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz suave
        scene.add(ambientLight);

        // Luz direccional
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Aumentar intensidad
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true; // Permitir que la luz direccional proyecte sombras
        scene.add(directionalLight);

        // Luz de relleno
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3); // Luz de relleno suave
        fillLight.position.set(-50, -50, -50);
        scene.add(fillLight);

        const loader = new THREE.TextureLoader();
        const texture = loader.load("/src/components/NEOs/textures/asteroidTexture.jpg");

        const geometry = new THREE.SphereGeometry(20, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.8, // Ajustar para obtener sombras más suaves
            metalness: 0.1, // Reducir metalicidad para una apariencia más rocosa
            bumpMap: texture, // Agregar un mapa de relieve si tienes uno
            bumpScale: 0.5, // Ajustar escala del relieve
        });

        const asteroid = new THREE.Mesh(geometry, material);
        asteroid.castShadow = true; // Permitir que el asteroide proyecte sombras
        asteroid.receiveShadow = true; // Permitir que el asteroide reciba sombras
        scene.add(asteroid);
        asteroidRef.current = asteroid;

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        const onMouseClick = (event) => {
            const mouse = new THREE.Vector2();
            const raycaster = new THREE.Raycaster();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(asteroid);
            if (intersects.length > 0) {
                setSelectedAsteroid({
                    name: "ASTEROIDE 1",
                    fullName: "NICOLE",
                    PHA: "54132",
                    diameter: "48 km",
                    orbitID: "5463521",
                    period: "40 años",
                    earthMOID: "685312 au",
                    SPK_ID: "123456",
                    risk: "Y"
                });
            } else {
                setSelectedAsteroid(null);
            }
        };

        window.addEventListener("click", onMouseClick);

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
            window.removeEventListener("click", onMouseClick);
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
            <AsteroidInfo asteroid={selectedAsteroid} />
        </div>
    );
};

export default AsteroidScene;
