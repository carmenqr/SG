
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class Pinchos extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); // Rojo
    this.material.flatShading = true;
    this.material.needsUpdate = true;


    this.pinchos = this.createForma();

    this.add(this.pinchos);
  }

  createForma() {

    var shape = new THREE.Shape();
    shape.moveTo(-1, 0);
    shape.quadraticCurveTo(0, 1.5, 1, 0);
    shape.lineTo(1, 1.1);
    shape.lineTo(0.85, 0.8);
    shape.lineTo(0.7, 1.1);
    shape.lineTo(0.55, 0.8);
    shape.lineTo(0.4, 1.1);
    shape.lineTo(0.25, 0.8);
    shape.lineTo(0.15, 1.1);
    shape.lineTo(0, 0.8);
    shape.lineTo(-0.15, 1.1);
    shape.lineTo(-0.25, 0.8);
    shape.lineTo(-0.4, 1.1);
    shape.lineTo(-0.55, 0.8);
    shape.lineTo(-0.7, 1.1);
    shape.lineTo(-0.85, 0.8);
    shape.lineTo(-1, 1.1);


    var options = { depth: 0.5, steps: 2, curveSegments: 10, bevelEnabled: false }; //etc
    var geometry1 = new THREE.ExtrudeGeometry(shape, options);

    var forma = new THREE.Mesh(geometry1, this.material);
    forma.position.y = -0.8;
    //forma.scale();
    return forma;

  }


  createGUI(gui, titleGui) {

  }


  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Pinchos }