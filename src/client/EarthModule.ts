import * as THREE from 'three';
import { SunModule } from './SunModule';

export class EarthModule {
    private earth: THREE.Mesh;
    public rotationSpeed: number = 0.00001;
    public orbitSpeed: number = 0.01/10;


    constructor(private sunModule: SunModule) {
        // Crear la esfera (Tierra)
        const earthGeometry = new THREE.SphereGeometry(1, 720, 360);
        /* const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0x0000FF,  // Color de la esfera
        });
        this.earth = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.earth.position.set(4, 3, 0); */

        const earthMaterial = new THREE.MeshStandardMaterial();
        const texture = new THREE.TextureLoader().load('textures/worldColour.5400x2700.jpg');
        texture.anisotropy = 16;
        earthMaterial.map = texture;

        const displacementMap = new THREE.TextureLoader().load('textures/srtm_ramp2.world.5400x2700.jpg');
        earthMaterial.displacementMap = displacementMap;
        earthMaterial.displacementScale = 0.1;

        this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.earth.rotateY(-Math.PI/2);
        this.earth.rotateX(THREE.MathUtils.degToRad(-23.5));
        this.earth.castShadow = true;
        this.earth.receiveShadow = true;


    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.earth);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        //Roation of the Earth
        this.earth.rotateY(this.rotationSpeed);

        //Obtain sun position
        const sunPosition = this.sunModule.getSunPosition();

        // Orbita
        const semiMajorAxis = -35;
        const semiMinorAxis = 34;

        const positionX = semiMajorAxis * Math.cos(this.orbitSpeed * Date.now()) + sunPosition.x;
        const positionZ = semiMinorAxis * Math.sin(this.orbitSpeed * Date.now()) + sunPosition.z;
        this.earth.position.set(positionX, sunPosition.y, positionZ);
        
    }

    public getEarthPosition(): THREE.Vector3 {
        return this.earth.position;
    }

    
}