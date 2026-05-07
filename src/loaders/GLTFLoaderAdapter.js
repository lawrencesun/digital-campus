import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class GLTFLoaderAdapter {
  constructor() {
    this.loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.loader.setDRACOLoader(dracoLoader);
    this.cache = new Map();
  }

  async load(url, onProgress) {
    if (this.cache.has(url)) {
      const cached = this.cache.get(url).clone();
      return cached;
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          this.cache.set(url, model.clone());
          resolve(model);
        },
        (event) => {
          if (onProgress && event.total) {
            onProgress(event.loaded / event.total);
          }
        },
        (error) => reject(error)
      );
    });
  }

  dispose() {
    this.cache.clear();
  }
}
