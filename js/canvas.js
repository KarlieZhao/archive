import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera, scene, renderer, controls;

init();
animate();

function init() {

    const container = document.createElement('div');
    // document.body.appendChild( container );

    const canvas = document.getElementById('canvasContainer');
    canvas.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20);
    camera.position.set(5.0, 2.0, -7.0);

    scene = new THREE.Scene();

    // model

    new GLTFLoader()
        .setPath('https://github.com/KarlieZhao/archive/raw/main/model/')
        .load('pillow4.gltf', function(gltf) {

            scene.add(gltf.scene);

            const object = gltf.scene.getObjectByName('SheenChair_fabric');
            // const gui = new GUI();
            // gui.add( object.material, 'sheen', 0, 1 );
            // gui.open();
        });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    const environment = new RoomEnvironment(renderer);
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    scene.background = new THREE.Color(0x333333);
    scene.environment = pmremGenerator.fromScene(environment).texture;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.target.set(0, 0.35, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize);
    onWindowResize();
}

function onWindowResize() {

    // camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // renderer.setSize( window.innerWidth, window.innerHeight );

    const container = document.getElementById('canvasContainer');

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);

}

//

function animate() {

    requestAnimationFrame(animate);

    controls.update(); // required if damping enabled

    render();

}

function render() {

    renderer.render(scene, camera);
}