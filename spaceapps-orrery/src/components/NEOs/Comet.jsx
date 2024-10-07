import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './Comet.css';

const Comet = () => {
    const mountRef = useRef(null);
    const [showInfo, setShowInfo] = useState(false);
    const [scaleFactor, setScaleFactor] = useState(1); // Para controlar el tamaño del cometa

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x0a2b5b, 1);
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.autoRotate = true;

        camera.position.z = 7;

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const positions = geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            const displacement = (Math.random() - 0.5) * 0.3;
            positions[i] += displacement;
            positions[i + 1] += displacement;
            positions[i + 2] += displacement;
        }
        geometry.attributes.position.needsUpdate = true;

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('/Comet.jpg', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);

            const material = new THREE.MeshBasicMaterial({
                map: texture,
            });

            const comet = new THREE.Mesh(geometry, material);
            scene.add(comet);

            const particleCount = 1875;
            const particleGeometry = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);
            const particleColors = new Float32Array(particleCount * 3);
            const particleLife = new Float32Array(particleCount);
            const particleOpacity = new Float32Array(particleCount);
            const particleGroup = new Float32Array(particleCount);

            for (let i = 0; i < particleCount; i++) {
                particleLife[i] = Math.random() * 2 + 1;
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 2 + 2;

                particlePositions[i * 3] = Math.cos(angle) * distance;
                particlePositions[i * 3 + 1] = Math.sin(angle) * distance;
                particlePositions[i * 3 + 2] = Math.random() * 5;
                particleColors[i * 3] = 1.0;
                particleColors[i * 3 + 1] = 1.0;
                particleColors[i * 3 + 2] = 1.0;
                particleOpacity[i] = 1.0;
                particleGroup[i] = -1;
            }

            particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
            particleGeometry.setAttribute('aLife', new THREE.BufferAttribute(particleLife, 1));
            particleGeometry.setAttribute('aOpacity', new THREE.BufferAttribute(particleOpacity, 1));

            const particleMaterial = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true });
            const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
            comet.add(particleSystem);

            const animate = function () {
                requestAnimationFrame(animate);
                comet.rotation.x += 0.01;
                comet.rotation.y = 0.01;
                comet.rotation.z = 0.01;

                for (let i = 0; i < particleCount; i++) {
                    particleLife[i] -= 0.01;
                    particlePositions[i * 3 + 2] -= 0.1;
                    const distanceFromCenter = Math.abs(particlePositions[i * 3 + 2]);
                    particleOpacity[i] = Math.max(0, 1 - distanceFromCenter / 5);

                    if (particleLife[i] <= 0) {
                        particleGroup[i] = -1;
                        particlePositions[i * 3 + 2] = 0;
                        particlePositions[i * 3] = (Math.random() - 0.5) * 2;
                        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2;
                        particleLife[i] = Math.random() * 2 + 1;
                    }

                    if (Math.random() < 0.04) {
                        particleLife[i] = Math.random() * 2 + 1;
                        particlePositions[i * 3 + 2] = 0;
                        particlePositions[i * 3] = (Math.random() - 0.5) * 2;
                        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2;
                        particleGroup[i] = i;
                    }
                }

                particleGeometry.attributes.position.needsUpdate = true;
                particleGeometry.attributes.color.needsUpdate = true;
                particleGeometry.attributes.aLife.needsUpdate = true;
                particleGeometry.attributes.aOpacity.needsUpdate = true;

                comet.scale.set(scaleFactor, scaleFactor, scaleFactor); // Aplicar el factor de escala
                controls.update();
                renderer.render(scene, camera);
            };

            animate();

            // Hacer clic en el cometa o partículas para restaurar la vista original
            const onClick = (event) => {
                if (scaleFactor === 1 / 12) {
                    setScaleFactor(1);
                    setShowInfo(false);
                }
            };

            renderer.domElement.addEventListener('click', onClick);

            return () => {
                document.body.removeChild(renderer.domElement);
                renderer.domElement.removeEventListener('click', onClick);
            };
        });

        return () => {
            document.body.removeChild(renderer.domElement);
        };
    }, [scaleFactor]);

    const handleToggleInfo = () => {
        setShowInfo(!showInfo);
    };

    const handleScaleDown = () => {
        setShowInfo(false); // Hacer desaparecer el botón de información
        setScaleFactor(1 / 12); // Cambiar el tamaño del cometa
    };

    return (
        <>
            <div ref={mountRef} />
            {scaleFactor === 1 && (
                <>
                    <button className="info-button" style={{ position: 'absolute', bottom: '20px', left: '20px' }} onClick={handleToggleInfo}>
                        INFORMACION
                    </button>
                    {showInfo && (
                        <div className="info-table">
                            <table>
                                <tbody>
                                <tr>
                                    <td>Object Fullname</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>IAU Name</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>NEO</td>
                                    <td>(Y/N)</td>
                                </tr>
                                <tr>
                                    <td>PHA</td>
                                    <td>(Y/N)</td>
                                </tr>
                                <tr>
                                    <td>Diameter</td>
                                    <td>(km)</td>
                                </tr>
                                <tr>
                                    <td>Orbit ID</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Period</td>
                                    <td>(years)</td>
                                </tr>
                                <tr>
                                    <td>Earth MOID</td>
                                    <td>(au)</td>
                                </tr>
                                <tr>
                                    <td>Orbit Class</td>
                                    <td></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    <button className="scale-button" style={{ position: 'absolute', bottom: '20px', right: '20px' }} onClick={handleScaleDown}>
                        ESCALA
                    </button>
                </>
            )}
        </>
    );
};

export default Comet;
