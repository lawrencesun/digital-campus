export class ImportedModel {
  constructor(modelManager) {
    this.modelManager = modelManager;
  }

  async load(id, url, options = {}) {
    this.modelManager.addToQueue(id, url, options);
    await this.modelManager.loadAll();
    return this.modelManager.get(id);
  }
}
