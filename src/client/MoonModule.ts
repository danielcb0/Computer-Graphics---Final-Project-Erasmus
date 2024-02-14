import * as THREE from 'three';

export class MoonModule {
    private sphere: THREE.Mesh;


    constructor() {
        // Crear la esfera (Luna)
        const sphereGeometry = new THREE.SphereGeometry(0.025, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,  // Color de la esfera
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.position.set(1.2, 3, 0);   

    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.sphere);
    }

    public animate(): void {
        
    }
}
