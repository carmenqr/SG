import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class Moneda extends THREE.Object3D {
  constructor(variablesTubo) {
    super();
    
    this.path = variablesTubo[0];
    this.tubeRadius = variablesTubo[1];
    this.segments = variablesTubo[2];
    this.tubeGeometry = variablesTubo[3];

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

  setAnguloObjeto(valor) {
    this.orObjeto.rotation.z = valor;
  }

  posObjetoTubo(valor) {
    var posTmp = this.path.getPointAt(valor);
    this.posOrObjeto.position.copy(posTmp);

    var tangente = this.path.getTangentAt(valor);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(valor * this.segments);
    this.posOrObjeto.up = this.tubeGeometry.binormals[segmentoActual];
    this.posOrObjeto.lookAt(posTmp);
  }

  posicionOrientacionObjeto(angulo, punto) {
    this.posOrObjeto = new THREE.Object3D();

    var orientacion = this.orientacionObjeto(angulo);

    this.posOrObjeto.add(orientacion);
    this.posObjetoTubo(punto);
    return this.posOrObjeto;
  }

  orientacionObjeto(angulo) {
    this.orObjeto = new THREE.Object3D();

    var posicion = this.posicionObjeto();
    this.orObjeto.add(posicion);

    this.setAnguloObjeto(angulo);

    return this.orObjeto;
  }

  posicionObjeto() {
    this.posObjeto = new THREE.Object3D();
    this.posObjeto.add(this);
    this.posObjeto.position.y = this.tubeRadius;

    return this.posObjeto;
  }

  update () {

    this.moneda.rotateY(0.05);
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Moneda }


