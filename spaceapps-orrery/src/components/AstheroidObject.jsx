// eslint-disable-next-line no-unused-vars
import React, { useRef, useEffect } from "react";
import * as THREE from 'three';

const AsteroidObject = () => {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load("https://upload.wikimedia.org/wikipedia/commons/2/2c/Generic_Celestia_asteroid_texture.jpg");
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshStandardMaterial({ map: texture,});

        return new THREE.Mesh(geometry, material);
};

export default AsteroidObject;