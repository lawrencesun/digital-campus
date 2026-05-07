import * as THREE from 'three';

export class RenderManager {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }

  setSize(width, height) {
    this.renderer.setSize(width, height);
  }

  setExposure(value) {
    this.renderer.toneMappingExposure = value;
  }

  dispose() {
    this.renderer.dispose();
  }
}
