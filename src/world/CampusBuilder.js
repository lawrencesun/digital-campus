import * as THREE from 'three';
import { ModelManager } from '../loaders/ModelManager.js';
import { ProceduralBuilding } from './ProceduralBuilding.js';
import { Terrain } from './Terrain.js';
import { Road } from './Road.js';
import { Vegetation } from './Vegetation.js';
import { Skybox } from './Skybox.js';

export class CampusBuilder {
  constructor(sceneManager, modelManager) {
    this.sceneManager = sceneManager;
    this.modelManager = modelManager;
    this.buildings = [];
    this.layers = {
      buildings: new THREE.Group(),
      roads: new THREE.Group(),
      vegetation: new THREE.Group(),
      terrain: new THREE.Group()
    };

    for (const [name, group] of Object.entries(this.layers)) {
      this.sceneManager.setLayer(name, group);
    }
  }

  async build(buildingsData, campusConfig) {
    this.buildingsData = buildingsData;

    this._buildTerrain(campusConfig);
    this._buildRoads(campusConfig);
    this._buildBuildings(buildingsData);
    this._buildVegetation(campusConfig);
    this._buildSkybox(campusConfig);

    return this.buildings;
  }

  _buildTerrain(config) {
    const terrain = new Terrain(config.terrain || {});
    const mesh = terrain.create();
    this.layers.terrain.add(mesh);
  }

  _buildRoads(config) {
    if (!config.roads) return;
    const road = new Road();
    for (const roadData of config.roads) {
      const mesh = road.create(roadData.points, roadData.width || 4, roadData.color || 0x444444);
      this.layers.roads.add(mesh);
    }
  }

  _buildBuildings(buildingsData) {
    for (const data of buildingsData) {
      let buildingMesh;

      if (data.modelUrl) {
        continue;
      } else {
        const procBuilding = new ProceduralBuilding();
        buildingMesh = procBuilding.create({
          width: data.width || 10,
          height: data.height || 12,
          depth: data.depth || 10,
          color: data.color || 0xcccccc,
          roofColor: data.roofColor || 0x996633,
          floors: data.floors || 4
        });
        buildingMesh.position.set(data.x || 0, (data.height || 12) / 2, data.z || 0);
      }

      if (buildingMesh) {
        buildingMesh.userData.buildingId = data.id;
        buildingMesh.userData.buildingData = data;
        this.layers.buildings.add(buildingMesh);
        this.buildings.push(buildingMesh);
      }
    }
  }

  async loadExternalModels() {
    const externalBuildings = this.buildingsData.filter((b) => b.modelUrl);
    if (externalBuildings.length === 0) return;

    for (const data of externalBuildings) {
      this.modelManager.addToQueue(data.id, data.modelUrl, {
        position: { x: data.x || 0, y: 0, z: data.z || 0 },
        scale: data.scale || 1,
        targetHeight: data.targetHeight || data.height || null
      });
    }

    await this.modelManager.loadAll();

    for (const data of externalBuildings) {
      const model = this.modelManager.get(data.id);
      if (model) {
        const cloned = model.clone();
        cloned.userData.buildingId = data.id;
        if (model.userData.actualSize) {
          cloned.userData.buildingData = {
            ...data,
            width: parseFloat(model.userData.actualSize.width.toFixed(1)),
            depth: parseFloat(model.userData.actualSize.depth.toFixed(1)),
            height: parseFloat(model.userData.actualSize.height.toFixed(1))
          };
        } else {
          cloned.userData.buildingData = data;
        }
        this.layers.buildings.add(cloned);
        this.buildings.push(cloned);
      }
    }
  }

  _buildVegetation(config) {
    if (!config.vegetation) return;
    const veg = new Vegetation();
    for (const tree of config.vegetation.trees || []) {
      const mesh = veg.createTree(tree.trunkHeight || 2, tree.crownRadius || 1.5);
      mesh.position.set(tree.x, 0, tree.z);
      this.layers.vegetation.add(mesh);
    }
  }

  _buildSkybox(config) {
    const skybox = new Skybox();
    const sky = skybox.createGradient(config.skyTopColor, config.skyBottomColor);
    this.sceneManager.add(sky);
  }
}
