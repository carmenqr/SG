
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class Pinchos extends THREE.Object3D {
  constructor(variablesTubo) {
    super();

    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    // this.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); // Rojo
    // this.material.flatShading = true;
    // this.material.needsUpdate = true;

    this.material = new THREE.MeshStandardMaterial({ color: 0xABAFAC }); // Rojo
    this.material.roughness = 0.2;
    this.material.metalness = 0;

    this.path = variablesTubo[0];
    this.tubeRadius = variablesTubo[1];
    this.segments = variablesTubo[2];
    this.tubeGeometry = variablesTubo[3];


    this.pinchos = this.createPinchos();

    this.add(this.pinchos);
  }

  createPinchos() {
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

  setAnguloObjeto(valor) {
    this.orObjeto.rotation.z = valor;
  }

  posObjetoTubo(valor) {
    var posTmp = this.path.getPointAt(valor);
    this.posOrObjeto.position.copy(posTmp);

    var tangente = this.path.getTangentAt(valor);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(valor * this.segments);
    this.posOrObjeto.up = this.tubeGeometry.binormals[segmentoActual];
    this.posOrObjeto.lookAt(posTmp);
  }

  posicionOrientacionObjeto(angulo, punto) {
    this.posOrObjeto = new THREE.Object3D();

    var orientacion = this.orientacionObjeto(angulo);

    this.posOrObjeto.add(orientacion);
    this.posObjetoTubo(punto);
    return this.posOrObjeto;
  }

  orientacionObjeto(angulo) {
    this.orObjeto = new THREE.Object3D();

    var posicion = this.posicionObjeto();
    this.orObjeto.add(posicion);

    this.setAnguloObjeto(angulo);

    return this.orObjeto;
  }

  posicionObjeto() {
    this.posObjeto = new THREE.Object3D();
    this.posObjeto.add(this);
    this.posObjeto.position.y = this.tubeRadius;

    return this.posObjeto;
  }

  colision(juego) {
    if (!juego.inmune) {
      juego.vidas -= 1;
      juego.coche.velocidad *= 1.1;
      console.log("Choque con pinchos, -1 vida y + velocidad");
    }
  }

  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Pinchos }