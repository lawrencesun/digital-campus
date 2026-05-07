import * as THREE from 'three';

export class SceneManager {
  constructor(renderer) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.layers = {};
  }

  setupDefaultLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    ambient.name = '__ambientLight';
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.name = '__directionalLight';
    dirLight.position.set(50, 80, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 300;
    this.scene.add(dirLight);

    const hemi = new THREE.HemisphereLight(0x87ceeb, 0x3a5f0b, 0.4);
    hemi.name = '__hemiLight';
    this.scene.add(hemi);
  }

  setupFog(color = 0xc8dde6, near = 80, far = 250) {
    this.scene.fog = new THREE.Fog(color, near, far);
    this.scene.background = new THREE.Color(color);
  }

  setLayer(name, group) {
    group.name = `layer_${name}`;
    this.layers[name] = group;
    this.scene.add(group);
  }

  getLayer(name) {
    return this.layers[name] || null;
  }

  toggleLayer(name, visible) {
    const layer = this.getLayer(name);
    if (layer) layer.visible = visible;
  }

  add(object) {
    this.scene.add(object);
  }

  remove(object) {
    this.scene.remove(object);
  }
}
