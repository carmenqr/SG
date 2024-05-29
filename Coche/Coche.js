
import * as THREE from 'three'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import * as TWEEN from '../libs/tween.esm.js'


class Coche extends THREE.Object3D {
  constructor(variablesTubo) {
    super();

    this.coche = this.createCoche();
    this.velocidad = 0.0004;
    this.vueltas = 0;

    this.t = 0.1; //0.058
    this.angulo = 0;

    this.path = variablesTubo[0];
    this.tubeRadius = variablesTubo[1];
    this.segments = variablesTubo[2];
    this.tubeGeometry = variablesTubo[3];

    return this.coche;

  }

  createCoche() {
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();

    var that = this;

    materialLoader.load('../models/coche/LEGO_CAR_B2.mtl',
      (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load('../models/coche/LEGO_CAR_B2.obj',
          (object) => {
            object.scale.set(0.01, 0.01, 0.01);
            this.coche = object;
            that.add(object);
          }, null, null);
      });
  }

  avanzarCoche(valor) {
    // asegurarse de que el coche se ha cargado antes de actualizar su posición
    var posTmp = this.path.getPointAt(valor);
    this.posOrCoche.position.copy(posTmp);

    var tangente = this.path.getTangentAt(valor);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(valor * this.segments);
    this.posOrCoche.up = this.tubeGeometry.binormals[segmentoActual];
    this.posOrCoche.lookAt(posTmp);
  }

  posicionOrientacionCoche() {
    this.posOrCoche = new THREE.Object3D();

    var orientacion = this.orientacionCoche();

    this.posOrCoche.add(orientacion);
    this.avanzarCoche(this.t);
    return this.posOrCoche;
  }

  setAnguloCoche(valor) {
    this.orCoche.rotation.z = valor;
  }

  orientacionCoche() {
    this.orCoche = new THREE.Object3D();

    var posicion = this.posicionCoche();
    this.orCoche.add(posicion);

    this.setAnguloCoche(this.angulo);

    return this.orCoche;
  }

  posicionCoche() {
    this.posCoche = new THREE.Object3D();
    //LANZADOR DE RAYOS
    var rayo1 = new THREE.Object3D();
    var rayo2 = new THREE.Object3D();
    var rayo3 = new THREE.Object3D();

    rayo1.position.x = 0.075;
    rayo2.position.x = 0.15;
    rayo3.position.set(0.075, 0.05, 0);

    this.posCoche.add(rayo1);
    this.posCoche.add(rayo2);
    this.posCoche.add(rayo3);
    //FIN RAYOS

    //CAMÁRA 3ª PERSONA
    this.cameraThirdPerson = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Definir posición relativa al coche
    this.cameraThirdPerson.position.set(0.125, 1, -2); // Posición con respecto al coche
    this.cameraThirdPerson.lookAt(0, 0, 1);

    // Agregar la cámara al escenario
    this.posCoche.add(this.cameraThirdPerson);
    //FIN CAMÁRA 3ª PERSONA

    //FOCO AL COCHE

    this.foco = new THREE.SpotLight(0xA200FF);
    this.foco.power = 0;
    this.foco.position.set(0, 2, 0);
    this.foco.angle = Math.PI/6;
    this.foco.penumbra = 1;
    this.foco.target = this.posCoche;
    this.posCoche.add(this.foco);

    this.posCoche.add(this);
    this.posCoche.position.y = this.tubeRadius;

    return this.posCoche;
  }

  getCamara3P() {
    return this.cameraThirdPerson;
  }

  update() {
    TWEEN.update();
    this.t = (this.t + this.velocidad) % 1;
    if (this.t < 0.0005) {
      this.velocidad *= 1.1; // Aumentar la velocidad en un 10%
      this.vueltas += 1;
    }
    this.avanzarCoche(this.t);
    this.setAnguloCoche(this.angulo);
  }
}

export { Coche }
