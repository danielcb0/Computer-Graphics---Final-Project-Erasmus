import * as THREE from 'three';
import { SunModule } from './SunModule';

export class NeptuneModule {
    private neptune: THREE.Mesh;
    public rotationSpeed: number = (2 * Math.PI) / (16 * 365 * 10); // Velocidad de rotación ajustada para Saturno
    public orbitSpeed: number = (2 * Math.PI) / (165 * 365 * 10); // Velocidad de traslación ajustada para Saturno
    public orbitRadius: number = 400;
    public path: THREE.Line;
    private startTime: number = Date.now();

    constructor(private sunModule: SunModule) {
        // Crear la esfera (neptune)
        const neptuneGeometry = new THREE.SphereGeometry(1, 720, 360);
        const neptuneMaterial = new THREE.MeshStandardMaterial();
        const texture = new THREE.TextureLoader().load('textures/neptuneTexture.jpg');
        texture.anisotropy = 16;
        neptuneMaterial.map = texture;

        this.neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
        this.neptune.rotateY(-Math.PI / 2);
        this.neptune.rotateX(THREE.MathUtils.degToRad(-23.5));
        this.neptune.castShadow = true;
        this.neptune.receiveShadow = true;

        const points = [];
        const orbitGeometry = new THREE.BufferGeometry();

        // Añadir puntos a la órbita
        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = this.orbitRadius * Math.cos(theta) + this.neptune.position.x;
            const z = this.orbitRadius * Math.sin(theta) + this.neptune.position.z;
            const point = new THREE.Vector3(x, this.neptune.position.y, z);
            points.push(point);
        }
        // Establecer los puntos en la geometría de la órbita
        orbitGeometry.setFromPoints(points);

        // Material de la órbita de Saturno
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 }); // Color blanco, ancho de línea 1

        // Crear el objeto de la línea de la órbita
        this.path = new THREE.Line(orbitGeometry, orbitMaterial);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.neptune);
        scene.add(this.path);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        // Rotación de Neptuno
        this.neptune.rotateY(this.rotationSpeed);

        // Obtener posición del sol
        const sunPosition = this.sunModule.getPlanetPosition();

        // Posicion de neptune en la órbita
        const elapsedTime = (Date.now() - this.startTime) * this.orbitSpeed;
        const positionX = this.orbitRadius * Math.cos(elapsedTime) + sunPosition.x;
        const positionZ = this.orbitRadius * Math.sin(elapsedTime) + sunPosition.z;
        this.neptune.position.set(positionX, sunPosition.y, positionZ);
    }

    public getPlanetPosition(): THREE.Mesh {
        return this.neptune;
    }
}