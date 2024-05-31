import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class Pomo extends THREE.Object3D {
  constructor() {
    super();

    this.material = new THREE.MeshStandardMaterial({
      color: 0xdcdcdc,
      metalness: 1.0,
      roughness: 0.3
    });

    
  }

  createPomoDer() {

    var pomo = new THREE.Object3D();

    var soporte = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32);
    var palo1 = new THREE.BoxGeometry(0.05, 0.1, 0.05);
    var palo2 = new THREE.BoxGeometry(0.05, 0.3, 0.05);

    soporte.rotateX(90* (Math.PI / 180));
    palo1.translate(0, 0.1, 0);
    palo1.rotateX(90* (Math.PI / 180));
    palo2.translate(0, 0.125, 0.175);
    palo2.rotateZ(-90* (Math.PI / 180));

    var soporteMesh = new THREE.Mesh(soporte, this.material);
    var palo1Mesh = new THREE.Mesh(palo1, this.material);
    this.palo2Mesh = new THREE.Mesh(palo2, this.material);

    pomo.add(soporteMesh);
    pomo.add(palo1Mesh);
    pomo.add(this.palo2Mesh);

    return pomo;
  }

  createPomoIzq() {

    var pomo = new THREE.Object3D();

    var soporte = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32);
    var palo1 = new THREE.BoxGeometry(0.05, 0.1, 0.05);
    var palo2 = new THREE.BoxGeometry(0.05, 0.3, 0.05);

    soporte.rotateX(90* (Math.PI / 180));
    palo1.translate(0, 0.1, 0);
    palo1.rotateX(90* (Math.PI / 180));
    palo2.translate(0, -0.125, 0.175);
    palo2.rotateZ(-90* (Math.PI / 180));

    var soporteMesh = new THREE.Mesh(soporte, this.material);
    var palo1Mesh = new THREE.Mesh(palo1, this.material);
    this.palo2Mesh = new THREE.Mesh(palo2, this.material);

    pomo.add(soporteMesh);
    pomo.add(palo1Mesh);
    pomo.add(this.palo2Mesh);

    return pomo;

  }

  setAngulo(angulo) {
    this.palo2Mesh.rotation.z = angulo;
  }

  animarDer() {
    const duracion = 2500;

    var origen = { rotacion: 0 };
    var destino = { rotacion: -Math.PI / 4 }; // -90º

    var movimiento = new TWEEN.Tween(origen).to(destino, duracion);

    movimiento.onUpdate(() => {
      this.setAngulo(origen.rotacion);
    });

    movimiento.yoyo(true) // Hacer que la animación vuelva al estado original
      .repeat(Infinity) // Repetir infinitamente
      .start();
  }

  animarIzq() {
    const duracion = 2500;

    var origen = { rotacion: 0 };
    var destino = { rotacion: Math.PI / 4 }; // 90º

    var movimiento = new TWEEN.Tween(origen).to(destino, duracion);

    movimiento.onUpdate(() => {
      this.setAngulo(origen.rotacion);
    });

    movimiento.yoyo(true) // Hacer que la animación vuelva al estado original
      .repeat(Infinity) // Repetir infinitamente
      .start();
  }

  update() {
    TWEEN.update();
    // this.Pomo.rotateY(0.05);
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Pomo }


