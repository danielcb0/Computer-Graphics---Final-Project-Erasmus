import * as THREE from 'three';

export class SunModule {
    private sphere: THREE.Mesh;
    private pointLight: THREE.PointLight;
    

    constructor() {
        // Crear la esfera (Sol)
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        // Crear el material inicialmente sin textura
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0xffaa00, // Color base
            emissiveMap: textureLoader.load("textures/2k_sun.jpg"),
            emissive: 0xffaa00, // Color de la emisión
            emissiveIntensity: 1 // Intensidad de la emisión
        });

        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.position.set(0, 3, 0);

        

        // Crear la luz puntual que coincide con la esfera
        this.pointLight = new THREE.PointLight(0xffaa00, 50000, 5);
        this.pointLight.position.set(0, 3, 0);


    }

    

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.sphere);
        scene.add(this.pointLight);
    }

    public animate(): void {
        // No es necesario actualizar la posición ya que el Sol no se mueve
    }

    // Método para obtener la luz puntual
    public getPointLight(): THREE.PointLight {
        return this.pointLight;
    }
}
