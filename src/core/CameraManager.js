import * as THREE from 'three';

export class CameraManager {
  constructor(canvas) {
    this.canvas = canvas;
    const aspect = canvas.clientWidth / canvas.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(60, 50, 60);
    this.camera.lookAt(0, 0, 0);

    this._presets = {
      birdEye: { position: new THREE.Vector3(0, 120, 0.1), target: new THREE.Vector3(0, 0, 0) },
      overview: { position: new THREE.Vector3(60, 50, 60), target: new THREE.Vector3(0, 0, 0) },
      street: { position: new THREE.Vector3(0, 2, 20), target: new THREE.Vector3(0, 2, 0) }
    };
  }

  updateAspect(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  applyPreset(name, controls) {
    const preset = this._presets[name];
    if (!preset) return;
    this.camera.position.copy(preset.position);
    if (controls) {
      controls.target.copy(preset.target);
      controls.update();
    }
  }

  focusOn(position, controls, distance = 30) {
    const dir = new THREE.Vector3(1, 0.8, 1).normalize();
    this.camera.position.copy(position).add(dir.multiplyScalar(distance));
    if (controls) {
      controls.target.copy(position);
      controls.update();
    }
  }

  setFOV(fov) {
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }
}
