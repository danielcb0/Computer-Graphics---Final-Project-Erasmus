import * as THREE from 'three';
import { SunModule } from './SunModule';

export class VenusModule {
    private venus: THREE.Mesh;
    public rotationSpeed: number = (2 * Math.PI) / (24 * 225 * 10); // Adjusted rotation speed for Venus
    public orbitSpeed: number = (2 * Math.PI) / (225 * 10); // Adjusted orbit speed for Venus
    public orbitRadius: number = 40;
    public path: THREE.Line;
    private startTime: number = Date.now();

    constructor(private sunModule: SunModule) {
        // Create the sphere (Venus)
        const venusGeometry = new THREE.SphereGeometry(1, 720, 360);
        const venusMaterial = new THREE.MeshStandardMaterial();
        const texture = new THREE.TextureLoader().load('textures/venusTexture.jpg');
        texture.anisotropy = 16;
        venusMaterial.map = texture;

        const displacementMap = new THREE.TextureLoader().load('textures/venusBumpMap.jpg');
        venusMaterial.displacementMap = displacementMap;
        venusMaterial.displacementScale = 0.1;

        this.venus = new THREE.Mesh(venusGeometry, venusMaterial);
        this.venus.rotateY(-Math.PI / 2);
        this.venus.rotateX(THREE.MathUtils.degToRad(-23.5));
        this.venus.castShadow = true;
        this.venus.receiveShadow = true;

        const points = [];
        const orbitGeometry = new THREE.BufferGeometry();

        // Add points to the orbit
        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = this.orbitRadius * Math.cos(theta) + this.venus.position.x;
            const z = this.orbitRadius * Math.sin(theta) + this.venus.position.z;
            const point = new THREE.Vector3(x, this.venus.position.y, z);
            points.push(point);
        }
        // Set the points in the orbit geometry
        orbitGeometry.setFromPoints(points);

        // Material for Venus's orbit
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 }); // White color, line width 1

        // Create the orbit line object
        this.path = new THREE.Line(orbitGeometry, orbitMaterial);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.venus);
        scene.add(this.path);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        // Rotation of Venus
        this.venus.rotateY(this.rotationSpeed);

        // Get the position of the sun
        const sunPosition = this.sunModule.getPlanetPosition();

        // Position of Venus in the orbit
        const elapsedTime = (Date.now() - this.startTime) * this.orbitSpeed;
        const positionX = this.orbitRadius * Math.cos(elapsedTime) + sunPosition.x;
        const positionZ = this.orbitRadius * Math.sin(elapsedTime) + sunPosition.z;
        this.venus.position.set(positionX, sunPosition.y, positionZ);
    }

    public getPlanetPosition(): THREE.Mesh {
        return this.venus;
    }
}
