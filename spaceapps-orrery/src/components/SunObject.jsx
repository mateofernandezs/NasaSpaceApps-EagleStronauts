// src/components/SunObject.jsx
import * as THREE from 'three';

const SunObject = () => {
    // Create the geometry for the Sun
    const sunGeometry = new THREE.SphereGeometry(15, 50, 50);

    // Load the texture
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7VwyE5iw-iGoEvUj9BV5mnCSpmUi-By-42Q&s'); // Update with your texture path

    // Create a material with the loaded texture
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });

    // Create the Sun mesh
    return new THREE.Mesh(sunGeometry, sunMaterial);
};

export default SunObject;
