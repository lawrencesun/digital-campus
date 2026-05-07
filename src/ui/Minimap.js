export class Minimap {
  constructor(camera) {
    this.camera = camera;
    this.container = document.getElementById('minimap-container');
    this.canvas = document.getElementById('minimap-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.buildingRects = [];
    this.scale = 1;
    this.offsetX = 0;
    this.offsetZ = 0;
    this.visible = false;
  }

  setBuildings(buildings, campusSize = 200) {
    this.buildingRects = [];
    const half = campusSize / 2;
    this.scale = 180 / campusSize;
    this.offsetX = 100;
    this.offsetZ = 100;

    for (const b of buildings) {
      const data = b.userData.buildingData;
      if (!data) continue;
      this.buildingRects.push({
        x: data.x - (data.width || 10) / 2,
        z: data.z - (data.depth || 10) / 2,
        w: data.width || 10,
        d: data.depth || 10,
        color: data.minimapColor || '#4fc3f7'
      });
    }
  }

  update() {
    if (!this.visible) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(10, 20, 30, 0.6)';
    ctx.fillRect(0, 0, w, h);

    for (const rect of this.buildingRects) {
      const rx = this.offsetX + rect.x * this.scale;
      const ry = this.offsetZ + rect.z * this.scale;
      const rw = rect.w * this.scale;
      const rh = rect.d * this.scale;

      ctx.fillStyle = rect.color;
      ctx.fillRect(rx, ry, rw, rh);
    }

    const camX = this.offsetX + this.camera.position.x * this.scale;
    const camZ = this.offsetZ + this.camera.position.z * this.scale;

    ctx.beginPath();
    ctx.arc(camX, camZ, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ff4444';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  show() {
    this.visible = true;
    this.container.classList.remove('ui-hidden');
    this.container.classList.add('ui-visible');
  }

  hide() {
    this.visible = false;
    this.container.classList.remove('ui-visible');
    this.container.classList.add('ui-hidden');
  }
}
