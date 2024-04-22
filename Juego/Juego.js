
import * as THREE from 'three'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class Juego extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);
    this.t = 0.1;

    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshNormalMaterial();
    this.material.flatShading = true;
    this.material.needsUpdate = true;

    this.circuito = this.createCircuito();
    //this.createCoche();

    // this.cubo = this.createCubo();
    this.puerta = this.createPuerta();
    
    this.add(this.posicionOrientacionCoche());
    //this.add(this.cubo);
    this.add(this.puerta);
    this.add(this.circuito);

    this.animacionPuertas();
  }

  createCubo() {
    this.cuboGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    var material = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 0.2 }); // Amarillo
    var cubo = new THREE.Mesh(this.cuboGeometry, material);
    cubo.position.y = 0.25;

    /* var posIni = this.path.getPointAt(0.2);
    
    var tangente = this.path.getTangentAt(0.2);
    var normal = new THREE.Vector3();
    normal.crossVectors(tangente, this.path.getTangentAt(0.2 + 0.01)).normalize();
    var offset = normal.clone().multiplyScalar(this.tubeRadius + 0.25);
    posIni.add(offset);

    cubo.position.copy(posIni);

    cubo.up = normal;
    cubo.lookAt(posIni.clone().add(tangente)); */

    return cubo;

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
    var resolution = 200;

    // Radio del tubo
    this.tubeRadius = 0.6;

    // Segmentos que forman el círculo alrededor de la curva
    this.segments = 20;

    // Crear la geometría del tubo cerrado
    this.tubeGeometry = new THREE.TubeGeometry(this.path, resolution, this.tubeRadius, this.segments, true);


    // Crear una malla utilizando la geometría y el material
    var forma = new THREE.Mesh(this.tubeGeometry, this.material);
    return forma;

  }

  createCoche() {
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load('../models/coche2/LEGO_CAR_B2.mtl',
      (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load('../models/coche2/LEGO_CAR_B2.obj',
          (object) => {
            object.scale.set(0.01, 0.01, 0.01);
            this.coche = object;

            this.posCoche.add(this.coche);

          }, null, null);
      });
  }

  createMarcos() {

    var marcos = new THREE.Object3D();

    var marco_lat = new THREE.BoxGeometry(0.05, 1, 0.05);
    var marco_sup = new THREE.BoxGeometry(0.05, 0.5, 0.05);

    this.material = new THREE.MeshNormalMaterial();
    this.material.flatShading = true;
    this.material.needsUpdate = true;
    // var material = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 0.2 }); // Amarillo

    var marco_latdMesh = new THREE.Mesh(marco_lat, this.material);
    var marco_latiMesh = new THREE.Mesh(marco_lat, this.material);
    var marco_supMesh = new THREE.Mesh(marco_sup, this.material);

    marco_latdMesh.position.set(0.225, 0.5, 0);
    marco_latiMesh.position.set(-0.225, 0.5, 0);

    marco_supMesh.rotation.set(0, 0, 90 * (Math.PI / 180));
    marco_supMesh.position.set(0, 1, 0);


    var csg = new CSG();
    csg.union([marco_latdMesh, marco_latiMesh, marco_supMesh])

    this.Puertas = csg.toMesh();

    marcos.add(this.Puertas);

    return marcos;
  }


  createPuertaIzq() {

    var PuertaIzq = new THREE.Object3D();

    var forma = new THREE.BoxGeometry(0.2, 1, 0.05);

    var formaMesh = new THREE.Mesh(forma, this.material);

    formaMesh.position.set(0.1, 0.5, 0);

    PuertaIzq.position.x = -0.2;
    PuertaIzq.add(formaMesh);

    return PuertaIzq;

  }

  createPuertaDcha() {

    var PuertaDcha = new THREE.Object3D();

    var forma = new THREE.BoxGeometry(0.2, 1, 0.05);

    var formaMesh = new THREE.Mesh(forma, this.material);

    formaMesh.position.set(-0.1, 0.5, 0);

    PuertaDcha.position.x = 0.2;
    PuertaDcha.add(formaMesh);

    return PuertaDcha;

  }

  createPuerta() {
    var puertas = new THREE.Object3D();

    var marc = this.createMarcos();
    this.pIzq = this.createPuertaIzq();
    this.pDcha = this.createPuertaDcha();

    puertas.add(marc);
    puertas.add(this.pIzq);
    puertas.add(this.pDcha);

    var posIni = this.path.getPointAt(0.2);
    var tangente = this.path.getTangentAt(0.2);
    var normal = new THREE.Vector3();
    normal.crossVectors(tangente, this.path.getTangentAt(0.2 + 0.005)).normalize();
    var offset = normal.clone().multiplyScalar(this.tubeRadius);
    posIni.add(offset);

    puertas.position.copy(posIni);
    puertas.up = normal;
    puertas.lookAt(posIni.clone().add(tangente));

    return puertas;
  }

  animacionPuertas() {
    const duracion = 2500;

    var origen = { rotacion: 0 };
    var destino = { rotacion: -Math.PI / 2 };

    var movimiento = new TWEEN.Tween(origen).to(destino, duracion).yoyo(true).repeat(Infinity);

    movimiento.onUpdate(() => {
      this.setAngulo(origen.rotacion);
    });

    movimiento.start();

  }

  setAngulo(valor) {
    this.pIzq.rotation.y = valor;
    this.pDcha.rotation.y = -valor;
  }

  avanzarCoche(valor) {
    // asegurarse de que el coche se ha cargado antes de actualizar su posición
    var posTmp = this.path.getPointAt(valor);
    this.posOrCoche.position.copy(posTmp);
  
    var tangente = this.path.getTangentAt(valor);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(valor*this.segments);
    this.posOrCoche.up = this.tubeGeometry.binormals[segmentoActual];
    this.posOrCoche.lookAt(posTmp);
  }

  posicionOrientacionCoche() {
    this.posOrCoche = new THREE.Object3D();

    var orientacion = this.orientacionCoche();

    this.posOrCoche.add(orientacion);
    this.avanzarCoche(this.t);
    return this.posOrCoche;

  }

  orientacionCoche() {
    var orCoche = new THREE.Object3D();

    var posicion = this.posicionCoche();
    orCoche.add(posicion);

    orCoche.rotation.z = 0 *(Math.PI / 180);

    return orCoche;
  }

  posicionCoche() {
    this.posCoche = new THREE.Object3D();

    this.createCoche();
    this.posCoche.position.y = this.tubeRadius;

    return this.posCoche;
  }

  createGUI(gui, titleGui) {

  }

  update() {
    TWEEN.update();
    this.t += 0.001;
    this.t = parseFloat(this.t.toFixed(3));
    //this.posicionOrientacionCoche();
    if (this.t >= 1) this.t = 0;
    if (this.coche) {
      this.avanzarCoche(this.t);
    }
    //this.posicionOrientacionCoche();
  }
}

export { Juego }
