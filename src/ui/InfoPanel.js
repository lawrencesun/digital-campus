export class InfoPanel {
  constructor() {
    this.panel = document.getElementById('info-panel');
    this.titleEl = document.getElementById('info-panel-title');
    this.bodyEl = document.getElementById('info-panel-body');
    this.closeBtn = document.getElementById('info-panel-close');
    this._currentId = null;

    this.closeBtn.addEventListener('click', () => this.hide());
  }

  show(buildingData) {
    if (!buildingData) return;
    this._currentId = buildingData.id;
    this.titleEl.textContent = buildingData.name || '未知建筑';

    let html = '';
    if (buildingData.type) {
      html += `<div class="info-row"><span class="info-label">类型</span><span class="info-value">${buildingData.type}</span></div>`;
    }
    if (buildingData.floors) {
      html += `<div class="info-row"><span class="info-label">楼层数</span><span class="info-value">${buildingData.floors} 层</span></div>`;
    }
    if (buildingData.area) {
      html += `<div class="info-row"><span class="info-label">建筑面积</span><span class="info-value">${buildingData.area} m²</span></div>`;
    }
    if (buildingData.year) {
      html += `<div class="info-row"><span class="info-label">建成年份</span><span class="info-value">${buildingData.year}</span></div>`;
    }
    if (buildingData.status) {
      html += `<div class="info-row"><span class="info-label">当前状态</span><span class="info-value">${buildingData.status}</span></div>`;
    }
    if (buildingData.description) {
      html += `<div class="info-desc">${buildingData.description}</div>`;
    }

    this.bodyEl.innerHTML = html;
    this.panel.classList.remove('ui-hidden');
    this.panel.classList.add('ui-visible');
  }

  hide() {
    this._currentId = null;
    this.panel.classList.remove('ui-visible');
    this.panel.classList.add('ui-hidden');
  }

  getCurrentId() {
    return this._currentId;
  }
}
