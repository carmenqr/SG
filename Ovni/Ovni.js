import * as THREE from 'three'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import * as TWEEN from '../libs/tween.esm.js'

class Ovni extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    /* this.loader1 = new THREE.TextureLoader();
    this.textura1 = this.loader1.load("../imgs/cristal.jpeg", function (texture) {
      // Ajustar las propiedades de la textura para que no se repita
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(1, 1);
    }); */
    this.material1 = new THREE.MeshStandardMaterial({ color: 0xFB60FD });
    this.material1.bumpMap = new THREE.TextureLoader().load('../imgs/roto.jpeg');
    this.material1.roughness = 0.2;
    this.material1.metalness = 0;

    this.loader2 = new THREE.TextureLoader();
    this.textura2 = this.loader2.load("../imgs/metal.jpg");
    this.material2 = new THREE.MeshStandardMaterial({ map: this.textura2, color: 0x13BC2F });
    this.material2.roughness = 0.5;
    this.material2.metalness = 0.5;

    this.loader3 = new THREE.TextureLoader();
    this.textura3 = this.loader3.load("../imgs/ovnialiens.jpg");
    this.material3 = new THREE.MeshStandardMaterial({ map: this.textura3, color: 0x8EFF61 });

    this.ovni = this.createOvni();
    //this.ovni.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);

    this.add(this.ovni);
  }

  createOvni() {
    var points = [];
    points.push(new THREE.Vector2(0.001, -0.5)); // Punto en el plano XY con curvatura
    points.push(new THREE.Vector2(0.8, -0.4)); // Punto en el eje X
    points.push(new THREE.Vector2(1.0, -0.2)); // Punto en el eje X
    points.push(new THREE.Vector2(1.5, -0.1)); // Punto en el plano XY
    points.push(new THREE.Vector2(1.5, 0.1)); // Punto en el plano XY
    points.push(new THREE.Vector2(1.0, 0.2)); // Punto en el eje X
    points.push(new THREE.Vector2(0.8, 0.4)); // Punto en el eje X
    points.push(new THREE.Vector2(0.001, 0.5)); // Punto base


    this.shape = new THREE.Shape(points);
    this.phiLength = 0;

    var platillo = new THREE.Mesh(new THREE.LatheGeometry(this.shape.getPoints(), 15, this.phiLength, 2 * Math.PI + 0.1), this.material2);

    var formaEsfera = new THREE.SphereGeometry(0.5, 10, 10);
    formaEsfera.translate(0, -0.4, 0);
    var esfera = new THREE.Mesh(formaEsfera, this.material1);

    // Crear un grupo y añadir el platillo y la esfera al grupo
    var ovniGroup = new THREE.Group();
    ovniGroup.add(platillo);
    ovniGroup.add(esfera);
    ovniGroup.scale.set(0.3, 0.3, 0.3);

    this.material4 = new THREE.MeshStandardMaterial({
      emissive: 0x36FF00, // Color de la emisividad (verde)
      emissiveIntensity: 1 // Intensidad de la emisividad (muy alta)
    });

    this.proyectil = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), this.material4);
    this.proyectil2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), this.material4);

    // ovniGroup.position.set(-2, 13, -5);
    return ovniGroup;
  }

  seleccionado(juego, objeto) {

    setTimeout(() => {
      juego.remove(objeto);
    }, 400);
  }

  lanzarProyectil1() {
    // Definir la trayectoria del proyectil
    var puntosTrayectoria = [];
    puntosTrayectoria.push(new THREE.Vector3(0, 0, 0)); // Punto inicial
    puntosTrayectoria.push(new THREE.Vector3(0, 14, 0)); // Punto final

    var trayectoria = new THREE.CatmullRomCurve3(puntosTrayectoria);

    var segmentos = 100;
    var binormales = trayectoria.computeFrenetFrames(segmentos, true).binormals;

    // Crear animación con Tween para mover el proyectil
    var origen = { t: 0 };
    var destino = { t: 1 };
    var tiempo = 900; // Duración de la animación en milisegundos

    var animacion = new TWEEN.Tween(origen).to(destino, tiempo).repeat(Infinity).onUpdate(() => {
      var posicion = trayectoria.getPointAt(origen.t);
      this.proyectil.position.copy(posicion);
      var tangente = trayectoria.getTangentAt(origen.t);
      posicion.add(tangente);
      this.proyectil.up = binormales[Math.floor(origen.t * segmentos)];
      this.proyectil.lookAt(posicion);

    });

    animacion.start();

    return this.proyectil;
  }

  lanzarProyectil2() {
    // Definir la trayectoria del proyectil
    var puntosTrayectoria = [];
    puntosTrayectoria.push(new THREE.Vector3(0, 1, 0)); // Punto inicial
    puntosTrayectoria.push(new THREE.Vector3(0, 10, 0)); // Punto final

    var trayectoria = new THREE.CatmullRomCurve3(puntosTrayectoria);

    var segmentos = 100;
    var binormales = trayectoria.computeFrenetFrames(segmentos, true).binormals;

    // Crear animación con Tween para mover el proyectil
    var origen = { t: 0 };
    var destino = { t: 1 };
    var tiempo = 900; // Duración de la animación en milisegundos

    var animacion = new TWEEN.Tween(origen).to(destino, tiempo).repeat(Infinity).onUpdate(() => {
      var posicion = trayectoria.getPointAt(origen.t);
      this.proyectil2.position.copy(posicion);
      var tangente = trayectoria.getTangentAt(origen.t);
      posicion.add(tangente);
      this.proyectil2.up = binormales[Math.floor(origen.t * segmentos)];
      this.proyectil2.lookAt(posicion);

    });

    animacion.start();

    return this.proyectil2;
  }

  animar1() {
    // Punto 7
    var punto = new THREE.Vector3(1, -2, 10);

    this.ovni.add(this.lanzarProyectil1());

    // Radio del anillo
    var radioAnillo = 4;

    // Crear puntos para el spline del anillo
    var puntosAnillo = [];
    for (var i = 0; i < Math.PI * 2; i += 0.1) {
      var x = punto.x + Math.cos(i) * radioAnillo;
      var y = punto.y + Math.sin(i) * radioAnillo;
      var z = punto.z;
      puntosAnillo.push(new THREE.Vector3(x, y, z));
    }

    // Crear el spline cerrado del anillo
    var splineAnillo = new THREE.CatmullRomCurve3(puntosAnillo, true);

    // Se dibuja con esto
    // var resolutionAnillo = 100;
    // var geometryAnillo = new THREE.BufferGeometry().setFromPoints(splineAnillo.getPoints(resolutionAnillo));
    // var materialAnillo = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // var splineMeshAnillo = new THREE.Line(geometryAnillo, materialAnillo);
    // this.add(splineMeshAnillo);

    // Se necesitan los binormales del spline
    var segmentos = 100;
    var binormales = splineAnillo.computeFrenetFrames(segmentos, true).binormals;

    // Parámetros para la animación
    var origen = { t: 0 };
    var destino = { t: 1 };
    var tiempo = 10000;

    // Crear animación con Tween
    var animacion = new TWEEN.Tween(origen).to(destino, tiempo).repeat(Infinity).onUpdate(() => {
      var posicion = splineAnillo.getPointAt(origen.t);
      this.ovni.position.copy(posicion);
      var tangente = splineAnillo.getTangentAt(origen.t);
      posicion.add(tangente);
      this.ovni.up = binormales[Math.floor(origen.t * segmentos)];
      this.ovni.lookAt(posicion);

    });

    // Comenzar la animación
    animacion.start();
  }
  animar2() {
    // Punto 7
    var punto = new THREE.Vector3(1, -2, 10);

    this.ovni.add(this.lanzarProyectil2());
    this.ovni.rotation.x = 150 * (Math.PI / 180);


    var puntos = [
      new THREE.Vector3(-14, 11, 4),
      new THREE.Vector3(-15, 10.5, 3),
      new THREE.Vector3(-14, 10, 2),
      new THREE.Vector3(-13, 10.5, 3),
      new THREE.Vector3(-15, 11.5, 5),
      new THREE.Vector3(-14, 12, 6),
      new THREE.Vector3(-13, 11.5, 5),
    ];

    // Crear el spline cerrado del anillo
    var splineAnillo = new THREE.CatmullRomCurve3(puntos, true);

    // Se dibuja con esto
    // var resolutionAnillo = 100;
    // var geometryAnillo = new THREE.BufferGeometry().setFromPoints(splineAnillo.getPoints(resolutionAnillo));
    // var materialAnillo = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // var splineMeshAnillo = new THREE.Line(geometryAnillo, materialAnillo);
    // this.add(splineMeshAnillo);

    // Se necesitan los binormales del spline
    var segmentos = 100;
    var binormales = splineAnillo.computeFrenetFrames(segmentos, true).binormals;

    // Parámetros para la animación
    var origen = { t: 0 };
    var destino = { t: 1 };
    var tiempo = 10000;

    // Crear animación con Tween
    var animacion = new TWEEN.Tween(origen).to(destino, tiempo).repeat(Infinity).onUpdate(() => {
      var posicion = splineAnillo.getPointAt(origen.t);
      this.ovni.position.copy(posicion);
      var tangente = splineAnillo.getTangentAt(origen.t);
      posicion.add(tangente);
      this.ovni.up = binormales[Math.floor(origen.t * segmentos)];
      //this.ovni.lookAt(posicion);

    });

    // Comenzar la animación
    animacion.start();
  }

  colision(juego) {

  }


  createGUI(gui, titleGui) {

  }


  update() {
    TWEEN.update();
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Ovni }
