export class Toolbar {
  constructor() {
    this.container = document.getElementById('toolbar');
    this.callbacks = {};
    this._init();
  }

  _init() {
    const buttons = this.container.querySelectorAll('.tool-btn');
    buttons.forEach((btn) => {
      const action = btn.dataset.action;
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        if (this.callbacks[action]) {
          this.callbacks[action](btn.classList.contains('active'));
        }
      });
    });
  }

  on(action, callback) {
    this.callbacks[action] = callback;
  }

  show() {
    this.container.classList.remove('ui-hidden');
    this.container.classList.add('ui-visible');
  }

  hide() {
    this.container.classList.remove('ui-visible');
    this.container.classList.add('ui-hidden');
  }
}
