
import * as THREE from 'three'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'

class Juego extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshNormalMaterial();
    this.material.flatShading = true;
    this.material.needsUpdate = true;

    this.circuito = this.createCircuito();
    this.createCoche();
    this.cubo = this.createCubo();
    
    //this.add(this.cubo);
    this.add(this.circuito);

  }

  createCubo(){
    this.cuboGeometry = new THREE.BoxGeometry(0.5,0.5,0.5);
    var material = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 0.2 }); // Amarillo
    var cubo = new THREE.Mesh(this.cuboGeometry, material);

    var posIni = this.path.getPointAt(0.2);
    
    var tangente = this.path.getTangentAt(0.2);
    var normal = new THREE.Vector3();
    normal.crossVectors(tangente, this.path.getTangentAt(0.2 + 0.01)).normalize();
    var offset = normal.clone().multiplyScalar(this.tubeRadius + 0.25);
    posIni.add(offset);

    cubo.position.copy(posIni);

    cubo.up = normal;
    cubo.lookAt(posIni.clone().add(tangente));

    return cubo;

  }

  createCircuito(){

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
    var resolution = 200;

    // Radio del tubo
    this.tubeRadius = 0.2;

    // Segmentos que forman el círculo alrededor de la curva
    this.segments = 20;

    // Crear la geometría del tubo cerrado
    this.tubeGeometry = new THREE.TubeGeometry(this.path, resolution, this.tubeRadius, this.segments, true);


    // Crear una malla utilizando la geometría y el material
    var forma = new THREE.Mesh(this.tubeGeometry, this.material);
    return forma;

  }

  createCoche(){
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load( '../models/coche2/LEGO_CAR_B2.mtl' ,
      (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load( '../models/coche2/LEGO_CAR_B2.obj' ,
          (object) => {
            object.scale.set(0.01, 0.01, 0.01); 
            //object.position.set(-0.25, 0, -0.5);

            /* var posIni = this.path.getPointAt(0.2);
            object.position.copy(posIni);
            var tangente = this.path.getTangentAt(0.2);

            posIni.add(tangente);
            var segmentoActual = Math.floor(0.2*this.segments);
            object.up = this.tubeGeometry.binormals[segmentoActual];
            object.lookAt(posIni); */

            var posIni = this.path.getPointAt(0.6); //0.6 es la t
    
            var tangente = this.path.getTangentAt(0.6); //0.6 es la t
            var normal = new THREE.Vector3();
            normal.crossVectors(tangente, this.path.getTangentAt(0.6 + 0.01)).normalize(); //0.01 para evitar división por 0 //0.6 es la t
            var offset = normal.clone().multiplyScalar(this.tubeRadius);
            posIni.add(offset);
        
            object.position.copy(posIni);
        
            object.up = normal;
            object.lookAt(posIni.clone().add(tangente));

            this.add(object);
          }, null, null);
      });
  }
  

  createGUI(gui, titleGui) {
    
  }
  

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Juego }
