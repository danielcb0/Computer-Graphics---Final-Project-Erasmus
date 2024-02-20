import * as THREE from 'three';
import { SunModule } from './SunModule';

export class JupiterModule {
    private jupiter: THREE.Mesh;
    public rotationSpeed: number = (2 * Math.PI) / (9 * 365 * 10); // Velocidad de rotación ajustada para Júpiter
    public orbitSpeed: number = (2 * Math.PI) / (9 * 365 * 10); // Velocidad de traslación ajustada para Júpiter
    public orbitRadius: number = 100;
    public path: THREE.Line;
    private startTime: number = Date.now();

    constructor(private sunModule: SunModule) {
        // Crear la esfera (Júpiter)
        const jupiterGeometry = new THREE.SphereGeometry(1, 720, 360);
        const jupiterMaterial = new THREE.MeshStandardMaterial();
        const texture = new THREE.TextureLoader().load('textures/jupiterTexture.jpg');
        texture.anisotropy = 16;
        jupiterMaterial.map = texture;

        this.jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
        this.jupiter.rotateY(-Math.PI / 2);
        this.jupiter.rotateX(THREE.MathUtils.degToRad(-23.5));
        this.jupiter.castShadow = true;
        this.jupiter.receiveShadow = true;

        const points = [];
        const orbitGeometry = new THREE.BufferGeometry();

        // Añadir puntos a la órbita
        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = this.orbitRadius * Math.cos(theta) + this.jupiter.position.x;
            const z = this.orbitRadius * Math.sin(theta) + this.jupiter.position.z;
            const point = new THREE.Vector3(x, this.jupiter.position.y, z);
            points.push(point);
        }
        // Establecer los puntos en la geometría de la órbita
        orbitGeometry.setFromPoints(points);

        // Material de la órbita de Júpiter
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 }); // Color blanco, ancho de línea 1

        // Crear el objeto de la línea de la órbita
        this.path = new THREE.Line(orbitGeometry, orbitMaterial);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.jupiter);
        scene.add(this.path);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        // Rotación de Júpiter
        this.jupiter.rotateY(this.rotationSpeed);

        // Obtener posición del sol
        const sunPosition = this.sunModule.getPlanetPosition();

        // Posicion de Júpiter en la órbita
        const elapsedTime = (Date.now() - this.startTime) * this.orbitSpeed;
        const positionX = this.orbitRadius * Math.cos(elapsedTime) + sunPosition.x;
        const positionZ = this.orbitRadius * Math.sin(elapsedTime) + sunPosition.z;
        this.jupiter.position.set(positionX, sunPosition.y, positionZ);
    }

    public getPlanetPosition(): THREE.Mesh {
        return this.jupiter;
    }
}