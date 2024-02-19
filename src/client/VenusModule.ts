import * as THREE from 'three';
import { SunModule } from './SunModule';

export class VenusModule {
    private venus: THREE.Mesh;
    public rotationSpeed: number = 0.00001;
    public orbitSpeed: number = 0.01 / 10;
    public orbitRadius: number = 40;
    public path: THREE.Line;

    constructor(private sunModule: SunModule) {
        // Crear la esfera (Venus)
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

        // Añadir puntos a la órbita
        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = this.orbitRadius * Math.cos(theta) + this.venus.position.x;
            const z = this.orbitRadius * Math.sin(theta) + this.venus.position.z;
            const point = new THREE.Vector3(x, this.venus.position.y, z);
            points.push(point);
        }
        // Establecer los puntos en la geometría de la órbita
        orbitGeometry.setFromPoints(points);

        // Material de la órbita de Venus
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 }); // Color blanco, ancho de línea 1

        // Crear el objeto de la línea de la órbita
        this.path = new THREE.Line(orbitGeometry, orbitMaterial);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.venus);
        scene.add(this.path);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        // Rotación de Venus
        this.venus.rotateY(this.rotationSpeed);

        // Obtener posición del sol
        const sunPosition = this.sunModule.getSunPosition();

        // Posicion de Venus en la órbita
        const angle = this.orbitSpeed * Date.now();
        const positionX = this.orbitRadius * Math.cos(angle) + sunPosition.x;
        const positionZ = this.orbitRadius * Math.sin(angle) + sunPosition.z;
        this.venus.position.set(positionX, sunPosition.y, positionZ);

    }

    public getVenusPosition(): THREE.Mesh {
        return this.venus;
    }
}
