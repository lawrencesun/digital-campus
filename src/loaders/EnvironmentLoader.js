import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export class EnvironmentLoader {
  constructor(renderer) {
    this.renderer = renderer;
    this.rgbeLoader = new RGBELoader();
  }

  async loadHDR(url) {
    return new Promise((resolve, reject) => {
      this.rgbeLoader.load(url, (texture) => {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        texture.dispose();
        resolve(envMap);
      }, undefined, reject);
    });
  }
}
