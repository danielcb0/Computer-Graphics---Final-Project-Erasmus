import * as THREE from 'three';
import { SunModule } from './SunModule';

export class SaturnModule {
    private saturn: THREE.Mesh;
    public rotationSpeed: number = (2 * Math.PI) / (9 * 365 * 10); // Velocidad de rotación ajustada para Saturno
    public orbitSpeed: number = (2 * Math.PI) / (30 * 365 * 10); // Velocidad de traslación ajustada para Saturno
    public orbitRadius: number = 200;
    public path: THREE.Line;
    private startTime: number = Date.now();

    constructor(private sunModule: SunModule) {
        // Crear la esfera (Saturno)
        const saturnGeometry = new THREE.SphereGeometry(1, 720, 360);
        const saturnMaterial = new THREE.MeshStandardMaterial();
        const texture = new THREE.TextureLoader().load('textures/saturnTexture.jpg');
        texture.anisotropy = 16;
        saturnMaterial.map = texture;

        this.saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
        this.saturn.rotateY(-Math.PI / 2);
        this.saturn.rotateX(THREE.MathUtils.degToRad(-23.5));
        this.saturn.castShadow = true;
        this.saturn.receiveShadow = true;

        const points = [];
        const orbitGeometry = new THREE.BufferGeometry();

        // Añadir puntos a la órbita
        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = this.orbitRadius * Math.cos(theta) + this.saturn.position.x;
            const z = this.orbitRadius * Math.sin(theta) + this.saturn.position.z;
            const point = new THREE.Vector3(x, this.saturn.position.y, z);
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
        scene.add(this.saturn);
        scene.add(this.path);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        // Rotación de Saturno
        this.saturn.rotateY(this.rotationSpeed);

        // Obtener posición del sol
        const sunPosition = this.sunModule.getPlanetPosition();

        // Posicion de Saturno en la órbita
        const elapsedTime = (Date.now() - this.startTime) * this.orbitSpeed;
        const positionX = this.orbitRadius * Math.cos(elapsedTime) + sunPosition.x;
        const positionZ = this.orbitRadius * Math.sin(elapsedTime) + sunPosition.z;
        this.saturn.position.set(positionX, sunPosition.y, positionZ);
    }

    public getPlanetPosition(): THREE.Mesh {
        return this.saturn;
    }
}