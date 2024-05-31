import * as THREE from 'three'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import * as TWEEN from '../libs/tween.esm.js'

class Corazon extends THREE.Object3D {
  constructor() {
    super();

    this.corazon = this.createCorazon();

    return this.corazon;

  }

  createCorazon() {
    // Corazon
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();

    var that = this;

    materialLoader.load('../models/corazon/12190_Heart_v1_L3.mtl',
      (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load('../models/corazon/12190_Heart_v1_L3.obj',
          (object) => {
            object.scale.set(0.025, 0.025, 0.025);
            object.rotateX(-90 * (Math.PI / 180));
            this.corazon = object;
            that.add(object);
            // Llamar a animacionCorazon() después de cargar el modelo
          }, null, null);
      });
  }

  seleccionado(juego, objeto){
    juego.vidas += 1;
    setTimeout(() => {
      juego.remove(objeto);
    }, 400);

    setTimeout(() => {
      juego.add(objeto);
    }, 10000);
  }

  animar1() {
    var pts = [
      new THREE.Vector3(-6, 4, 20),
      new THREE.Vector3(-7, 4, 19),
      new THREE.Vector3(-8, 4, 20),
      new THREE.Vector3(-7, 4, 21),
      new THREE.Vector3(-5, 4, 19),
      new THREE.Vector3(-4, 4, 20),
      new THREE.Vector3(-5, 4, 21)
    ];

    var splineen8 = new THREE.CatmullRomCurve3(pts, true);

    var segmentos = 100;
    var binormales = splineen8.computeFrenetFrames(segmentos, true).binormals;

    // Parámetros para la animación
    var origen = { t: 0 };
    var destino = { t: 1 };
    var tiempo = 10000;


    // Crear animación con Tween
    var animacion = new TWEEN.Tween(origen).to(destino, tiempo).repeat(Infinity).onUpdate(() => {
      var posicion = splineen8.getPointAt(origen.t);
      this.position.copy(posicion);
      var tangente = splineen8.getTangentAt(origen.t);
      posicion.add(tangente);
      this.up = binormales[Math.floor(origen.t * segmentos)];
      // this.ovni.lookAt(posicion);

    });

    // Comenzar la animación
    animacion.start();
  }
  
  animar2() {
    var pts = [
      new THREE.Vector3(-6, 10, 9),
      new THREE.Vector3(-2, 9, 9),
    ];

    var splineen8 = new THREE.CatmullRomCurve3(pts, true);

    var segmentos = 100;
    var binormales = splineen8.computeFrenetFrames(segmentos, true).binormals;

    // Parámetros para la animación
    var origen = { t: 0 };
    var destino = { t: 1 };
    var tiempo = 5000;


    // Crear animación con Tween
    var animacion = new TWEEN.Tween(origen).to(destino, tiempo).repeat(Infinity).onUpdate(() => {
      var posicion = splineen8.getPointAt(origen.t);
      this.position.copy(posicion);
      var tangente = splineen8.getTangentAt(origen.t);
      posicion.add(tangente);
      this.up = binormales[Math.floor(origen.t * segmentos)];
      // this.ovni.lookAt(posicion);

    });

    // Comenzar la animación
    animacion.start();
  }

  
  update () {

    this.rotateY(0.05);
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Corazon }


