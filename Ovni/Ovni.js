
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

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
    this.phiLength = 0; // Ángulo de revolución completo

    this.ovni = this.createForma();
    //this.ovni.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);
    
    this.add(this.ovni);
  }

  createForma(){

    var platillo = new THREE.Mesh (new THREE.LatheGeometry(this.shape.getPoints(), 64, this.phiLength, 2 * Math.PI +0.1), this.material);
    
    var formaEsfera = new THREE.SphereGeometry (0.5, 20, 20);
    formaEsfera.translate(0,0.4,0);
    var esfera = new THREE.Mesh (formaEsfera, this.material);

    var forma = new CSG();
    forma.union([platillo,esfera]);
    return forma.toMesh();
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
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Ovni }
