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

      if (options.position) {
        model.position.set(options.position.x, options.position.y, options.position.z);
      }
      if (options.rotation) {
        model.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);
      }
      if (options.scale) {
        model.scale.set(options.scale, options.scale, options.scale);
      }

      model.userData.buildingId = id;

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
