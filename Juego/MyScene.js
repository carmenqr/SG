// Clases de la biblioteca
// import * as THREE from "three"

import * as THREE from '../libs/three.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'

// Clases de mi proyecto

import { Juego } from './Juego.js'

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

export class MyScene extends THREE.Scene {
  // Recibe el  div  que se ha creado en el  html  que va a ser el lienzo en el que mostrar
  // la visualización de la escena
  constructor(myCanvas) {
    super();

    this.juegoIniciado = false;

    this.cambio = true;

    this.renderer = this.createRenderer(myCanvas);

    this.createLights();

    this.model = new Juego();

    this.createCamera();

    this.model.asignarCamara(this.camera);

    //this.axis = new THREE.AxesHelper(10);
    //this.add(this.axis);

    this.add(this.model);

    this.asignarFondo();

    this.onKeyDown = this.onKeyDown.bind(this);
    addEventListener('keydown', this.onKeyDown, false);
  }

  asignarFondo() {
    // Ruta del video
    var videoPath = "../imgs/cielo.mp4";

    // Crear elemento de video
    var video = document.createElement('video');
    video.src = videoPath;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true; // Importante para evitar problemas con autoplay en algunos navegadores
    video.autoplay = true; // Autoreproducción
    video.play();

    // Crear textura de video
    var videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat; // Cambiado a RGBAFormat

    // Asignar textura de video como fondo
    this.background = videoTexture;
  }

  onKeyDown(event) {
    // Comprueba qué tecla se ha presionado
    switch (event.keyCode) {
      case 13: // Tecla Enter
        this.iniciarJuego();
        break;
      case 70: // Tecla F
        this.acabarJuego();
        break;
      default:
        // No hacer nada si se presiona otra tecla
        break;
    }
  }

  // Agrega una función para iniciar el juego
  iniciarJuego() {
    // Si el juego ya ha sido iniciado, no hagas nada
    if (this.juegoIniciado) return;

    // Oculta la pantalla de inicio (puedes implementar esta función según tu estructura HTML)
    this.ocultarPantallaDeInicio();

    // Establece el estado del juego como iniciado
    this.juegoIniciado = true;

    // Comienza la actualización de la escena
    this.update();
  }

  acabarJuego() {
    // Calcular la puntuación final
    const puntuacionFinal = this.model.distanciaRecorrida + (this.model.monedas * 50) + (this.model.ovnis * 100);

    // Actualizar el contenido del overlay de fin
    const finOverlay = document.getElementById('fin-overlay');
    finOverlay.innerHTML = `
        <p>¡Gracias por jugar!</p>
        <h1>Fin del Juego</h1>
        <p>Puntuación Final: ${puntuacionFinal.toFixed(2)}</p>
        <button onclick="location.reload()">Reiniciar</button>
    `;

    // Mostrar la pantalla de fin
    finOverlay.style.display = 'flex';

    // Establecer el estado del juego como no iniciado
    this.juegoIniciado = false;
  }


  ocultarPantallaDeInicio() {
    document.getElementById('inicio-overlay').style.display = 'none';
  }

  createCamera() {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión vértical en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set(0.8, 0.05, 40);
    // Y hacia dónde mira
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);

    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);

    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
  }

  createLights() {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    this.ambientLight = new THREE.AmbientLight('white', 0.35);
    // La añadimos a la escena
    this.add(this.ambientLight);

    //0x00aae4
    this.luzPuntual = new THREE.PointLight(0x00d1d2);
    this.luzPuntual.power = 1000;
    this.luzPuntual.position.set(0, 0, -2);
    this.add(this.luzPuntual);

    this.luzPuntual2 = new THREE.PointLight('blue');
    this.luzPuntual2.power = 2000;
    this.luzPuntual2.position.set(0, 3, 15);
    this.add(this.luzPuntual2);

    this.luzPuntual3 = new THREE.PointLight('purple');
    this.luzPuntual3.power = 1000;
    this.luzPuntual3.position.set(-10, 6, 10);
    this.add(this.luzPuntual3);

    this.luzPuntual4 = new THREE.PointLight('red');
    this.luzPuntual4.power = 1000;
    this.luzPuntual4.position.set(0, -6, 6);
    this.add(this.luzPuntual4);

    this.luzPuntual5 = new THREE.PointLight(0x33ff71);
    this.luzPuntual5.power = 1000;
    this.luzPuntual5.position.set(0, 12, 4);
    this.add(this.luzPuntual5);

    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.pointLight = new THREE.SpotLight(0xffffff);
    this.pointLight.power = 1000;
    this.pointLight.position.set(5, 2, 30);
    this.pointLight.target.position.set(0, 0, 0);

    this.add(this.pointLight);

    this.pointLight2 = new THREE.SpotLight(0xffffff);
    this.pointLight2.power = 250;
    this.pointLight2.position.set(0, 8, -15);
    this.pointLight2.target.position.set(0, 0, 0);
    this.add(this.pointLight2);

    this.pointLight3 = new THREE.SpotLight(0xffffff);
    this.pointLight3.power = 1000;
    this.pointLight3.position.set(-25, 3, 5);
    this.pointLight3.target.position.set(0, 0, 0);
    this.add(this.pointLight3);
  }

  setLightPower(valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity(valor) {
    this.ambientLight.intensity = valor;
  }

  setAxisVisible(valor) {
    this.axis.visible = valor;
  }

  createRenderer(myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();

    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);

    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  getCamera() {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }

  setCameraAspect(ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect(window.innerWidth / window.innerHeight);

    // Y también el tamaño del renderizador
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  actualizarCorazones() {
    const corazonesContainer = document.getElementById('corazones-container');
    corazonesContainer.innerHTML = ''; // Limpiar los corazones existentes

    // Crear un corazón HTML para cada vida en el juego
    for (let i = 0; i < this.model.vidas; i++) {
      const corazon = document.createElement('span');
      corazon.innerHTML = '❤️'; // Emoji de corazón
      corazon.classList.add('corazon'); // Clase para estilos adicionales si es necesario
      corazonesContainer.appendChild(corazon);
    }
  }

  actualizarDistancia() {
    const distanciaContainer = document.getElementById('distancia');
    const velocidadContainer = document.getElementById('velocidad');
    const monedasContainer = document.getElementById('monedas');
    const ovnisContainer = document.getElementById('ovnis');
    const inmuneContainer = document.getElementById('inmunidad');

    distanciaContainer.textContent = 'Distancia: ' + this.model.distanciaRecorrida.toFixed(2);
    var velocidad = this.model.coche.velocidad * 10000;
    velocidadContainer.textContent = 'Velocidad: ' + velocidad.toFixed(1);
    monedasContainer.textContent = 'Monedas: ' + this.model.monedas;
    ovnisContainer.textContent = 'Ovnis destruidos: ' + this.model.ovnis;
    if (this.model.inmune) inmuneContainer.textContent = 'Inmunidad: Activada';
    else inmuneContainer.textContent = 'Inmunidad: Desactivada';

  }

  // Modifica el método update para que solo actualice la escena cuando el juego esté iniciado
  update() {
    // Verifica si el juego está iniciado antes de actualizar la escena
    if (this.juegoIniciado) {
      // Verifica si el juego ha terminado
      if (this.model.vidas <= 0) {
        this.acabarJuego();
        return;
      }

      // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
      this.renderer.render(this, this.model.getCamara());

      // Se actualiza la posición de la cámara según su controlador
      this.cameraControl.update();

      // Se actualiza el resto del modelo
      this.model.update();

      this.actualizarCorazones();
      this.actualizarDistancia();

      // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
      // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
      // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
      requestAnimationFrame(() => this.update());
    }
  }
}

/// La función   main
$(function () {
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener("resize", () => scene.onWindowResize());

  // Que no se nos olvide, la primera visualización.
  scene.update();
});
