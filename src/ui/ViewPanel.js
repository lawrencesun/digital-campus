export class ViewPanel {
  constructor() {
    this.panel = document.getElementById('view-panel');
    this.callbacks = [];
    this._init();
  }

  _init() {
    const options = this.panel.querySelectorAll('.view-option');
    options.forEach((btn) => {
      btn.addEventListener('click', () => {
        const viewName = btn.dataset.view;
        options.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        for (const cb of this.callbacks) {
          cb(viewName);
        }
      });
    });
  }

  onSelect(callback) {
    this.callbacks.push(callback);
  }

  setActive(viewName) {
    const options = this.panel.querySelectorAll('.view-option');
    options.forEach((b) => {
      b.classList.toggle('active', b.dataset.view === viewName);
    });
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
