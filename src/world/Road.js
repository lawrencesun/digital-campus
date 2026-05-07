import * as THREE from 'three';

export class Road {
  create(points, width = 4, color = 0x444444) {
    const vectors = points.map((p) => new THREE.Vector3(p.x, 0.02, p.z));
    const curve = new THREE.CatmullRomCurve3(vectors);

    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);

    const extrudeSettings = {
      steps: Math.max(20, points.length * 10),
      extrudePath: curve
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.95,
      metalness: 0.0
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    mesh.name = 'road';
    return mesh;
  }
}
