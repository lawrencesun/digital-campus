import * as THREE from 'three';

export class Skybox {
  createGradient(topColor = 0x87ceeb, bottomColor = 0xc8dde6) {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 512;

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);

    const top = new THREE.Color(topColor);
    const bottom = new THREE.Color(bottomColor);
    gradient.addColorStop(0, `rgb(${Math.round(top.r * 255)},${Math.round(top.g * 255)},${Math.round(top.b * 255)})`);
    gradient.addColorStop(1, `rgb(${Math.round(bottom.r * 255)},${Math.round(bottom.g * 255)},${Math.round(bottom.b * 255)})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;

    const geo = new THREE.SphereGeometry(400, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide
    });

    const skybox = new THREE.Mesh(geo, mat);
    skybox.name = 'skybox';
    return skybox;
  }
}
