
import * as THREE from 'three'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import { CSG } from '../libs/CSG-v2.js'


class Escudo extends THREE.Object3D {
  constructor(variablesTubo) {
    super();

    this.path = variablesTubo[0];
    this.tubeRadius = variablesTubo[1];
    this.segments = variablesTubo[2];
    this.tubeGeometry = variablesTubo[3];

    this.escudo = this.createEscudo();

    this.add(this.escudo);
  }

  createEscudo() {
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.7, 0.3, 0.65, 1.4);
    shape.quadraticCurveTo(0.2, 1.5, 0, 1.6);
    shape.quadraticCurveTo(-0.2, 1.5, -0.65, 1.4);
    shape.quadraticCurveTo(-0.7, 0.3, 0, 0);

    this.loader = new THREE.TextureLoader();
    this.textura = this.loader.load("../imgs/metalTornillos.jpg");
    this.material1 = new THREE.MeshStandardMaterial({ map: this.textura/* , color: 'yellow' */ });

    this.loader2 = new THREE.TextureLoader();
    //this.textura2 = this.loader2.load("../imgs/rejilla.jpg");
    this.textura2 = this.loader.load("../imgs/maderavieja.jpg", function (texture) {
      // Ajustar las propiedades de la textura
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(0.5, 0.5);
      texture.offset.set(0.51, 0);
      texture.needsUpdate = true; 
  });
    this.material2 = new THREE.MeshStandardMaterial({ map: this.textura2/* , color: 'yellow' */ });

    var options = { depth: 0.5, steps: 2, curveSegments: 10, bevelEnabled: false }; //etc
    var geometry1 = new THREE.ExtrudeGeometry(shape, options);

    var options2 = { depth: 0.7, steps: 2, curveSegments: 10, bevelEnabled: false }; //etc
    var geometry2 = new THREE.ExtrudeGeometry(shape, options2);

    var forma = new THREE.Mesh(geometry1, this.material1);
    var forma2 = new THREE.Mesh(geometry1, this.material2);
    var forma3 = new THREE.Mesh(geometry2, this.material2);

    forma.scale.set(0.5, 0.5, 0.5);
    forma2.scale.set(0.4, 0.4, 0.4);
    forma3.scale.set(0.4, 0.4, 0.4);
    forma.position.y = -0.01;
    forma2.position.y = 0.09;
    forma2.position.z = 0.02;
    forma3.position.y = 0.09;

    var csg = new CSG();
    csg.union([forma]);
    csg.subtract([forma3]);
    var borde = csg.toMesh();

    var grupo = new THREE.Group();
    grupo.add(borde);
    grupo.add(forma2);

    return grupo;
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

  colision(juego, objeto) {
    if (!juego.inmune) {
      // Activa la inmunidad inmediatamente después de la colisión
      juego.inmune = true;
      juego.coche.foco.power = 150;
      console.log("Inmunidad activada.");

      // Inicia el temporizador de 10 segundos
      setTimeout(function () {
        juego.inmune = false;
        juego.coche.foco.power = 0;
        console.log("El estado inmune ha terminado.");
      }, 8000);
    }

    objeto.posObjetoTubo(juego.posAleatoria());
    objeto.setAnguloObjeto(juego.angAleatorio() * (Math.PI / 180));

    setTimeout(function () {
      juego.objetosConColision.delete(objeto);
    }, 2000);
  }


  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Escudo }
