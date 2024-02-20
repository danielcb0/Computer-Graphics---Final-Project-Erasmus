import * as THREE from 'three';
import { SunModule } from './SunModule';

export class MercuryModule {
    private mercury: THREE.Mesh;
    public rotationSpeed: number = (2 * Math.PI) / (16 * 365 * 10); // Velocidad de rotación ajustada para Saturno
    public orbitSpeed: number = (2 * Math.PI) / (165 * 365 * 10); // Velocidad de traslación ajustada para Saturno
    public orbitRadius: number = 20;
    public path: THREE.Line;
    private startTime: number = Date.now();

    constructor(private sunModule: SunModule) {
        const mercuryGeometry = new THREE.SphereGeometry(1, 720, 360);
        const mercuryMaterial = new THREE.MeshStandardMaterial();
        const texture = new THREE.TextureLoader().load('textures/2k_mercury.jpg');
        texture.anisotropy = 16;
        mercuryMaterial.map = texture;

        const displacementMap = new THREE.TextureLoader().load('textures/2k_mercury_bump.jpg');
        mercuryMaterial.displacementMap = displacementMap;
        mercuryMaterial.displacementScale = 0.1;

        this.mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
        this.mercury.rotateY(-Math.PI / 2);
        this.mercury.rotateX(THREE.MathUtils.degToRad(-23.5));
        this.mercury.castShadow = true;
        this.mercury.receiveShadow = true;

        const points = [];
        const orbitGeometry = new THREE.BufferGeometry();

        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = this.orbitRadius * Math.cos(theta) + this.mercury.position.x;
            const z = this.orbitRadius * Math.sin(theta) + this.mercury.position.z;
            const point = new THREE.Vector3(x, this.mercury.position.y, z);
            points.push(point);
        }
        orbitGeometry.setFromPoints(points);

        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 }); // Color blanco, ancho de línea 1

        this.path = new THREE.Line(orbitGeometry, orbitMaterial);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.mercury);
        scene.add(this.path);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        this.mercury.rotateY(this.rotationSpeed);

        const sunPosition = this.sunModule.getPlanetPosition();

        const elapsedTime = (Date.now() - this.startTime) * this.orbitSpeed;
        const positionX = this.orbitRadius * Math.cos(elapsedTime) + sunPosition.x;
        const positionZ = this.orbitRadius * Math.sin(elapsedTime) + sunPosition.z;
        this.mercury.position.set(positionX, sunPosition.y, positionZ);
    }

    public getPlanetPosition(): THREE.Mesh {
        return this.mercury;
    }
}