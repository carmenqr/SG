
import * as THREE from 'three'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'


class Escudo extends THREE.Object3D {
  constructor(variablesTubo) {
    super();

    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    /* this.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); // Rojo
    this.material.flatShading = true;
    this.material.needsUpdate = true; */

    this.loader = new THREE.TextureLoader();
    this.textura = this.loader.load('../imgs/escudo99.png', function (texture) {
      // Ajustar las propiedades de la textura
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(0.5, 0.5); // Repetir una vez en ambas direcciones
      texture.offset.set(0.51, 0.1); // Ajustar el offset para mover la textura
    });

    this.material = new THREE.MeshStandardMaterial({ map: this.textura/* , color: 'yellow' */ });


    this.path = variablesTubo[0];
    this.tubeRadius = variablesTubo[1];
    this.segments = variablesTubo[2];
    this.tubeGeometry = variablesTubo[3];

    this.escudo = this.createEscudo();

    this.add(this.escudo);
  }

  createEscudo() {
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.7, 0.3, 0.65, 1.4);
    shape.quadraticCurveTo(0.2, 1.5, 0, 1.6);
    shape.quadraticCurveTo(-0.2, 1.5, -0.65, 1.4);
    shape.quadraticCurveTo(-0.7, 0.3, 0, 0);

    var options = { depth: 0.5, steps: 2, curveSegments: 10, bevelEnabled: false }; //etc
    var geometry1 = new THREE.ExtrudeGeometry(shape, options);

    var forma = new THREE.Mesh(geometry1, this.material);
    forma.scale.set(0.5, 0.5, 0.5);
    forma.position.y = -0.01;
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


  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Escudo }
