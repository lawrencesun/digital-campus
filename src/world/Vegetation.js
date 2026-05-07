import * as THREE from 'three';

export class Vegetation {
  createTree(trunkHeight = 2, crownRadius = 1.5) {
    const group = new THREE.Group();
    group.name = 'tree';

    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, trunkHeight, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = trunkHeight / 2;
    trunk.castShadow = true;
    group.add(trunk);

    const crownGeo = new THREE.SphereGeometry(crownRadius, 8, 8);
    const crownMat = new THREE.MeshStandardMaterial({ color: 0x2d8a4e, roughness: 0.8 });
    const crown = new THREE.Mesh(crownGeo, crownMat);
    crown.position.y = trunkHeight + crownRadius * 0.6;
    crown.castShadow = true;
    group.add(crown);

    return group;
  }

  createGrassPatch(width, depth) {
    const geo = new THREE.PlaneGeometry(width, depth);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x5a9e3e,
      roughness: 1.0,
      metalness: 0.0
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.01;
    mesh.receiveShadow = true;
    return mesh;
  }
}
