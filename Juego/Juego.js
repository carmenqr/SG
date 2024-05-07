import * as THREE from 'three'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'
import { MyScene } from './MyScene.js'


class Juego extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // const mySceneInstance = new MyScene(); // Crear una instancia de MyScene
    // const camera = mySceneInstance.camera;

    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);
    this.t = 0.1;
    this.angulo = 0;


    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshNormalMaterial();
    this.material.flatShading = true;
    this.material.needsUpdate = true;

    this.circuito = this.createCircuito();

    this.cubo = this.createCubo();
    this.puerta1 = this.createPuerta();
    this.moneda1 = this.createMoneda();
    this.moneda2 = this.createMoneda();
    this.moneda3 = this.createMoneda();
    this.moneda4 = this.createMoneda();
    this.ovni1 = this.createOvni();
    this.escudo1 = this.createEscudo();
    this.escudo2 = this.createEscudo();
    this.escudo3 = this.createEscudo();
    this.pinchos1 = this.createPinchos();
    this.pinchos2 = this.createPinchos();
    this.createCorazon();

    this.add(this.posicionOrientacionObjeto(this.puerta1, 0 * (Math.PI / 180), 0.25));
    this.add(this.posicionOrientacionObjeto(this.moneda1, 0 * (Math.PI / 180), 0.14));
    this.add(this.posicionOrientacionObjeto(this.moneda2, 170 * (Math.PI / 180), 0.3));
    this.add(this.posicionOrientacionObjeto(this.moneda3, 80 * (Math.PI / 180), 0.44));
    this.add(this.posicionOrientacionObjeto(this.moneda4, 45 * (Math.PI / 180), 0.71));
    this.add(this.posicionOrientacionObjeto(this.escudo1, 0 * (Math.PI / 180), 0.8));
    this.add(this.posicionOrientacionObjeto(this.escudo2, 0 * (Math.PI / 180), 0.35));
    this.add(this.posicionOrientacionObjeto(this.escudo3, 0 * (Math.PI / 180), 0.92));
    this.add(this.posicionOrientacionObjeto(this.pinchos1, 180 * (Math.PI / 180), 0.4));
    this.add(this.posicionOrientacionObjeto(this.pinchos2, 250 * (Math.PI / 180), 0.88));
    // this.add(this.posicionOrientacionObjeto(this.cubo, 90*(Math.PI/180), 0.2));
    this.add(this.posicionOrientacionCoche());

    
    this.add(this.ovni1);
    this.add(this.circuito);
    
    this.animacionOvni();
    //this.animacionCorazon();
    this.animacionPuertas();

    this.onKeyDown = this.onKeyDown.bind(this);
    addEventListener('keydown', this.onKeyDown, false);
    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
    addEventListener('mousedown', this.onDocumentMouseDown, false);
  }

  asignarCamara(camara){
    this.camera = camara;
  }

  onKeyDown(event) {
    // Comprueba qué tecla se ha presionado
    switch (event.keyCode) {
      case 37: // Tecla izquierda
        // Ejecuta la función correspondiente
        this.setAnguloCoche(this.angulo -= (5 * (Math.PI / 180)));
        break;
      case 39: // Tecla derecha
        // Ejecuta la función correspondiente
        this.setAnguloCoche(this.angulo += (5 * (Math.PI / 180)));
        break;
      default:
        // No hacer nada si se presiona otra tecla
        break;
    }
  }

  onDocumentMouseDown(event) {
    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();


    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera); // Raycaster

    var pickedObjects = raycaster.intersectObjects([this.ovni1, this.corazon], true);

    if (pickedObjects.length > 0) {
      var selectedObject = pickedObjects[0].object;
      this.disparar(selectedObject);
      if(selectedObject == this.ovni1) console.log("Ovni seleccionado");
      else if (selectedObject == this.corazon)  console.log("Corazon seleccionado");
    }

  }

  disparar(objeto) {
    // Obtener la posición actual del coche
    var posicionCoche = this.posOrCoche.getWorldPosition(new THREE.Vector3());

    // Obtener la posición del objeto seleccionado con el ratón
    var posicionObjetoSeleccionado = objeto.getWorldPosition(new THREE.Vector3());;

    // Crear una instancia del objeto 3D con forma de bala
    var bala = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    bala.position.copy(posicionCoche);

    // Añadir la bala a la escena
    this.add(bala);

    // Animar el objeto bala desde la posición del coche hasta la posición del objeto seleccionado
    var velocidad = 0.05; // ajusta la velocidad de la bala según lo necesites
    var direccion = posicionObjetoSeleccionado.clone().sub(posicionCoche).normalize();
    var distancia = posicionCoche.distanceTo(posicionObjetoSeleccionado);

    var duracionAnimacion = distancia / velocidad;

    var tween = new TWEEN.Tween(bala.position)
        .to(posicionObjetoSeleccionado, duracionAnimacion)
        .onComplete(() => {
            // Eliminar la bala de la escena al finalizar la animación
            this.remove(bala);
        })
        .start();
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
    var resolution = 100;

    // Radio del tubo
    this.tubeRadius = 1;

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

  createEscudo() {
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.8, 0.3, 0.5, 1.2);
    shape.quadraticCurveTo(0.2, 1, 0, 1.4);
    shape.quadraticCurveTo(-0.2, 1, -0.5, 1.2);
    shape.quadraticCurveTo(-0.8, 0.3, 0, 0);
    
    var options = { depth: 0.5, steps: 2, curveSegments: 10, bevelEnabled: false }; //etc
    var geometry1 = new THREE.ExtrudeGeometry(shape, options);

    var forma = new THREE.Mesh(geometry1, this.material);
    forma.scale.set(0.5,0.5,0.5);
    forma.position.y = -0.01;
    return forma;
  }

  createPinchos() {
    var shape = new THREE.Shape();
    shape.moveTo(-1, 0);
    shape.quadraticCurveTo(0, 1.5, 1, 0);
    shape.lineTo(1, 1.1);
    shape.lineTo(0.85, 0.8);
    shape.lineTo(0.7, 1.1);
    shape.lineTo(0.55, 0.8);
    shape.lineTo(0.4, 1.1);
    shape.lineTo(0.25, 0.8);
    shape.lineTo(0.15, 1.1);
    shape.lineTo(0, 0.8);
    shape.lineTo(-0.15, 1.1);
    shape.lineTo(-0.25, 0.8);
    shape.lineTo(-0.4, 1.1);
    shape.lineTo(-0.55, 0.8);
    shape.lineTo(-0.7, 1.1);
    shape.lineTo(-0.85, 0.8);
    shape.lineTo(-1, 1.1);


    var options = { depth: 0.5, steps: 2, curveSegments: 10, bevelEnabled: false }; //etc
    var geometry1 = new THREE.ExtrudeGeometry(shape, options);

    var forma = new THREE.Mesh(geometry1, this.material);
    forma.position.y = -0.8;
    //forma.scale();
    return forma;
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

    puertas.scale.set(2, 2, 2);
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

  createOvni() {
    var ov = new THREE.Object3D();

    var points = [];
    points.push(new THREE.Vector2(0.001, -0.5)); // Punto en el plano XY con curvatura
    points.push(new THREE.Vector2(0.8, -0.4)); // Punto en el eje X
    points.push(new THREE.Vector2(1.0, -0.2)); // Punto en el eje X
    points.push(new THREE.Vector2(1.5, -0.1)); // Punto en el plano XY
    points.push(new THREE.Vector2(1.5, 0.1)); // Punto en el plano XY
    points.push(new THREE.Vector2(1.0, 0.2)); // Punto en el eje X
    points.push(new THREE.Vector2(0.8, 0.4)); // Punto en el eje X
    points.push(new THREE.Vector2(0.001, 0.5)); // Punto base
    

    this.shape = new THREE.Shape(points);
    this.phiLength = 0; // Ángulo de revolución completo

    ov = this.createFormaOvni();
    ov.scale.set(0.3, 0.3, 0.3);

    return ov;
  }

  createFormaOvni(){
    var platillo = new THREE.Mesh (new THREE.LatheGeometry(this.shape.getPoints(), 15, this.phiLength, 2 * Math.PI +0.1), this.material);
    
    var formaEsfera = new THREE.SphereGeometry (0.5, 5, 5);
    formaEsfera.translate(0,0.4,0);
    var esfera = new THREE.Mesh (formaEsfera, this.material);

    var forma = new CSG();
    forma.union([platillo,esfera]);
    return forma.toMesh();
  }

  animacionOvni() {
    // Punto 7
    var punto = new THREE.Vector3(-15, 8, 6);

    // Radio del anillo
    var radioAnillo = 4;

    // Crear puntos para el spline del anillo
    var puntosAnillo = [];
    for (var i = 0; i < Math.PI * 2; i += 0.1) {
        var x = punto.x + Math.cos(i) * radioAnillo;
        var y = punto.y + Math.sin(i) * radioAnillo;
        var z = punto.z;
        puntosAnillo.push(new THREE.Vector3(x, y, z));
    }

    // Crear el spline cerrado del anillo
    var splineAnillo = new THREE.CatmullRomCurve3(puntosAnillo, true);

    // Se dibuja con esto
    // var resolutionAnillo = 100;
    // var geometryAnillo = new THREE.BufferGeometry().setFromPoints(splineAnillo.getPoints(resolutionAnillo));
    // var materialAnillo = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // var splineMeshAnillo = new THREE.Line(geometryAnillo, materialAnillo);
    // this.add(splineMeshAnillo);

    // Se necesitan los binormales del spline
    var segmentos = 100;
    var binormales = splineAnillo.computeFrenetFrames(segmentos, true).binormals;

    // Parámetros para la animación
    var origen = { t: 0 };
    var destino = { t: 1 };
    var tiempo = 10000;

    // Crear animación con Tween
    var animacion = new TWEEN.Tween(origen).to(destino, tiempo).repeat(Infinity).onUpdate(() => {
        var posicion = splineAnillo.getPointAt(origen.t);
        this.ovni1.position.copy(posicion);
        var tangente = splineAnillo.getTangentAt(origen.t);
        posicion.add(tangente);
        this.ovni1.up = binormales[Math.floor(origen.t * segmentos)];
        // this.ovni.lookAt(posicion);

    });

    // Comenzar la animación
    animacion.start();
  }

  createCorazon() {
    // Corazon
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();

    var that = this;

    materialLoader.load('../models/corazon/12190_Heart_v1_L3.mtl' ,
      (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load ('../models/corazon/12190_Heart_v1_L3.obj',
        (object) => {
          object.scale.set(0.025, 0.025, 0.025);
          object.rotateX(-90*(Math.PI/180));
          this.corazon = object;
          that.add(object);
          // Llamar a animacionCorazon() después de cargar el modelo
          this.animacionCorazon();
        },null,null);
    } ) ;
  }

  animacionCorazon() {
    var pts = [
      new THREE.Vector3(-6, 4, 20),
      new THREE.Vector3(-7, 4, 19),
      new THREE.Vector3(-8, 4, 20),
      new THREE.Vector3(-7, 4, 21),
      new THREE.Vector3(-5, 4, 19),
      new THREE.Vector3(-4, 4, 20),
      new THREE.Vector3(-5, 4, 21)
    ];

    var splineen8 = new THREE.CatmullRomCurve3(pts, true);

    // Se dibuja con esto
    // var resolutionAnillo = 100;
    // var geometryAnillo = new THREE.BufferGeometry().setFromPoints(splineAnillo.getPoints(resolutionAnillo));
    // var materialAnillo = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // var splineMeshAnillo = new THREE.Line(geometryAnillo, materialAnillo);
    // this.add(splineMeshAnillo);

    var segmentos = 100;
    var binormales = splineen8.computeFrenetFrames(segmentos, true).binormals;

    // Parámetros para la animación
    var origen = { t: 0 };
    var destino = { t: 1 };
    var tiempo = 10000;

    
    // Crear animación con Tween
    var animacion = new TWEEN.Tween(origen).to(destino, tiempo).repeat(Infinity).onUpdate(() => {
        var posicion = splineen8.getPointAt(origen.t);
        this.corazon.position.copy(posicion);
        var tangente = splineen8.getTangentAt(origen.t);
        posicion.add(tangente);
        this.corazon.up = binormales[Math.floor(origen.t * segmentos)];
        // this.ovni.lookAt(posicion);

    });

    // Comenzar la animación
    animacion.start();

    
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


  setAnguloCoche(valor) {
    this.orCoche.rotation.z = valor;
  }


  avanzarCoche(valor) {
    // asegurarse de que el coche se ha cargado antes de actualizar su posición
    var posTmp = this.path.getPointAt(valor);
    this.posOrCoche.position.copy(posTmp);

    var tangente = this.path.getTangentAt(valor);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(valor * this.segments);
    this.posOrCoche.up = this.tubeGeometry.binormals[segmentoActual];
    this.posOrCoche.lookAt(posTmp);
  }

  getPosOrCoche(){
    return this.posOrCoche;
  }

  posicionOrientacionCoche() {
    this.posOrCoche = new THREE.Object3D();

    var orientacion = this.orientacionCoche();

    this.posOrCoche.add(orientacion);
    this.avanzarCoche(this.t);
    return this.posOrCoche;
  }

  orientacionCoche() {
    this.orCoche = new THREE.Object3D();

    var posicion = this.posicionCoche();
    this.orCoche.add(posicion);

    this.setAnguloCoche(this.angulo);

    return this.orCoche;
  }

  getPosCoche(){
    return this.posCoche;
  }

  posicionCoche() {
    this.posCoche = new THREE.Object3D();
    //LANZADOR DE RAYOS
    var rayo1 = new THREE.Object3D();
    var rayo2 = new THREE.Object3D();
    var rayo3 = new THREE.Object3D();

    rayo1.position.x = 0.075;
    rayo2.position.x = 0.15;
    rayo3.position.set(0.075,0.05,0);

    this.posCoche.add(rayo1);
    this.posCoche.add(rayo2);
    this.posCoche.add(rayo3);

    this.createCoche();
    this.posCoche.position.y = this.tubeRadius;

    return this.posCoche;
  }

  posicionOrientacionObjeto(objeto, angulo, punto) {
    this.posOrObjeto = new THREE.Object3D();

    var orientacion = this.orientacionObjeto(objeto, angulo);

    this.posOrObjeto.add(orientacion);
    this.posObjetoTubo(punto);
    return this.posOrObjeto;
  }

  orientacionObjeto(objeto, angulo) {
    this.orObjeto = new THREE.Object3D();

    var posicion = this.posicionObjeto(objeto);
    this.orObjeto.add(posicion);

    this.setAnguloObjeto(angulo);

    return this.orObjeto;
  }

  posicionObjeto(objeto) {
    this.posObjeto = new THREE.Object3D();
    this.posObjeto.add(objeto);
    this.posObjeto.position.y = this.tubeRadius;

    return this.posObjeto;
  }

  // Funcion para detectar las colisiones
  colisiones() {

    for (var i = 0; i < this.posCoche.children.length; i++) {
      var distancia = 0.4;

      this.rayo = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, 1), 0, distancia);

      var tangente = this.path.getTangentAt(this.t);

      this.posCoche.children[i].updateMatrixWorld();
      var origenRayo = new THREE.Vector3();
      origenRayo.setFromMatrixPosition(this.posCoche.children[i].matrixWorld);

      var direccionMirada = this.posOrCoche.getWorldDirection(tangente);

      this.rayo.set(origenRayo, direccionMirada);

      // var rayoVisual = new THREE.ArrowHelper(this.rayo.ray.direction, this.rayo.ray.origin, 0.5, 0xff0000);
      // // Agregar el objeto visual a la escena
      // this.add(rayoVisual);

      var impactos = this.rayo.intersectObjects([this.puerta1, this.moneda1, this.escudo1, this.pinchos1], true);

      if (impactos.length > 0) {
        console.log("Colisión detectada" + impactos[0].object);
      }
    }
  }

  createGUI(gui, titleGui) {

  }

  update() {
    TWEEN.update();
    this.t = (this.t + 0.0005) % 1;
    this.avanzarCoche(this.t);
    this.setAnguloCoche(this.angulo);
    this.colisiones();
  }
}

export { Juego }
