import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

import { SunModule } from './SunModule';
import { EarthModule } from './EarthModule';
import { MoonModule } from './MoonModule';
import { VenusModule } from './VenusModule';
import { MarsModule } from './MarteModule';
import { JupiterModule } from './JupiterModule';
import { NeptuneModule } from './NeptuneModule';
import { MercuryModule } from './MercuryModule';
import { UranusModule } from './UranusModule';
import { SaturnModule } from './SaturnModule'; 



const scene = new THREE.Scene();
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Initialize the planetary modules
const sun = new SunModule();
const earth = new EarthModule(sun);
const moon = new MoonModule(earth);
const mercury = new MercuryModule(sun);
const venus = new VenusModule(sun);
const mars = new MarsModule(sun);
const jupiter = new JupiterModule(sun);
const uranus = new UranusModule(sun);
const neptune = new NeptuneModule(sun);
const saturn = new SaturnModule(sun);
// Add planetary modules to the scene
[sun, earth, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune].forEach(module => module.addToScene(scene));

let currentFocusedPlanet: any = null;

// Sun's point light
const sunLight = sun.getPointLight();

// Background skybox
const textureLoader = new THREE.TextureLoader();
const skyboxTextures = [
    'textures/ny.png', 'textures/ny.png', 'textures/ny.png', 
    'textures/ny.png', 'textures/ny.png', 'textures/ny.png'
].map(texture => textureLoader.load(texture));

const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
const skyboxMaterial = skyboxTextures.map(texture => new THREE.MeshBasicMaterial({ 
  map: texture,
  side: THREE.BackSide 
}));

const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

// Camera and renderer setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(40.8, 1.4, 1.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 512;  // Resolución de la sombra
sunLight.shadow.mapSize.height = 512;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;



const orbitControls = new OrbitControls(camera, renderer.domElement);
let isFollowingPlanet = false;

orbitControls.addEventListener('start', () => {
    isFollowingPlanet = false;
});

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const stats = new Stats();
document.body.appendChild(stats.dom);

const gui = new GUI();

const sunData = {
    lightIntensity: sunLight.intensity
};

const sunFolder = gui.addFolder('Sun Light');
sunFolder.add(sunData, 'lightIntensity', 0, 100000, 1).onChange(value => {
    sunLight.intensity = value;
});
sunFolder.open();

// GUI setup for each planet
function createPlanetGUI(planetName:any, planetModule:any) {
    const folder = gui.addFolder(`${planetName} Rotation`);
    folder.add(planetModule, 'rotationSpeed', 0, 0.00001).name('Rotation Speed');
    folder.add(planetModule, 'orbitSpeed', 0, 0.001).name('Orbit Speed');
}


createPlanetGUI('Mercury', mercury);
createPlanetGUI('Venus', venus);
createPlanetGUI('Earth', earth);
createPlanetGUI('Moon', moon);
createPlanetGUI('Mars', mars);
createPlanetGUI('Jupiter', jupiter);
createPlanetGUI('Saturn', saturn);
createPlanetGUI('Uranus', uranus);
createPlanetGUI('Neptune', neptune);
















// Function to focus on a planet
function focusOnPlanet(planetModule:any) {
    currentFocusedPlanet = planetModule;
    isFollowingPlanet = true;

    let planetPosition;

    if (planetModule instanceof SunModule) {
        planetPosition = new THREE.Vector3(0, 0, 0); 
        camera.position.set(40.8, 1.4, 1.0);
        camera.lookAt(planetPosition);
        orbitControls.target.set(planetPosition.x, planetPosition.y, planetPosition.z);
    } else {
        planetPosition = planetModule.getPlanetPosition().position;
        camera.position.set(planetPosition.x + 10, planetPosition.y + 10, planetPosition.z + 10);
        camera.lookAt(planetPosition);
        orbitControls.target.set(planetPosition.x, planetPosition.y, planetPosition.z);
    }

    orbitControls.update();
}

// Event listeners for planet selection buttons
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('focusSun')?.addEventListener('click', () => focusOnPlanet(sun));
    document.getElementById('focusMercury')?.addEventListener('click', () => focusOnPlanet(mercury));
    document.getElementById('focusVenus')?.addEventListener('click', () => focusOnPlanet(venus));
    document.getElementById('focusEarth')?.addEventListener('click', () => focusOnPlanet(earth));
    document.getElementById('focusMoon')?.addEventListener('click', () => focusOnPlanet(moon));
    document.getElementById('focusMars')?.addEventListener('click', () => focusOnPlanet(mars));
    document.getElementById('focusJupyter')?.addEventListener('click', () => focusOnPlanet(jupiter));
    document.getElementById('focusSaturn')?.addEventListener('click', () => focusOnPlanet(saturn));
    document.getElementById('focusUranus')?.addEventListener('click', () => focusOnPlanet(uranus));
    document.getElementById('focusNeptune')?.addEventListener('click', () => focusOnPlanet(neptune));

});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    sun.animate();
    earth.animate();
    moon.animate();
    mercury.animate();
    venus.animate();
    mars.animate();
    jupiter.animate();
    saturn.animate();
    uranus.animate();
    neptune.animate();

    if (isFollowingPlanet && currentFocusedPlanet) {
        const planetInfo = currentFocusedPlanet.getPlanetPosition();
        if (planetInfo && planetInfo.position) {
            const { x, y, z } = planetInfo.position;
            camera.position.set(x + 10, y + 10, z + 10);
            camera.lookAt(x, y, z);
            orbitControls.target.set(x, y, z);
        }
    }

    orbitControls.update();
    render();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

animate();