import * as THREE from 'three';

export class Road {
  create(points, width = 4, color = 0x444444) {
    const group = new THREE.Group();
    group.name = 'road';

    const vectors = points.map((p) => new THREE.Vector3(p.x, 0, p.z));
    const curve = new THREE.CatmullRomCurve3(vectors);

    const mainMesh = this._createRibbon(curve, width, 0.02, color, 0.95);
    group.add(mainMesh);

    const edgeMesh = this._createRibbon(curve, width + 1.6, 0.015, 0x666666, 0.9);
    edgeMesh.renderOrder = -1;
    group.add(edgeMesh);

    return group;
  }

  _createRibbon(curve, width, y, color, roughness) {
    const segments = 64;
    const halfWidth = width / 2;
    const vertices = [];
    const indices = [];
    const uvs = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);

      const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const left = point.clone().add(perp.clone().multiplyScalar(halfWidth));
      const right = point.clone().add(perp.clone().multiplyScalar(-halfWidth));

      vertices.push(left.x, y, left.z);
      vertices.push(right.x, y, right.z);

      uvs.push(0, t * segments);
      uvs.push(1, t * segments);

      if (i < segments) {
        const base = i * 2;
        indices.push(base, base + 2, base + 1);
        indices.push(base + 1, base + 2, base + 3);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0.0,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    return mesh;
  }
}
