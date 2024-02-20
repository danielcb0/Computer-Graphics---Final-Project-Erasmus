import * as THREE from 'three';
import { EarthModule } from './EarthModule';

export class MoonModule {
    private moon: THREE.Mesh;
    public rotationSpeed: number = (2 * Math.PI) / (24 * 88 * 10); 
    public orbitSpeed: number = (2 * Math.PI) / (88 * 10); 
    public orbitRadius: number = 20;
    public path: THREE.Line;
    private startTime: number = Date.now();

    constructor(private earthModule: EarthModule) {
        this.orbitRadius = earthModule.orbitRadius / 390; 
        const moonGeometry = new THREE.SphereGeometry(0.25, 720, 360); 
        const moonMaterial = new THREE.MeshStandardMaterial();
        const texture = new THREE.TextureLoader().load('textures/2k_moon.jpg');
        texture.anisotropy = 16;
        moonMaterial.map = texture;

        const displacementMap = new THREE.TextureLoader().load('textures/2k_moon_bump.jpg');
        moonMaterial.displacementMap = displacementMap;
        moonMaterial.displacementScale = 0.1;

        this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
        this.moon.rotateY(-Math.PI / 2);
        this.moon.rotateX(THREE.MathUtils.degToRad(-23.5));
        this.moon.castShadow = true;
        this.moon.receiveShadow = true;

        const points = [];
        const orbitGeometry = new THREE.BufferGeometry();

        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = this.orbitRadius * Math.cos(theta) + this.moon.position.x;
            const z = this.orbitRadius * Math.sin(theta) + this.moon.position.z;
            const point = new THREE.Vector3(x, this.moon.position.y, z);
            points.push(point);
        }
        orbitGeometry.setFromPoints(points);

        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 }); // Color blanco, ancho de línea 1

        this.path = new THREE.Line(orbitGeometry, orbitMaterial);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.moon);
        scene.add(this.path);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        this.moon.rotateY(this.rotationSpeed);

        const earthPosition = this.earthModule.getEarthPosition();

        const elapsedTime = (Date.now() - this.startTime) * this.orbitSpeed;
        const positionX = this.orbitRadius * Math.cos(elapsedTime) + earthPosition.x;
        const positionZ = this.orbitRadius * Math.sin(elapsedTime) + earthPosition.z;
        this.moon.position.set(positionX, earthPosition.y, positionZ);
    }

    public getPlanetPosition(): THREE.Mesh {
        return this.moon;
    }
}
