import { Engine } from './core/Engine.js';
import { OrbitControlsAdapter } from './controls/OrbitControlsAdapter.js';
import { CampusBuilder } from './world/CampusBuilder.js';
import { ModelManager } from './loaders/ModelManager.js';
import { InfoPanel } from './ui/InfoPanel.js';
import { Toolbar } from './ui/Toolbar.js';
import { Minimap } from './ui/Minimap.js';
import { LoadingScreen } from './ui/LoadingScreen.js';
import { LayerPanel } from './ui/LayerPanel.js';
import { DayNightCycle } from './effects/DayNightCycle.js';
import { formatTime } from './utils/helpers.js';

class App {
  constructor() {
    this.canvas = document.getElementById('scene-canvas');
    this.engine = new Engine(this.canvas);
    this.loadingScreen = new LoadingScreen();
    this.infoPanel = new InfoPanel();
    this.toolbar = new Toolbar();
    this.minimap = new Minimap(this.engine.camera);
    this.layerPanel = new LayerPanel();
    this.modelManager = new ModelManager();
    this.orbitControls = null;
    this.dayNightCycle = null;
    this.fpsFrames = 0;
    this.fpsTime = 0;
  }

  async start() {
    this.loadingScreen.setProgress(0.1);

    this.engine.init();

    this.orbitControls = new OrbitControlsAdapter(
      this.engine.camera,
      this.canvas
    );
    this.engine.onUpdate(() => this.orbitControls.update());

    this.loadingScreen.setProgress(0.2);

    const [buildingsData, campusConfig] = await Promise.all([
      fetch('/data/buildings.json').then((r) => r.json()),
      fetch('/data/campus-config.json').then((r) => r.json())
    ]);

    this.loadingScreen.setProgress(0.4);

    const campusBuilder = new CampusBuilder(
      this.engine.sceneManager,
      this.modelManager
    );

    await campusBuilder.build(buildingsData, campusConfig);

    this.loadingScreen.setProgress(0.8);

    for (const building of campusBuilder.buildings) {
      this.engine.registerPickable(building);
    }

    this.loadingScreen.setProgress(0.9);

    this.minimap.setBuildings(campusBuilder.buildings);

    this._setupEventHandlers();
    this._setupDayNight();
    this._showUI();

    this.loadingScreen.setProgress(1.0);

    setTimeout(() => {
      this.loadingScreen.hide();
    }, 500);

    this.engine.onUpdate((delta, elapsed) => {
      this._updateFPS(delta);
      if (this.dayNightCycle) {
        this.dayNightCycle.update(delta);
      }
      this.minimap.update();
    });

    this.engine.start();
  }

  _setupEventHandlers() {
    this.engine.eventBus.on('object-click', (obj) => {
      const data = obj.userData.buildingData;
      if (data) {
        this.infoPanel.show(data);
        this.engine.cameraManager.focusOn(
          obj.position.clone().setY(0),
          this.orbitControls.controls,
          35
        );
      }
    });

    this.engine.eventBus.on('object-hover', (obj) => {
      this.canvas.style.cursor = 'pointer';
    });

    this.engine.eventBus.on('object-hoverout', () => {
      this.canvas.style.cursor = 'default';
    });

    this.toolbar.on('reset-camera', () => {
      this.engine.cameraManager.applyPreset('overview', this.orbitControls.controls);
      this.infoPanel.hide();
    });

    this.toolbar.on('toggle-bird-eye', (active) => {
      if (active) {
        this.engine.cameraManager.applyPreset('birdEye', this.orbitControls.controls);
      } else {
        this.engine.cameraManager.applyPreset('overview', this.orbitControls.controls);
      }
    });

    this.toolbar.on('toggle-layers', (active) => {
      if (active) {
        this.layerPanel.show();
      } else {
        this.layerPanel.hide();
      }
    });

    this.toolbar.on('toggle-minimap', (active) => {
      if (active) {
        this.minimap.show();
      } else {
        this.minimap.hide();
      }
    });

    this.layerPanel.onToggle('buildings', (visible) => {
      this.engine.sceneManager.toggleLayer('buildings', visible);
    });
    this.layerPanel.onToggle('roads', (visible) => {
      this.engine.sceneManager.toggleLayer('roads', visible);
    });
    this.layerPanel.onToggle('vegetation', (visible) => {
      this.engine.sceneManager.toggleLayer('vegetation', visible);
    });
    this.layerPanel.onToggle('terrain', (visible) => {
      this.engine.sceneManager.toggleLayer('terrain', visible);
    });
  }

  _setupDayNight() {
    this.dayNightCycle = new DayNightCycle(
      this.engine.scene,
      {
        setSunPosition: (x, y, z) => {
          const light = this.engine.scene.getObjectByName('__directionalLight');
          if (light) light.position.set(x, y, z);
        },
        setAmbientIntensity: (v) => {
          const light = this.engine.scene.getObjectByName('__ambientLight');
          if (light) light.intensity = v;
        },
        setSunIntensity: (v) => {
          const light = this.engine.scene.getObjectByName('__directionalLight');
          if (light) light.intensity = v;
        }
      }
    );
  }

  _showUI() {
    this.toolbar.show();
    const statusBar = document.getElementById('status-bar');
    statusBar.classList.remove('ui-hidden');
    statusBar.classList.add('ui-visible');

    this._startTimeUpdate();
  }

  _startTimeUpdate() {
    const timeEl = document.getElementById('status-time');
    const update = () => {
      timeEl.textContent = formatTime(new Date());
    };
    update();
    setInterval(update, 1000);
  }

  _updateFPS(delta) {
    this.fpsFrames++;
    this.fpsTime += delta;
    if (this.fpsTime >= 1) {
      const fps = Math.round(this.fpsFrames / this.fpsTime);
      document.getElementById('status-fps').textContent = `FPS: ${fps}`;
      this.fpsFrames = 0;
      this.fpsTime = 0;
    }
  }
}

const app = new App();
app.start();
