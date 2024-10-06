import React, { useEffect, useRef } from 'react';
import { Scene, WebGLRenderer, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Starfield from './starField';
import Sun from './sun';
import Planet from './planets';
import { Earth } from './earth.jsx';
import Asteroid from '../NEOs/Asteroid.jsx';
import AsteroidInfo from '../NEOs/neoInfo.jsx';
import CenterSceneButton from './centerSceneButton.jsx';
import PlanetInfo from '../PlanetInfo.jsx';
import EarthInfo from '../EarthInfo.jsx';

const MAX_ORBIT_RADIUS = 60;
const MIN_ORBIT_RADIUS = 8;

const convertAsteroidData = (apiAsteroid) => {
  const semiMajorAxis = Math.max(
    MIN_ORBIT_RADIUS,
    Math.min(MAX_ORBIT_RADIUS, parseFloat(apiAsteroid.a) * 10)
  );

  const orbitSpeed = parseFloat(apiAsteroid.n) * 0.0001;

  const eccentricity = parseFloat(apiAsteroid.e);
  const inclination = parseFloat(apiAsteroid.i) * 0.01;

  const asteroidSize = apiAsteroid.diameter
    ? parseFloat(apiAsteroid.diameter) * 0.01
    : 0.9;

  const rotationSpeed = 0.01;

  return {
    orbitSpeed,
    semiMajorAxis,
    eccentricity,
    inclination,
    asteroidSize,
    rotationSpeed,
    asteroidTexture: '/assets/asteroid.jpg',
  };
};

const planets = [
  {
    name: 'Mercury',
    orbitSpeed: 0.00048,
    orbitRadius: 10,
    orbitRotationDirection: 'clockwise',
    planetSize: 0.2,
    planetRotationSpeed: 0.005,
    planetRotationDirection: 'counterclockwise',
    planetTexture: '/assets/mercurymap.jpg',
    rimHex: 0xf9cf9f,
  },
  {
    name: 'Venus',
    orbitSpeed: 0.00035,
    orbitRadius: 12,
    orbitRotationDirection: 'clockwise',
    planetSize: 0.5,
    planetRotationSpeed: 0.0005,
    planetRotationDirection: 'clockwise',
    planetTexture: '/assets/venusmapthumb.jpg',
    rimHex: 0xb66f1f,
  },
  {
    name: 'Mars',
    orbitSpeed: 0.00024,
    orbitRadius: 18,
    orbitRotationDirection: 'clockwise',
    planetSize: 0.3,
    planetRotationSpeed: 0.01,
    planetRotationDirection: 'counterclockwise',
    planetTexture: '/assets/mars_map.jpg',
    rimHex: 0xbc6434,
  },
  {
    name: 'Jupiter',
    orbitSpeed: 0.00013,
    orbitRadius: 23,
    orbitRotationDirection: 'clockwise',
    planetSize: 1,
    planetRotationSpeed: 0.06,
    planetRotationDirection: 'counterclockwise',
    planetTexture: '/assets/jupitermapthumb.jpg',
    rimHex: 0xf3d6b6,
  },
  {
    name: 'Saturn',
    orbitSpeed: 0.0001,
    orbitRadius: 28,
    orbitRotationDirection: 'clockwise',
    planetSize: 0.8,
    planetRotationSpeed: 0.05,
    planetRotationDirection: 'counterclockwise',
    planetTexture: '/assets/saturnmapthumb.jpg',
    rimHex: 0xd6b892,
    rings: {
      ringsSize: 0.5,
      ringsTexture: '/assets/saturn-rings.jpg',
    },
  },
  {
    name: 'Uranus',
    orbitSpeed: 0.00007,
    orbitRadius: 34,
    orbitRotationDirection: 'clockwise',
    planetSize: 0.5,
    planetRotationSpeed: 0.02,
    planetRotationDirection: 'clockwise',
    planetTexture: '/assets/uranusmapthumb.jpg',
    rimHex: 0x9ab6c2,
    rings: {
      ringsSize: 0.4,
      ringsTexture: '/assets/uranus-rings.jpg',
    },
  },
  {
    name: 'Neptune',
    orbitSpeed: 0.000054,
    orbitRadius: 40,
    orbitRotationDirection: 'clockwise',
    planetSize: 0.5,
    planetRotationSpeed: 0.02,
    planetRotationDirection: 'counterclockwise',
    planetTexture: '/assets/neptunemapthumb.jpg',
    rimHex: 0x5c7ed7,
  },
];

const asteroids = [
  {
    orbitSpeed: 0.00005,
    semiMajorAxis: 35,
    eccentricity: 0.3,
    inclination: 0.2,
    asteroidSize: 0.9,
    rotationSpeed: 0.01,
    asteroidTexture: '/assets/asteroid.jpg',
  },
  {
    orbitSpeed: 0.00003,
    semiMajorAxis: 50, // Larger orbit
    eccentricity: 0.5,
    inclination: 0.5,
    asteroidSize: 0.9,
    rotationSpeed: 0.015,
    asteroidTexture: '/assets/asteroid2.jpg',
  },
];

const initialCameraPosition = {
  x: 30 * Math.cos(Math.PI / 6),
  y: 30 * Math.sin(Math.PI / 6),
  z: 40,
};

export default function ThreeScene() {
  const [selectedAsteroid, setSelectedAsteroid] = React.useState(null);
  const [selectedPlanet, setSelectedPlanet] = React.useState(null);
  const [planetPositions, setPlanetPositions] = React.useState([]);
  const [earthIsSelected, setEarthIsSelected] = React.useState(false);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new Scene();
    const camera = new PerspectiveCamera(75, w / h, 0.1, 100);
    cameraRef.current = camera;
    const renderer = new WebGLRenderer({ antialias: true });
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    const starfield = new Starfield({ numStars: 1000 }).getStarfield();
    scene.add(starfield);

    const sun = new Sun().getSun();
    scene.add(sun);

    planets.forEach((planet) => {
      const planetObj = new Planet({
        ...planet,
        onPlanetClick: () => {
          handleClose();
          setSelectedPlanet(planet);
        },
        camera: camera,
      }).getPlanet();
      scene.add(planetObj);

      const position = planetObj.position.clone();
      setPlanetPositions((prev) => [...prev, { name: planet.name, position }]);
    });

    asteroids.forEach((asteroidData) => {
      const asteroidObj = new Asteroid({
        ...asteroidData,
        onAsteroidClick: () => {
          handleClose();
          setSelectedAsteroid(asteroidData);
        },
        camera: camera,
      }).getAsteroid();
      scene.add(asteroidObj);
    });

    const earth = new Earth({
      name: 'Earth',
      orbitSpeed: 0.00029,
      orbitRadius: 14,
      orbitRotationDirection: 'clockwise',
      planetSize: 0.5,
      planetAngle: (-23.4 * Math.PI) / 180,
      planetRotationSpeed: 0.01,
      planetRotationDirection: 'counterclockwise',
      planetTexture: '/assets/earth-map-1.jpg',
      onPlanetClick: () => {
        console.log('clickeando TIERAAAAAAAAAAAAAAAAAA');
        handleClose();
        setEarthIsSelected(true);
      },
    }).getPlanet();
    scene.add(earth);

    controls.minDistance = 10;
    controls.maxDistance = 60;
    camera.position.set(
      initialCameraPosition.x,
      initialCameraPosition.y,
      initialCameraPosition.z
    );
    controls.target.set(0, 0, 0);
    controls.update();

    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });

    return () => {
      renderer.dispose();
      controls.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  const handleClose = () => {
    setSelectedAsteroid(null);
    setSelectedPlanet(null);
    setEarthIsSelected(false);
  };

  const handleCenterScene = () => {
    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;

      camera.position.set(
        initialCameraPosition.x,
        initialCameraPosition.y,
        initialCameraPosition.z
      );
      controls.target.set(0, 0, 0);
      controls.update();
    }
  };

  return (
    <div>
      {selectedAsteroid ? (
        <AsteroidInfo asteroid={selectedAsteroid} onClose={handleClose} />
      ) : null}
      {selectedPlanet ? (
        <PlanetInfo planet={selectedPlanet} onClose={handleClose} />
      ) : null}
      {earthIsSelected ? <EarthInfo onClose={handleClose} /> : null}
      <CenterSceneButton onClick={handleCenterScene} />
    </div>
  );
}
