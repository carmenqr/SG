
import * as THREE from 'three'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'


class Coche2 extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshNormalMaterial();
    this.material.flatShading = true;
    this.material.needsUpdate = true;

    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load( '../models/coche2/LEGO_CAR_B2.mtl' ,
      (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load( '../models/coche2/LEGO_CAR_B2.obj' ,
          (object) => {
            this.scale.set(0.01, 0.01, 0.01); 
            //this.rotateX(-Math.PI / 2); 
            this.add(object);
          }, null, null);
      });

  }

  createForma() {

  }


  createGUI(gui, titleGui) {
    // Controles para el movimiento de la parte móvil
    this.guiControls = {
      segmentos: 3,
      angulo: 10,
    };

    // Se crea una sección para los controles de la construccion
    var folder = gui.addFolder(titleGui);

    //Para que los valores se actualicen
    var that = this;

    // Estas líneas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add(this.guiControls, 'segmentos', 3, 64, 1)
      .name('Segmentos: ')
      .onChange(function () { that.construccion.geometry = new THREE.LatheGeometry(that.shape.getPoints(), that.guiControls.segmentos, that.phiLength, that.guiControls.angulo) });

    folder.add(this.guiControls, 'angulo', 0, 2 * Math.PI + 0.1, 0.01)
      .name('Ángulo: ')
      .onChange(function () { that.construccion.geometry = new THREE.LatheGeometry(that.shape.getPoints(), that.guiControls.segmentos, that.phiLength, that.guiControls.angulo) });
  }


  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Coche2 }
