import * as THREE from 'three';
import { GLTFLoaderAdapter } from './GLTFLoaderAdapter.js';
import { EventBus } from '../utils/helpers.js';

export class ModelManager {
  constructor() {
    this.adapter = new GLTFLoaderAdapter();
    this.eventBus = new EventBus();
    this.loadedModels = new Map();
    this.queue = [];
    this.totalItems = 0;
    this.loadedItems = 0;
  }

  addToQueue(id, url, options = {}) {
    this.queue.push({ id, url, options });
    this.totalItems++;
  }

  async loadAll() {
    const promises = this.queue.map((item) => this._loadItem(item));
    const results = await Promise.allSettled(promises);

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        this.loadedModels.set(result.value.id, result.value.model);
      }
    }

    return this.loadedModels;
  }

  async _loadItem({ id, url, options }) {
    try {
      const model = await this.adapter.load(url, (progress) => {
        this.eventBus.emit('progress', { id, progress });
      });

      if (options.scale) {
        model.scale.set(options.scale, options.scale, options.scale);
      }

      model.position.set(0, 0, 0);
      model.updateMatrixWorld(true);
      const rawBox = new THREE.Box3().setFromObject(model);
      const rawW = rawBox.max.x - rawBox.min.x;
      const rawH = rawBox.max.y - rawBox.min.y;
      const rawD = rawBox.max.z - rawBox.min.z;

      if (rawH > 0 && (options.targetHeight || options.targetWidth || options.targetDepth)) {
        if (options.targetWidth && options.targetDepth) {
          const scaleH = options.targetHeight ? options.targetHeight / rawH : Infinity;
          const scaleW = options.targetWidth / rawW;
          const scaleD = options.targetDepth / rawD;
          const bestScale = Math.min(scaleH, scaleW, scaleD);
          if (isFinite(bestScale) && bestScale > 0) {
            model.scale.multiplyScalar(bestScale);
          }
        } else if (options.targetHeight) {
          model.scale.multiplyScalar(options.targetHeight / rawH);
        }
      }

      model.position.set(0, 0, 0);
      model.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const minY = box.min.y;

      model.position.set(
        (options.position && options.position.x) || 0,
        0,
        (options.position && options.position.z) || 0
      );
      model.position.x -= center.x;
      model.position.z -= center.z;
      model.position.y -= minY;

      const finalBox = new THREE.Box3().setFromObject(model);
      model.userData.buildingId = id;
      model.userData.actualSize = {
        width: finalBox.max.x - finalBox.min.x,
        height: finalBox.max.y - finalBox.min.y,
        depth: finalBox.max.z - finalBox.min.z
      };

      console.log(
        `[ModelManager] ${id}: actual ${model.userData.actualSize.width.toFixed(1)} x ${model.userData.actualSize.height.toFixed(1)} x ${model.userData.actualSize.depth.toFixed(1)}  at (${model.position.x.toFixed(1)}, ${model.position.y.toFixed(1)}, ${model.position.z.toFixed(1)})`
      );

      this.loadedItems++;
      this.eventBus.emit('item-loaded', {
        id,
        model,
        progress: this.loadedItems / this.totalItems
      });

      return { id, model };
    } catch (err) {
      console.warn(`[ModelManager] Failed to load model: ${url}`, err);
      this.loadedItems++;
      return null;
    }
  }

  get(id) {
    return this.loadedModels.get(id) || null;
  }

  on(event, callback) {
    this.eventBus.on(event, callback);
  }

  dispose() {
    this.adapter.dispose();
    this.loadedModels.clear();
    this.queue = [];
  }
}
