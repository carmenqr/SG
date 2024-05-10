import * as THREE from 'three'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'
import { Escudo } from '../Escudo/Escudo.js'
import { Ovni } from '../Ovni/Ovni.js'
import { Pinchos } from '../Pinchos/Pinchos.js'
import { Moneda } from '../Moneda/Moneda.js'
import { Circuito } from '../Circuito/Circuito.js'
import { Puertas } from '../Puertas/Puertas.js'
import { Corazon } from '../Corazon/Corazon.js'


class Juego extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // const mySceneInstance = new MyScene(); // Crear una instancia de MyScene
    // const camera = mySceneInstance.camera;

    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);
    this.t = 0.1;
    this.angulo = 0;
    this.cambio = true;
    this.objetos = [];


    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshNormalMaterial();
    this.material.flatShading = true;
    this.material.needsUpdate = true;

    this.circuito = new Circuito();
    var variablesTubo = this.circuito.getVariablesTubo();
    //Variables del tubo
    this.path = variablesTubo[0];
    this.tubeRadius = variablesTubo[1];
    this.segments = variablesTubo[2];
    this.tubeGeometry = variablesTubo[3];

    this.puerta1 = new Puertas(); this.objetos.push(this.puerta1);
    this.moneda1 = new Moneda(); this.objetos.push(this.moneda1);
    this.moneda2 = new Moneda(); this.objetos.push(this.moneda2);
    this.moneda3 = new Moneda(); this.objetos.push(this.moneda3);
    this.moneda4 = new Moneda(); this.objetos.push(this.moneda4);
    this.ovni1 = new Ovni();
    this.ovni2 = new Ovni();
    this.escudo1 = new Escudo(); this.objetos.push(this.escudo1);
    this.escudo2 = new Escudo(); this.objetos.push(this.escudo2);
    this.escudo3 = new Escudo(); this.objetos.push(this.escudo3);
    this.pinchos1 = new Pinchos(); this.objetos.push(this.pinchos1);
    this.pinchos2 = new Pinchos(); this.objetos.push(this.pinchos2);
    this.corazon1 = new Corazon();
    this.createCorazon1();

    this.add(this.posicionOrientacionObjeto(this.puerta1, 0 * (Math.PI / 180), 0.25));
    this.add(this.posicionOrientacionObjeto(this.moneda1, 0 * (Math.PI / 180), 0.14));
    this.add(this.posicionOrientacionObjeto(this.moneda2, 170 * (Math.PI / 180), 0.3));
    this.add(this.posicionOrientacionObjeto(this.moneda3, 80 * (Math.PI / 180), 0.44));
    this.add(this.posicionOrientacionObjeto(this.moneda4, 45 * (Math.PI / 180), 0.71));
    this.add(this.posicionOrientacionObjeto(this.escudo1, 0 * (Math.PI / 180), 0.8));
    this.add(this.posicionOrientacionObjeto(this.escudo2, 0 * (Math.PI / 180), 0.35));
    this.add(this.posicionOrientacionObjeto(this.escudo3, 0 * (Math.PI / 180), 0.92));
    this.add(this.posicionOrientacionObjeto(this.pinchos1, 180 * (Math.PI / 180), 0.4));
    this.add(this.posicionOrientacionObjeto(this.pinchos2, 250 * (Math.PI / 180), 0.88));
    this.add(this.posicionOrientacionCoche());


    this.add(this.ovni1);
    this.add(this.ovni2);
    this.add(this.corazon1);

    this.add(this.circuito);

    this.ovni1.animar1();
    this.ovni2.animar2();
    this.puerta1.animar();

    this.onKeyDown = this.onKeyDown.bind(this);
    addEventListener('keydown', this.onKeyDown, false);
    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
    addEventListener('mousedown', this.onDocumentMouseDown, false);
  }

  asignarCamara(camara) {
    this.cameraN = camara;
    this.camera = camara;
  }

  getCamara() {
    return this.camera;
  }

  onKeyDown(event) {
    // Comprueba qué tecla se ha presionado
    switch (event.keyCode) {
      case 37: // Tecla izquierda
        // Ejecuta la función correspondiente
        this.setAnguloCoche(this.angulo -= (5 * (Math.PI / 180)));
        break;
      case 39: // Tecla derecha
        // Ejecuta la función correspondiente
        this.setAnguloCoche(this.angulo += (5 * (Math.PI / 180)));
        break;
      case 32: // Tecla espacio
        this.cambio = !this.cambio;
        console.log("cambio");
        if (this.cambio) this.camera = this.cameraN;
        else this.camera = this.cameraThirdPerson;
        break;
      default:
        // No hacer nada si se presiona otra tecla
        break;
    }
  }

  onDocumentMouseDown(event) {
    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();


    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera); // Raycaster

    var pickedObjects = raycaster.intersectObjects([this.ovni1, this.corazon1], true);

    if (pickedObjects.length > 0) {
      var selectedObject = pickedObjects[0].object;
      this.disparar(selectedObject);
      if (selectedObject == this.ovni1) console.log("Ovni seleccionado");
      else console.log("Corazon seleccionado");
    }

  }

  disparar(objeto) {
    // Obtener la posición actual del coche
    var posicionCoche = this.posOrCoche.getWorldPosition(new THREE.Vector3());

    // Obtener la posición del objeto seleccionado con el ratón
    var posicionObjetoSeleccionado = objeto.getWorldPosition(new THREE.Vector3());;

    // Crear una instancia del objeto 3D con forma de bala
    var bala = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    bala.position.copy(posicionCoche);

    // Añadir la bala a la escena
    this.add(bala);

    // Animar el objeto bala desde la posición del coche hasta la posición del objeto seleccionado
    var velocidad = 0.05; // ajusta la velocidad de la bala según lo necesites
    var direccion = posicionObjetoSeleccionado.clone().sub(posicionCoche).normalize();
    var distancia = posicionCoche.distanceTo(posicionObjetoSeleccionado);

    var duracionAnimacion = distancia / velocidad;

    var tween = new TWEEN.Tween(bala.position)
      .to(posicionObjetoSeleccionado, duracionAnimacion)
      .onComplete(() => {
        // Eliminar la bala de la escena al finalizar la animación
        this.remove(bala);
      })
      .start();
  }

  createCoche() {
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load('../models/coche2/LEGO_CAR_B2.mtl',
      (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load('../models/coche2/LEGO_CAR_B2.obj',
          (object) => {
            object.scale.set(0.01, 0.01, 0.01);
            this.coche = object;

            this.posCoche.add(this.coche);

          }, null, null);
      });
  }

  createCorazon1() {
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
            this.corazon1 = object;
            that.add(object);
            // Llamar a animacionCorazon() después de cargar el modelo
            this.animacionCorazon1();
          }, null, null);
      });
  }

  animacionCorazon1() {
    var pts = [
      new THREE.Vector3(-6, 10, 9),
      new THREE.Vector3(-2, 9, 9),
      //new THREE.Vector3(-7, 4, 19),
      // new THREE.Vector3(-8, 4, 20),
      // new THREE.Vector3(-7, 4, 21),
      // new THREE.Vector3(-5, 4, 19),
      // new THREE.Vector3(-4, 4, 20),
      // new THREE.Vector3(-5, 4, 21)
    ];

    var splineen8 = new THREE.CatmullRomCurve3(pts, true);

    // Se dibuja con esto
    // var resolutionAnillo = 100;
    // var geometryAnillo = new THREE.BufferGeometry().setFromPoints(splineAnillo.getPoints(resolutionAnillo));
    // var materialAnillo = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // var splineMeshAnillo = new THREE.Line(geometryAnillo, materialAnillo);
    // this.add(splineMeshAnillo);

    var segmentos = 100;
    var binormales = splineen8.computeFrenetFrames(segmentos, true).binormals;

    // Parámetros para la animación
    var origen = { t: 0 };
    var destino = { t: 1 };
    var tiempo = 5000;


    // Crear animación con Tween
    var animacion = new TWEEN.Tween(origen).to(destino, tiempo).repeat(Infinity).onUpdate(() => {
      var posicion = splineen8.getPointAt(origen.t);
      this.corazon1.position.copy(posicion);
      var tangente = splineen8.getTangentAt(origen.t);
      posicion.add(tangente);
      this.corazon1.up = binormales[Math.floor(origen.t * segmentos)];
      // this.ovni.lookAt(posicion);

    });

    // Comenzar la animación
    animacion.start();
  }


  setAngulo(valor) {
    this.pIzq.rotation.y = valor;
    this.pDcha.rotation.y = -valor;
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


  setAnguloCoche(valor) {
    this.orCoche.rotation.z = valor;
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

  getPosOrCoche() {
    return this.posOrCoche;
  }

  posicionOrientacionCoche() {
    this.posOrCoche = new THREE.Object3D();

    var orientacion = this.orientacionCoche();

    this.posOrCoche.add(orientacion);
    this.avanzarCoche(this.t);
    return this.posOrCoche;
  }

  orientacionCoche() {
    this.orCoche = new THREE.Object3D();

    var posicion = this.posicionCoche();
    this.orCoche.add(posicion);

    this.setAnguloCoche(this.angulo);

    return this.orCoche;
  }

  getPosCoche() {
    return this.posCoche;
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

    this.createCoche();
    this.posCoche.position.y = this.tubeRadius;

    return this.posCoche;
  }

  posicionOrientacionObjeto(objeto, angulo, punto) {
    this.posOrObjeto = new THREE.Object3D();

    var orientacion = this.orientacionObjeto(objeto, angulo);

    this.posOrObjeto.add(orientacion);
    this.posObjetoTubo(punto);
    return this.posOrObjeto;
  }

  orientacionObjeto(objeto, angulo) {
    this.orObjeto = new THREE.Object3D();

    var posicion = this.posicionObjeto(objeto);
    this.orObjeto.add(posicion);

    this.setAnguloObjeto(angulo);

    return this.orObjeto;
  }

  posicionObjeto(objeto) {
    this.posObjeto = new THREE.Object3D();
    this.posObjeto.add(objeto);
    this.posObjeto.position.y = this.tubeRadius;

    return this.posObjeto;
  }

  // Funcion para detectar las colisiones
  colisiones() {

    for (var i = 0; i < this.posCoche.children.length; i++) {
      var distancia = 0.4;

      this.rayo = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, 1), 0, distancia);

      var tangente = this.path.getTangentAt(this.t);

      this.posCoche.children[i].updateMatrixWorld();
      var origenRayo = new THREE.Vector3();
      origenRayo.setFromMatrixPosition(this.posCoche.children[i].matrixWorld);

      var direccionMirada = this.posOrCoche.getWorldDirection(tangente);

      this.rayo.set(origenRayo, direccionMirada);

      if (this.posCoche.children[i] != this.cameraThirdPerson) {
        /* var rayoVisual = new THREE.ArrowHelper(this.rayo.ray.direction, this.rayo.ray.origin, 0.5, 0xff0000);
        // // Agregar el objeto visual a la escena
        this.add(rayoVisual); */
        var impactos = this.rayo.intersectObjects(this.objetos, true);

        if (impactos.length > 0) {
          console.log("Colisión detectada" + impactos[0].object);
        }
      }

    }
  }

  createGUI(gui, titleGui) {

  }

  update() {
    TWEEN.update();
    this.ovni1.update();
    this.ovni2.update();
    this.moneda1.update();
    this.moneda2.update();
    this.moneda3.update();
    this.moneda4.update();
    this.t = (this.t + 0.0002) % 1;
    this.avanzarCoche(this.t);
    this.setAnguloCoche(this.angulo);
    this.colisiones();
  }
}

export { Juego }
