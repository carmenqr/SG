
import * as THREE from 'three'

class Circuito extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    // this.material = new THREE.MeshNormalMaterial();
    // this.material.flatShading = true;
    // this.material.needsUpdate = true;

    // this.loader = new THREE.TextureLoader();
    // this.textura = this.loader.load('../imgs/descarga.jpg');
    // this.material = new THREE.MeshStandardMaterial({map: this.textura});

    this.material = new THREE.MeshStandardMaterial({color: 0xFFDF9B});
    this.material.bumpMap = new THREE.TextureLoader().load('../imgs/texturacircuito.jpg');
    

    this.circuito = this.createCircuito();
    
    this.add(this.circuito);
  }

  createCircuito() {

    var pts = [
      new THREE.Vector3(-5, -2, 15),
      new THREE.Vector3(1, -2, 10), //1
      new THREE.Vector3(-2, 10, -5), //2
      new THREE.Vector3(3, -1, -7),
      new THREE.Vector3(3, -5, 0), //3
      new THREE.Vector3(-3, 3, 6), //4
      new THREE.Vector3(-6, 2, 20), //5
      new THREE.Vector3(3, -3, 15), //8
      new THREE.Vector3(7, 3, 10), //6
      new THREE.Vector3(-15, 10, 8), //7
      new THREE.Vector3(-10, 3, 2) //9
    ];
    
    // Crear la curva de Catmull-Rom cerrada
    this.path = new THREE.CatmullRomCurve3(pts, true);

    // Resolución del tubo
    var resolution = 500;

    // Radio del tubo
    this.tubeRadius = 1;

    // Segmentos que forman el círculo alrededor de la curva
    this.segments = 300;

    // Crear la geometría del tubo cerrado
    this.tubeGeometry = new THREE.TubeGeometry(this.path, resolution, this.tubeRadius, this.segments, true);


    // Crear una malla utilizando la geometría y el material
    var forma = new THREE.Mesh(this.tubeGeometry, this.material);
    return forma;

  }

  getVariablesTubo(){
    var variables = [this.path,this.tubeRadius,this.segments,this.tubeGeometry];
    return variables;
  }
  

  createGUI(gui, titleGui) {
    
  }
  

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Circuito }
