import * as THREE from 'three';
import { SunModule } from './SunModule';

export class MarsModule {
    private mars: THREE.Mesh;
    public rotationSpeed: number = (2 * Math.PI) / (24 * 687 * 10); // Velocidad de rotación ajustada para Marte
    public orbitSpeed: number = (2 * Math.PI) / (687 * 10); // Velocidad de traslación ajustada para Marte
    public orbitRadius: number = 80;
    public path: THREE.Line;
    private startTime: number = Date.now();

    constructor(private sunModule: SunModule) {
        // Create the sphere (Mars)
        const marsGeometry = new THREE.SphereGeometry(1, 720, 360);
        const marsMaterial = new THREE.MeshStandardMaterial();
        const texture = new THREE.TextureLoader().load('textures/marsTexture.jpg');
        texture.anisotropy = 16;
        marsMaterial.map = texture;

        const displacementMap = new THREE.TextureLoader().load('textures/marsBumpMap.jpg');
        marsMaterial.displacementMap = displacementMap;
        marsMaterial.displacementScale = 0.1;

        this.mars = new THREE.Mesh(marsGeometry, marsMaterial);
        this.mars.rotateY(-Math.PI / 2);
        this.mars.rotateX(THREE.MathUtils.degToRad(-23.5));
        this.mars.castShadow = true;
        this.mars.receiveShadow = true;

        const points = [];
        const orbitGeometry = new THREE.BufferGeometry();

        // Adding points to the orbit
        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = this.orbitRadius * Math.cos(theta) + this.mars.position.x;
            const z = this.orbitRadius * Math.sin(theta) + this.mars.position.z;
            const point = new THREE.Vector3(x, this.mars.position.y, z);
            points.push(point);
        }
        // Set the points in the geometry of the orbit
        orbitGeometry.setFromPoints(points);

        // Mars orbit material
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 }); // Color blanco, ancho de línea 1

        // Create orbit line object
        this.path = new THREE.Line(orbitGeometry, orbitMaterial);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.mars);
        scene.add(this.path);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        // Rotation of Mars
        this.mars.rotateY(this.rotationSpeed);

        // Get position of the sun
        const sunPosition = this.sunModule.getPlanetPosition();

        // Position of Mars in orbit
        const elapsedTime = (Date.now() - this.startTime) * this.orbitSpeed;
        const positionX = this.orbitRadius * Math.cos(elapsedTime) + sunPosition.x;
        const positionZ = this.orbitRadius * Math.sin(elapsedTime) + sunPosition.z;
        this.mars.position.set(positionX, sunPosition.y, positionZ);
    }

    public getPlanetPosition(): THREE.Mesh {
        return this.mars;
    }
}
