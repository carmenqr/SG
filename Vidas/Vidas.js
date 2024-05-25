import * as THREE from 'three';

class Corazon extends THREE.Object3D {
  constructor() {
    super();

    this.corazon = this.createCorazon();
    this.add(this.corazon);
  }

  createCorazon() {
    var heart = new THREE.Object3D();

    // Definir manualmente la geometría del corazón
    var corazonGeometria = new THREE.Shape();
    corazonGeometria.moveTo(0, 0);
    corazonGeometria.bezierCurveTo(2, 2, 2, 5.5, 0, 7.5);
    corazonGeometria.bezierCurveTo(-2, 5.5, -2, 2, 0, 0);

    var extrudeSettings = {
      steps: 2,
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 2
    };

    // Extrusión de la geometría del corazón
    var corazonExtruido = new THREE.ExtrudeGeometry(corazonGeometria, extrudeSettings);

    // Crear el material del corazón
    var material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    // Crear la malla del corazón
    var mesh = new THREE.Mesh(corazonExtruido, material);

    // Añadir la malla del corazón al objeto 3D
    heart.add(mesh);

    // Escalar el corazón para ajustarlo al tamaño deseado
    heart.scale.set(0.1, 0.1, 0.1);

    return heart;
  }

  update() {
    // No hay animación o actualización necesaria para el corazón en este caso
  }
}

class Vidas extends THREE.Object3D {
  constructor() {
    super();

    this.corazones = [];

    // Crear y añadir los corazones de vida
    for (let i = 0; i < 4; i++) {
      let corazon = new Corazon();
      corazon.position.set(i * 0.2, 0, 0); // Espaciar los corazones horizontalmente
      this.corazones.push(corazon);
      this.add(corazon);
    }

    // Posicionar los corazones en la parte superior derecha de la pantalla
    this.position.set(0.5, 0.5, -1); // Ajusta las coordenadas según la escena
  }

  // Función para eliminar un corazón de vida
  perderVida() {
    if (this.corazones.length > 0) {
      let corazonPerdido = this.corazones.pop();
      this.remove(corazonPerdido);
    }
  }

  // Función para añadir un corazón de vida
  ganarVida() {
    if (this.corazones.length < 4) {
      let nuevoCorazon = new Corazon();
      let posicionUltimoCorazon = this.corazones.length > 0 ? this.corazones[this.corazones.length - 1].position.clone() : new THREE.Vector3(0, 0, 0);
      nuevoCorazon.position.copy(posicionUltimoCorazon).add(new THREE.Vector3(0.2, 0, 0)); // Espaciar los corazones horizontalmente
      this.corazones.push(nuevoCorazon);
      this.add(nuevoCorazon);
    }
  }
  update() {
    // No hay animación o actualización necesaria para el corazón en este caso
  }
}

export { Vidas };
