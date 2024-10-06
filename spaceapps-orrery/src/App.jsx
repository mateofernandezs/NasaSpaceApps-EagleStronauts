import './App.css';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import SunObject from './components/SunObject.jsx';
import AsteroidObject from "./components/AstheroidObject.jsx";

const App = () => {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const isDragging = useRef(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const dragSensitivity = 0.003; // Adjust sensitivity for camera movement
    const velocity = new THREE.Vector3();

    // For key controls
    const moveForward = useRef(false);
    const moveBackward = useRef(false);
    const moveLeft = useRef(false);
    const moveRight = useRef(false);
    const moveUp = useRef(false); // Move up
    const moveDown = useRef(false); // Move down

    const angle = useRef(0); // For cube rotation around the sun

    useEffect(() => {
        // Create a Scene
        const scene = new THREE.Scene();

        // Create a Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000);
        camera.position.set(-50, 90, 150); // Initial position of the camera
        cameraRef.current = camera;

        // Create a Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Add Sun
        const sun = SunObject();
        scene.add(sun);

        // Create a Cube positioned initially at 20 units away from the Sun
        const geometry = new THREE.BoxGeometry(1, 1, 1); // Create a cube
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Set the color of the cube
        const cube = new THREE.Mesh(geometry, material); // Combine geometry and material into a mesh
        scene.add(cube); // Add the cube to the scene

        const asteroid = AsteroidObject();
        scene.add(asteroid);

        // Handle mouse dragging
        const onMouseDown = (event) => {
            isDragging.current = true;
            lastMousePosition.current = { x: event.clientX, y: event.clientY };
        };

        const onMouseMove = (event) => {
            if (isDragging.current) {
                const deltaX = event.clientX - lastMousePosition.current.x;
                const deltaY = event.clientY - lastMousePosition.current.y;
                lastMousePosition.current = { x: event.clientX, y: event.clientY };

                // Update camera rotation based on mouse movement
                camera.rotation.y -= deltaX * dragSensitivity; // Horizontal rotation
                camera.rotation.x -= deltaY * dragSensitivity; // Vertical rotation

                // Clamp vertical rotation to prevent flipping
                camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
            }
        };

        const onMouseUp = () => {
            isDragging.current = false;
        };

        // Key controls for moving towards/away from the sun (W/S), left/right (A/D), up/down (Q/E)
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'KeyW':
                    moveForward.current = true; // Move towards the sun
                    break;
                case 'KeyS':
                    moveBackward.current = true; // Move away from the sun
                    break;
                case 'KeyA':
                    moveLeft.current = true; // Move left
                    break;
                case 'KeyD':
                    moveRight.current = true; // Move right
                    break;
                case 'KeyQ':
                    moveUp.current = true; // Move up
                    break;
                case 'KeyE':
                    moveDown.current = true; // Move down
                    break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'KeyW':
                    moveForward.current = false;
                    break;
                case 'KeyS':
                    moveBackward.current = false;
                    break;
                case 'KeyA':
                    moveLeft.current = false;
                    break;
                case 'KeyD':
                    moveRight.current = false;
                    break;
                case 'KeyQ':
                    moveUp.current = false; // Stop moving up
                    break;
                case 'KeyE':
                    moveDown.current = false; // Stop moving down
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Update cube position for rotation around the sun
            angle.current += 0.01; // Increment angle for rotation
            cube.position.x = 20 * Math.cos(angle.current); // X position based on angle
            cube.position.z = 20 * Math.sin(angle.current); // Z position based on angle

            asteroid.position.x = 30 * Math.cos(angle.current); // X position based on angle
            asteroid.position.z = 30 * Math.sin(angle.current); // Z position based on angle

            // Move towards/away from the sun based on key presses
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction); // Get the direction the camera is looking
            direction.y = 0; // Prevent vertical movement

            if (moveForward.current) {
                camera.position.addScaledVector(direction, 0.5); // Move towards the sun
            }
            if (moveBackward.current) {
                camera.position.addScaledVector(direction, -0.5); // Move away from the sun
            }
            if (moveLeft.current) {
                camera.position.x -= 0.5; // Move left
            }
            if (moveRight.current) {
                camera.position.x += 0.5; // Move right
            }
            if (moveUp.current) {
                camera.position.y += 0.5; // Move up
            }
            if (moveDown.current) {
                camera.position.y -= 0.5; // Move down
            }

            sun.rotation.y += 0.03; // Rotate the sun
            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Add event listeners for mouse controls
        mountRef.current.addEventListener('mousedown', onMouseDown);
        mountRef.current.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            mountRef.current.removeEventListener('mousedown', onMouseDown);
            mountRef.current.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    // Function to center camera on the sun
    const centerCamera = () => {
        if (cameraRef.current) {
            cameraRef.current.position.set(-50, 90, 150); // Reset camera position
            cameraRef.current.lookAt(0, 0, 0); // Look at the center (sun)
        }
    };

    return (
        <div ref={mountRef} style={{ width: '100vw', height: '100vh', cursor: 'grab' }}>
            <button onClick={centerCamera} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}>
                Centrar
            </button>
        </div>
    );
};

export default App;