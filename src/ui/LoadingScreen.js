export class LoadingScreen {
  constructor() {
    this.screen = document.getElementById('loading-screen');
    this.progressBar = document.getElementById('progress-bar');
    this.loadingText = document.getElementById('loading-text');
    this._progress = 0;
  }

  setProgress(value) {
    this._progress = Math.min(1, Math.max(0, value));
    const pct = Math.round(this._progress * 100);
    this.progressBar.style.width = pct + '%';
    this.loadingText.textContent = `正在加载场景资源... ${pct}%`;
  }

  setText(text) {
    this.loadingText.textContent = text;
  }

  hide() {
    this.screen.classList.add('fade-out');
    setTimeout(() => {
      this.screen.style.display = 'none';
    }, 700);
  }

  show() {
    this.screen.style.display = 'flex';
    this.screen.classList.remove('fade-out');
  }
}
