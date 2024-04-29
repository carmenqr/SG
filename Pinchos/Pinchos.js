
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class Pinchos extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshNormalMaterial();
    this.material.flatShading = true;
    this.material.needsUpdate = true;

    this.pinchos = this.createForma();
    
    this.add(this.pinchos);
  }

  createForma(){

    /* var shape = new THREE.Shape();
    shape.moveTo(0,0);
    shape.lineTo(0.3,0);
    shape.lineTo(0.3,0.2);
    shape.lineTo(0,0.2);

    var pts = [
      new THREE.Vector3(0, 0, 0),
      //new THREE.Vector3(0, 0.25, 0.5), 
      new THREE.Vector3(0, 0.5, 1), 
      //new THREE.Vector3(0, 0.25, 1.5),
      new THREE.Vector3(0, 0, 2), 
    ];

    // Crear la curva de Catmull-Rom cerrada
    var path = new THREE.CatmullRomCurve3(pts);

    var options = {steps: 50, curveSegments: 4, extrudePath: path};
    var base = new THREE.ExtrudeGeometry(shape, options); 

    var forma = new THREE.Mesh(base, this.material);
    return forma;
    */

    var cilExt = new THREE.CylinderGeometry(1,1,1,10,1);
    var cilInt = new THREE.CylinderGeometry(0.7,0.7,1,10,1);
    var corte = new THREE.BoxGeometry(3,1,3);
    
    
    cilExt.rotateX(Math.PI / 2);
    cilInt.rotateX(Math.PI / 2);
    corte.translate(0,-0.5,0);
    

    var cilExtMesh = new THREE.Mesh (cilExt, this.material);
    var cilIntMesh = new THREE.Mesh (cilInt, this.material);
    var corteMesh = new THREE.Mesh (corte, this.material);
    
    
    var csg = new CSG();
    //csg.union([cilExtMesh]);
    csg.subtract([cilExtMesh,cilIntMesh]);
    csg.subtract([corteMesh]);

    /* var ejex = 0, ejey = 1.2, ejez = 0, gradosZ = 0;
    for (let i = 0; i < 4; i++){
      var cono = new THREE.CylinderGeometry(0.001,0.1,0.5,60,1);
      cono.rotateZ(gradosZ * (-Math.PI / 180));
      gradosZ += 22.5;
      ejey -= 0.1 * i;
      for (let j = 0; j < 3; j++){
        var cono2 = cono.clone();
        cono2.translate(ejex, ejey, ejez);
        var conoMesh = new THREE.Mesh (cono2, this.material);
        csg.union([conoMesh]);
        if (j%2 == 0) ejez += 0.3;
        else ejez -= 0.3 * 2 
      }
      if(i == 2) ejex += 0.2;
      else ejex += 0.4;  
    }

    ejex = -0.4, ejey = 1.2, ejez = 0, gradosZ = 22.5;
    for (let i = 1; i < 4; i++){
      var cono = new THREE.CylinderGeometry(0.001,0.1,0.5,60,1);
      cono.rotateZ(gradosZ * (Math.PI / 180));
      gradosZ += 22.5;
      ejey -= 0.1 * i;
      for (let j = 0; j < 3; j++){
        var cono2 = cono.clone();
        cono2.translate(ejex, ejey, ejez);
        var conoMesh = new THREE.Mesh (cono2, this.material);
        csg.union([conoMesh]);
        if (j%2 == 0) ejez += 0.3;
        else ejez -= 0.3 * 2 
      }
      if(i == 2) ejex -= 0.2;
      else ejex -= 0.4;  
    } */

    var ejex = 0, ejey = 1.2, ejez = 0, gradosZ = 0;
    for (let i = 0; i < 4; i++) {
        var cono = new THREE.CylinderGeometry(0.001, 0.1, 0.5, 60, 1);
        cono.rotateZ(gradosZ * (-Math.PI / 180));
        gradosZ += 22.5;
        ejey -= 0.1 * i;
        var offsetX = (i == 2) ? 0.2 : 0.4;
        for (let j = 0; j < 3; j++) {
            var cono2 = cono.clone();
            cono2.translate(ejex, ejey, ejez);
            csg.union([new THREE.Mesh(cono2, this.material)]);
            ejez += (j % 2 == 0) ? 0.3 : -0.6;
        }
        ejex += offsetX; 
    }

    ejex = -0.4, ejey = 1.2, ejez = 0, gradosZ = 22.5;
    for (let i = 1; i < 4; i++) {
        var cono = new THREE.CylinderGeometry(0.001, 0.1, 0.5, 60, 1);
        cono.rotateZ(gradosZ * (Math.PI / 180));
        gradosZ += 22.5;
        ejey -= 0.1 * i;
        var offsetX = (i == 2) ? 0.2 : 0.4; 
        for (let j = 0; j < 3; j++) {
            var cono2 = cono.clone();
            cono2.translate(ejex, ejey, ejez);
            csg.union([new THREE.Mesh(cono2, this.material)]);
            ejez += (j % 2 == 0) ? 0.3 : -0.6;
        }
        ejex -= offsetX; 
    }
    
    
    return csg.toMesh();
  }
  

  createGUI(gui, titleGui) {
    
  }
  

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Pinchos }
