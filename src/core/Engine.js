import * as THREE from 'three';
import { RenderManager } from './RenderManager.js';
import { SceneManager } from './SceneManager.js';
import { CameraManager } from './CameraManager.js';
import { Picker } from '../controls/Picker.js';
import { EventBus } from '../utils/helpers.js';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.isRunning = false;
    this.eventBus = new EventBus();
    this.updateCallbacks = [];

    this.renderManager = new RenderManager(canvas);
    this.sceneManager = new SceneManager(this.renderManager.renderer);
    this.cameraManager = new CameraManager(canvas);

    this.scene = this.sceneManager.scene;
    this.camera = this.cameraManager.camera;
    this.renderer = this.renderManager.renderer;

    this.pickableObjects = [];

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  init() {
    this.sceneManager.setupDefaultLights();
    this.sceneManager.setupFog();
    this.picker = new Picker(this.camera, this.scene, this.canvas);
    this._setupPicking();
  }

  _setupPicking() {
    this.picker.on('hover', (obj) => {
      this.eventBus.emit('object-hover', obj);
    });
    this.picker.on('hoverout', () => {
      this.eventBus.emit('object-hoverout');
    });
    this.picker.on('click', (obj) => {
      this.eventBus.emit('object-click', obj);
    });
  }

  registerPickable(object) {
    this.pickableObjects.push(object);
    this.picker.addPickable(object);
  }

  unregisterPickable(object) {
    const idx = this.pickableObjects.indexOf(object);
    if (idx !== -1) this.pickableObjects.splice(idx, 1);
    this.picker.removePickable(object);
  }

  onUpdate(callback) {
    this.updateCallbacks.push(callback);
  }

  start() {
    this.isRunning = true;
    this.clock.start();
    this._animate();
  }

  stop() {
    this.isRunning = false;
  }

  _animate() {
    if (!this.isRunning) return;
    requestAnimationFrame(() => this._animate());

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    for (const cb of this.updateCallbacks) {
      cb(delta, elapsed);
    }

    this.renderManager.render(this.scene, this.camera);
  }

  _onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.cameraManager.updateAspect(w, h);
    this.renderManager.setSize(w, h);
  }

  dispose() {
    window.removeEventListener('resize', this._onResize);
    this.isRunning = false;
    this.renderer.dispose();
  }
}
