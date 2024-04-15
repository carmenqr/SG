import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class Puertas extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la hPuertas interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Puertas
    var marc = this.createMarcos();
    this.pIzq = this.createPuertaIzq();
    this.pDcha = this.createPuertaDcha();


    this.add(marc);
    this.add(this.pIzq);
    this.add(this.pDcha);
    // this.add(cilin_extMesh);
    // this.add(cilin_cent1Mesh);
    // this.add(cilin_cent2Mesh);
    // this.add(ranura1Mesh);
    // this.add(ranura2Mesh);

  }

  createMarcos(){

    var marcos = new THREE.Object3D();

    var marco_lat = new THREE.BoxGeometry(0.1, 2, 0.1);
    var marco_sup = new THREE.BoxGeometry(0.1, 1, 0.1);

    this.material = new THREE.MeshNormalMaterial();
    this.material.flatShading = true;
    this.material.needsUpdate = true;
    // var material = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 0.2 }); // Amarillo

    var marco_latdMesh = new THREE.Mesh(marco_lat, this.material);
    var marco_latiMesh = new THREE.Mesh(marco_lat, this.material);
    var marco_supMesh = new THREE.Mesh(marco_sup, this.material);

    marco_latdMesh.position.set(0.45, 1, 0);
    marco_latiMesh.position.set(-0.45, 1, 0);

    marco_supMesh.rotation.set(0, 0, 90*(Math.PI/180));
    marco_supMesh.position.set(0, 2, 0);

    
    var csg = new CSG();
    csg.union([marco_latdMesh, marco_latiMesh, marco_supMesh])

    this.Puertas = csg.toMesh();

    marcos.add(this.Puertas);

    return marcos;
  }


  createPuertaIzq(){
  
    var PuertaIzq = new THREE.Object3D();

    var forma = new THREE.BoxGeometry(0.4, 2, 0.1);

    var formaMesh = new THREE.Mesh(forma, this.material);

    formaMesh.position.set(0.2, 1, 0);
    formaMesh.rotateY(this.guiControls.rotacion);

    PuertaIzq.position.x = -0.4;
    PuertaIzq.add(formaMesh);

    return PuertaIzq;

  }

  createPuertaDcha(){
  
    var PuertaDcha = new THREE.Object3D();

    var forma = new THREE.BoxGeometry(0.4, 2, 0.1);

    var formaMesh = new THREE.Mesh(forma, this.material);

    formaMesh.position.set(-0.2, 1, 0);
    formaMesh.rotateY(this.guiControls.rotacion);

    PuertaDcha.position.x = 0.4;
    PuertaDcha.add(formaMesh);

    return PuertaDcha;

  }

  setAngulo (valor) {
    this.pIzq.rotation.y = valor;
    this.pDcha.rotation.y = -valor;
  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientacion y la posicion de la caja
    this.guiControls = {
      rotacion : 0
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add (this.guiControls, 'rotacion', -90*(Math.PI/180), 0, 0.1)
      .name ('Apertura : ')
      .onChange ( (value) => this.setAngulo (-value) );
  }
  
  update () {

    // this.Puertas.rotateY(0.05);
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Puertas }


