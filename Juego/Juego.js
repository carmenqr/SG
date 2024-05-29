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
import { Coche } from '../Coche/Coche.js'


class Juego extends THREE.Object3D {
  constructor() {
    super();

    //Inicialización de variables
    this.t = 0.05;
    this.angulo = 0;
    this.cambio = true;
    this.objetos = [];
    this.objetosConColision = new Set();
    this.monedas = 0;
    this.inmune = false;
    this.vidas = 4;
    this.distanciaRecorrida = 0;


    // Creación del material
    this.material = new THREE.MeshNormalMaterial();
    this.material.flatShading = true;
    this.material.needsUpdate = true;

    //Creación del circuito y recogida de sus variables
    this.circuito = new Circuito();
    var variablesTubo = this.circuito.getVariablesTubo();
    //Variables del tubo
    this.path = variablesTubo[0];
    this.tubeRadius = variablesTubo[1];
    this.segments = variablesTubo[2];
    this.tubeGeometry = variablesTubo[3];


    //Creación de objetos
    this.puerta1 = new Puertas(variablesTubo); this.objetos.push(this.puerta1); this.puerta1.userData = { nombre: "Puerta" };
    this.puerta2 = new Puertas(variablesTubo); this.objetos.push(this.puerta2); this.puerta2.userData = { nombre: "Puerta" };
    this.puerta3 = new Puertas(variablesTubo); this.objetos.push(this.puerta3); this.puerta3.userData = { nombre: "Puerta" };
    this.moneda1 = new Moneda(variablesTubo); this.objetos.push(this.moneda1); this.moneda1.userData = { nombre: "Moneda" };
    this.moneda2 = new Moneda(variablesTubo); this.objetos.push(this.moneda2); this.moneda2.userData = { nombre: "Moneda" };
    this.moneda3 = new Moneda(variablesTubo); this.objetos.push(this.moneda3); this.moneda3.userData = { nombre: "Moneda" };
    this.moneda4 = new Moneda(variablesTubo); this.objetos.push(this.moneda4); this.moneda4.userData = { nombre: "Moneda" };
    this.ovni1 = new Ovni(); this.objetos.push(this.ovni1.proyectil); this.ovni1.proyectil.userData = { nombre: "Proyectil" }; this.ovni1.userData = { nombre: "Ovni" };
    this.ovni2 = new Ovni(); this.objetos.push(this.ovni2.proyectil2); this.ovni2.proyectil2.userData = { nombre: "Proyectil" }; this.ovni2.userData = { nombre: "Ovni" };
    this.escudo1 = new Escudo(variablesTubo); this.objetos.push(this.escudo1); this.escudo1.userData = { nombre: "Escudo" };
    this.escudo2 = new Escudo(variablesTubo); this.objetos.push(this.escudo2); this.escudo2.userData = { nombre: "Escudo" };
    this.escudo3 = new Escudo(variablesTubo); this.objetos.push(this.escudo3); this.escudo3.userData = { nombre: "Escudo" };
    this.pinchos1 = new Pinchos(variablesTubo); this.objetos.push(this.pinchos1); this.pinchos1.userData = { nombre: "Pinchos" };
    this.pinchos2 = new Pinchos(variablesTubo); this.objetos.push(this.pinchos2); this.pinchos2.userData = { nombre: "Pinchos" };
    this.pinchos3 = new Pinchos(variablesTubo); this.objetos.push(this.pinchos3); this.pinchos3.userData = { nombre: "Pinchos" };
    this.pinchos4 = new Pinchos(variablesTubo); this.objetos.push(this.pinchos4); this.pinchos4.userData = { nombre: "Pinchos" };
    this.pinchos5 = new Pinchos(variablesTubo); this.objetos.push(this.pinchos5); this.pinchos5.userData = { nombre: "Pinchos" };
    this.corazon1 = new Corazon(); this.corazon1.userData = { nombre: "Corazon" };
    this.corazon2 = new Corazon(); this.corazon2.userData = { nombre: "Corazon" };
    this.coche = new Coche(variablesTubo);



    // Inicializa la distancia recorrida por el coche
   

    //Añadir los objetos al circuito (a la escena)
    this.add(this.puerta1.posicionOrientacionObjeto(270 * (Math.PI / 180), 0.16));
    this.add(this.puerta2.posicionOrientacionObjeto(270 * (Math.PI / 180), 0.45));
    this.add(this.puerta3.posicionOrientacionObjeto(180 * (Math.PI / 180), 0));
    this.add(this.moneda1.posicionOrientacionObjeto(4 * (Math.PI / 180), 0.14));
    this.add(this.moneda2.posicionOrientacionObjeto(170 * (Math.PI / 180), 0.3));
    this.add(this.moneda3.posicionOrientacionObjeto(80 * (Math.PI / 180), 0.44));
    this.add(this.moneda4.posicionOrientacionObjeto(45 * (Math.PI / 180), 0.71));
    this.add(this.escudo1.posicionOrientacionObjeto(123 * (Math.PI / 180), 0.8));
    this.add(this.escudo2.posicionOrientacionObjeto(30 * (Math.PI / 180), 0.38));
    /* this.add(this.escudo3.posicionOrientacionObjeto(0 * (Math.PI / 180), 0.92)); */
    this.add(this.pinchos1.posicionOrientacionObjeto(180 * (Math.PI / 180), 0.2));
    this.add(this.pinchos2.posicionOrientacionObjeto(0 * (Math.PI / 180), 0.88));
    this.add(this.pinchos3.posicionOrientacionObjeto(10 * (Math.PI / 180), 0.61));
    this.add(this.pinchos4.posicionOrientacionObjeto(111 * (Math.PI / 180), 0.09));
    this.add(this.pinchos5.posicionOrientacionObjeto(0 * (Math.PI / 180), 0.09));

    this.add(this.coche.posicionOrientacionCoche());//AÑADIR A LA ESCENA EL COCHE

    this.add(this.ovni1);
    this.add(this.ovni2);
    this.add(this.corazon1);
    this.add(this.corazon2);

    this.add(this.circuito);

    //Funciones específicas de los objetos
    this.ovni1.animar1();
    this.ovni2.animar2();
    this.corazon1.animar1();
    this.corazon2.animar2();

    //Gestión de eventos de reatón y teclado
    this.onKeyDown = this.onKeyDown.bind(this);
    addEventListener('keydown', this.onKeyDown, false);

    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
    addEventListener('mousedown', this.onDocumentMouseDown, false);
  }

  //Cambio de cámaras
  asignarCamara(camara) {
    this.cameraN = camara;
    this.camera = camara;
  }

  //Decuelve la cámara activa
  getCamara() {
    return this.camera;
  }

  //Pulsaciones de teclado
  onKeyDown(event) {
    // Comprueba qué tecla se ha presionado
    switch (event.keyCode) {
      case 37:
      case 65: // Tecla izquierda
        // Ejecuta la función correspondiente
        this.coche.setAnguloCoche(this.coche.angulo -= (5 * (Math.PI / 180)));
        break;
      case 39:
      case 68: // Tecla derecha
        // Ejecuta la función correspondiente
        this.coche.setAnguloCoche(this.coche.angulo += (5 * (Math.PI / 180)));
        break;
      case 32: // Tecla espacio
        this.cambio = !this.cambio;
        if (this.cambio) this.camera = this.cameraN;
        else this.camera = this.coche.getCamara3P();
        break;
      default:
        // No hacer nada si se presiona otra tecla
        break;
    }
  }

  //Pulsaciones de ratón
  onDocumentMouseDown(event) {
    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();


    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera); // Raycaster

    var pickedObjects = raycaster.intersectObjects([this.ovni1, this.corazon1, this.corazon2, this.ovni2], true);

    if (pickedObjects.length > 0) {
      var selectedObject = pickedObjects[0].object;
      this.disparar(selectedObject);
    }

    if (pickedObjects.length > 0) {
      let object = pickedObjects[0].object;
      var selectedObject = pickedObjects[0].object;
      while (object.parent && object.parent.parent && !(object instanceof Corazon || object instanceof Ovni)) {
        object = object.parent;
      }
      const originalObject = object;
      originalObject.seleccionado(this, originalObject);
      console.log(originalObject.userData.nombre);
      this.disparar(selectedObject);
    }

  }

  //función para disparar a los objetos voladores
  disparar(objeto) {
    // Obtener la posición actual del coche
    var posicionCoche = this.coche.posOrCoche.getWorldPosition(new THREE.Vector3());

    // Obtener la posición del objeto seleccionado con el ratón
    var posicionObjetoSeleccionado = objeto.getWorldPosition(new THREE.Vector3());;

    // Crear una instancia del objeto 3D con forma de bala
    var bala = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    bala.position.copy(posicionCoche);

    // Añadir la bala a la escena
    this.add(bala);

    // Animar el objeto bala desde la posición del coche hasta la posición del objeto seleccionado
    var velocidad = 0.05; // ajusta la velocidad de la bala según lo necesites
    //var direccion = posicionObjetoSeleccionado.clone().sub(posicionCoche).normalize();
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

  posAleatoria() {
    return Math.random();
  }

  // Función para generar un número aleatorio entre 0 y 360
  angAleatorio() {
    return Math.random() * 360;
  }

  getObject(Object3D) {
    return Object3D;
  }

  // Funcion para detectar las colisiones
  colisiones() {

    for (var i = 0; i < this.coche.posCoche.children.length; i++) {
      var distancia = 0.4;

      this.rayo = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, 1), 0, distancia);

      var tangente = this.path.getTangentAt(this.t);

      this.coche.posCoche.children[i].updateMatrixWorld();
      var origenRayo = new THREE.Vector3();
      origenRayo.setFromMatrixPosition(this.coche.posCoche.children[i].matrixWorld);

      var direccionMirada = this.coche.posOrCoche.getWorldDirection(tangente);

      this.rayo.set(origenRayo, direccionMirada);

      if (this.coche.posCoche.children[i] != this.cameraThirdPerson) {
        /* var rayoVisual = new THREE.ArrowHelper(this.rayo.ray.direction, this.rayo.ray.origin, 0.5, 0xff0000);
        // // Agregar el objeto visual a la escena
        this.add(rayoVisual); */
        this.impactos = this.rayo.intersectObjects(this.objetos, true);

        //console.log(this.objetos[1].userData.nombre);

        if (this.impactos.length > 0) {
          let object = this.impactos[0].object;
          while (object.parent && object.parent.parent && !(object instanceof Ovni || object instanceof Moneda || object instanceof Pinchos || object instanceof Escudo || object instanceof Puertas)) {
            object = object.parent;
          }
          const originalObject = object;

          if (!this.objetosConColision.has(originalObject)) { // Verificar si el objeto ya ha sido colisionado
            console.log(originalObject.userData.nombre);
            originalObject.colision(this, originalObject);
            this.objetosConColision.add(originalObject); // Agregar el objeto al conjunto de objetos colisionados
          }
        }

        /* if (this.impactos.length > 0) {
          let object = this.impactos[0].object;
          while (object.parent && object.parent.parent && !(object instanceof Moneda || object instanceof Pinchos || object instanceof Escudo || object instanceof Puertas)) object = object.parent;
          const originalObject = object;
          console.log(originalObject.userData.nombre);
          originalObject.colision(this);
        } */
      }

    }
  }

  actualizarDistanciaRecorrida() {
    // Actualiza la distancia recorrida en función de la posición actual del coche (t)
    this.distanciaRecorrida += this.coche.t;
  }

  update() {
    TWEEN.update();
    this.ovni1.update();
    this.ovni2.update();
    this.moneda1.update();
    this.moneda2.update();
    this.moneda3.update();
    this.moneda4.update();
    this.corazon1.update();
    this.corazon2.update();
    this.coche.update();
    /* if (this.coche.t < 0.0005) {
      this.objetosConColision = new Set();
    } */
    this.colisiones();
    this.actualizarDistanciaRecorrida();
  }
}

export { Juego }
