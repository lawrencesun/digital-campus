export class LayerPanel {
  constructor() {
    this.panel = document.getElementById('layer-panel');
    this.callbacks = {};
    this._init();
  }

  _init() {
    const checkboxes = this.panel.querySelectorAll('input[data-layer]');
    checkboxes.forEach((cb) => {
      const layerName = cb.dataset.layer;
      cb.addEventListener('change', () => {
        if (this.callbacks[layerName]) {
          this.callbacks[layerName](cb.checked);
        }
      });
    });
  }

  onToggle(layerName, callback) {
    this.callbacks[layerName] = callback;
  }

  show() {
    this.panel.classList.remove('ui-hidden');
    this.panel.classList.add('ui-visible');
  }

  hide() {
    this.panel.classList.remove('ui-visible');
    this.panel.classList.add('ui-hidden');
  }
}
