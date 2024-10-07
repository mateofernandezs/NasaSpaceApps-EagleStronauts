import {
    Mesh,
    Group,
    TextureLoader,
    SphereGeometry,
    MeshStandardMaterial,
    Raycaster,
    Vector2,
    BufferGeometry,
    LineBasicMaterial,
    Line,
    Vector3,
} from "three";

export default class Asteroid {
    group;
    loader;
    asteroidMesh;
    raycaster;
    mouse;
    onAsteroidClick;
    trail; // To store the asteroid's trail
    trailLine; // The line representing the trail
    projectionLine; // The line representing the projection of the asteroid's path
    maxTrailLength; // Max length of the trail
    projectionLength; // Length of the projection line

    constructor({
                    orbitSpeed = 0.0002,
                    semiMajorAxis = 35,
                    eccentricity = 0.5,
                    inclination = 0.1,
                    asteroidSize = 0.9,
                    asteroidTexture = "/./src/assets/asteroid.jpg",
                    asteroidAngle = 0,
                    rotationSpeed = 0.01,
                    rotationDirection = "clockwise",
                    roughness = 0.8,
                    metalness = 0.1,
                    onAsteroidClick = null,
                    camera = null,
                    trailLength = 100, // Length of the trail (number of points)
                    projectionLength = 20, // Length of the projection line
                    isPHA = false, // Flag to indicate if the asteroid is a PHA
                } = {}) {
        this.orbitSpeed = orbitSpeed;
        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;
        this.inclination = inclination;
        this.asteroidSize = asteroidSize;
        this.asteroidTexture = asteroidTexture;
        this.asteroidAngle = asteroidAngle;
        this.rotationSpeed = rotationSpeed;
        this.rotationDirection = rotationDirection;
        this.roughness = roughness;
        this.metalness = metalness;
        this.onAsteroidClick = onAsteroidClick;
        this.camera = camera;
        this.isPHA = isPHA;

        this.group = new Group();
        this.loader = new TextureLoader();
        this.asteroidMesh = null;

        this.raycaster = new Raycaster();
        this.mouse = new Vector2();

        this.trail = []; // Initialize empty trail array
        this.maxTrailLength = trailLength; // Max number of points in the trail
        this.projectionLength = projectionLength; // Length of the projection line

        this.createAsteroid();
        this.createTrailLine(); // Create the trail line (initially empty)
        this.createProjectionLine(); // Create the projection line (initially empty)

        this.animate = this.createAnimateFunction();
        this.animate();

        // Initialize the click handler to make asteroids clickable
        this.initClickHandler();
    }

    createAsteroid() {
        const texture = this.loader.load(this.asteroidTexture);
        const asteroidGeometry = new SphereGeometry(this.asteroidSize, 32, 32);
        const asteroidMaterial = new MeshStandardMaterial({
            map: texture,
            roughness: this.roughness,
            metalness: this.metalness,
        });
        this.asteroidMesh = new Mesh(asteroidGeometry, asteroidMaterial);
        this.asteroidMesh.castShadow = true;
        this.asteroidMesh.receiveShadow = true;

        this.group.add(this.asteroidMesh);
    }

    // Create the initial empty trail line
    createTrailLine() {
        const geometry = new BufferGeometry(); // Will update points dynamically
        const material = new LineBasicMaterial({ color: this.isPHA ? 0xff0000 : 0x00ff00 }); // Green trail
        this.trailLine = new Line(geometry, material);

        // Add trail line to the scene
        this.group.add(this.trailLine);
    }

    // Create the projection line
    createProjectionLine() {
        const geometry = new BufferGeometry(); // Will update points dynamically
        const material = new LineBasicMaterial({ color: 0xff0000 }); // Red projection
        this.projectionLine = new Line(geometry, material);

        // Add projection line to the scene
        this.group.add(this.projectionLine);
    }

    updateTrail() {
        // Get current position of the asteroid
        const currentPosition = new Vector3().copy(this.asteroidMesh.position);

        // Add the current position to the trail
        this.trail.push(currentPosition);

        // Limit the length of the trail (remove oldest points)
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift(); // Remove the oldest position
        }

        // Update the geometry of the trail line with the updated trail points
        const trailPoints = this.trail.map((point) => point.clone()); // Clone points to avoid modifying original

        const geometry = new BufferGeometry().setFromPoints(trailPoints); // Set new points for the trail
        this.trailLine.geometry.dispose(); // Dispose the old geometry
        this.trailLine.geometry = geometry; // Assign the new geometry
    }

    updateProjection() {
        // Calculate the future position based on the current angle and the projection length
        const orbitAngle = Date.now() * this.orbitSpeed; // Current orbit angle
        const projectionAngle = orbitAngle + (this.projectionLength * this.orbitSpeed); // Future orbit angle

        // Get current position
        const currentX = this.semiMajorAxis * Math.cos(orbitAngle);
        const currentY = this.semiMajorAxis * Math.sin(orbitAngle) * Math.sqrt(1 - this.eccentricity * this.eccentricity);

        // Get projected position
        const projectedX = this.semiMajorAxis * Math.cos(projectionAngle);
        const projectedY = this.semiMajorAxis * Math.sin(projectionAngle) * Math.sqrt(1 - this.eccentricity * this.eccentricity);

        // Create a line from current position to projected position
        const projectionPoints = [
            new Vector3(currentX, currentY, 0),
            new Vector3(projectedX, projectedY, 0)
        ];

        const geometry = new BufferGeometry().setFromPoints(projectionPoints); // Set new points for the projection line
        this.projectionLine.geometry.dispose(); // Dispose the old geometry
        this.projectionLine.geometry = geometry; // Assign the new geometry
    }

    createAnimateFunction() {
        return () => {
            requestAnimationFrame(this.animate);

            // Handle rotation of the asteroid itself
            if (this.rotationDirection === "clockwise") {
                this.asteroidMesh.rotation.y -= this.rotationSpeed;
            } else {
                this.asteroidMesh.rotation.y += this.rotationSpeed;
            }

            // Animate the elliptical orbit
            const orbitAngle = Date.now() * this.orbitSpeed; // Time-based angle
            const x = this.semiMajorAxis * Math.cos(orbitAngle);
            const y = this.semiMajorAxis * Math.sin(orbitAngle) * Math.sqrt(1 - this.eccentricity * this.eccentricity);

            // Set asteroid's position along the orbit path
            this.asteroidMesh.position.set(x, y, 0);

            // Update the trail and projection with the new position
            this.updateTrail();
            this.updateProjection();
        };
    }

    initClickHandler() {
        window.addEventListener("click", this.onMouseClick.bind(this));
    }

    onMouseClick(event) {
        if (!this.camera) return;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.asteroidMesh]); // Ensure to pass an array of objects

        if (intersects.length > 0 && this.onAsteroidClick) {
            this.onAsteroidClick({
                name: 'ASTEROID-001', // Hardcoded example data
                diameter: '10 km',
                orbitSpeed: this.orbitSpeed,
                semiMajorAxis: this.semiMajorAxis,
                eccentricity: this.eccentricity,
                inclination: this.inclination,
                PHA: this.isPHA,
                spkID: '123456789',
                earthMOID: '0.05 au',
            });
        }
    }

    getAsteroid() {
        return this.group;
    }
}
