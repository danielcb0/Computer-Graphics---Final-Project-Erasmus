import * as THREE from 'three';
import { SunModule } from './SunModule';

export class UranusModule {
    private uranus: THREE.Mesh;
    public rotationSpeed: number = (2 * Math.PI) / (17 * 365 * 10); // Velocidad de rotación ajustada para Saturno
    public orbitSpeed: number = (2 * Math.PI) / (84 * 365 * 10); // Velocidad de traslación ajustada para Saturno
    public orbitRadius: number = 300;
    public path: THREE.Line;
    private startTime: number = Date.now();

    constructor(private sunModule: SunModule) {
        // Crear la esfera (Uranus)
        const uranusGeometry = new THREE.SphereGeometry(1, 720, 360);
        const uranusMaterial = new THREE.MeshStandardMaterial();
        const texture = new THREE.TextureLoader().load('textures/uranusTexture.jpg');
        texture.anisotropy = 16;
        uranusMaterial.map = texture;

        this.uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
        this.uranus.rotateY(-Math.PI / 2);
        this.uranus.rotateX(THREE.MathUtils.degToRad(-23.5));
        this.uranus.castShadow = true;
        this.uranus.receiveShadow = true;

        const points = [];
        const orbitGeometry = new THREE.BufferGeometry();

        // Añadir puntos a la órbita
        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = this.orbitRadius * Math.cos(theta) + this.uranus.position.x;
            const z = this.orbitRadius * Math.sin(theta) + this.uranus.position.z;
            const point = new THREE.Vector3(x, this.uranus.position.y, z);
            points.push(point);
        }
        // Establecer los puntos en la geometría de la órbita
        orbitGeometry.setFromPoints(points);

        // Material de la órbita de Uranus
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 }); // Color blanco, ancho de línea 1

        // Crear el objeto de la línea de la órbita
        this.path = new THREE.Line(orbitGeometry, orbitMaterial);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.uranus);
        scene.add(this.path);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        // Rotación de Saturno
        this.uranus.rotateY(this.rotationSpeed);

        // Obtener posición del sol
        const sunPosition = this.sunModule.getPlanetPosition();

        // Posicion de Uranus en la órbita
        const elapsedTime = (Date.now() - this.startTime) * this.orbitSpeed;
        const positionX = this.orbitRadius * Math.cos(elapsedTime) + sunPosition.x;
        const positionZ = this.orbitRadius * Math.sin(elapsedTime) + sunPosition.z;
        this.uranus.position.set(positionX, sunPosition.y, positionZ);
    }

    public getPlanetPosition(): THREE.Mesh {
        return this.uranus;
    }
}