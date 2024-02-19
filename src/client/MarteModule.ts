import * as THREE from 'three';
import { SunModule } from './SunModule';

export class MarsModule {
    private mars: THREE.Mesh;
    public rotationSpeed: number = 0.00001;
    public orbitSpeed: number = 0.01 / 10;
    public orbitRadius: number = 80;
    public path: THREE.Line;

    constructor(private sunModule: SunModule) {
        // Crear la esfera (Marte)
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

        // Añadir puntos a la órbita
        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = this.orbitRadius * Math.cos(theta) + this.mars.position.x;
            const z = this.orbitRadius * Math.sin(theta) + this.mars.position.z;
            const point = new THREE.Vector3(x, this.mars.position.y, z);
            points.push(point);
        }
        // Establecer los puntos en la geometría de la órbita
        orbitGeometry.setFromPoints(points);

        // Material de la órbita de Marte
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 }); // Color blanco, ancho de línea 1

        // Crear el objeto de la línea de la órbita
        this.path = new THREE.Line(orbitGeometry, orbitMaterial);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.mars);
        scene.add(this.path);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        // Rotación de Marte
        this.mars.rotateY(this.rotationSpeed);

        // Obtener posición del sol
        const sunPosition = this.sunModule.getSunPosition();

        // Posicion de Marte en la órbita
        const angle = this.orbitSpeed * Date.now();
        const positionX = this.orbitRadius * Math.cos(angle) + sunPosition.x;
        const positionZ = this.orbitRadius * Math.sin(angle) + sunPosition.z;
        this.mars.position.set(positionX, sunPosition.y, positionZ);

    }

    public getMarsPosition(): THREE.Mesh {
        return this.mars;
    }
}
