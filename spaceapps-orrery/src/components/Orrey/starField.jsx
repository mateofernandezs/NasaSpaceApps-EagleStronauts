import {
  Group,
  Color,
  Points,
  Vector3,
  TextureLoader,
  PointsMaterial,
  BufferGeometry,
  AdditiveBlending,
  Float32BufferAttribute,
} from 'three';

class Starfield {
  constructor({ numStars = 1000 } = {}) {
    this.numStars = numStars;
    this.group = new Group(); // Grupo para contener las estrellas
    this.loader = new TextureLoader(); // Cargador de texturas

    this.createStarfield(); // Crear el campo de estrellas
  }

  createStarfield() {
    let col;
    const verts = [];
    const colors = [];

    // Generar las estrellas
    for (let i = 0; i < this.numStars; i += 1) {
      const { pos, hue } = this.getRandomSpherePoint(); // Obtener una posición aleatoria en la esfera
      col = new Color().setHSL(hue, 0.2, Math.random());
      verts.push(pos.x, pos.y, pos.z); // Añadir las posiciones de las estrellas
      colors.push(col.r, col.g, col.b); // Añadir los colores de las estrellas
    }

    // Crear la geometría
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(verts, 3));
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));

    // Crear el material de las estrellas
    const mat = new PointsMaterial({
      size: 0.2, // Aumentar el tamaño
      alphaTest: 0.5,
      transparent: true,
      vertexColors: true,
      blending: AdditiveBlending,
      map: this.loader.load('/src/assets/circle.png'), // Asegúrate de que esta ruta es correcta
    });

    // Crear el objeto de puntos y añadirlo al grupo
    const points = new Points(geo, mat);
    this.group.add(points);
  }

  getRandomSpherePoint() {
    const radius = Math.random() * 25 + 25; // Radio aleatorio
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return {
      pos: new Vector3(x, y, z), // Devuelve un Vector3 con las coordenadas
      hue: 0.6,
      minDist: radius,
    };
  }

  getStarfield() {
    return this.group; // Método para obtener el grupo de estrellas
  }
}

export default Starfield;
