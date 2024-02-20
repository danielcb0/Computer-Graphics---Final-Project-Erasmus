import * as THREE from 'three';

export class SunModule {
    private sphere: THREE.Mesh;
    private pointLight: THREE.PointLight;
    
    constructor() {
        // Create the sphere (Sun)
        const sphereGeometry = new THREE.SphereGeometry(15, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        // Create the material initially with a texture
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF, // Base color plus white
            emissiveMap: textureLoader.load("textures/2k_sun.jpg"),
            emissive: 0xFFFFFF, // Emissive color plus white
            emissiveIntensity: 1 // Emissive intensity
        });

        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.position.set(0, 3, 0);

        // Create the point light that coincides with the sphere
        this.pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
        this.pointLight.position.set(0, 3, 0);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.sphere);
        scene.add(this.pointLight);
    }

    public animate(): void {
        // No need to update the position as the Sun does not move, only added to avoid problem with camera change position
    }

    // Method to get the point light
    public getPointLight(): THREE.PointLight {
        return this.pointLight;
    }

    // Get Sun position
    public getPlanetPosition(): THREE.Vector3 {
        return this.sphere.position;
    }

}
