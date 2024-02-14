import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

import { SunModule } from './SunModule';
import { EarthModule } from './EarthModule';
import { MoonModule } from './MoonModule';

const scene = new THREE.Scene();
const sun = new SunModule();
const earth = new EarthModule();
const moon = new MoonModule();

sun.addToScene(scene);
earth.addToScene(scene);
moon.addToScene(scene);

// Obtener la luz puntual del sol
const sunLight = sun.getPointLight(); 

scene.add(new THREE.AxesHelper(5));

// const light = new THREE.PointLight(0xffffff, 50);
// light.position.set(0.8, 1.4, 1.0);
// scene.add(light);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0.8, 1.4, 1.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

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




function animate() {
    requestAnimationFrame(animate);

    sun.animate();

    render();
    stats.update();
}
function render() {
    renderer.render(scene, camera);
}

animate();
