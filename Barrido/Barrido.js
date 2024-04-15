
import * as THREE from 'three'

class Barrido extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshNormalMaterial();
    this.material.flatShading = true;
    this.material.needsUpdate = true;

    this.barrido = this.createForma();
    
    this.add(this.barrido);
  }

  createForma(){

    var pts = [
      new THREE.Vector3(0.1, -0.2, 1.0), //1
      new THREE.Vector3(-0.2, 1.0, -0.5), //2
      new THREE.Vector3(0.3, -0.5, 0.0), //3
      new THREE.Vector3(-0.3, 0.3, 0.6), //4
      new THREE.Vector3(-0.6, 0.2, 2.0), //5
      new THREE.Vector3(0.3, -0.3, 1.5), //8
      new THREE.Vector3(0.7, 0.3, 1.0), //6
      new THREE.Vector3(-1.5, 1.0, 0.8), //7
      new THREE.Vector3(-1.0, 0.3, 0.2) //9
    ];

    // Crear la curva de Catmull-Rom cerrada
    var path = new THREE.CatmullRomCurve3(pts, true);

    // Resolución del tubo
    var resolution = 200;

    // Radio del tubo
    var tubeRadius = 0.1;

    // Segmentos que forman el círculo alrededor de la curva
    var segments = 20;

    // Crear la geometría del tubo cerrado
    var tubeGeometry = new THREE.TubeGeometry(path, resolution, tubeRadius, segments, true);


    // Crear una malla utilizando la geometría y el material
    var forma = new THREE.Mesh(tubeGeometry, this.material);
    return forma;

  }
  

  createGUI(gui, titleGui) {
    
  }
  

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Barrido }
