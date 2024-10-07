import React, { useEffect } from 'react';
import { Scene, WebGLRenderer, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Starfield from './starField';
import Sun from './sun';
import Planet from './planets';
import { Earth } from './earth.jsx';
import Asteroid from '../NEOs/Asteroid.jsx';
import AsteroidInfo from '../NEOs/neoInfo.jsx';
import { getNEOAsteroids } from '../Aux_json_PHA_NEO_parser.jsx';
import Comet from "../NEOs/Comet.jsx";

const MAX_ORBIT_RADIUS = 60;
const MIN_ORBIT_RADIUS = 8;

const convertAsteroidData = (apiAsteroid) => {
  // Scale the semi-major axis to fit within the orbit range [10, 60]
  const semiMajorAxis = Math.max(
    MIN_ORBIT_RADIUS,
    Math.min(MAX_ORBIT_RADIUS, parseFloat(apiAsteroid.a) * 10) // Adjust scaling factor as needed
  );

  // Scale the orbit speed based on the period (per) or mean motion (n)
  const orbitSpeed = parseFloat(apiAsteroid.n) * 0.0001; // Scale down the value for visualization

  // Use the eccentricity and inclination directly from the API
  const eccentricity = parseFloat(apiAsteroid.e);
  const inclination = parseFloat(apiAsteroid.i) * 0.01; // Normalize inclination to a smaller range

  // Set the asteroid size based on diameter (if available) or a default value
  const asteroidSize = apiAsteroid.diameter
    ? parseFloat(apiAsteroid.diameter) * 0.01
    : 0.9; // Scale down if diameter is available

  // Default rotation speed
  const rotationSpeed = 0.01;

  // Return the formatted asteroid data
  return {
    orbitSpeed,
    semiMajorAxis,
    eccentricity,
    inclination,
    asteroidSize,
    rotationSpeed,
    asteroidTexture: '/assets/asteroid.jpg', // Default texture
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
    isPHA: false,
  },
  {
    orbitSpeed: 0.00003,
    semiMajorAxis: 50, // Larger orbit
    eccentricity: 0.5,
    inclination: 0.5,
    asteroidSize: 0.9,
    rotationSpeed: 0.015,
    asteroidTexture: '/assets/asteroid2.jpg',
    isPHA: false,
  },
  {
    orbitSpeed: 0.0001, // Adjust speed for the PHA
    semiMajorAxis: 10,  // Closer orbit
    eccentricity: 0.8,  // Higher eccentricity for close approaches
    inclination: 0.5,    // Slight inclination
    asteroidSize: 0.5,   // Smaller size
    rotationSpeed: 0.02, // Default rotation speed
    asteroidTexture: '/assets/asteroid2.jpg', // Path to texture for the PHA
    isPHA: true,         // Flag to indicate that this is a PHA
  },
];

const comets = [
  {
    orbitSpeed: 0.0003,          // The speed at which the comet orbits
    semiMajorAxis: 75,           // The size of the comet's orbit (distance from the center)
    eccentricity: 0.9,           // Eccentricity for elliptical orbit (higher means more elongated)
    inclination: 0.2,            // Orbit's inclination (tilt)
    cometSize: 2.0,              // Size of the comet
    cometTexture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeW0ToF6yIm9h5QgTBBqaUA93R77nxG6_6kg&s", // Path to comet texture image
    rotationSpeed: 0.02,         // How fast the comet rotates on its own axis
    rotationDirection: "clockwise", // Rotation direction (clockwise or counter-clockwise)
    roughness: 0.7,              // Roughness of the comet's surface material
    metalness: 0.2,              // Reflectivity of the comet's material
    trailLength: 200             // Length of the comet's white trail
  },
  {
    orbitSpeed: 0.0002,
    semiMajorAxis: 80,
    eccentricity: 0.3,
    inclination: 0.1,
    cometSize: 1.8,
    cometTexture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeW0ToF6yIm9h5QgTBBqaUA93R77nxG6_6kg&s",
    rotationSpeed: 0.015,
    rotationDirection: "counter-clockwise",
    roughness: 0.6,
    metalness: 0.3,
    trailLength: 180
  }
  // Add more cometData objects if you need more comets
];


const ThreeScene = () => {
  const [selectedAsteroid, setSelectedAsteroid] = React.useState(null);
  const [planetPositions, setPlanetPositions] = React.useState([]);
  /*const [asteroids, setAsteroids] = React.useState([]);*/
  const [loading, setLoading] = React.useState(true);

  /*useEffect(() => {
    // Fetch the asteroid data
    const fetchAsteroids = async () => {
      try {
        const asteroidData = await getNEOAsteroids(); // Fetch asteroid data from NASA API
        setAsteroids(asteroidData); // Store fetched asteroids
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching asteroids:", error);
      }
    };

    fetchAsteroids().then(() => console.log(asteroids)); // Call the function to fetch asteroids data
  }, []);*/

  useEffect(() => {
    /*if (loading) return;*/

    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new Scene();
    const camera = new PerspectiveCamera(75, w / h, 0.1, 100);
    const renderer = new WebGLRenderer({ antialias: true });
    const controls = new OrbitControls(camera, renderer.domElement);

    const starfield = new Starfield({ numStars: 1000 }).getStarfield();
    scene.add(starfield);

    const sun = new Sun().getSun();
    scene.add(sun);

    planets.forEach((planet) => {
      const planetObj = new Planet(planet).getPlanet();
      scene.add(planetObj);

      const position = planetObj.position.clone();
      setPlanetPositions((prev) => [...prev, { name: planet.name, position }]);
    });

    asteroids.forEach((asteroidData) => {
      const asteroidObj = new Asteroid({
        ...asteroidData,
        onAsteroidClick: setSelectedAsteroid,
        camera: camera,
      }).getAsteroid();
      scene.add(asteroidObj);
    });

    comets.forEach((cometData) => {
      const cometObj = new Comet({
        ...cometData,
        onCometClick: setSelectedAsteroid, // Reuse asteroid click handler for comets
        camera: camera,
      }).getComet();
      scene.add(cometObj);
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
    }).getPlanet();
    scene.add(earth);

    controls.minDistance = 10;
    controls.maxDistance = 60;
    camera.position.set(
      30 * Math.cos(Math.PI / 6),
      30 * Math.sin(Math.PI / 6),
      40
    );

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
    setSelectedAsteroid(null); // Reset selected asteroid
  };

  return (
    <div>
      {/* Render Asteroid Info component */}
      <AsteroidInfo asteroid={selectedAsteroid} onClose={handleClose} />
    </div>
  );
};

export default ThreeScene;
