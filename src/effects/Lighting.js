import * as THREE from 'three';

export class Lighting {
  constructor(scene) {
    this.scene = scene;
    this.lights = {};
  }

  setupDefault() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.lights.ambient = ambient;
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff5e6, 1.0);
    sun.position.set(60, 80, 40);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -100;
    sun.shadow.camera.right = 100;
    sun.shadow.camera.top = 100;
    sun.shadow.camera.bottom = -100;
    this.lights.sun = sun;
    this.scene.add(sun);

    const hemi = new THREE.HemisphereLight(0x87ceeb, 0x3a5f0b, 0.3);
    this.lights.hemi = hemi;
    this.scene.add(hemi);
  }

  setSunPosition(x, y, z) {
    if (this.lights.sun) {
      this.lights.sun.position.set(x, y, z);
    }
  }

  setAmbientIntensity(value) {
    if (this.lights.ambient) {
      this.lights.ambient.intensity = value;
    }
  }

  setSunIntensity(value) {
    if (this.lights.sun) {
      this.lights.sun.intensity = value;
    }
  }
}
