import * as THREE from 'three';
import { SunModule } from './SunModule';


export class MercuryModule {

    private mercury: THREE.Mesh;
    public rotationSpeed: number = 0.00001;
    public orbitSpeed: number = 0.02/10;
    path: THREE.Line;


    constructor(private sunModule: SunModule) {
        // Crear la esfera (Mercurio)
        const mercuryGeometry = new THREE.SphereGeometry(1, 520, 260);
        

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

        const points = []; // Puntos que forman la órbita
        const semiMajorAxis = -22;
        const semiMinorAxis = 21;

        // Geometría de la órbita de Mercurio
        const orbitGeometry = new THREE.BufferGeometry();

        // Añadir puntos a la órbita
        for (let i = 0; i <= 360; i++) {
            const theta = THREE.MathUtils.degToRad(i);
            const x = semiMajorAxis * Math.cos(theta) + this.mercury.position.x;
            const z = semiMinorAxis * Math.sin(theta) + this.mercury.position.z;
            const point = new THREE.Vector3(x, this.mercury.position.y, z);
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
        scene.add(this.mercury);
        scene.add(this.path);
    }

    public animate(): void {

        requestAnimationFrame(() => this.animate());

        // Rotación de Mercurio
        this.mercury.rotateY(this.rotationSpeed);

        // Obtener posición del sol
        const sunPosition = this.sunModule.getSunPosition();

        // Orbita
        const semiMajorAxis = -22;
        const semiMinorAxis = 21;

        // Obtener la posición en la órbita actual
        const positionOnOrbit = new THREE.Vector3();
        const orbitSpeed = 0.02 / 10; // velocidad de la órbita
        const time = Date.now();
        positionOnOrbit.x = semiMajorAxis * Math.cos(orbitSpeed * time);
        positionOnOrbit.z = semiMinorAxis * Math.sin(orbitSpeed * time);

        // Actualizar la posición de Mercurio
        this.mercury.position.copy(positionOnOrbit.add(sunPosition));
        
    }

    public getEarthPosition(): THREE.Vector3 {
        return this.mercury.position;
    }

    
}