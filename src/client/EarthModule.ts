import * as THREE from 'three';
import { SunModule } from './SunModule';

export class EarthModule {
    private earth: THREE.Mesh;
    public rotationSpeed: number = (2 * Math.PI) / (24 * 365*10); // Adjusted rotation speed
    public orbitSpeed: number = (2 * Math.PI) / (365 * 10); // Adjusted orbit speed
    public orbitRadius: number = 60;
    public path: THREE.Line;
    private startTime: number = Date.now();

    constructor(private sunModule: SunModule) {
        // Create the sphere (Earth)
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

        // Add points to the orbit
        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = this.orbitRadius * Math.cos(theta) + this.earth.position.x;
            const z = this.orbitRadius * Math.sin(theta) + this.earth.position.z;
            const point = new THREE.Vector3(x, this.earth.position.y, z);
            points.push(point);
        }
        // Set the points in the orbit geometry
        orbitGeometry.setFromPoints(points);

        // Material for Mercury's orbit
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 }); // White color, line width 1

        // Create the orbit line object
        this.path = new THREE.Line(orbitGeometry, orbitMaterial);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.earth);
        scene.add(this.path);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());
    
        // Earth's rotation
        this.rotateEarth();
    
        // Update Earth's position in its orbit
        this.updateEarthPosition();
    }
    
    private rotateEarth(): void {
        // Earth's rotation around its own axis
        this.earth.rotateY(this.rotationSpeed);
    }
    
    private updateEarthPosition(): void {
        // Get the sun's position
        const sunPosition = this.sunModule.getPlanetPosition();
    
        // Get the accumulated time since the start of the animation
        const elapsedTime = (Date.now() - this.startTime) * this.orbitSpeed;
    
        // Calculate Earth's position in its orbit around the sun
        const positionX = this.orbitRadius * Math.cos(elapsedTime) + sunPosition.x;
        const positionZ = this.orbitRadius * Math.sin(elapsedTime) + sunPosition.z;
    
        // Set Earth's position
        this.earth.position.set(positionX, sunPosition.y, positionZ);
    }
    
    public getPlanetPosition(): THREE.Mesh {
        return this.earth;
    }
    public getEarthPosition(): THREE.Vector3 {
        return this.earth.position;
    }
}
