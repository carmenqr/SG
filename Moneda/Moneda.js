import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'

class Moneda extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la hMoneda interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Moneda
    var cilin_ext = new THREE.CylinderGeometry(2, 2, 0.45, 40);
    var cilin_cent1 = new THREE.CylinderGeometry(1.75, 1.75, 0.45, 40);
    var cilin_cent2 = new THREE.CylinderGeometry(1.75, 1.75, 0.45, 40);
    var ranura1 = new THREE.BoxGeometry(0.5, 1.5, 0.25);
    var ranura2 = new THREE.BoxGeometry(0.5, 1.5, 0.25);

    // var material = new THREE.MeshNormalMaterial();
    // material.flatShading = true;
    // material.needsUpdate = true;
    var material = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 0.2 }); // Amarillo

    cilin_ext.rotateX(90*(Math.PI/180));
    cilin_ext.translate(0,2,0);
    cilin_cent1.rotateX(90*(Math.PI/180));
    cilin_cent2.rotateX(90*(Math.PI/180));
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

    this.add(this.moneda);
     /* this.add(cilin_extMesh);
     this.add(cilin_cent1Mesh);
     this.add(cilin_cent2Mesh);
     this.add(ranura1Mesh);
   this.add(ranura2Mesh); */

  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientacion y la posicion de la caja
    this.guiControls = new function() {
      this.numRev = 3;

      this.posX = 0.0;
      this.posY = 0.0;
      this.posZ = 0.0;

      //Un boton para dejarlo todo en su posicion inicial 
      //Cuando se pulse se ejecutara esta funcion
      this.reset = function(){
        this.numRev = 3;
      }
    } 
    
    var that = this;
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El metodo listen() permite que si se cambia el valor de la variable en el codigo,
    // el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'numRev', 3, 30, 1)
    .name('Numero de Monedaes: ')
    .onChange(function(){
      that.box.geometry = new THREE.LatheGeometry(that.puntos,
        that.guiControls.numRev,
        0,
        Math.PI *2,);
    });

    folder.add(this.guiControls, 'reset')
    .name('[Reset]');

  }
  
  update () {

    //this.moneda.rotateY(0.05);
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Moneda }


