import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class Moneda extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la hMoneda interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    this.moneda = this.createMoneda();

    this.add(this.moneda);

  }

  createMoneda() {
    var coin = new THREE.Object3D();

    var cilin_ext = new THREE.CylinderGeometry(2, 2, 0.45, 10);
    var cilin_cent1 = new THREE.CylinderGeometry(1.75, 1.75, 0.45, 10);
    var cilin_cent2 = new THREE.CylinderGeometry(1.75, 1.75, 0.45, 10);
    var ranura1 = new THREE.BoxGeometry(0.5, 1.5, 0.25);
    var ranura2 = new THREE.BoxGeometry(0.5, 1.5, 0.25);

    // var material = new THREE.MeshNormalMaterial();
    // material.flatShading = true;
    // material.needsUpdate = true;
    var material = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 0.2 }); // Amarillo

    cilin_ext.rotateX(90 * (Math.PI / 180));
    cilin_ext.translate(0, 2, 0);
    cilin_cent1.rotateX(90 * (Math.PI / 180));
    cilin_cent2.rotateX(90 * (Math.PI / 180));
    cilin_cent1.translate(0, 2, 0.35);
    cilin_cent2.translate(0, 2, -0.35);

    ranura1.translate(0, 2, 0.15);
    ranura2.translate(0, 2, -0.15);


    var cilin_extMesh = new THREE.Mesh(cilin_ext, material);
    var cilin_cent1Mesh = new THREE.Mesh(cilin_cent1, material);
    var cilin_cent2Mesh = new THREE.Mesh(cilin_cent2, material);
    var ranura1Mesh = new THREE.Mesh(ranura1, material);
    var ranura2Mesh = new THREE.Mesh(ranura2, material);

    var csg = new CSG();
    csg.union([cilin_extMesh]);
    csg.subtract([cilin_cent1Mesh, cilin_cent2Mesh]);
    csg.subtract([ranura1Mesh, ranura2Mesh]);


    this.moneda = csg.toMesh();


    this.moneda.scale.set(0.1, 0.1, 0.1);

    coin.add(this.moneda);

    return coin;
  }
  
  createGUI (gui,titleGui) {

  }
  
  update () {

    this.moneda.rotateY(0.05);
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Moneda }


