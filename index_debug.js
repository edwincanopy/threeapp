import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-canvas').appendChild(renderer.domElement);

const loader = new GLTFLoader();
loader.load(
    'dd1_dots.glb',
    function (gltf) {
        scene.add(gltf.scene);
        animate();
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
