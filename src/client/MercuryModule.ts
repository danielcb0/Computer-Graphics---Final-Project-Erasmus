import * as THREE from 'three';
import { SunModule } from './SunModule';

export class MercuryModule {
    private mercury: THREE.Mesh;
    public rotationSpeed: number = 0.00001;
    public orbitSpeed: number = 0.02/10;


    constructor(private sunModule: SunModule) {
        // Crear la esfera (Tierra)
        const mercuryGeometry = new THREE.SphereGeometry(1, 720, 360);
        /* const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0x0000FF,  // Color de la esfera
        });
        this.earth = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.earth.position.set(4, 3, 0); */

        const mercuryMaterial = new THREE.MeshStandardMaterial();
        const texture = new THREE.TextureLoader().load('textures/2k_mercury.jpg');
        texture.anisotropy = 16;
        mercuryMaterial.map = texture;

        const displacementMap = new THREE.TextureLoader().load('textures/2k_mercury_bump.jpg');
        mercuryMaterial.displacementMap = displacementMap;
        mercuryMaterial.displacementScale = 0.1;

        this.mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
        this.mercury.rotateY(-Math.PI/2);
        this.mercury.rotateX(THREE.MathUtils.degToRad(-23.5));
        this.mercury.castShadow = true;
        this.mercury.receiveShadow = true;


    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.mercury);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());

        //Roation of the Earth
        this.mercury.rotateY(this.rotationSpeed);

        //Obtain sun position
        const sunPosition = this.sunModule.getSunPosition();

        // Orbita
        const semiMajorAxis = -22;
        const semiMinorAxis = 21;

        const positionX = semiMajorAxis * Math.cos(this.orbitSpeed * Date.now()) + sunPosition.x;
        const positionZ = semiMinorAxis * Math.sin(this.orbitSpeed * Date.now()) + sunPosition.z;
        this.mercury.position.set(positionX, sunPosition.y, positionZ);
        
    }

    public getEarthPosition(): THREE.Vector3 {
        return this.mercury.position;
    }

    
}