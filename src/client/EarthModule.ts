import * as THREE from 'three';
import { SunModule } from './SunModule';

export class EarthModule {
    private earth: THREE.Mesh;
    public rotationSpeed: number = 0.00001;
    public orbitSpeed: number = 0.01 / 10;
    public orbitRadius: number = 60;
    public path: THREE.Line;

    constructor(private sunModule: SunModule) {
        // Crear la esfera (Tierra)
        const earthGeometry = new THREE.SphereGeometry(1, 720, 360);
        const earthMaterial = new THREE.MeshStandardMaterial();
        const texture = new THREE.TextureLoader().load('textures/worldColour.5400x2700.jpg');
        texture.anisotropy = 16;
        earthMaterial.map = texture;

        const displacementMap = new THREE.TextureLoader().load('textures/srtm_ramp2.world.5400x2700.jpg');
        earthMaterial.displacementMap = displacementMap;
        earthMaterial.displacementScale = 0.1;

        this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.earth.rotateY(-Math.PI / 2);
        this.earth.rotateX(THREE.MathUtils.degToRad(-23.5));
        this.earth.castShadow = true;
        this.earth.receiveShadow = true;

        const points = [];
        const orbitGeometry = new THREE.BufferGeometry();

        // Añadir puntos a la órbita
        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = this.orbitRadius * Math.cos(theta) + this.earth.position.x;
            const z = this.orbitRadius * Math.sin(theta) + this.earth.position.z;
            const point = new THREE.Vector3(x, this.earth.position.y, z);
            points.push(point);
        }
        // Establecer los puntos en la geometría de la órbita
        orbitGeometry.setFromPoints(points);

        // Material de la órbita de Mercurio
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 }); // Color blanco, ancho de línea 1

        // Crear el objeto de la línea de la órbita
        this.path = new THREE.Line(orbitGeometry, orbitMaterial);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.earth);
        scene.add(this.path);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        // Rotación de la Tierra
        this.earth.rotateY(this.rotationSpeed);

        // Obtener posición del sol
        const sunPosition = this.sunModule.getSunPosition();

        // Posicion de la Tierra en la órbita
        const angle = this.orbitSpeed * Date.now();
        const positionX = this.orbitRadius * Math.cos(angle) + sunPosition.x;
        const positionZ = this.orbitRadius * Math.sin(angle) + sunPosition.z;
        this.earth.position.set(positionX, sunPosition.y, positionZ);

    }

    public getEarthPosition(): THREE.Mesh {
        return this.earth;
    }
}
