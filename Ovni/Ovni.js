
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

    // Crear proyectil
    this.proyectil = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    ov.add(this.proyectil);

    // Definir la trayectoria del proyectil
    var puntosTrayectoria = [];
    puntosTrayectoria.push(new THREE.Vector3(0, 0, 0)); // Punto inicial
    puntosTrayectoria.push(new THREE.Vector3(0, 4, 0)); // Punto final

    var trayectoria = new THREE.CatmullRomCurve3(puntosTrayectoria);

    var segmentos = 100;
    var binormales = trayectoria.computeFrenetFrames(segmentos, true).binormals;

    // Crear animación con Tween para mover el proyectil
    var origen = { t: 0 };
    var destino = { t: 1 };
    var tiempo = 1000; // Duración de la animación en milisegundos

    var animacion = new TWEEN.Tween(origen).to(destino, tiempo).repeat(Infinity).onUpdate(() => {
      var posicion = trayectoria.getPointAt(origen.t);
      this.proyectil.position.copy(posicion);
      var tangente = trayectoria.getTangentAt(origen.t);
      posicion.add(tangente);
      this.proyectil.up = binormales[Math.floor(origen.t * segmentos)];
      this.proyectil.lookAt(posicion);

    });

    animacion.start();

    return ov;
}


  

  createGUI(gui, titleGui) {
    // Controles para el movimiento de la parte móvil
    this.guiControls = {
      segmentos : 3,
      angulo : 10,
    };

    // Se crea una sección para los controles de la ovni
    var folder = gui.addFolder(titleGui);

    //Para que los valores se actualicen
    var that = this;

    // Estas líneas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add(this.guiControls, 'segmentos', 3, 64, 1)
        .name('Segmentos: ')
        .onChange(function(){that.ovni.geometry = new THREE.LatheGeometry(that.shape.getPoints(), that.guiControls.segmentos, that.phiLength, that.guiControls.angulo)});

    folder.add(this.guiControls, 'angulo', 0, 2 * Math.PI +0.1, 0.01)
        .name('Ángulo: ')
        .onChange(function(){that.ovni.geometry = new THREE.LatheGeometry(that.shape.getPoints(), that.guiControls.segmentos, that.phiLength, that.guiControls.angulo)});
  }
  

  update () {
    TWEEN.update();
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Ovni }
