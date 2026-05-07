import * as THREE from 'three';

export class ProceduralBuilding {
  create({ width = 10, height = 12, depth = 10, color = 0xcccccc, roofColor = 0x996633, floors = 4 } = {}) {
    const group = new THREE.Group();
    group.name = 'procedural-building';

    const bodyGeo = new THREE.BoxGeometry(width, height, depth);
    const bodyMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.7,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = 0;
    group.add(body);

    this._addFloorLines(group, width, height, depth, floors);
    this._addWindows(group, width, height, depth, floors);
    this._addRoof(group, width, depth, roofColor);

    return group;
  }

  _addFloorLines(group, width, height, depth, floors) {
    const floorHeight = height / floors;
    const lineMat = new THREE.LineBasicMaterial({ color: 0x888888 });

    for (let i = 1; i < floors; i++) {
      const y = -height / 2 + i * floorHeight;
      const points = [
        new THREE.Vector3(-width / 2, y, depth / 2 + 0.01),
        new THREE.Vector3(width / 2, y, depth / 2 + 0.01)
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, lineMat);
      group.add(line);

      const pointsBack = [
        new THREE.Vector3(-width / 2, y, -depth / 2 - 0.01),
        new THREE.Vector3(width / 2, y, -depth / 2 - 0.01)
      ];
      const geoBack = new THREE.BufferGeometry().setFromPoints(pointsBack);
      group.add(new THREE.Line(geoBack, lineMat));
    }
  }

  _addWindows(group, width, height, depth, floors) {
    const floorHeight = height / floors;
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x88bbdd,
      roughness: 0.3,
      metalness: 0.5,
      emissive: 0x224466,
      emissiveIntensity: 0.2
    });

    const windowWidth = Math.min(1.2, (width - 1) / (Math.max(1, Math.floor(width / 2))));
    const windowHeight = floorHeight * 0.5;

    for (let floor = 0; floor < floors; floor++) {
      const y = -height / 2 + floor * floorHeight + floorHeight * 0.55;
      const windowCount = Math.max(1, Math.floor(width / 2.5));

      for (let w = 0; w < windowCount; w++) {
        const x = -width / 2 + (width / (windowCount + 1)) * (w + 1);

        const winGeo = new THREE.PlaneGeometry(windowWidth, windowHeight);
        const winFront = new THREE.Mesh(winGeo, windowMat);
        winFront.position.set(x, y, depth / 2 + 0.02);
        group.add(winFront);

        const winBack = new THREE.Mesh(winGeo, windowMat);
        winBack.position.set(x, y, -depth / 2 - 0.02);
        winBack.rotation.y = Math.PI;
        group.add(winBack);
      }
    }
  }

  _addRoof(group, width, depth, roofColor) {
    const roofGeo = new THREE.BoxGeometry(width + 0.5, 0.3, depth + 0.5);
    const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.8 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 0 + 0.15;
    roof.castShadow = true;
    group.add(roof);
  }
}
