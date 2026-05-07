import * as THREE from 'three';
import { EventBus } from '../utils/helpers.js';

export class Picker {
  constructor(camera, scene, canvas) {
    this.camera = camera;
    this.scene = scene;
    this.canvas = canvas;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.pickableObjects = [];
    this.eventBus = new EventBus();
    this._hoveredObject = null;
    this._originalEmissive = new Map();

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onClick = this._onClick.bind(this);
    canvas.addEventListener('mousemove', this._onMouseMove);
    canvas.addEventListener('click', this._onClick);
  }

  addPickable(object) {
    this.pickableObjects.push(object);
  }

  removePickable(object) {
    const idx = this.pickableObjects.indexOf(object);
    if (idx !== -1) this.pickableObjects.splice(idx, 1);
  }

  _getMouseNDC(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  _findRootPickableObject(object3D) {
    let current = object3D;
    while (current.parent && current.parent !== this.scene) {
      if (current.userData.buildingId) return current;
      current = current.parent;
    }
    return current.userData.buildingId ? current : object3D;
  }

  _onMouseMove(event) {
    this._getMouseNDC(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.pickableObjects, true);

    if (intersects.length > 0) {
      const rootObj = this._findRootPickableObject(intersects[0].object);
      if (this._hoveredObject !== rootObj) {
        if (this._hoveredObject) {
          this._restoreEmissive(this._hoveredObject);
          this.eventBus.emit('hoverout', this._hoveredObject);
        }
        this._hoveredObject = rootObj;
        this._highlightObject(rootObj);
        this.eventBus.emit('hover', rootObj);
      }
    } else {
      if (this._hoveredObject) {
        this._restoreEmissive(this._hoveredObject);
        this.eventBus.emit('hoverout', this._hoveredObject);
        this._hoveredObject = null;
      }
    }
  }

  _onClick(event) {
    this._getMouseNDC(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.pickableObjects, true);
    if (intersects.length > 0) {
      const rootObj = this._findRootPickableObject(intersects[0].object);
      this.eventBus.emit('click', rootObj);
    }
  }

  _highlightObject(obj) {
    obj.traverse((child) => {
      if (child.isMesh && child.material) {
        if (!this._originalEmissive.has(child.uuid)) {
          const mat = child.material;
          this._originalEmissive.set(child.uuid, mat.emissive ? mat.emissive.clone() : new THREE.Color(0));
          if (mat.emissive) {
            mat.emissive.set(0x223344);
          }
        }
      }
    });
  }

  _restoreEmissive(obj) {
    obj.traverse((child) => {
      if (child.isMesh && child.material && this._originalEmissive.has(child.uuid)) {
        child.material.emissive.copy(this._originalEmissive.get(child.uuid));
        this._originalEmissive.delete(child.uuid);
      }
    });
  }

  on(event, callback) {
    this.eventBus.on(event, callback);
  }

  dispose() {
    this.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('click', this._onClick);
  }
}
