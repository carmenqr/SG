
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import * as TWEEN from '../libs/tween.esm.js'

class Ovni extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshNormalMaterial();
    this.material.flatShading = true;
    this.material.needsUpdate = true;

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

    var platillo = new THREE.Mesh(new THREE.LatheGeometry(this.shape.getPoints(), 15, this.phiLength, 2 * Math.PI + 0.1), this.material);

    var formaEsfera = new THREE.SphereGeometry(0.5, 5, 5);
    formaEsfera.translate(0, -0.4, 0);
    var esfera = new THREE.Mesh(formaEsfera, this.material);

    var forma = new CSG();
    forma.union([platillo, esfera]);
    var ov = forma.toMesh();
    ov.scale.set(0.3, 0.3, 0.3);
    // ov.add(this.lanzarProyectil());

    //ov.position.set(-2, 13, -5);
    return ov;
  }

  lanzarProyectil1() {
    this.proyectil = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));

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
    var tiempo = 1500; // Duración de la animación en milisegundos

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
    this.proyectil2 = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));

    // Definir la trayectoria del proyectil
    var puntosTrayectoria = [];
    puntosTrayectoria.push(new THREE.Vector3(0, 0, 0)); // Punto inicial
    puntosTrayectoria.push(new THREE.Vector3(0, 10, 0)); // Punto final

    var trayectoria = new THREE.CatmullRomCurve3(puntosTrayectoria);

    var segmentos = 100;
    var binormales = trayectoria.computeFrenetFrames(segmentos, true).binormals;

    // Crear animación con Tween para mover el proyectil
    var origen = { t: 0 };
    var destino = { t: 1 };
    var tiempo = 1500; // Duración de la animación en milisegundos

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
  

  createGUI(gui, titleGui) {
  
  }
  

  update () {
    TWEEN.update();
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Ovni }
