import * as THREE from 'three';

export class DayNightCycle {
  constructor(scene, lighting) {
    this.scene = scene;
    this.lighting = lighting;
    this.time = 0.25;
    this.speed = 0.02;
    this.enabled = false;

    this.dayFog = new THREE.Color(0xc8dde6);
    this.nightFog = new THREE.Color(0x0a0a1a);
    this.dayBg = new THREE.Color(0xc8dde6);
    this.nightBg = new THREE.Color(0x0a0a1a);
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  update(delta) {
    if (!this.enabled) return;
    this.time = (this.time + this.speed * delta) % 1;

    const sunAngle = this.time * Math.PI * 2;
    const sunY = Math.sin(sunAngle) * 80;
    const sunX = Math.cos(sunAngle) * 60;
    this.lighting.setSunPosition(sunX, Math.max(sunY, -20), 40);

    const dayFactor = Math.max(0, Math.sin(sunAngle));
    this.lighting.setSunIntensity(0.1 + dayFactor * 1.2);
    this.lighting.setAmbientIntensity(0.1 + dayFactor * 0.4);

    const fogColor = this.nightFog.clone().lerp(this.dayFog, dayFactor);
    const bgColor = this.nightBg.clone().lerp(this.dayBg, dayFactor);

    if (this.scene.fog) this.scene.fog.color.copy(fogColor);
    this.scene.background.copy(bgColor);
  }
}
