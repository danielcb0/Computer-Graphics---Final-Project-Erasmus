import * as THREE from 'three';
import { EarthModule } from './EarthModule';

export class MoonModule {
    private sphere: THREE.Mesh;
    public orbitSpeed: number = 0.05/10;

    constructor(private earthModule: EarthModule) {
        // Crear la esfera (Luna)
        const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const moonTexture = textureLoader.load('textures/2k_moon.jpg'); // Ruta de la textura de la luna
        const sphereMaterial = new THREE.MeshStandardMaterial({
            map: moonTexture,  // Asignar la textura a la esfera
        });

        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.castShadow = true;
        this.sphere.receiveShadow = true;
        //this.sphere.position.set(0.6, 0, 0); // Posición relativa a la tierra
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.sphere);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        //Obtain earth position
        const earthPosition = this.earthModule.getEarthPosition();

        // Orbita
        const semiMajorAxis = -5;
        const semiMinorAxis = 4;

        const positionX = semiMajorAxis * Math.cos(this.orbitSpeed * Date.now()) + earthPosition.x;
        const positionZ = semiMinorAxis * Math.sin(this.orbitSpeed * Date.now()) + earthPosition.z;
        this.sphere.position.set(positionX, earthPosition.y, positionZ);
    }
}
