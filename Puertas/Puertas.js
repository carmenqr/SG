import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class Puertas extends THREE.Object3D {
  constructor(variablesTubo) {
    super();

    this.path = variablesTubo[0];
    this.tubeRadius = variablesTubo[1];
    this.segments = variablesTubo[2];
    this.tubeGeometry = variablesTubo[3];
    this.abierta = true;

    this.loader = new THREE.TextureLoader();
    this.textura = this.loader.load("../imgs/tablones2.jpg");
    this.material = new THREE.MeshStandardMaterial({ map: this.textura });
    //this.material = new THREE.MeshStandardMaterial({map: this.textura});
    //this.material.bumpMap = new THREE.TextureLoader().load('../imgs/tablones.jpg');

    this.pIzq = null;
    this.pDcha = null;

    this.puertas = this.createPuerta();

    this.add(this.puertas);
  }

  createMarcos() {

    var marcos = new THREE.Object3D();

    var marco_lat = new THREE.BoxGeometry(0.05, 1, 0.05);
    var marco_sup = new THREE.BoxGeometry(0.05, 0.5, 0.05);

    // this.material = new THREE.MeshNormalMaterial();
    // this.material.flatShading = true;
    // this.material.needsUpdate = true;
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
    PuertaIzq.rotation.y = -90 * (Math.PI / 180);

    return PuertaIzq;

  }

  createPuertaDcha() {

    var PuertaDcha = new THREE.Object3D();

    var forma = new THREE.BoxGeometry(0.2, 1, 0.05);

    var formaMesh = new THREE.Mesh(forma, this.material);

    formaMesh.position.set(-0.1, 0.5, 0);

    PuertaDcha.position.x = 0.2;
    PuertaDcha.add(formaMesh);
    PuertaDcha.rotation.y = 90 * (Math.PI / 180);

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

    puertas.scale.set(2, 2, 2);
    return puertas;
  }

  abrir() {
    const duracion = 2500;

    var origen = { rotacion: 0 };
    var destino = { rotacion: -Math.PI / 2 }; //-90º

    var movimiento = new TWEEN.Tween(origen).to(destino, duracion);

    movimiento.onUpdate(() => {
      this.setAngulo(origen.rotacion);
    });

    movimiento.start();

  }

  cerrar() {
    const duracion = 2500;

    var origen = { rotacion: -Math.PI / 2 };
    var destino = { rotacion: 0 };

    var movimiento = new TWEEN.Tween(origen).to(destino, duracion);

    movimiento.onUpdate(() => {
      this.setAngulo(origen.rotacion);
    });

    movimiento.start();

  }

  setAngulo(valor) {
    this.pIzq.rotation.y = valor;
    this.pDcha.rotation.y = -valor;
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

    this.foco = new THREE.SpotLight(0x2AFF00);
    this.foco.power = 200;
    this.foco.position.set(0, 4, 0);
    this.foco.angle = Math.PI/12;
    this.foco.penumbra = 1;
    this.foco.target = this.posObjeto;
    this.posObjeto.add(this.foco);

    return this.posObjeto;
  }

  colision(juego, objeto) {

    if (!this.abierta && !juego.inmune) {
      juego.coche.t = (juego.coche.t - 0.25) + 1;
      juego.coche.t = juego.coche.t % 1;

      var distanciaPerdida = Math.ceil(juego.distanciaRecorrida * 0.4);
      juego.distanciaRecorrida -= distanciaPerdida;

      this.foco.color.set(0x2AFF00);

      juego.coche.velocidad *= 1.1;
      this.abierta = true;
      this.abrir();
    }
    else if (this.abierta) {
      juego.coche.t = (juego.coche.t + 0.1) % 1;

      var distanciaGanada = Math.ceil(juego.distanciaRecorrida * 0.2);
      juego.distanciaRecorrida += distanciaGanada;

      this.foco.color.set(0xFF0000);

      this.abierta = false;
      this.cerrar();
    }

    setTimeout(function () {
      juego.objetosConColision.delete(objeto);
    }, 2000);

  }

  update() {
    TWEEN.update();
    // this.Puertas.rotateY(0.05);
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Puertas }


