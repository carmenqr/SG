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
  constructor(gui, titleGui) {
    super();

    //Inicialización de variables
    this.createGUI(gui, titleGui);
    this.t = 0.1;
    this.angulo = 0;
    this.cambio = true;
    this.objetos = [];


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
    this.puerta1 = new Puertas(variablesTubo); this.objetos.push(this.puerta1);
    this.moneda1 = new Moneda(variablesTubo); this.objetos.push(this.moneda1);
    this.moneda2 = new Moneda(variablesTubo); this.objetos.push(this.moneda2);
    this.moneda3 = new Moneda(variablesTubo); this.objetos.push(this.moneda3);
    this.moneda4 = new Moneda(variablesTubo); this.objetos.push(this.moneda4);
    this.ovni1 = new Ovni();
    this.ovni2 = new Ovni();
    this.escudo1 = new Escudo(variablesTubo); this.objetos.push(this.escudo1);
    this.escudo2 = new Escudo(variablesTubo); this.objetos.push(this.escudo2);
    this.escudo3 = new Escudo(variablesTubo); this.objetos.push(this.escudo3);
    this.pinchos1 = new Pinchos(variablesTubo); this.objetos.push(this.pinchos1);
    this.pinchos2 = new Pinchos(variablesTubo); this.objetos.push(this.pinchos2);
    this.corazon1 = new Corazon();
    this.corazon2 = new Corazon();
    this.coche = new Coche(variablesTubo);

    //Añadir los objetos al circuito (a la escena)
    this.add(this.puerta1.posicionOrientacionObjeto( 0 * (Math.PI / 180), 0.25));
    this.add(this.moneda1.posicionOrientacionObjeto( 0 * (Math.PI / 180), 0.14));
    this.add(this.moneda2.posicionOrientacionObjeto( 170 * (Math.PI / 180), 0.3));
    this.add(this.moneda3.posicionOrientacionObjeto( 80 * (Math.PI / 180), 0.44));
    this.add(this.moneda4.posicionOrientacionObjeto( 45 * (Math.PI / 180), 0.71));
    this.add(this.escudo1.posicionOrientacionObjeto(0 * (Math.PI / 180), 0.8));
    this.add(this.escudo2.posicionOrientacionObjeto(0 * (Math.PI / 180), 0.35));
    this.add(this.escudo3.posicionOrientacionObjeto(0 * (Math.PI / 180), 0.92));
    this.add(this.pinchos1.posicionOrientacionObjeto(180 * (Math.PI / 180), 0.4));
    this.add(this.pinchos2.posicionOrientacionObjeto(250 * (Math.PI / 180), 0.88));

    this.add(this.coche.posicionOrientacionCoche());//AÑADIR A LA ESCENA EL COCHE

    this.add(this.ovni1);
    this.add(this.ovni2);
    this.add(this.corazon1);
    this.add(this.corazon2);

    this.add(this.circuito);

    //Funciones específicas de los objetos
    this.ovni1.animar1();
    this.ovni2.animar2();
    this.puerta1.animar();
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
      case 65: // Tecla izquierda
        // Ejecuta la función correspondiente
        this.coche.setAnguloCoche(this.coche.angulo -= (5 * (Math.PI / 180)));
        break;
      case 68: // Tecla derecha
        // Ejecuta la función correspondiente
        this.coche.setAnguloCoche(this.coche.angulo += (5 * (Math.PI / 180)));
        break;
      case 32: // Tecla espacio
        this.cambio = !this.cambio;
        console.log("cambio");
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

    var pickedObjects = raycaster.intersectObjects([this.ovni1, this.corazon1, this.corazon2], true);

    if (pickedObjects.length > 0) {
      var selectedObject = pickedObjects[0].object;
      this.disparar(selectedObject);
      if (selectedObject == this.ovni1) console.log("Ovni seleccionado");
      else console.log("Corazon seleccionado");
    }

  }

  //función para disparar a los objetos voladores
  disparar(objeto) {
    // Obtener la posición actual del coche
    var posicionCoche = this.coche.posOrCoche.getWorldPosition(new THREE.Vector3());

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
    this.coche.update();
    this.colisiones();
  }
}

export { Juego }
