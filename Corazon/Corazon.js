import * as THREE from 'three'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'

class Corazon extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la hCorazon interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Corazon
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();

    var that = this;

    materialLoader.load('corazon/12190_Heart_v1_L3.mtl' ,
      (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load ('corazon/12190_Heart_v1_L3.obj',
        (object) => {
          that.add(object);
        },null,null);
    } ) ;

    that.rotateX(-90*(Math.PI/180));
    that.scale.set(0.15, 0.15, 0.15);

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
    .name('Numero de Corazones: ')
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

    // this.rotateZ(0.05);
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Corazon }


