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

export default class Comet {
    group;
    loader;
    cometMesh;
    raycaster;
    mouse;
    onCometClick;
    trail; // To store the comet's trail
    trailLine; // The line representing the trail
    maxTrailLength; // Max length of the trail

    constructor({
                    orbitSpeed = 0.0002,
                    semiMajorAxis = 50,
                    eccentricity = 0.7,
                    inclination = 0.1,
                    cometSize = 1.5,
                    cometTexture = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeW0ToF6yIm9h5QgTBBqaUA93R77nxG6_6kg&s",
                    rotationSpeed = 0.01,
                    rotationDirection = "clockwise",
                    roughness = 0.8,
                    metalness = 0.1,
                    onCometClick = null,
                    camera = null,
                    trailLength = 150, // Length of the comet's trail
                } = {}) {
        this.orbitSpeed = orbitSpeed;
        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;
        this.inclination = inclination;
        this.cometSize = cometSize;
        this.cometTexture = cometTexture;
        this.rotationSpeed = rotationSpeed;
        this.rotationDirection = rotationDirection;
        this.roughness = roughness;
        this.metalness = metalness;
        this.onCometClick = onCometClick;
        this.camera = camera;

        this.group = new Group();
        this.loader = new TextureLoader();
        this.cometMesh = null;

        this.raycaster = new Raycaster();
        this.mouse = new Vector2();

        this.trail = []; // Initialize empty trail array
        this.maxTrailLength = trailLength; // Max number of points in the trail

        this.createComet();
        this.createTrailLine(); // Create the trail line (initially empty)

        this.animate = this.createAnimateFunction();
        this.animate();

        // Initialize the click handler to make comets clickable
        this.initClickHandler();
    }

    createComet() {
        const texture = this.loader.load(this.cometTexture);
        const cometGeometry = new SphereGeometry(this.cometSize, 32, 32);
        const cometMaterial = new MeshStandardMaterial({
            map: texture,
            roughness: this.roughness,
            metalness: this.metalness,
        });
        this.cometMesh = new Mesh(cometGeometry, cometMaterial);
        this.cometMesh.castShadow = true;
        this.cometMesh.receiveShadow = true;

        this.group.add(this.cometMesh);
    }

    // Create the initial empty white trail line
    createTrailLine() {
        const geometry = new BufferGeometry(); // Will update points dynamically
        const material = new LineBasicMaterial({ color: 0xffffff }); // White trail
        this.trailLine = new Line(geometry, material);

        // Add trail line to the scene
        this.group.add(this.trailLine);
    }

    updateTrail() {
        // Get current position of the comet
        const currentPosition = new Vector3().copy(this.cometMesh.position);

        // Add the current position to the trail
        this.trail.push(currentPosition);

        // Limit the length of the trail (remove oldest points)
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift(); // Remove the oldest position
        }

        // Update the geometry of the trail line with the updated trail points
        const trailPoints = this.trail.map((point) => point.clone());

        const geometry = new BufferGeometry().setFromPoints(trailPoints); // Set new points for the trail
        this.trailLine.geometry.dispose(); // Dispose the old geometry
        this.trailLine.geometry = geometry; // Assign the new geometry
    }

    createAnimateFunction() {
        return () => {
            requestAnimationFrame(this.animate);

            // Handle rotation of the comet itself
            if (this.rotationDirection === "clockwise") {
                this.cometMesh.rotation.y -= this.rotationSpeed;
            } else {
                this.cometMesh.rotation.y += this.rotationSpeed;
            }

            // Animate the elliptical orbit
            const orbitAngle = Date.now() * this.orbitSpeed;
            const x = this.semiMajorAxis * Math.cos(orbitAngle);
            const y = this.semiMajorAxis * Math.sin(orbitAngle) * Math.sqrt(1 - this.eccentricity * this.eccentricity);

            // Set comet's position along the orbit path
            this.cometMesh.position.set(x, y, 0);

            // Update the trail with the new position
            this.updateTrail();
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
        const intersects = this.raycaster.intersectObjects([this.cometMesh]);

        if (intersects.length > 0 && this.onCometClick) {
            this.onCometClick({
                name: 'COMET-001', // Example data
                diameter: '20 km',
                orbitSpeed: this.orbitSpeed,
                semiMajorAxis: this.semiMajorAxis,
                eccentricity: this.eccentricity,
                inclination: this.inclination,
            });
        }
    }

    getComet() {
        return this.group;
    }
}
