import * as THREE from 'three';

export class EarthModule {
    private sphere: THREE.Mesh;


    constructor() {
        // Crear la esfera (Tierra)
        const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0x0000FF,  // Color de la esfera
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.position.set(1, 3, 0);

    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.sphere);
    }

    public animate(): void {
        
    }
}
