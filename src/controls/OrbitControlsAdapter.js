import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class OrbitControlsAdapter {
  constructor(camera, canvas) {
    this.controls = new OrbitControls(camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 200;
    this.controls.maxPolarAngle = Math.PI / 2.05;
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  update() {
    this.controls.update();
  }

  enable() {
    this.controls.enabled = true;
  }

  disable() {
    this.controls.enabled = false;
  }

  setTarget(x, y, z) {
    this.controls.target.set(x, y, z);
    this.controls.update();
  }

  dispose() {
    this.controls.dispose();
  }
}
