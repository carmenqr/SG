
import * as THREE from 'three'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'


class Escudo extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); // Rojo
    this.material.flatShading = true;
    this.material.needsUpdate = true;


    this.escudo = this.createEscudo();

    this.add(this.escudo);
  }

  createEscudo() {
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.8, 0.3, 0.5, 1.2);
    shape.quadraticCurveTo(0.2, 1, 0, 1.4);
    shape.quadraticCurveTo(-0.2, 1, -0.5, 1.2);
    shape.quadraticCurveTo(-0.8, 0.3, 0, 0);

    var options = { depth: 0.5, steps: 2, curveSegments: 10, bevelEnabled: false }; //etc
    var geometry1 = new THREE.ExtrudeGeometry(shape, options);

    var forma = new THREE.Mesh(geometry1, this.material);
    forma.scale.set(0.5, 0.5, 0.5);
    forma.position.y = -0.01;
    return forma;
  }


  createGUI(gui, titleGui) {

  }


  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Escudo }
