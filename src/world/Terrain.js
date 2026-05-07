import * as THREE from 'three';

export class Terrain {
  constructor(options = {}) {
    this.size = options.size || 200;
    this.color = options.color || 0x4a7c59;
    this.segments = options.segments || 40;
  }

  create() {
    const geo = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
    geo.rotateX(-Math.PI / 2);

    const mat = new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.9,
      metalness: 0.0,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    mesh.name = 'terrain';
    mesh.position.y = -0.01;
    return mesh;
  }
}
