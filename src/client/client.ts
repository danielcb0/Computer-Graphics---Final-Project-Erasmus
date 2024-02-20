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

const scene = new THREE.Scene();
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color, intensidad
scene.add(ambientLight);
const sun = new SunModule();
const earth = new EarthModule(sun);
const moon = new MoonModule();
const venus = new VenusModule(sun);
const mars = new MarsModule(sun);
const jupiter = new JupiterModule(sun);

sun.addToScene(scene);
earth.addToScene(scene);
moon.addToScene(scene);
venus.addToScene(scene);
mars.addToScene(scene);
jupiter.addToScene(scene);

// Variable global para el planeta enfocado
let currentFocusedPlanet: any = null; 



// Obtener la luz puntual del sol
const sunLight = sun.getPointLight(); 

scene.add(new THREE.AxesHelper(5));

// const light = new THREE.PointLight(0xffffff, 50);
// light.position.set(0.8, 1.4, 1.0);
// scene.add(light);


//Background
const textureLoader = new THREE.TextureLoader();
const skyboxTextures = [
  'textures/ny.png',
  'textures/ny.png',
  'textures/ny.png',
  'textures/ny.png',
  'textures/ny.png',
  'textures/ny.png'
].map(texture => textureLoader.load(texture));

const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
const skyboxMaterial = skyboxTextures.map(texture => new THREE.MeshBasicMaterial({ 
  map: texture,
  side: THREE.BackSide 
}));

const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);






// Creación de la cámara y renderizador
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(40.8, 1.4, 1.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);

// Agrega un flag para controlar el seguimiento
let isFollowingPlanet = false;

orbitControls.addEventListener('start', () => {
    // Cuando el usuario comienza a interactuar con los controles de órbita
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

// Datos para la GUI
const sunData = {
    lightIntensity: sunLight.intensity
};
const sunFolder = gui.addFolder('Sun Light');
sunFolder.add(sunData, 'lightIntensity', 0, 100000, 1).onChange(value => {
    sunLight.intensity = value;
});
sunFolder.open(); // Abre este folder por defecto

// Aunque el PointLight ha sido eliminado, mantenemos la configuración de su menú para futuros usos
const data = {
    // Estos valores ya no afectarán a nada, ya que el PointLight se ha eliminado
    // Se podrían eliminar o dejar para futuras referencias o usos
    color: 0xffffff,
    lightIntensity: 50,
};

const lightFolder = gui.addFolder('Point Light');
lightFolder.addColor(data, 'color').onChange(() => {
    // light.color.setHex(Number(data.color.toString().replace('#', '0x')));
});
lightFolder.add(data, 'lightIntensity', 0, 100, 1).onChange(() => {
    // light.intensity = data.lightIntensity;
});

// Datos para la GUI de cada planeta
const planetData = {
    'Earth': { rotationSpeed: earth.rotationSpeed, orbitSpeed: earth.orbitSpeed },
    'Venus': { rotationSpeed: venus.rotationSpeed, orbitSpeed: venus.orbitSpeed },
    'Mars': { rotationSpeed: mars.rotationSpeed, orbitSpeed: mars.orbitSpeed },
    'Jupiter': { rotationSpeed: jupiter.rotationSpeed, orbitSpeed: jupiter.orbitSpeed }
};

// Función para crear una GUI para un planeta
function createPlanetGUI(planetName: any, planetModule: any) {
    const folder = gui.addFolder(`${planetName} Rotation`);
    folder.add(planetModule, 'rotationSpeed', 0, 0.00001).name('Rotation Speed');
    folder.add(planetModule, 'orbitSpeed', 0, 0.001).name('Orbit Speed');
}

// Crear GUI para cada planeta
createPlanetGUI('Earth', earth);
createPlanetGUI('Venus', venus);
createPlanetGUI('Mars', mars);
createPlanetGUI('Jupiter', jupiter);


// Función para enfocar en un planeta
function focusOnPlanet(planetModule: any) {
    currentFocusedPlanet = planetModule;
    isFollowingPlanet = true;

    let planetPosition;

    if (planetModule instanceof SunModule) {
        // Si es el sol, utiliza una posición fija para la cámara
        planetPosition = new THREE.Vector3(0, 0, 0); // Asumiendo que el sol está en el origen
        camera.position.set(40.8, 1.4, 1.0); // Ajusta estos valores según sea necesario
        camera.lookAt(planetPosition);
        orbitControls.target.set(planetPosition.x, planetPosition.y, planetPosition.z);
    } else {
        // Para otros planetas, sigue el procedimiento habitual
        planetPosition = planetModule.getPlanetPosition().position;
        camera.position.set(planetPosition.x + 10, planetPosition.y + 10, planetPosition.z + 10);
        camera.lookAt(planetPosition);
        orbitControls.target.set(planetPosition.x, planetPosition.y, planetPosition.z);
    }

    orbitControls.update();
}



// Añadir listeners para los botones después de que se haya cargado la página
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('focusSun')?.addEventListener('click', () => focusOnPlanet(sun));
    //document.getElementById('focusMercury')?.addEventListener('click', () => focusOnPlanet(mercury));
    document.getElementById('focusVenus')?.addEventListener('click', () => focusOnPlanet(venus));
    document.getElementById('focusEarth')?.addEventListener('click', () => focusOnPlanet(earth));
    document.getElementById('focusMars')?.addEventListener('click', () => focusOnPlanet(mars));
    document.getElementById('focusJupyter')?.addEventListener('click', () => focusOnPlanet(jupiter));
    //document.getElementById('focusSaturn')?.addEventListener('click', () => focusOnPlanet(saturn));
    //document.getElementById('focusUranus')?.addEventListener('click', () => focusOnPlanet(uranus));
    //document.getElementById('focusNeptune')?.addEventListener('click', () => focusOnPlanet(neptune));




});





function animate() {
    requestAnimationFrame(animate);

    sun.animate();
    earth.animate();
    venus.animate();
    mars.animate();
    jupiter.animate();

    if (isFollowingPlanet && currentFocusedPlanet) {
        // Verificar si getPlanetPosition devuelve un objeto válido
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