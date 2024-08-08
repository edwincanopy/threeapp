import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';

import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/ShaderPass.js';
import { FilmShader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/shaders/FilmShader.js';


document.addEventListener('DOMContentLoaded', () => {
    const popupButton = document.getElementById('popupButton');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');

    popupButton.addEventListener('click', () => {
        popup.style.display = 'flex';
    });

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});


document.getElementById('playAudioButton').addEventListener('click', function() {
    var audioElement = document.getElementById('audio');
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var source = audioContext.createBufferSource();
    
    // Fetch and decode the audio data
    fetch(audioElement.src)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data))
        .then(buffer => {
            source.buffer = buffer;
            source.connect(audioContext.destination);
            
            // Play or pause the audio
            if (audioElement.paused) {
                source.start(0);
                audioElement.paused = false;
            } else {
                source.stop();
                audioElement.paused = true;
            }
        })
        .catch(error => console.error('Error with decoding audio data:', error));
});


const remoteUrl = "http://34.32.228.101:8080/generate_animation"
// 1. Set up the Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
let meshes = [];
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-canvas').appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

camera.fov = 50;
camera.updateProjectionMatrix();

let count;
let numbers; // identify the current image

/*
const images = [];
for (let i = 0; i <= 99; i++) {
    for (let j = 1; j <= 24; j++) {
        images.push(`graphs/overlay_graphs_${i}/${j}_GRAPH.png`);
    }
}*/

const images = ['graphs/overlay_graphs_0/1_GRAPH.png', 'graphs/overlay_graphs_0/2_GRAPH.png', 'graphs/overlay_graphs_0/3_GRAPH.png', 'graphs/overlay_graphs_0/4_GRAPH.png', 'graphs/overlay_graphs_0/5_GRAPH.png', 'graphs/overlay_graphs_0/6_GRAPH.png', 'graphs/overlay_graphs_0/7_GRAPH.png', 'graphs/overlay_graphs_0/8_GRAPH.png', 'graphs/overlay_graphs_0/9_GRAPH.png', 'graphs/overlay_graphs_0/10_GRAPH.png', 'graphs/overlay_graphs_0/11_GRAPH.png', 'graphs/overlay_graphs_0/12_GRAPH.png', 'graphs/overlay_graphs_0/13_GRAPH.png', 'graphs/overlay_graphs_0/14_GRAPH.png', 'graphs/overlay_graphs_0/15_GRAPH.png', 'graphs/overlay_graphs_0/16_GRAPH.png', 'graphs/overlay_graphs_0/17_GRAPH.png', 'graphs/overlay_graphs_0/18_GRAPH.png', 'graphs/overlay_graphs_0/19_GRAPH.png', 'graphs/overlay_graphs_0/20_GRAPH.png', 'graphs/overlay_graphs_0/21_GRAPH.png', 'graphs/overlay_graphs_0/22_GRAPH.png', 'graphs/overlay_graphs_0/23_GRAPH.png', 'graphs/overlay_graphs_0/24_GRAPH.png', 'graphs/overlay_graphs_1/1_GRAPH.png', 'graphs/overlay_graphs_1/2_GRAPH.png', 'graphs/overlay_graphs_1/3_GRAPH.png', 'graphs/overlay_graphs_1/4_GRAPH.png', 'graphs/overlay_graphs_1/5_GRAPH.png', 'graphs/overlay_graphs_1/6_GRAPH.png', 'graphs/overlay_graphs_1/7_GRAPH.png', 'graphs/overlay_graphs_1/8_GRAPH.png', 'graphs/overlay_graphs_1/9_GRAPH.png', 'graphs/overlay_graphs_1/10_GRAPH.png', 'graphs/overlay_graphs_1/11_GRAPH.png', 'graphs/overlay_graphs_1/12_GRAPH.png', 'graphs/overlay_graphs_1/13_GRAPH.png', 'graphs/overlay_graphs_1/14_GRAPH.png', 'graphs/overlay_graphs_1/15_GRAPH.png', 'graphs/overlay_graphs_1/16_GRAPH.png', 'graphs/overlay_graphs_1/17_GRAPH.png', 'graphs/overlay_graphs_1/18_GRAPH.png', 'graphs/overlay_graphs_1/19_GRAPH.png', 'graphs/overlay_graphs_1/20_GRAPH.png', 'graphs/overlay_graphs_1/21_GRAPH.png', 'graphs/overlay_graphs_1/22_GRAPH.png', 'graphs/overlay_graphs_1/23_GRAPH.png', 'graphs/overlay_graphs_1/24_GRAPH.png', 'graphs/overlay_graphs_2/1_GRAPH.png', 'graphs/overlay_graphs_2/2_GRAPH.png', 'graphs/overlay_graphs_2/3_GRAPH.png', 'graphs/overlay_graphs_2/4_GRAPH.png', 'graphs/overlay_graphs_2/5_GRAPH.png', 'graphs/overlay_graphs_2/6_GRAPH.png', 'graphs/overlay_graphs_2/7_GRAPH.png', 'graphs/overlay_graphs_2/8_GRAPH.png', 'graphs/overlay_graphs_2/9_GRAPH.png', 'graphs/overlay_graphs_2/10_GRAPH.png', 'graphs/overlay_graphs_2/11_GRAPH.png', 'graphs/overlay_graphs_2/12_GRAPH.png', 'graphs/overlay_graphs_2/13_GRAPH.png', 'graphs/overlay_graphs_2/14_GRAPH.png', 'graphs/overlay_graphs_2/15_GRAPH.png', 'graphs/overlay_graphs_2/16_GRAPH.png', 'graphs/overlay_graphs_2/17_GRAPH.png', 'graphs/overlay_graphs_2/18_GRAPH.png', 'graphs/overlay_graphs_2/19_GRAPH.png', 'graphs/overlay_graphs_2/20_GRAPH.png', 'graphs/overlay_graphs_2/21_GRAPH.png', 'graphs/overlay_graphs_2/22_GRAPH.png', 'graphs/overlay_graphs_2/23_GRAPH.png', 'graphs/overlay_graphs_2/24_GRAPH.png', 'graphs/overlay_graphs_3/1_GRAPH.png', 'graphs/overlay_graphs_3/2_GRAPH.png', 'graphs/overlay_graphs_3/3_GRAPH.png', 'graphs/overlay_graphs_3/4_GRAPH.png', 'graphs/overlay_graphs_3/5_GRAPH.png', 'graphs/overlay_graphs_3/6_GRAPH.png', 'graphs/overlay_graphs_3/7_GRAPH.png', 'graphs/overlay_graphs_3/8_GRAPH.png', 'graphs/overlay_graphs_3/9_GRAPH.png', 'graphs/overlay_graphs_3/10_GRAPH.png', 'graphs/overlay_graphs_3/11_GRAPH.png', 'graphs/overlay_graphs_3/12_GRAPH.png', 'graphs/overlay_graphs_3/13_GRAPH.png', 'graphs/overlay_graphs_3/14_GRAPH.png', 'graphs/overlay_graphs_3/15_GRAPH.png', 'graphs/overlay_graphs_3/16_GRAPH.png', 'graphs/overlay_graphs_3/17_GRAPH.png', 'graphs/overlay_graphs_3/18_GRAPH.png', 'graphs/overlay_graphs_3/19_GRAPH.png', 'graphs/overlay_graphs_3/20_GRAPH.png', 'graphs/overlay_graphs_3/21_GRAPH.png', 'graphs/overlay_graphs_3/22_GRAPH.png', 'graphs/overlay_graphs_3/23_GRAPH.png', 'graphs/overlay_graphs_3/24_GRAPH.png', 'graphs/overlay_graphs_4/1_GRAPH.png', 'graphs/overlay_graphs_4/2_GRAPH.png', 'graphs/overlay_graphs_4/3_GRAPH.png', 'graphs/overlay_graphs_4/4_GRAPH.png', 'graphs/overlay_graphs_4/5_GRAPH.png', 'graphs/overlay_graphs_4/6_GRAPH.png', 'graphs/overlay_graphs_4/7_GRAPH.png', 'graphs/overlay_graphs_4/8_GRAPH.png', 'graphs/overlay_graphs_4/9_GRAPH.png', 'graphs/overlay_graphs_4/10_GRAPH.png', 'graphs/overlay_graphs_4/11_GRAPH.png', 'graphs/overlay_graphs_4/12_GRAPH.png', 'graphs/overlay_graphs_4/13_GRAPH.png', 'graphs/overlay_graphs_4/14_GRAPH.png', 'graphs/overlay_graphs_4/15_GRAPH.png', 'graphs/overlay_graphs_4/16_GRAPH.png', 'graphs/overlay_graphs_4/17_GRAPH.png', 'graphs/overlay_graphs_4/18_GRAPH.png', 'graphs/overlay_graphs_4/19_GRAPH.png', 'graphs/overlay_graphs_4/20_GRAPH.png', 'graphs/overlay_graphs_5/1_GRAPH.png', 'graphs/overlay_graphs_5/2_GRAPH.png', 'graphs/overlay_graphs_5/3_GRAPH.png', 'graphs/overlay_graphs_5/4_GRAPH.png', 'graphs/overlay_graphs_5/5_GRAPH.png', 'graphs/overlay_graphs_5/6_GRAPH.png', 'graphs/overlay_graphs_5/7_GRAPH.png', 'graphs/overlay_graphs_5/8_GRAPH.png', 'graphs/overlay_graphs_5/9_GRAPH.png', 'graphs/overlay_graphs_5/10_GRAPH.png', 'graphs/overlay_graphs_5/11_GRAPH.png', 'graphs/overlay_graphs_5/12_GRAPH.png', 'graphs/overlay_graphs_5/13_GRAPH.png', 'graphs/overlay_graphs_5/14_GRAPH.png', 'graphs/overlay_graphs_5/15_GRAPH.png', 'graphs/overlay_graphs_5/16_GRAPH.png', 'graphs/overlay_graphs_5/17_GRAPH.png', 'graphs/overlay_graphs_5/18_GRAPH.png', 'graphs/overlay_graphs_5/19_GRAPH.png', 'graphs/overlay_graphs_5/20_GRAPH.png', 'graphs/overlay_graphs_5/21_GRAPH.png', 'graphs/overlay_graphs_5/22_GRAPH.png', 'graphs/overlay_graphs_5/23_GRAPH.png', 'graphs/overlay_graphs_5/24_GRAPH.png', 'graphs/overlay_graphs_6/1_GRAPH.png', 'graphs/overlay_graphs_6/2_GRAPH.png', 'graphs/overlay_graphs_6/3_GRAPH.png', 'graphs/overlay_graphs_6/4_GRAPH.png', 'graphs/overlay_graphs_6/5_GRAPH.png', 'graphs/overlay_graphs_6/6_GRAPH.png', 'graphs/overlay_graphs_6/7_GRAPH.png', 'graphs/overlay_graphs_6/8_GRAPH.png', 'graphs/overlay_graphs_6/9_GRAPH.png', 'graphs/overlay_graphs_6/10_GRAPH.png', 'graphs/overlay_graphs_6/11_GRAPH.png', 'graphs/overlay_graphs_6/12_GRAPH.png', 'graphs/overlay_graphs_6/13_GRAPH.png', 'graphs/overlay_graphs_6/14_GRAPH.png', 'graphs/overlay_graphs_6/15_GRAPH.png', 'graphs/overlay_graphs_6/16_GRAPH.png', 'graphs/overlay_graphs_7/1_GRAPH.png', 'graphs/overlay_graphs_7/2_GRAPH.png', 'graphs/overlay_graphs_7/3_GRAPH.png', 'graphs/overlay_graphs_7/4_GRAPH.png', 'graphs/overlay_graphs_7/5_GRAPH.png', 'graphs/overlay_graphs_7/6_GRAPH.png', 'graphs/overlay_graphs_7/7_GRAPH.png', 'graphs/overlay_graphs_7/8_GRAPH.png', 'graphs/overlay_graphs_7/9_GRAPH.png', 'graphs/overlay_graphs_7/10_GRAPH.png', 'graphs/overlay_graphs_7/11_GRAPH.png', 'graphs/overlay_graphs_7/12_GRAPH.png', 'graphs/overlay_graphs_7/13_GRAPH.png', 'graphs/overlay_graphs_7/14_GRAPH.png', 'graphs/overlay_graphs_7/15_GRAPH.png', 'graphs/overlay_graphs_7/16_GRAPH.png', 'graphs/overlay_graphs_7/17_GRAPH.png', 'graphs/overlay_graphs_7/18_GRAPH.png', 'graphs/overlay_graphs_7/19_GRAPH.png', 'graphs/overlay_graphs_7/20_GRAPH.png', 'graphs/overlay_graphs_7/21_GRAPH.png', 'graphs/overlay_graphs_7/22_GRAPH.png', 'graphs/overlay_graphs_7/23_GRAPH.png', 'graphs/overlay_graphs_7/24_GRAPH.png', 'graphs/overlay_graphs_8/1_GRAPH.png', 'graphs/overlay_graphs_8/2_GRAPH.png', 'graphs/overlay_graphs_8/3_GRAPH.png', 'graphs/overlay_graphs_8/4_GRAPH.png', 'graphs/overlay_graphs_8/5_GRAPH.png', 'graphs/overlay_graphs_8/6_GRAPH.png', 'graphs/overlay_graphs_8/7_GRAPH.png', 'graphs/overlay_graphs_8/8_GRAPH.png', 'graphs/overlay_graphs_8/9_GRAPH.png', 'graphs/overlay_graphs_8/10_GRAPH.png', 'graphs/overlay_graphs_8/11_GRAPH.png', 'graphs/overlay_graphs_8/12_GRAPH.png', 'graphs/overlay_graphs_8/13_GRAPH.png', 'graphs/overlay_graphs_8/14_GRAPH.png', 'graphs/overlay_graphs_8/15_GRAPH.png', 'graphs/overlay_graphs_8/16_GRAPH.png', 'graphs/overlay_graphs_8/17_GRAPH.png', 'graphs/overlay_graphs_8/18_GRAPH.png', 'graphs/overlay_graphs_8/19_GRAPH.png', 'graphs/overlay_graphs_8/20_GRAPH.png', 'graphs/overlay_graphs_8/21_GRAPH.png', 'graphs/overlay_graphs_8/22_GRAPH.png', 'graphs/overlay_graphs_8/23_GRAPH.png', 'graphs/overlay_graphs_8/24_GRAPH.png', 'graphs/overlay_graphs_9/1_GRAPH.png', 'graphs/overlay_graphs_9/2_GRAPH.png', 'graphs/overlay_graphs_9/3_GRAPH.png', 'graphs/overlay_graphs_9/4_GRAPH.png', 'graphs/overlay_graphs_9/5_GRAPH.png', 'graphs/overlay_graphs_9/6_GRAPH.png', 'graphs/overlay_graphs_9/7_GRAPH.png', 'graphs/overlay_graphs_9/8_GRAPH.png', 'graphs/overlay_graphs_9/9_GRAPH.png', 'graphs/overlay_graphs_9/10_GRAPH.png', 'graphs/overlay_graphs_9/11_GRAPH.png', 'graphs/overlay_graphs_9/12_GRAPH.png', 'graphs/overlay_graphs_9/13_GRAPH.png', 'graphs/overlay_graphs_9/14_GRAPH.png', 'graphs/overlay_graphs_9/15_GRAPH.png', 'graphs/overlay_graphs_9/16_GRAPH.png', 'graphs/overlay_graphs_9/17_GRAPH.png', 'graphs/overlay_graphs_9/18_GRAPH.png', 'graphs/overlay_graphs_9/19_GRAPH.png', 'graphs/overlay_graphs_9/20_GRAPH.png', 'graphs/overlay_graphs_9/21_GRAPH.png', 'graphs/overlay_graphs_9/22_GRAPH.png', 'graphs/overlay_graphs_9/23_GRAPH.png', 'graphs/overlay_graphs_9/24_GRAPH.png', 'graphs/overlay_graphs_10/1_GRAPH.png', 'graphs/overlay_graphs_10/2_GRAPH.png', 'graphs/overlay_graphs_10/3_GRAPH.png', 'graphs/overlay_graphs_10/4_GRAPH.png', 'graphs/overlay_graphs_10/5_GRAPH.png', 'graphs/overlay_graphs_10/6_GRAPH.png', 'graphs/overlay_graphs_10/7_GRAPH.png', 'graphs/overlay_graphs_10/8_GRAPH.png', 'graphs/overlay_graphs_10/9_GRAPH.png', 'graphs/overlay_graphs_10/10_GRAPH.png', 'graphs/overlay_graphs_10/11_GRAPH.png', 'graphs/overlay_graphs_10/12_GRAPH.png', 'graphs/overlay_graphs_10/13_GRAPH.png', 'graphs/overlay_graphs_10/14_GRAPH.png', 'graphs/overlay_graphs_10/15_GRAPH.png', 'graphs/overlay_graphs_10/16_GRAPH.png', 'graphs/overlay_graphs_10/17_GRAPH.png', 'graphs/overlay_graphs_10/18_GRAPH.png', 'graphs/overlay_graphs_10/19_GRAPH.png', 'graphs/overlay_graphs_10/20_GRAPH.png', 'graphs/overlay_graphs_10/21_GRAPH.png', 'graphs/overlay_graphs_10/22_GRAPH.png', 'graphs/overlay_graphs_10/23_GRAPH.png', 'graphs/overlay_graphs_10/24_GRAPH.png', 'graphs/overlay_graphs_11/1_GRAPH.png', 'graphs/overlay_graphs_11/2_GRAPH.png', 'graphs/overlay_graphs_11/3_GRAPH.png', 'graphs/overlay_graphs_11/4_GRAPH.png', 'graphs/overlay_graphs_11/5_GRAPH.png', 'graphs/overlay_graphs_11/6_GRAPH.png', 'graphs/overlay_graphs_11/7_GRAPH.png', 'graphs/overlay_graphs_11/8_GRAPH.png', 'graphs/overlay_graphs_11/9_GRAPH.png', 'graphs/overlay_graphs_11/10_GRAPH.png', 'graphs/overlay_graphs_11/11_GRAPH.png', 'graphs/overlay_graphs_11/12_GRAPH.png', 'graphs/overlay_graphs_11/13_GRAPH.png', 'graphs/overlay_graphs_11/14_GRAPH.png', 'graphs/overlay_graphs_11/15_GRAPH.png', 'graphs/overlay_graphs_11/16_GRAPH.png', 'graphs/overlay_graphs_11/17_GRAPH.png', 'graphs/overlay_graphs_11/18_GRAPH.png', 'graphs/overlay_graphs_11/19_GRAPH.png', 'graphs/overlay_graphs_11/20_GRAPH.png', 'graphs/overlay_graphs_11/21_GRAPH.png', 'graphs/overlay_graphs_11/22_GRAPH.png', 'graphs/overlay_graphs_11/23_GRAPH.png', 'graphs/overlay_graphs_11/24_GRAPH.png', 'graphs/overlay_graphs_12/1_GRAPH.png', 'graphs/overlay_graphs_12/2_GRAPH.png', 'graphs/overlay_graphs_12/3_GRAPH.png', 'graphs/overlay_graphs_12/4_GRAPH.png', 'graphs/overlay_graphs_12/5_GRAPH.png', 'graphs/overlay_graphs_12/6_GRAPH.png', 'graphs/overlay_graphs_12/7_GRAPH.png', 'graphs/overlay_graphs_12/8_GRAPH.png', 'graphs/overlay_graphs_12/9_GRAPH.png', 'graphs/overlay_graphs_12/10_GRAPH.png', 'graphs/overlay_graphs_12/11_GRAPH.png', 'graphs/overlay_graphs_12/12_GRAPH.png', 'graphs/overlay_graphs_12/13_GRAPH.png', 'graphs/overlay_graphs_12/14_GRAPH.png', 'graphs/overlay_graphs_12/15_GRAPH.png', 'graphs/overlay_graphs_12/16_GRAPH.png', 'graphs/overlay_graphs_12/17_GRAPH.png', 'graphs/overlay_graphs_12/18_GRAPH.png', 'graphs/overlay_graphs_12/19_GRAPH.png', 'graphs/overlay_graphs_12/20_GRAPH.png', 'graphs/overlay_graphs_12/21_GRAPH.png', 'graphs/overlay_graphs_12/22_GRAPH.png', 'graphs/overlay_graphs_12/23_GRAPH.png', 'graphs/overlay_graphs_12/24_GRAPH.png', 'graphs/overlay_graphs_13/1_GRAPH.png', 'graphs/overlay_graphs_13/2_GRAPH.png', 'graphs/overlay_graphs_13/3_GRAPH.png', 'graphs/overlay_graphs_13/4_GRAPH.png', 'graphs/overlay_graphs_13/5_GRAPH.png', 'graphs/overlay_graphs_13/6_GRAPH.png', 'graphs/overlay_graphs_13/7_GRAPH.png', 'graphs/overlay_graphs_13/8_GRAPH.png', 'graphs/overlay_graphs_13/9_GRAPH.png', 'graphs/overlay_graphs_13/10_GRAPH.png', 'graphs/overlay_graphs_13/11_GRAPH.png', 'graphs/overlay_graphs_13/12_GRAPH.png', 'graphs/overlay_graphs_13/13_GRAPH.png', 'graphs/overlay_graphs_13/14_GRAPH.png', 'graphs/overlay_graphs_13/15_GRAPH.png', 'graphs/overlay_graphs_13/16_GRAPH.png', 'graphs/overlay_graphs_13/17_GRAPH.png', 'graphs/overlay_graphs_13/18_GRAPH.png', 'graphs/overlay_graphs_13/19_GRAPH.png', 'graphs/overlay_graphs_13/20_GRAPH.png', 'graphs/overlay_graphs_13/21_GRAPH.png', 'graphs/overlay_graphs_13/22_GRAPH.png', 'graphs/overlay_graphs_13/23_GRAPH.png', 'graphs/overlay_graphs_13/24_GRAPH.png', 'graphs/overlay_graphs_14/1_GRAPH.png', 'graphs/overlay_graphs_14/2_GRAPH.png', 'graphs/overlay_graphs_14/3_GRAPH.png', 'graphs/overlay_graphs_14/4_GRAPH.png', 'graphs/overlay_graphs_14/5_GRAPH.png', 'graphs/overlay_graphs_14/6_GRAPH.png', 'graphs/overlay_graphs_14/7_GRAPH.png', 'graphs/overlay_graphs_14/8_GRAPH.png', 'graphs/overlay_graphs_14/9_GRAPH.png', 'graphs/overlay_graphs_14/10_GRAPH.png', 'graphs/overlay_graphs_14/11_GRAPH.png', 'graphs/overlay_graphs_14/12_GRAPH.png', 'graphs/overlay_graphs_14/13_GRAPH.png', 'graphs/overlay_graphs_14/14_GRAPH.png', 'graphs/overlay_graphs_14/15_GRAPH.png', 'graphs/overlay_graphs_14/16_GRAPH.png', 'graphs/overlay_graphs_14/17_GRAPH.png', 'graphs/overlay_graphs_14/18_GRAPH.png', 'graphs/overlay_graphs_14/19_GRAPH.png', 'graphs/overlay_graphs_14/20_GRAPH.png', 'graphs/overlay_graphs_14/21_GRAPH.png', 'graphs/overlay_graphs_14/22_GRAPH.png', 'graphs/overlay_graphs_14/23_GRAPH.png', 'graphs/overlay_graphs_14/24_GRAPH.png', 'graphs/overlay_graphs_15/1_GRAPH.png', 'graphs/overlay_graphs_15/2_GRAPH.png', 'graphs/overlay_graphs_15/3_GRAPH.png', 'graphs/overlay_graphs_15/4_GRAPH.png', 'graphs/overlay_graphs_15/5_GRAPH.png', 'graphs/overlay_graphs_15/6_GRAPH.png', 'graphs/overlay_graphs_15/7_GRAPH.png', 'graphs/overlay_graphs_15/8_GRAPH.png', 'graphs/overlay_graphs_15/9_GRAPH.png', 'graphs/overlay_graphs_15/10_GRAPH.png', 'graphs/overlay_graphs_15/11_GRAPH.png', 'graphs/overlay_graphs_15/12_GRAPH.png', 'graphs/overlay_graphs_15/13_GRAPH.png', 'graphs/overlay_graphs_15/14_GRAPH.png', 'graphs/overlay_graphs_15/15_GRAPH.png', 'graphs/overlay_graphs_15/16_GRAPH.png', 'graphs/overlay_graphs_15/17_GRAPH.png', 'graphs/overlay_graphs_15/18_GRAPH.png', 'graphs/overlay_graphs_15/19_GRAPH.png', 'graphs/overlay_graphs_15/20_GRAPH.png', 'graphs/overlay_graphs_15/21_GRAPH.png', 'graphs/overlay_graphs_15/22_GRAPH.png', 'graphs/overlay_graphs_15/23_GRAPH.png', 'graphs/overlay_graphs_15/24_GRAPH.png', 'graphs/overlay_graphs_16/1_GRAPH.png', 'graphs/overlay_graphs_16/2_GRAPH.png', 'graphs/overlay_graphs_16/3_GRAPH.png', 'graphs/overlay_graphs_16/4_GRAPH.png', 'graphs/overlay_graphs_16/5_GRAPH.png', 'graphs/overlay_graphs_16/6_GRAPH.png', 'graphs/overlay_graphs_16/7_GRAPH.png', 'graphs/overlay_graphs_16/8_GRAPH.png', 'graphs/overlay_graphs_16/9_GRAPH.png', 'graphs/overlay_graphs_16/10_GRAPH.png', 'graphs/overlay_graphs_16/11_GRAPH.png', 'graphs/overlay_graphs_16/12_GRAPH.png', 'graphs/overlay_graphs_17/1_GRAPH.png', 'graphs/overlay_graphs_17/2_GRAPH.png', 'graphs/overlay_graphs_17/3_GRAPH.png', 'graphs/overlay_graphs_17/4_GRAPH.png', 'graphs/overlay_graphs_17/5_GRAPH.png', 'graphs/overlay_graphs_17/6_GRAPH.png', 'graphs/overlay_graphs_17/7_GRAPH.png', 'graphs/overlay_graphs_17/8_GRAPH.png', 'graphs/overlay_graphs_17/9_GRAPH.png', 'graphs/overlay_graphs_17/10_GRAPH.png', 'graphs/overlay_graphs_17/11_GRAPH.png', 'graphs/overlay_graphs_17/12_GRAPH.png', 'graphs/overlay_graphs_17/13_GRAPH.png', 'graphs/overlay_graphs_17/14_GRAPH.png', 'graphs/overlay_graphs_17/15_GRAPH.png', 'graphs/overlay_graphs_17/16_GRAPH.png', 'graphs/overlay_graphs_18/1_GRAPH.png', 'graphs/overlay_graphs_18/2_GRAPH.png', 'graphs/overlay_graphs_18/3_GRAPH.png', 'graphs/overlay_graphs_18/4_GRAPH.png', 'graphs/overlay_graphs_18/5_GRAPH.png', 'graphs/overlay_graphs_18/6_GRAPH.png', 'graphs/overlay_graphs_18/7_GRAPH.png', 'graphs/overlay_graphs_18/8_GRAPH.png', 'graphs/overlay_graphs_18/9_GRAPH.png', 'graphs/overlay_graphs_18/10_GRAPH.png', 'graphs/overlay_graphs_18/11_GRAPH.png', 'graphs/overlay_graphs_18/12_GRAPH.png', 'graphs/overlay_graphs_18/13_GRAPH.png', 'graphs/overlay_graphs_18/14_GRAPH.png', 'graphs/overlay_graphs_18/15_GRAPH.png', 'graphs/overlay_graphs_18/16_GRAPH.png', 'graphs/overlay_graphs_18/17_GRAPH.png', 'graphs/overlay_graphs_18/18_GRAPH.png', 'graphs/overlay_graphs_18/19_GRAPH.png', 'graphs/overlay_graphs_18/20_GRAPH.png', 'graphs/overlay_graphs_18/21_GRAPH.png', 'graphs/overlay_graphs_18/22_GRAPH.png', 'graphs/overlay_graphs_18/23_GRAPH.png', 'graphs/overlay_graphs_18/24_GRAPH.png', 'graphs/overlay_graphs_19/1_GRAPH.png', 'graphs/overlay_graphs_19/2_GRAPH.png', 'graphs/overlay_graphs_19/3_GRAPH.png', 'graphs/overlay_graphs_19/4_GRAPH.png', 'graphs/overlay_graphs_19/5_GRAPH.png', 'graphs/overlay_graphs_19/6_GRAPH.png', 'graphs/overlay_graphs_19/7_GRAPH.png', 'graphs/overlay_graphs_19/8_GRAPH.png', 'graphs/overlay_graphs_19/9_GRAPH.png', 'graphs/overlay_graphs_19/10_GRAPH.png', 'graphs/overlay_graphs_19/11_GRAPH.png', 'graphs/overlay_graphs_19/12_GRAPH.png', 'graphs/overlay_graphs_19/13_GRAPH.png', 'graphs/overlay_graphs_19/14_GRAPH.png', 'graphs/overlay_graphs_19/15_GRAPH.png', 'graphs/overlay_graphs_19/16_GRAPH.png', 'graphs/overlay_graphs_19/17_GRAPH.png', 'graphs/overlay_graphs_19/18_GRAPH.png', 'graphs/overlay_graphs_19/19_GRAPH.png', 'graphs/overlay_graphs_19/20_GRAPH.png', 'graphs/overlay_graphs_19/21_GRAPH.png', 'graphs/overlay_graphs_19/22_GRAPH.png', 'graphs/overlay_graphs_19/23_GRAPH.png', 'graphs/overlay_graphs_19/24_GRAPH.png', 'graphs/overlay_graphs_20/1_GRAPH.png', 'graphs/overlay_graphs_20/2_GRAPH.png', 'graphs/overlay_graphs_20/3_GRAPH.png', 'graphs/overlay_graphs_20/4_GRAPH.png', 'graphs/overlay_graphs_20/5_GRAPH.png', 'graphs/overlay_graphs_20/6_GRAPH.png', 'graphs/overlay_graphs_20/7_GRAPH.png', 'graphs/overlay_graphs_20/8_GRAPH.png', 'graphs/overlay_graphs_20/9_GRAPH.png', 'graphs/overlay_graphs_20/10_GRAPH.png', 'graphs/overlay_graphs_20/11_GRAPH.png', 'graphs/overlay_graphs_20/12_GRAPH.png', 'graphs/overlay_graphs_20/13_GRAPH.png', 'graphs/overlay_graphs_20/14_GRAPH.png', 'graphs/overlay_graphs_20/15_GRAPH.png', 'graphs/overlay_graphs_20/16_GRAPH.png', 'graphs/overlay_graphs_20/17_GRAPH.png', 'graphs/overlay_graphs_20/18_GRAPH.png', 'graphs/overlay_graphs_20/19_GRAPH.png', 'graphs/overlay_graphs_20/20_GRAPH.png', 'graphs/overlay_graphs_20/21_GRAPH.png', 'graphs/overlay_graphs_20/22_GRAPH.png', 'graphs/overlay_graphs_20/23_GRAPH.png', 'graphs/overlay_graphs_20/24_GRAPH.png', 'graphs/overlay_graphs_21/1_GRAPH.png', 'graphs/overlay_graphs_21/2_GRAPH.png', 'graphs/overlay_graphs_21/3_GRAPH.png', 'graphs/overlay_graphs_21/4_GRAPH.png', 'graphs/overlay_graphs_21/5_GRAPH.png', 'graphs/overlay_graphs_21/6_GRAPH.png', 'graphs/overlay_graphs_21/7_GRAPH.png', 'graphs/overlay_graphs_21/8_GRAPH.png', 'graphs/overlay_graphs_21/9_GRAPH.png', 'graphs/overlay_graphs_21/10_GRAPH.png', 'graphs/overlay_graphs_21/11_GRAPH.png', 'graphs/overlay_graphs_21/12_GRAPH.png', 'graphs/overlay_graphs_21/13_GRAPH.png', 'graphs/overlay_graphs_21/14_GRAPH.png', 'graphs/overlay_graphs_21/15_GRAPH.png', 'graphs/overlay_graphs_21/16_GRAPH.png', 'graphs/overlay_graphs_21/17_GRAPH.png', 'graphs/overlay_graphs_21/18_GRAPH.png', 'graphs/overlay_graphs_21/19_GRAPH.png', 'graphs/overlay_graphs_21/20_GRAPH.png', 'graphs/overlay_graphs_21/21_GRAPH.png', 'graphs/overlay_graphs_21/22_GRAPH.png', 'graphs/overlay_graphs_21/23_GRAPH.png', 'graphs/overlay_graphs_21/24_GRAPH.png', 'graphs/overlay_graphs_22/1_GRAPH.png', 'graphs/overlay_graphs_22/2_GRAPH.png', 'graphs/overlay_graphs_22/3_GRAPH.png', 'graphs/overlay_graphs_22/4_GRAPH.png', 'graphs/overlay_graphs_22/5_GRAPH.png', 'graphs/overlay_graphs_22/6_GRAPH.png', 'graphs/overlay_graphs_22/7_GRAPH.png', 'graphs/overlay_graphs_22/8_GRAPH.png', 'graphs/overlay_graphs_22/9_GRAPH.png', 'graphs/overlay_graphs_22/10_GRAPH.png', 'graphs/overlay_graphs_22/11_GRAPH.png', 'graphs/overlay_graphs_22/12_GRAPH.png', 'graphs/overlay_graphs_22/13_GRAPH.png', 'graphs/overlay_graphs_22/14_GRAPH.png', 'graphs/overlay_graphs_22/15_GRAPH.png', 'graphs/overlay_graphs_22/16_GRAPH.png', 'graphs/overlay_graphs_22/17_GRAPH.png', 'graphs/overlay_graphs_22/18_GRAPH.png', 'graphs/overlay_graphs_22/19_GRAPH.png', 'graphs/overlay_graphs_22/20_GRAPH.png', 'graphs/overlay_graphs_22/21_GRAPH.png', 'graphs/overlay_graphs_22/22_GRAPH.png', 'graphs/overlay_graphs_22/23_GRAPH.png', 'graphs/overlay_graphs_22/24_GRAPH.png', 'graphs/overlay_graphs_23/1_GRAPH.png', 'graphs/overlay_graphs_23/2_GRAPH.png', 'graphs/overlay_graphs_23/3_GRAPH.png', 'graphs/overlay_graphs_23/4_GRAPH.png', 'graphs/overlay_graphs_23/5_GRAPH.png', 'graphs/overlay_graphs_23/6_GRAPH.png', 'graphs/overlay_graphs_23/7_GRAPH.png', 'graphs/overlay_graphs_23/8_GRAPH.png', 'graphs/overlay_graphs_23/9_GRAPH.png', 'graphs/overlay_graphs_23/10_GRAPH.png', 'graphs/overlay_graphs_23/11_GRAPH.png', 'graphs/overlay_graphs_23/12_GRAPH.png', 'graphs/overlay_graphs_23/13_GRAPH.png', 'graphs/overlay_graphs_23/14_GRAPH.png', 'graphs/overlay_graphs_23/15_GRAPH.png', 'graphs/overlay_graphs_23/16_GRAPH.png', 'graphs/overlay_graphs_23/17_GRAPH.png', 'graphs/overlay_graphs_23/18_GRAPH.png', 'graphs/overlay_graphs_23/19_GRAPH.png', 'graphs/overlay_graphs_23/20_GRAPH.png', 'graphs/overlay_graphs_23/21_GRAPH.png', 'graphs/overlay_graphs_23/22_GRAPH.png', 'graphs/overlay_graphs_23/23_GRAPH.png', 'graphs/overlay_graphs_23/24_GRAPH.png', 'graphs/overlay_graphs_24/1_GRAPH.png', 'graphs/overlay_graphs_24/2_GRAPH.png', 'graphs/overlay_graphs_24/3_GRAPH.png', 'graphs/overlay_graphs_24/4_GRAPH.png', 'graphs/overlay_graphs_24/5_GRAPH.png', 'graphs/overlay_graphs_24/6_GRAPH.png', 'graphs/overlay_graphs_24/7_GRAPH.png', 'graphs/overlay_graphs_24/8_GRAPH.png', 'graphs/overlay_graphs_24/9_GRAPH.png', 'graphs/overlay_graphs_24/10_GRAPH.png', 'graphs/overlay_graphs_24/11_GRAPH.png', 'graphs/overlay_graphs_24/12_GRAPH.png', 'graphs/overlay_graphs_24/13_GRAPH.png', 'graphs/overlay_graphs_24/14_GRAPH.png', 'graphs/overlay_graphs_24/15_GRAPH.png', 'graphs/overlay_graphs_24/16_GRAPH.png', 'graphs/overlay_graphs_24/17_GRAPH.png', 'graphs/overlay_graphs_24/18_GRAPH.png', 'graphs/overlay_graphs_24/19_GRAPH.png', 'graphs/overlay_graphs_24/20_GRAPH.png', 'graphs/overlay_graphs_24/21_GRAPH.png', 'graphs/overlay_graphs_24/22_GRAPH.png', 'graphs/overlay_graphs_24/23_GRAPH.png', 'graphs/overlay_graphs_24/24_GRAPH.png', 'graphs/overlay_graphs_25/1_GRAPH.png', 'graphs/overlay_graphs_25/2_GRAPH.png', 'graphs/overlay_graphs_25/3_GRAPH.png', 'graphs/overlay_graphs_25/4_GRAPH.png', 'graphs/overlay_graphs_25/5_GRAPH.png', 'graphs/overlay_graphs_25/6_GRAPH.png', 'graphs/overlay_graphs_25/7_GRAPH.png', 'graphs/overlay_graphs_25/8_GRAPH.png', 'graphs/overlay_graphs_25/9_GRAPH.png', 'graphs/overlay_graphs_25/10_GRAPH.png', 'graphs/overlay_graphs_25/11_GRAPH.png', 'graphs/overlay_graphs_25/12_GRAPH.png', 'graphs/overlay_graphs_25/13_GRAPH.png', 'graphs/overlay_graphs_25/14_GRAPH.png', 'graphs/overlay_graphs_25/15_GRAPH.png', 'graphs/overlay_graphs_25/16_GRAPH.png', 'graphs/overlay_graphs_25/17_GRAPH.png', 'graphs/overlay_graphs_25/18_GRAPH.png', 'graphs/overlay_graphs_25/19_GRAPH.png', 'graphs/overlay_graphs_25/20_GRAPH.png', 'graphs/overlay_graphs_25/21_GRAPH.png', 'graphs/overlay_graphs_25/22_GRAPH.png', 'graphs/overlay_graphs_25/23_GRAPH.png', 'graphs/overlay_graphs_25/24_GRAPH.png', 'graphs/overlay_graphs_26/1_GRAPH.png', 'graphs/overlay_graphs_26/2_GRAPH.png', 'graphs/overlay_graphs_26/3_GRAPH.png', 'graphs/overlay_graphs_26/4_GRAPH.png', 'graphs/overlay_graphs_26/5_GRAPH.png', 'graphs/overlay_graphs_26/6_GRAPH.png', 'graphs/overlay_graphs_26/7_GRAPH.png', 'graphs/overlay_graphs_26/8_GRAPH.png', 'graphs/overlay_graphs_26/9_GRAPH.png', 'graphs/overlay_graphs_26/10_GRAPH.png', 'graphs/overlay_graphs_26/11_GRAPH.png', 'graphs/overlay_graphs_26/12_GRAPH.png', 'graphs/overlay_graphs_26/13_GRAPH.png', 'graphs/overlay_graphs_26/14_GRAPH.png', 'graphs/overlay_graphs_26/15_GRAPH.png', 'graphs/overlay_graphs_26/16_GRAPH.png', 'graphs/overlay_graphs_26/17_GRAPH.png', 'graphs/overlay_graphs_26/18_GRAPH.png', 'graphs/overlay_graphs_26/19_GRAPH.png', 'graphs/overlay_graphs_26/20_GRAPH.png', 'graphs/overlay_graphs_26/21_GRAPH.png', 'graphs/overlay_graphs_26/22_GRAPH.png', 'graphs/overlay_graphs_26/23_GRAPH.png', 'graphs/overlay_graphs_26/24_GRAPH.png', 'graphs/overlay_graphs_27/1_GRAPH.png', 'graphs/overlay_graphs_27/2_GRAPH.png', 'graphs/overlay_graphs_27/3_GRAPH.png', 'graphs/overlay_graphs_27/4_GRAPH.png', 'graphs/overlay_graphs_27/5_GRAPH.png', 'graphs/overlay_graphs_27/6_GRAPH.png', 'graphs/overlay_graphs_27/7_GRAPH.png', 'graphs/overlay_graphs_27/8_GRAPH.png', 'graphs/overlay_graphs_27/9_GRAPH.png', 'graphs/overlay_graphs_27/10_GRAPH.png', 'graphs/overlay_graphs_27/11_GRAPH.png', 'graphs/overlay_graphs_27/12_GRAPH.png', 'graphs/overlay_graphs_27/13_GRAPH.png', 'graphs/overlay_graphs_27/14_GRAPH.png', 'graphs/overlay_graphs_27/15_GRAPH.png', 'graphs/overlay_graphs_27/16_GRAPH.png', 'graphs/overlay_graphs_27/17_GRAPH.png', 'graphs/overlay_graphs_27/18_GRAPH.png', 'graphs/overlay_graphs_27/19_GRAPH.png', 'graphs/overlay_graphs_27/20_GRAPH.png', 'graphs/overlay_graphs_27/21_GRAPH.png', 'graphs/overlay_graphs_27/22_GRAPH.png', 'graphs/overlay_graphs_27/23_GRAPH.png', 'graphs/overlay_graphs_27/24_GRAPH.png', 'graphs/overlay_graphs_28/1_GRAPH.png', 'graphs/overlay_graphs_28/2_GRAPH.png', 'graphs/overlay_graphs_28/3_GRAPH.png', 'graphs/overlay_graphs_28/4_GRAPH.png', 'graphs/overlay_graphs_28/5_GRAPH.png', 'graphs/overlay_graphs_28/6_GRAPH.png', 'graphs/overlay_graphs_28/7_GRAPH.png', 'graphs/overlay_graphs_28/8_GRAPH.png', 'graphs/overlay_graphs_28/9_GRAPH.png', 'graphs/overlay_graphs_28/10_GRAPH.png', 'graphs/overlay_graphs_28/11_GRAPH.png', 'graphs/overlay_graphs_28/12_GRAPH.png', 'graphs/overlay_graphs_28/13_GRAPH.png', 'graphs/overlay_graphs_28/14_GRAPH.png', 'graphs/overlay_graphs_28/15_GRAPH.png', 'graphs/overlay_graphs_28/16_GRAPH.png', 'graphs/overlay_graphs_28/17_GRAPH.png', 'graphs/overlay_graphs_28/18_GRAPH.png', 'graphs/overlay_graphs_28/19_GRAPH.png', 'graphs/overlay_graphs_28/20_GRAPH.png', 'graphs/overlay_graphs_28/21_GRAPH.png', 'graphs/overlay_graphs_28/22_GRAPH.png', 'graphs/overlay_graphs_28/23_GRAPH.png', 'graphs/overlay_graphs_28/24_GRAPH.png', 'graphs/overlay_graphs_29/1_GRAPH.png', 'graphs/overlay_graphs_29/2_GRAPH.png', 'graphs/overlay_graphs_29/3_GRAPH.png', 'graphs/overlay_graphs_29/4_GRAPH.png', 'graphs/overlay_graphs_29/5_GRAPH.png', 'graphs/overlay_graphs_29/6_GRAPH.png', 'graphs/overlay_graphs_29/7_GRAPH.png', 'graphs/overlay_graphs_29/8_GRAPH.png', 'graphs/overlay_graphs_29/9_GRAPH.png', 'graphs/overlay_graphs_29/10_GRAPH.png', 'graphs/overlay_graphs_29/11_GRAPH.png', 'graphs/overlay_graphs_29/12_GRAPH.png', 'graphs/overlay_graphs_29/13_GRAPH.png', 'graphs/overlay_graphs_29/14_GRAPH.png', 'graphs/overlay_graphs_29/15_GRAPH.png', 'graphs/overlay_graphs_29/16_GRAPH.png', 'graphs/overlay_graphs_29/17_GRAPH.png', 'graphs/overlay_graphs_29/18_GRAPH.png', 'graphs/overlay_graphs_29/19_GRAPH.png', 'graphs/overlay_graphs_29/20_GRAPH.png', 'graphs/overlay_graphs_30/1_GRAPH.png', 'graphs/overlay_graphs_30/2_GRAPH.png', 'graphs/overlay_graphs_30/3_GRAPH.png', 'graphs/overlay_graphs_30/4_GRAPH.png', 'graphs/overlay_graphs_30/5_GRAPH.png', 'graphs/overlay_graphs_30/6_GRAPH.png', 'graphs/overlay_graphs_30/7_GRAPH.png', 'graphs/overlay_graphs_30/8_GRAPH.png', 'graphs/overlay_graphs_30/9_GRAPH.png', 'graphs/overlay_graphs_30/10_GRAPH.png', 'graphs/overlay_graphs_30/11_GRAPH.png', 'graphs/overlay_graphs_30/12_GRAPH.png', 'graphs/overlay_graphs_30/13_GRAPH.png', 'graphs/overlay_graphs_30/14_GRAPH.png', 'graphs/overlay_graphs_30/15_GRAPH.png', 'graphs/overlay_graphs_30/16_GRAPH.png', 'graphs/overlay_graphs_30/17_GRAPH.png', 'graphs/overlay_graphs_30/18_GRAPH.png', 'graphs/overlay_graphs_30/19_GRAPH.png', 'graphs/overlay_graphs_30/20_GRAPH.png', 'graphs/overlay_graphs_30/21_GRAPH.png', 'graphs/overlay_graphs_30/22_GRAPH.png', 'graphs/overlay_graphs_30/23_GRAPH.png', 'graphs/overlay_graphs_30/24_GRAPH.png', 'graphs/overlay_graphs_31/1_GRAPH.png', 'graphs/overlay_graphs_31/2_GRAPH.png', 'graphs/overlay_graphs_31/3_GRAPH.png', 'graphs/overlay_graphs_31/4_GRAPH.png', 'graphs/overlay_graphs_31/5_GRAPH.png', 'graphs/overlay_graphs_31/6_GRAPH.png', 'graphs/overlay_graphs_31/7_GRAPH.png', 'graphs/overlay_graphs_31/8_GRAPH.png', 'graphs/overlay_graphs_31/9_GRAPH.png', 'graphs/overlay_graphs_31/10_GRAPH.png', 'graphs/overlay_graphs_31/11_GRAPH.png', 'graphs/overlay_graphs_31/12_GRAPH.png', 'graphs/overlay_graphs_31/13_GRAPH.png', 'graphs/overlay_graphs_31/14_GRAPH.png', 'graphs/overlay_graphs_31/15_GRAPH.png', 'graphs/overlay_graphs_31/16_GRAPH.png', 'graphs/overlay_graphs_31/17_GRAPH.png', 'graphs/overlay_graphs_31/18_GRAPH.png', 'graphs/overlay_graphs_31/19_GRAPH.png', 'graphs/overlay_graphs_31/20_GRAPH.png', 'graphs/overlay_graphs_31/21_GRAPH.png', 'graphs/overlay_graphs_31/22_GRAPH.png', 'graphs/overlay_graphs_31/23_GRAPH.png', 'graphs/overlay_graphs_31/24_GRAPH.png', 'graphs/overlay_graphs_32/1_GRAPH.png', 'graphs/overlay_graphs_32/2_GRAPH.png', 'graphs/overlay_graphs_32/3_GRAPH.png', 'graphs/overlay_graphs_32/4_GRAPH.png', 'graphs/overlay_graphs_32/5_GRAPH.png', 'graphs/overlay_graphs_32/6_GRAPH.png', 'graphs/overlay_graphs_32/7_GRAPH.png', 'graphs/overlay_graphs_32/8_GRAPH.png', 'graphs/overlay_graphs_32/9_GRAPH.png', 'graphs/overlay_graphs_32/10_GRAPH.png', 'graphs/overlay_graphs_32/11_GRAPH.png', 'graphs/overlay_graphs_32/12_GRAPH.png', 'graphs/overlay_graphs_32/13_GRAPH.png', 'graphs/overlay_graphs_32/14_GRAPH.png', 'graphs/overlay_graphs_32/15_GRAPH.png', 'graphs/overlay_graphs_32/16_GRAPH.png', 'graphs/overlay_graphs_32/17_GRAPH.png', 'graphs/overlay_graphs_32/18_GRAPH.png', 'graphs/overlay_graphs_32/19_GRAPH.png', 'graphs/overlay_graphs_32/20_GRAPH.png', 'graphs/overlay_graphs_32/21_GRAPH.png', 'graphs/overlay_graphs_32/22_GRAPH.png', 'graphs/overlay_graphs_32/23_GRAPH.png', 'graphs/overlay_graphs_32/24_GRAPH.png', 'graphs/overlay_graphs_33/1_GRAPH.png', 'graphs/overlay_graphs_33/2_GRAPH.png', 'graphs/overlay_graphs_33/3_GRAPH.png', 'graphs/overlay_graphs_33/4_GRAPH.png', 'graphs/overlay_graphs_33/5_GRAPH.png', 'graphs/overlay_graphs_33/6_GRAPH.png', 'graphs/overlay_graphs_33/7_GRAPH.png', 'graphs/overlay_graphs_33/8_GRAPH.png', 'graphs/overlay_graphs_33/9_GRAPH.png', 'graphs/overlay_graphs_33/10_GRAPH.png', 'graphs/overlay_graphs_33/11_GRAPH.png', 'graphs/overlay_graphs_33/12_GRAPH.png', 'graphs/overlay_graphs_33/13_GRAPH.png', 'graphs/overlay_graphs_33/14_GRAPH.png', 'graphs/overlay_graphs_33/15_GRAPH.png', 'graphs/overlay_graphs_33/16_GRAPH.png', 'graphs/overlay_graphs_33/17_GRAPH.png', 'graphs/overlay_graphs_33/18_GRAPH.png', 'graphs/overlay_graphs_33/19_GRAPH.png', 'graphs/overlay_graphs_33/20_GRAPH.png', 'graphs/overlay_graphs_33/21_GRAPH.png', 'graphs/overlay_graphs_33/22_GRAPH.png', 'graphs/overlay_graphs_33/23_GRAPH.png', 'graphs/overlay_graphs_33/24_GRAPH.png', 'graphs/overlay_graphs_34/1_GRAPH.png', 'graphs/overlay_graphs_34/2_GRAPH.png', 'graphs/overlay_graphs_34/3_GRAPH.png', 'graphs/overlay_graphs_34/4_GRAPH.png', 'graphs/overlay_graphs_34/5_GRAPH.png', 'graphs/overlay_graphs_34/6_GRAPH.png', 'graphs/overlay_graphs_34/7_GRAPH.png', 'graphs/overlay_graphs_34/8_GRAPH.png', 'graphs/overlay_graphs_34/9_GRAPH.png', 'graphs/overlay_graphs_34/10_GRAPH.png', 'graphs/overlay_graphs_34/11_GRAPH.png', 'graphs/overlay_graphs_34/12_GRAPH.png', 'graphs/overlay_graphs_34/13_GRAPH.png', 'graphs/overlay_graphs_34/14_GRAPH.png', 'graphs/overlay_graphs_34/15_GRAPH.png', 'graphs/overlay_graphs_34/16_GRAPH.png', 'graphs/overlay_graphs_34/17_GRAPH.png', 'graphs/overlay_graphs_34/18_GRAPH.png', 'graphs/overlay_graphs_34/19_GRAPH.png', 'graphs/overlay_graphs_34/20_GRAPH.png', 'graphs/overlay_graphs_34/21_GRAPH.png', 'graphs/overlay_graphs_34/22_GRAPH.png', 'graphs/overlay_graphs_34/23_GRAPH.png', 'graphs/overlay_graphs_34/24_GRAPH.png', 'graphs/overlay_graphs_35/1_GRAPH.png', 'graphs/overlay_graphs_35/2_GRAPH.png', 'graphs/overlay_graphs_35/3_GRAPH.png', 'graphs/overlay_graphs_35/4_GRAPH.png', 'graphs/overlay_graphs_35/5_GRAPH.png', 'graphs/overlay_graphs_35/6_GRAPH.png', 'graphs/overlay_graphs_35/7_GRAPH.png', 'graphs/overlay_graphs_35/8_GRAPH.png', 'graphs/overlay_graphs_35/9_GRAPH.png', 'graphs/overlay_graphs_35/10_GRAPH.png', 'graphs/overlay_graphs_35/11_GRAPH.png', 'graphs/overlay_graphs_35/12_GRAPH.png', 'graphs/overlay_graphs_35/13_GRAPH.png', 'graphs/overlay_graphs_35/14_GRAPH.png', 'graphs/overlay_graphs_35/15_GRAPH.png', 'graphs/overlay_graphs_35/16_GRAPH.png', 'graphs/overlay_graphs_35/17_GRAPH.png', 'graphs/overlay_graphs_35/18_GRAPH.png', 'graphs/overlay_graphs_35/19_GRAPH.png', 'graphs/overlay_graphs_35/20_GRAPH.png', 'graphs/overlay_graphs_35/21_GRAPH.png', 'graphs/overlay_graphs_35/22_GRAPH.png', 'graphs/overlay_graphs_35/23_GRAPH.png', 'graphs/overlay_graphs_35/24_GRAPH.png', 'graphs/overlay_graphs_36/1_GRAPH.png', 'graphs/overlay_graphs_36/2_GRAPH.png', 'graphs/overlay_graphs_36/3_GRAPH.png', 'graphs/overlay_graphs_36/4_GRAPH.png', 'graphs/overlay_graphs_36/5_GRAPH.png', 'graphs/overlay_graphs_36/6_GRAPH.png', 'graphs/overlay_graphs_36/7_GRAPH.png', 'graphs/overlay_graphs_36/8_GRAPH.png', 'graphs/overlay_graphs_36/9_GRAPH.png', 'graphs/overlay_graphs_36/10_GRAPH.png', 'graphs/overlay_graphs_36/11_GRAPH.png', 'graphs/overlay_graphs_36/12_GRAPH.png', 'graphs/overlay_graphs_36/13_GRAPH.png', 'graphs/overlay_graphs_36/14_GRAPH.png', 'graphs/overlay_graphs_36/15_GRAPH.png', 'graphs/overlay_graphs_36/16_GRAPH.png', 'graphs/overlay_graphs_36/17_GRAPH.png', 'graphs/overlay_graphs_36/18_GRAPH.png', 'graphs/overlay_graphs_36/19_GRAPH.png', 'graphs/overlay_graphs_36/20_GRAPH.png', 'graphs/overlay_graphs_36/21_GRAPH.png', 'graphs/overlay_graphs_36/22_GRAPH.png', 'graphs/overlay_graphs_36/23_GRAPH.png', 'graphs/overlay_graphs_36/24_GRAPH.png', 'graphs/overlay_graphs_37/1_GRAPH.png', 'graphs/overlay_graphs_37/2_GRAPH.png', 'graphs/overlay_graphs_37/3_GRAPH.png', 'graphs/overlay_graphs_37/4_GRAPH.png', 'graphs/overlay_graphs_37/5_GRAPH.png', 'graphs/overlay_graphs_37/6_GRAPH.png', 'graphs/overlay_graphs_37/7_GRAPH.png', 'graphs/overlay_graphs_37/8_GRAPH.png', 'graphs/overlay_graphs_37/9_GRAPH.png', 'graphs/overlay_graphs_37/10_GRAPH.png', 'graphs/overlay_graphs_37/11_GRAPH.png', 'graphs/overlay_graphs_37/12_GRAPH.png', 'graphs/overlay_graphs_37/13_GRAPH.png', 'graphs/overlay_graphs_37/14_GRAPH.png', 'graphs/overlay_graphs_37/15_GRAPH.png', 'graphs/overlay_graphs_37/16_GRAPH.png', 'graphs/overlay_graphs_37/17_GRAPH.png', 'graphs/overlay_graphs_37/18_GRAPH.png', 'graphs/overlay_graphs_37/19_GRAPH.png', 'graphs/overlay_graphs_37/20_GRAPH.png', 'graphs/overlay_graphs_37/21_GRAPH.png', 'graphs/overlay_graphs_37/22_GRAPH.png', 'graphs/overlay_graphs_37/23_GRAPH.png', 'graphs/overlay_graphs_37/24_GRAPH.png', 'graphs/overlay_graphs_38/1_GRAPH.png', 'graphs/overlay_graphs_38/2_GRAPH.png', 'graphs/overlay_graphs_38/3_GRAPH.png', 'graphs/overlay_graphs_38/4_GRAPH.png', 'graphs/overlay_graphs_38/5_GRAPH.png', 'graphs/overlay_graphs_38/6_GRAPH.png', 'graphs/overlay_graphs_38/7_GRAPH.png', 'graphs/overlay_graphs_38/8_GRAPH.png', 'graphs/overlay_graphs_38/9_GRAPH.png', 'graphs/overlay_graphs_38/10_GRAPH.png', 'graphs/overlay_graphs_38/11_GRAPH.png', 'graphs/overlay_graphs_38/12_GRAPH.png', 'graphs/overlay_graphs_38/13_GRAPH.png', 'graphs/overlay_graphs_38/14_GRAPH.png', 'graphs/overlay_graphs_38/15_GRAPH.png', 'graphs/overlay_graphs_38/16_GRAPH.png', 'graphs/overlay_graphs_38/17_GRAPH.png', 'graphs/overlay_graphs_38/18_GRAPH.png', 'graphs/overlay_graphs_38/19_GRAPH.png', 'graphs/overlay_graphs_38/20_GRAPH.png', 'graphs/overlay_graphs_38/21_GRAPH.png', 'graphs/overlay_graphs_38/22_GRAPH.png', 'graphs/overlay_graphs_38/23_GRAPH.png', 'graphs/overlay_graphs_38/24_GRAPH.png', 'graphs/overlay_graphs_39/1_GRAPH.png', 'graphs/overlay_graphs_39/2_GRAPH.png', 'graphs/overlay_graphs_39/3_GRAPH.png', 'graphs/overlay_graphs_39/4_GRAPH.png', 'graphs/overlay_graphs_39/5_GRAPH.png', 'graphs/overlay_graphs_39/6_GRAPH.png', 'graphs/overlay_graphs_39/7_GRAPH.png', 'graphs/overlay_graphs_39/8_GRAPH.png', 'graphs/overlay_graphs_39/9_GRAPH.png', 'graphs/overlay_graphs_39/10_GRAPH.png', 'graphs/overlay_graphs_39/11_GRAPH.png', 'graphs/overlay_graphs_39/12_GRAPH.png', 'graphs/overlay_graphs_39/13_GRAPH.png', 'graphs/overlay_graphs_39/14_GRAPH.png', 'graphs/overlay_graphs_39/15_GRAPH.png', 'graphs/overlay_graphs_39/16_GRAPH.png', 'graphs/overlay_graphs_39/17_GRAPH.png', 'graphs/overlay_graphs_39/18_GRAPH.png', 'graphs/overlay_graphs_39/19_GRAPH.png', 'graphs/overlay_graphs_39/20_GRAPH.png', 'graphs/overlay_graphs_39/21_GRAPH.png', 'graphs/overlay_graphs_39/22_GRAPH.png', 'graphs/overlay_graphs_39/23_GRAPH.png', 'graphs/overlay_graphs_39/24_GRAPH.png', 'graphs/overlay_graphs_40/1_GRAPH.png', 'graphs/overlay_graphs_40/2_GRAPH.png', 'graphs/overlay_graphs_40/3_GRAPH.png', 'graphs/overlay_graphs_40/4_GRAPH.png', 'graphs/overlay_graphs_40/5_GRAPH.png', 'graphs/overlay_graphs_40/6_GRAPH.png', 'graphs/overlay_graphs_40/7_GRAPH.png', 'graphs/overlay_graphs_40/8_GRAPH.png', 'graphs/overlay_graphs_40/9_GRAPH.png', 'graphs/overlay_graphs_40/10_GRAPH.png', 'graphs/overlay_graphs_40/11_GRAPH.png', 'graphs/overlay_graphs_40/12_GRAPH.png', 'graphs/overlay_graphs_40/13_GRAPH.png', 'graphs/overlay_graphs_40/14_GRAPH.png', 'graphs/overlay_graphs_40/15_GRAPH.png', 'graphs/overlay_graphs_40/16_GRAPH.png', 'graphs/overlay_graphs_40/17_GRAPH.png', 'graphs/overlay_graphs_40/18_GRAPH.png', 'graphs/overlay_graphs_40/19_GRAPH.png', 'graphs/overlay_graphs_40/20_GRAPH.png', 'graphs/overlay_graphs_40/21_GRAPH.png', 'graphs/overlay_graphs_40/22_GRAPH.png', 'graphs/overlay_graphs_40/23_GRAPH.png', 'graphs/overlay_graphs_40/24_GRAPH.png', 'graphs/overlay_graphs_41/1_GRAPH.png', 'graphs/overlay_graphs_41/2_GRAPH.png', 'graphs/overlay_graphs_41/3_GRAPH.png', 'graphs/overlay_graphs_41/4_GRAPH.png', 'graphs/overlay_graphs_41/5_GRAPH.png', 'graphs/overlay_graphs_41/6_GRAPH.png', 'graphs/overlay_graphs_41/7_GRAPH.png', 'graphs/overlay_graphs_41/8_GRAPH.png', 'graphs/overlay_graphs_41/9_GRAPH.png', 'graphs/overlay_graphs_41/10_GRAPH.png', 'graphs/overlay_graphs_41/11_GRAPH.png', 'graphs/overlay_graphs_41/12_GRAPH.png', 'graphs/overlay_graphs_41/13_GRAPH.png', 'graphs/overlay_graphs_41/14_GRAPH.png', 'graphs/overlay_graphs_41/15_GRAPH.png', 'graphs/overlay_graphs_41/16_GRAPH.png', 'graphs/overlay_graphs_41/17_GRAPH.png', 'graphs/overlay_graphs_41/18_GRAPH.png', 'graphs/overlay_graphs_41/19_GRAPH.png', 'graphs/overlay_graphs_41/20_GRAPH.png', 'graphs/overlay_graphs_41/21_GRAPH.png', 'graphs/overlay_graphs_41/22_GRAPH.png', 'graphs/overlay_graphs_41/23_GRAPH.png', 'graphs/overlay_graphs_41/24_GRAPH.png', 'graphs/overlay_graphs_42/1_GRAPH.png', 'graphs/overlay_graphs_42/2_GRAPH.png', 'graphs/overlay_graphs_42/3_GRAPH.png', 'graphs/overlay_graphs_42/4_GRAPH.png', 'graphs/overlay_graphs_42/5_GRAPH.png', 'graphs/overlay_graphs_42/6_GRAPH.png', 'graphs/overlay_graphs_42/7_GRAPH.png', 'graphs/overlay_graphs_42/8_GRAPH.png', 'graphs/overlay_graphs_42/9_GRAPH.png', 'graphs/overlay_graphs_42/10_GRAPH.png', 'graphs/overlay_graphs_42/11_GRAPH.png', 'graphs/overlay_graphs_42/12_GRAPH.png', 'graphs/overlay_graphs_42/13_GRAPH.png', 'graphs/overlay_graphs_42/14_GRAPH.png', 'graphs/overlay_graphs_42/15_GRAPH.png', 'graphs/overlay_graphs_42/16_GRAPH.png', 'graphs/overlay_graphs_42/17_GRAPH.png', 'graphs/overlay_graphs_42/18_GRAPH.png', 'graphs/overlay_graphs_42/19_GRAPH.png', 'graphs/overlay_graphs_42/20_GRAPH.png', 'graphs/overlay_graphs_42/21_GRAPH.png', 'graphs/overlay_graphs_42/22_GRAPH.png', 'graphs/overlay_graphs_42/23_GRAPH.png', 'graphs/overlay_graphs_42/24_GRAPH.png', 'graphs/overlay_graphs_43/1_GRAPH.png', 'graphs/overlay_graphs_43/2_GRAPH.png', 'graphs/overlay_graphs_43/3_GRAPH.png', 'graphs/overlay_graphs_43/4_GRAPH.png', 'graphs/overlay_graphs_43/5_GRAPH.png', 'graphs/overlay_graphs_43/6_GRAPH.png', 'graphs/overlay_graphs_43/7_GRAPH.png', 'graphs/overlay_graphs_43/8_GRAPH.png', 'graphs/overlay_graphs_43/9_GRAPH.png', 'graphs/overlay_graphs_43/10_GRAPH.png', 'graphs/overlay_graphs_43/11_GRAPH.png', 'graphs/overlay_graphs_43/12_GRAPH.png', 'graphs/overlay_graphs_43/13_GRAPH.png', 'graphs/overlay_graphs_43/14_GRAPH.png', 'graphs/overlay_graphs_43/15_GRAPH.png', 'graphs/overlay_graphs_43/16_GRAPH.png', 'graphs/overlay_graphs_43/17_GRAPH.png', 'graphs/overlay_graphs_43/18_GRAPH.png', 'graphs/overlay_graphs_43/19_GRAPH.png', 'graphs/overlay_graphs_43/20_GRAPH.png', 'graphs/overlay_graphs_43/21_GRAPH.png', 'graphs/overlay_graphs_43/22_GRAPH.png', 'graphs/overlay_graphs_43/23_GRAPH.png', 'graphs/overlay_graphs_43/24_GRAPH.png', 'graphs/overlay_graphs_44/1_GRAPH.png', 'graphs/overlay_graphs_44/2_GRAPH.png', 'graphs/overlay_graphs_44/3_GRAPH.png', 'graphs/overlay_graphs_44/4_GRAPH.png', 'graphs/overlay_graphs_44/5_GRAPH.png', 'graphs/overlay_graphs_44/6_GRAPH.png', 'graphs/overlay_graphs_44/7_GRAPH.png', 'graphs/overlay_graphs_44/8_GRAPH.png', 'graphs/overlay_graphs_44/9_GRAPH.png', 'graphs/overlay_graphs_44/10_GRAPH.png', 'graphs/overlay_graphs_44/11_GRAPH.png', 'graphs/overlay_graphs_44/12_GRAPH.png', 'graphs/overlay_graphs_44/13_GRAPH.png', 'graphs/overlay_graphs_44/14_GRAPH.png', 'graphs/overlay_graphs_44/15_GRAPH.png', 'graphs/overlay_graphs_44/16_GRAPH.png', 'graphs/overlay_graphs_44/17_GRAPH.png', 'graphs/overlay_graphs_44/18_GRAPH.png', 'graphs/overlay_graphs_44/19_GRAPH.png', 'graphs/overlay_graphs_44/20_GRAPH.png', 'graphs/overlay_graphs_44/21_GRAPH.png', 'graphs/overlay_graphs_44/22_GRAPH.png', 'graphs/overlay_graphs_44/23_GRAPH.png', 'graphs/overlay_graphs_44/24_GRAPH.png', 'graphs/overlay_graphs_45/1_GRAPH.png', 'graphs/overlay_graphs_45/2_GRAPH.png', 'graphs/overlay_graphs_45/3_GRAPH.png', 'graphs/overlay_graphs_45/4_GRAPH.png', 'graphs/overlay_graphs_45/5_GRAPH.png', 'graphs/overlay_graphs_45/6_GRAPH.png', 'graphs/overlay_graphs_45/7_GRAPH.png', 'graphs/overlay_graphs_45/8_GRAPH.png', 'graphs/overlay_graphs_45/9_GRAPH.png', 'graphs/overlay_graphs_45/10_GRAPH.png', 'graphs/overlay_graphs_45/11_GRAPH.png', 'graphs/overlay_graphs_45/12_GRAPH.png', 'graphs/overlay_graphs_45/13_GRAPH.png', 'graphs/overlay_graphs_45/14_GRAPH.png', 'graphs/overlay_graphs_45/15_GRAPH.png', 'graphs/overlay_graphs_45/16_GRAPH.png', 'graphs/overlay_graphs_45/17_GRAPH.png', 'graphs/overlay_graphs_45/18_GRAPH.png', 'graphs/overlay_graphs_45/19_GRAPH.png', 'graphs/overlay_graphs_45/20_GRAPH.png', 'graphs/overlay_graphs_45/21_GRAPH.png', 'graphs/overlay_graphs_45/22_GRAPH.png', 'graphs/overlay_graphs_45/23_GRAPH.png', 'graphs/overlay_graphs_45/24_GRAPH.png', 'graphs/overlay_graphs_46/1_GRAPH.png', 'graphs/overlay_graphs_46/2_GRAPH.png', 'graphs/overlay_graphs_46/3_GRAPH.png', 'graphs/overlay_graphs_46/4_GRAPH.png', 'graphs/overlay_graphs_46/5_GRAPH.png', 'graphs/overlay_graphs_46/6_GRAPH.png', 'graphs/overlay_graphs_46/7_GRAPH.png', 'graphs/overlay_graphs_46/8_GRAPH.png', 'graphs/overlay_graphs_46/9_GRAPH.png', 'graphs/overlay_graphs_46/10_GRAPH.png', 'graphs/overlay_graphs_46/11_GRAPH.png', 'graphs/overlay_graphs_46/12_GRAPH.png', 'graphs/overlay_graphs_46/13_GRAPH.png', 'graphs/overlay_graphs_46/14_GRAPH.png', 'graphs/overlay_graphs_46/15_GRAPH.png', 'graphs/overlay_graphs_46/16_GRAPH.png', 'graphs/overlay_graphs_46/17_GRAPH.png', 'graphs/overlay_graphs_46/18_GRAPH.png', 'graphs/overlay_graphs_46/19_GRAPH.png', 'graphs/overlay_graphs_46/20_GRAPH.png', 'graphs/overlay_graphs_46/21_GRAPH.png', 'graphs/overlay_graphs_46/22_GRAPH.png', 'graphs/overlay_graphs_46/23_GRAPH.png', 'graphs/overlay_graphs_46/24_GRAPH.png', 'graphs/overlay_graphs_47/1_GRAPH.png', 'graphs/overlay_graphs_47/2_GRAPH.png', 'graphs/overlay_graphs_47/3_GRAPH.png', 'graphs/overlay_graphs_47/4_GRAPH.png', 'graphs/overlay_graphs_47/5_GRAPH.png', 'graphs/overlay_graphs_47/6_GRAPH.png', 'graphs/overlay_graphs_47/7_GRAPH.png', 'graphs/overlay_graphs_47/8_GRAPH.png', 'graphs/overlay_graphs_47/9_GRAPH.png', 'graphs/overlay_graphs_47/10_GRAPH.png', 'graphs/overlay_graphs_47/11_GRAPH.png', 'graphs/overlay_graphs_47/12_GRAPH.png', 'graphs/overlay_graphs_47/13_GRAPH.png', 'graphs/overlay_graphs_47/14_GRAPH.png', 'graphs/overlay_graphs_47/15_GRAPH.png', 'graphs/overlay_graphs_47/16_GRAPH.png', 'graphs/overlay_graphs_47/17_GRAPH.png', 'graphs/overlay_graphs_47/18_GRAPH.png', 'graphs/overlay_graphs_47/19_GRAPH.png', 'graphs/overlay_graphs_47/20_GRAPH.png', 'graphs/overlay_graphs_47/21_GRAPH.png', 'graphs/overlay_graphs_47/22_GRAPH.png', 'graphs/overlay_graphs_47/23_GRAPH.png', 'graphs/overlay_graphs_47/24_GRAPH.png', 'graphs/overlay_graphs_48/1_GRAPH.png', 'graphs/overlay_graphs_48/2_GRAPH.png', 'graphs/overlay_graphs_48/3_GRAPH.png', 'graphs/overlay_graphs_48/4_GRAPH.png', 'graphs/overlay_graphs_48/5_GRAPH.png', 'graphs/overlay_graphs_48/6_GRAPH.png', 'graphs/overlay_graphs_48/7_GRAPH.png', 'graphs/overlay_graphs_48/8_GRAPH.png', 'graphs/overlay_graphs_48/9_GRAPH.png', 'graphs/overlay_graphs_48/10_GRAPH.png', 'graphs/overlay_graphs_48/11_GRAPH.png', 'graphs/overlay_graphs_48/12_GRAPH.png', 'graphs/overlay_graphs_48/13_GRAPH.png', 'graphs/overlay_graphs_48/14_GRAPH.png', 'graphs/overlay_graphs_48/15_GRAPH.png', 'graphs/overlay_graphs_48/16_GRAPH.png', 'graphs/overlay_graphs_49/1_GRAPH.png', 'graphs/overlay_graphs_49/2_GRAPH.png', 'graphs/overlay_graphs_49/3_GRAPH.png', 'graphs/overlay_graphs_49/4_GRAPH.png', 'graphs/overlay_graphs_49/5_GRAPH.png', 'graphs/overlay_graphs_49/6_GRAPH.png', 'graphs/overlay_graphs_49/7_GRAPH.png', 'graphs/overlay_graphs_49/8_GRAPH.png', 'graphs/overlay_graphs_49/9_GRAPH.png', 'graphs/overlay_graphs_49/10_GRAPH.png', 'graphs/overlay_graphs_49/11_GRAPH.png', 'graphs/overlay_graphs_49/12_GRAPH.png', 'graphs/overlay_graphs_49/13_GRAPH.png', 'graphs/overlay_graphs_49/14_GRAPH.png', 'graphs/overlay_graphs_49/15_GRAPH.png', 'graphs/overlay_graphs_49/16_GRAPH.png', 'graphs/overlay_graphs_49/17_GRAPH.png', 'graphs/overlay_graphs_49/18_GRAPH.png', 'graphs/overlay_graphs_49/19_GRAPH.png', 'graphs/overlay_graphs_49/20_GRAPH.png', 'graphs/overlay_graphs_49/21_GRAPH.png', 'graphs/overlay_graphs_49/22_GRAPH.png', 'graphs/overlay_graphs_49/23_GRAPH.png', 'graphs/overlay_graphs_49/24_GRAPH.png', 'graphs/overlay_graphs_50/1_GRAPH.png', 'graphs/overlay_graphs_50/2_GRAPH.png', 'graphs/overlay_graphs_50/3_GRAPH.png', 'graphs/overlay_graphs_50/4_GRAPH.png', 'graphs/overlay_graphs_50/5_GRAPH.png', 'graphs/overlay_graphs_50/6_GRAPH.png', 'graphs/overlay_graphs_50/7_GRAPH.png', 'graphs/overlay_graphs_50/8_GRAPH.png', 'graphs/overlay_graphs_50/9_GRAPH.png', 'graphs/overlay_graphs_50/10_GRAPH.png', 'graphs/overlay_graphs_50/11_GRAPH.png', 'graphs/overlay_graphs_50/12_GRAPH.png', 'graphs/overlay_graphs_50/13_GRAPH.png', 'graphs/overlay_graphs_50/14_GRAPH.png', 'graphs/overlay_graphs_50/15_GRAPH.png', 'graphs/overlay_graphs_50/16_GRAPH.png', 'graphs/overlay_graphs_50/17_GRAPH.png', 'graphs/overlay_graphs_50/18_GRAPH.png', 'graphs/overlay_graphs_50/19_GRAPH.png', 'graphs/overlay_graphs_50/20_GRAPH.png', 'graphs/overlay_graphs_50/21_GRAPH.png', 'graphs/overlay_graphs_50/22_GRAPH.png', 'graphs/overlay_graphs_50/23_GRAPH.png', 'graphs/overlay_graphs_50/24_GRAPH.png', 'graphs/overlay_graphs_51/1_GRAPH.png', 'graphs/overlay_graphs_51/2_GRAPH.png', 'graphs/overlay_graphs_51/3_GRAPH.png', 'graphs/overlay_graphs_51/4_GRAPH.png', 'graphs/overlay_graphs_51/5_GRAPH.png', 'graphs/overlay_graphs_51/6_GRAPH.png', 'graphs/overlay_graphs_51/7_GRAPH.png', 'graphs/overlay_graphs_51/8_GRAPH.png', 'graphs/overlay_graphs_51/9_GRAPH.png', 'graphs/overlay_graphs_51/10_GRAPH.png', 'graphs/overlay_graphs_51/11_GRAPH.png', 'graphs/overlay_graphs_51/12_GRAPH.png', 'graphs/overlay_graphs_51/13_GRAPH.png', 'graphs/overlay_graphs_51/14_GRAPH.png', 'graphs/overlay_graphs_51/15_GRAPH.png', 'graphs/overlay_graphs_51/16_GRAPH.png', 'graphs/overlay_graphs_51/17_GRAPH.png', 'graphs/overlay_graphs_51/18_GRAPH.png', 'graphs/overlay_graphs_51/19_GRAPH.png', 'graphs/overlay_graphs_51/20_GRAPH.png', 'graphs/overlay_graphs_51/21_GRAPH.png', 'graphs/overlay_graphs_51/22_GRAPH.png', 'graphs/overlay_graphs_51/23_GRAPH.png', 'graphs/overlay_graphs_51/24_GRAPH.png', 'graphs/overlay_graphs_52/1_GRAPH.png', 'graphs/overlay_graphs_52/2_GRAPH.png', 'graphs/overlay_graphs_52/3_GRAPH.png', 'graphs/overlay_graphs_52/4_GRAPH.png', 'graphs/overlay_graphs_52/5_GRAPH.png', 'graphs/overlay_graphs_52/6_GRAPH.png', 'graphs/overlay_graphs_52/7_GRAPH.png', 'graphs/overlay_graphs_52/8_GRAPH.png', 'graphs/overlay_graphs_52/9_GRAPH.png', 'graphs/overlay_graphs_52/10_GRAPH.png', 'graphs/overlay_graphs_52/11_GRAPH.png', 'graphs/overlay_graphs_52/12_GRAPH.png', 'graphs/overlay_graphs_52/13_GRAPH.png', 'graphs/overlay_graphs_52/14_GRAPH.png', 'graphs/overlay_graphs_52/15_GRAPH.png', 'graphs/overlay_graphs_52/16_GRAPH.png', 'graphs/overlay_graphs_52/17_GRAPH.png', 'graphs/overlay_graphs_52/18_GRAPH.png', 'graphs/overlay_graphs_52/19_GRAPH.png', 'graphs/overlay_graphs_52/20_GRAPH.png', 'graphs/overlay_graphs_52/21_GRAPH.png', 'graphs/overlay_graphs_52/22_GRAPH.png', 'graphs/overlay_graphs_52/23_GRAPH.png', 'graphs/overlay_graphs_52/24_GRAPH.png', 'graphs/overlay_graphs_53/1_GRAPH.png', 'graphs/overlay_graphs_53/2_GRAPH.png', 'graphs/overlay_graphs_53/3_GRAPH.png', 'graphs/overlay_graphs_53/4_GRAPH.png', 'graphs/overlay_graphs_53/5_GRAPH.png', 'graphs/overlay_graphs_53/6_GRAPH.png', 'graphs/overlay_graphs_53/7_GRAPH.png', 'graphs/overlay_graphs_53/8_GRAPH.png', 'graphs/overlay_graphs_53/9_GRAPH.png', 'graphs/overlay_graphs_53/10_GRAPH.png', 'graphs/overlay_graphs_53/11_GRAPH.png', 'graphs/overlay_graphs_53/12_GRAPH.png', 'graphs/overlay_graphs_53/13_GRAPH.png', 'graphs/overlay_graphs_53/14_GRAPH.png', 'graphs/overlay_graphs_53/15_GRAPH.png', 'graphs/overlay_graphs_53/16_GRAPH.png', 'graphs/overlay_graphs_53/17_GRAPH.png', 'graphs/overlay_graphs_53/18_GRAPH.png', 'graphs/overlay_graphs_53/19_GRAPH.png', 'graphs/overlay_graphs_53/20_GRAPH.png', 'graphs/overlay_graphs_53/21_GRAPH.png', 'graphs/overlay_graphs_53/22_GRAPH.png', 'graphs/overlay_graphs_53/23_GRAPH.png', 'graphs/overlay_graphs_53/24_GRAPH.png', 'graphs/overlay_graphs_54/1_GRAPH.png', 'graphs/overlay_graphs_54/2_GRAPH.png', 'graphs/overlay_graphs_54/3_GRAPH.png', 'graphs/overlay_graphs_54/4_GRAPH.png', 'graphs/overlay_graphs_54/5_GRAPH.png', 'graphs/overlay_graphs_54/6_GRAPH.png', 'graphs/overlay_graphs_54/7_GRAPH.png', 'graphs/overlay_graphs_54/8_GRAPH.png', 'graphs/overlay_graphs_54/9_GRAPH.png', 'graphs/overlay_graphs_54/10_GRAPH.png', 'graphs/overlay_graphs_54/11_GRAPH.png', 'graphs/overlay_graphs_54/12_GRAPH.png', 'graphs/overlay_graphs_54/13_GRAPH.png', 'graphs/overlay_graphs_54/14_GRAPH.png', 'graphs/overlay_graphs_54/15_GRAPH.png', 'graphs/overlay_graphs_54/16_GRAPH.png', 'graphs/overlay_graphs_54/17_GRAPH.png', 'graphs/overlay_graphs_54/18_GRAPH.png', 'graphs/overlay_graphs_54/19_GRAPH.png', 'graphs/overlay_graphs_54/20_GRAPH.png', 'graphs/overlay_graphs_54/21_GRAPH.png', 'graphs/overlay_graphs_54/22_GRAPH.png', 'graphs/overlay_graphs_54/23_GRAPH.png', 'graphs/overlay_graphs_54/24_GRAPH.png', 'graphs/overlay_graphs_55/1_GRAPH.png', 'graphs/overlay_graphs_55/2_GRAPH.png', 'graphs/overlay_graphs_55/3_GRAPH.png', 'graphs/overlay_graphs_55/4_GRAPH.png', 'graphs/overlay_graphs_55/5_GRAPH.png', 'graphs/overlay_graphs_55/6_GRAPH.png', 'graphs/overlay_graphs_55/7_GRAPH.png', 'graphs/overlay_graphs_55/8_GRAPH.png', 'graphs/overlay_graphs_55/9_GRAPH.png', 'graphs/overlay_graphs_55/10_GRAPH.png', 'graphs/overlay_graphs_55/11_GRAPH.png', 'graphs/overlay_graphs_55/12_GRAPH.png', 'graphs/overlay_graphs_55/13_GRAPH.png', 'graphs/overlay_graphs_55/14_GRAPH.png', 'graphs/overlay_graphs_55/15_GRAPH.png', 'graphs/overlay_graphs_55/16_GRAPH.png', 'graphs/overlay_graphs_55/17_GRAPH.png', 'graphs/overlay_graphs_55/18_GRAPH.png', 'graphs/overlay_graphs_55/19_GRAPH.png', 'graphs/overlay_graphs_55/20_GRAPH.png', 'graphs/overlay_graphs_55/21_GRAPH.png', 'graphs/overlay_graphs_55/22_GRAPH.png', 'graphs/overlay_graphs_55/23_GRAPH.png', 'graphs/overlay_graphs_55/24_GRAPH.png', 'graphs/overlay_graphs_56/1_GRAPH.png', 'graphs/overlay_graphs_56/2_GRAPH.png', 'graphs/overlay_graphs_56/3_GRAPH.png', 'graphs/overlay_graphs_56/4_GRAPH.png', 'graphs/overlay_graphs_56/5_GRAPH.png', 'graphs/overlay_graphs_56/6_GRAPH.png', 'graphs/overlay_graphs_56/7_GRAPH.png', 'graphs/overlay_graphs_56/8_GRAPH.png', 'graphs/overlay_graphs_56/9_GRAPH.png', 'graphs/overlay_graphs_56/10_GRAPH.png', 'graphs/overlay_graphs_56/11_GRAPH.png', 'graphs/overlay_graphs_56/12_GRAPH.png', 'graphs/overlay_graphs_56/13_GRAPH.png', 'graphs/overlay_graphs_56/14_GRAPH.png', 'graphs/overlay_graphs_56/15_GRAPH.png', 'graphs/overlay_graphs_56/16_GRAPH.png', 'graphs/overlay_graphs_56/17_GRAPH.png', 'graphs/overlay_graphs_56/18_GRAPH.png', 'graphs/overlay_graphs_56/19_GRAPH.png', 'graphs/overlay_graphs_56/20_GRAPH.png', 'graphs/overlay_graphs_56/21_GRAPH.png', 'graphs/overlay_graphs_56/22_GRAPH.png', 'graphs/overlay_graphs_56/23_GRAPH.png', 'graphs/overlay_graphs_56/24_GRAPH.png', 'graphs/overlay_graphs_57/1_GRAPH.png', 'graphs/overlay_graphs_57/2_GRAPH.png', 'graphs/overlay_graphs_57/3_GRAPH.png', 'graphs/overlay_graphs_57/4_GRAPH.png', 'graphs/overlay_graphs_57/5_GRAPH.png', 'graphs/overlay_graphs_57/6_GRAPH.png', 'graphs/overlay_graphs_57/7_GRAPH.png', 'graphs/overlay_graphs_57/8_GRAPH.png', 'graphs/overlay_graphs_57/9_GRAPH.png', 'graphs/overlay_graphs_57/10_GRAPH.png', 'graphs/overlay_graphs_57/11_GRAPH.png', 'graphs/overlay_graphs_57/12_GRAPH.png', 'graphs/overlay_graphs_57/13_GRAPH.png', 'graphs/overlay_graphs_57/14_GRAPH.png', 'graphs/overlay_graphs_57/15_GRAPH.png', 'graphs/overlay_graphs_57/16_GRAPH.png', 'graphs/overlay_graphs_57/17_GRAPH.png', 'graphs/overlay_graphs_57/18_GRAPH.png', 'graphs/overlay_graphs_57/19_GRAPH.png', 'graphs/overlay_graphs_57/20_GRAPH.png', 'graphs/overlay_graphs_57/21_GRAPH.png', 'graphs/overlay_graphs_57/22_GRAPH.png', 'graphs/overlay_graphs_57/23_GRAPH.png', 'graphs/overlay_graphs_57/24_GRAPH.png', 'graphs/overlay_graphs_58/1_GRAPH.png', 'graphs/overlay_graphs_58/2_GRAPH.png', 'graphs/overlay_graphs_58/3_GRAPH.png', 'graphs/overlay_graphs_58/4_GRAPH.png', 'graphs/overlay_graphs_58/5_GRAPH.png', 'graphs/overlay_graphs_58/6_GRAPH.png', 'graphs/overlay_graphs_58/7_GRAPH.png', 'graphs/overlay_graphs_58/8_GRAPH.png', 'graphs/overlay_graphs_58/9_GRAPH.png', 'graphs/overlay_graphs_58/10_GRAPH.png', 'graphs/overlay_graphs_58/11_GRAPH.png', 'graphs/overlay_graphs_58/12_GRAPH.png', 'graphs/overlay_graphs_58/13_GRAPH.png', 'graphs/overlay_graphs_58/14_GRAPH.png', 'graphs/overlay_graphs_58/15_GRAPH.png', 'graphs/overlay_graphs_58/16_GRAPH.png', 'graphs/overlay_graphs_58/17_GRAPH.png', 'graphs/overlay_graphs_58/18_GRAPH.png', 'graphs/overlay_graphs_58/19_GRAPH.png', 'graphs/overlay_graphs_58/20_GRAPH.png', 'graphs/overlay_graphs_58/21_GRAPH.png', 'graphs/overlay_graphs_58/22_GRAPH.png', 'graphs/overlay_graphs_58/23_GRAPH.png', 'graphs/overlay_graphs_58/24_GRAPH.png', 'graphs/overlay_graphs_59/1_GRAPH.png', 'graphs/overlay_graphs_59/2_GRAPH.png', 'graphs/overlay_graphs_59/3_GRAPH.png', 'graphs/overlay_graphs_59/4_GRAPH.png', 'graphs/overlay_graphs_59/5_GRAPH.png', 'graphs/overlay_graphs_59/6_GRAPH.png', 'graphs/overlay_graphs_59/7_GRAPH.png', 'graphs/overlay_graphs_59/8_GRAPH.png', 'graphs/overlay_graphs_59/9_GRAPH.png', 'graphs/overlay_graphs_59/10_GRAPH.png', 'graphs/overlay_graphs_59/11_GRAPH.png', 'graphs/overlay_graphs_59/12_GRAPH.png', 'graphs/overlay_graphs_59/13_GRAPH.png', 'graphs/overlay_graphs_59/14_GRAPH.png', 'graphs/overlay_graphs_59/15_GRAPH.png', 'graphs/overlay_graphs_59/16_GRAPH.png', 'graphs/overlay_graphs_59/17_GRAPH.png', 'graphs/overlay_graphs_59/18_GRAPH.png', 'graphs/overlay_graphs_59/19_GRAPH.png', 'graphs/overlay_graphs_59/20_GRAPH.png', 'graphs/overlay_graphs_59/21_GRAPH.png', 'graphs/overlay_graphs_59/22_GRAPH.png', 'graphs/overlay_graphs_59/23_GRAPH.png', 'graphs/overlay_graphs_59/24_GRAPH.png', 'graphs/overlay_graphs_60/1_GRAPH.png', 'graphs/overlay_graphs_60/2_GRAPH.png', 'graphs/overlay_graphs_60/3_GRAPH.png', 'graphs/overlay_graphs_60/4_GRAPH.png', 'graphs/overlay_graphs_60/5_GRAPH.png', 'graphs/overlay_graphs_60/6_GRAPH.png', 'graphs/overlay_graphs_60/7_GRAPH.png', 'graphs/overlay_graphs_60/8_GRAPH.png', 'graphs/overlay_graphs_60/9_GRAPH.png', 'graphs/overlay_graphs_60/10_GRAPH.png', 'graphs/overlay_graphs_60/11_GRAPH.png', 'graphs/overlay_graphs_60/12_GRAPH.png', 'graphs/overlay_graphs_60/13_GRAPH.png', 'graphs/overlay_graphs_60/14_GRAPH.png', 'graphs/overlay_graphs_60/15_GRAPH.png', 'graphs/overlay_graphs_60/16_GRAPH.png', 'graphs/overlay_graphs_60/17_GRAPH.png', 'graphs/overlay_graphs_60/18_GRAPH.png', 'graphs/overlay_graphs_60/19_GRAPH.png', 'graphs/overlay_graphs_60/20_GRAPH.png', 'graphs/overlay_graphs_60/21_GRAPH.png', 'graphs/overlay_graphs_60/22_GRAPH.png', 'graphs/overlay_graphs_60/23_GRAPH.png', 'graphs/overlay_graphs_60/24_GRAPH.png', 'graphs/overlay_graphs_61/1_GRAPH.png', 'graphs/overlay_graphs_61/2_GRAPH.png', 'graphs/overlay_graphs_61/3_GRAPH.png', 'graphs/overlay_graphs_61/4_GRAPH.png', 'graphs/overlay_graphs_61/5_GRAPH.png', 'graphs/overlay_graphs_61/6_GRAPH.png', 'graphs/overlay_graphs_61/7_GRAPH.png', 'graphs/overlay_graphs_61/8_GRAPH.png', 'graphs/overlay_graphs_61/9_GRAPH.png', 'graphs/overlay_graphs_61/10_GRAPH.png', 'graphs/overlay_graphs_61/11_GRAPH.png', 'graphs/overlay_graphs_61/12_GRAPH.png', 'graphs/overlay_graphs_61/13_GRAPH.png', 'graphs/overlay_graphs_61/14_GRAPH.png', 'graphs/overlay_graphs_61/15_GRAPH.png', 'graphs/overlay_graphs_61/16_GRAPH.png', 'graphs/overlay_graphs_61/17_GRAPH.png', 'graphs/overlay_graphs_61/18_GRAPH.png', 'graphs/overlay_graphs_61/19_GRAPH.png', 'graphs/overlay_graphs_61/20_GRAPH.png', 'graphs/overlay_graphs_61/21_GRAPH.png', 'graphs/overlay_graphs_61/22_GRAPH.png', 'graphs/overlay_graphs_61/23_GRAPH.png', 'graphs/overlay_graphs_61/24_GRAPH.png', 'graphs/overlay_graphs_62/1_GRAPH.png', 'graphs/overlay_graphs_62/2_GRAPH.png', 'graphs/overlay_graphs_62/3_GRAPH.png', 'graphs/overlay_graphs_62/4_GRAPH.png', 'graphs/overlay_graphs_62/5_GRAPH.png', 'graphs/overlay_graphs_62/6_GRAPH.png', 'graphs/overlay_graphs_62/7_GRAPH.png', 'graphs/overlay_graphs_62/8_GRAPH.png', 'graphs/overlay_graphs_62/9_GRAPH.png', 'graphs/overlay_graphs_62/10_GRAPH.png', 'graphs/overlay_graphs_62/11_GRAPH.png', 'graphs/overlay_graphs_62/12_GRAPH.png', 'graphs/overlay_graphs_62/13_GRAPH.png', 'graphs/overlay_graphs_62/14_GRAPH.png', 'graphs/overlay_graphs_62/15_GRAPH.png', 'graphs/overlay_graphs_62/16_GRAPH.png', 'graphs/overlay_graphs_62/17_GRAPH.png', 'graphs/overlay_graphs_62/18_GRAPH.png', 'graphs/overlay_graphs_62/19_GRAPH.png', 'graphs/overlay_graphs_62/20_GRAPH.png', 'graphs/overlay_graphs_62/21_GRAPH.png', 'graphs/overlay_graphs_62/22_GRAPH.png', 'graphs/overlay_graphs_62/23_GRAPH.png', 'graphs/overlay_graphs_62/24_GRAPH.png', 'graphs/overlay_graphs_63/1_GRAPH.png', 'graphs/overlay_graphs_63/2_GRAPH.png', 'graphs/overlay_graphs_63/3_GRAPH.png', 'graphs/overlay_graphs_63/4_GRAPH.png', 'graphs/overlay_graphs_63/5_GRAPH.png', 'graphs/overlay_graphs_63/6_GRAPH.png', 'graphs/overlay_graphs_63/7_GRAPH.png', 'graphs/overlay_graphs_63/8_GRAPH.png', 'graphs/overlay_graphs_63/9_GRAPH.png', 'graphs/overlay_graphs_63/10_GRAPH.png', 'graphs/overlay_graphs_63/11_GRAPH.png', 'graphs/overlay_graphs_63/12_GRAPH.png', 'graphs/overlay_graphs_63/13_GRAPH.png', 'graphs/overlay_graphs_63/14_GRAPH.png', 'graphs/overlay_graphs_63/15_GRAPH.png', 'graphs/overlay_graphs_63/16_GRAPH.png', 'graphs/overlay_graphs_63/17_GRAPH.png', 'graphs/overlay_graphs_63/18_GRAPH.png', 'graphs/overlay_graphs_63/19_GRAPH.png', 'graphs/overlay_graphs_63/20_GRAPH.png', 'graphs/overlay_graphs_63/21_GRAPH.png', 'graphs/overlay_graphs_63/22_GRAPH.png', 'graphs/overlay_graphs_63/23_GRAPH.png', 'graphs/overlay_graphs_63/24_GRAPH.png', 'graphs/overlay_graphs_64/1_GRAPH.png', 'graphs/overlay_graphs_64/2_GRAPH.png', 'graphs/overlay_graphs_64/3_GRAPH.png', 'graphs/overlay_graphs_64/4_GRAPH.png', 'graphs/overlay_graphs_64/5_GRAPH.png', 'graphs/overlay_graphs_64/6_GRAPH.png', 'graphs/overlay_graphs_64/7_GRAPH.png', 'graphs/overlay_graphs_64/8_GRAPH.png', 'graphs/overlay_graphs_64/9_GRAPH.png', 'graphs/overlay_graphs_64/10_GRAPH.png', 'graphs/overlay_graphs_64/11_GRAPH.png', 'graphs/overlay_graphs_64/12_GRAPH.png', 'graphs/overlay_graphs_64/13_GRAPH.png', 'graphs/overlay_graphs_64/14_GRAPH.png', 'graphs/overlay_graphs_64/15_GRAPH.png', 'graphs/overlay_graphs_64/16_GRAPH.png', 'graphs/overlay_graphs_64/17_GRAPH.png', 'graphs/overlay_graphs_64/18_GRAPH.png', 'graphs/overlay_graphs_64/19_GRAPH.png', 'graphs/overlay_graphs_64/20_GRAPH.png', 'graphs/overlay_graphs_64/21_GRAPH.png', 'graphs/overlay_graphs_64/22_GRAPH.png', 'graphs/overlay_graphs_64/23_GRAPH.png', 'graphs/overlay_graphs_64/24_GRAPH.png', 'graphs/overlay_graphs_65/1_GRAPH.png', 'graphs/overlay_graphs_65/2_GRAPH.png', 'graphs/overlay_graphs_65/3_GRAPH.png', 'graphs/overlay_graphs_65/4_GRAPH.png', 'graphs/overlay_graphs_65/5_GRAPH.png', 'graphs/overlay_graphs_65/6_GRAPH.png', 'graphs/overlay_graphs_65/7_GRAPH.png', 'graphs/overlay_graphs_65/8_GRAPH.png', 'graphs/overlay_graphs_65/9_GRAPH.png', 'graphs/overlay_graphs_65/10_GRAPH.png', 'graphs/overlay_graphs_65/11_GRAPH.png', 'graphs/overlay_graphs_65/12_GRAPH.png', 'graphs/overlay_graphs_65/13_GRAPH.png', 'graphs/overlay_graphs_65/14_GRAPH.png', 'graphs/overlay_graphs_65/15_GRAPH.png', 'graphs/overlay_graphs_65/16_GRAPH.png', 'graphs/overlay_graphs_65/17_GRAPH.png', 'graphs/overlay_graphs_65/18_GRAPH.png', 'graphs/overlay_graphs_65/19_GRAPH.png', 'graphs/overlay_graphs_65/20_GRAPH.png', 'graphs/overlay_graphs_65/21_GRAPH.png', 'graphs/overlay_graphs_65/22_GRAPH.png', 'graphs/overlay_graphs_65/23_GRAPH.png', 'graphs/overlay_graphs_65/24_GRAPH.png', 'graphs/overlay_graphs_66/1_GRAPH.png', 'graphs/overlay_graphs_66/2_GRAPH.png', 'graphs/overlay_graphs_66/3_GRAPH.png', 'graphs/overlay_graphs_66/4_GRAPH.png', 'graphs/overlay_graphs_66/5_GRAPH.png', 'graphs/overlay_graphs_66/6_GRAPH.png', 'graphs/overlay_graphs_66/7_GRAPH.png', 'graphs/overlay_graphs_66/8_GRAPH.png', 'graphs/overlay_graphs_66/9_GRAPH.png', 'graphs/overlay_graphs_66/10_GRAPH.png', 'graphs/overlay_graphs_66/11_GRAPH.png', 'graphs/overlay_graphs_66/12_GRAPH.png', 'graphs/overlay_graphs_66/13_GRAPH.png', 'graphs/overlay_graphs_66/14_GRAPH.png', 'graphs/overlay_graphs_66/15_GRAPH.png', 'graphs/overlay_graphs_66/16_GRAPH.png', 'graphs/overlay_graphs_66/17_GRAPH.png', 'graphs/overlay_graphs_66/18_GRAPH.png', 'graphs/overlay_graphs_66/19_GRAPH.png', 'graphs/overlay_graphs_66/20_GRAPH.png', 'graphs/overlay_graphs_66/21_GRAPH.png', 'graphs/overlay_graphs_66/22_GRAPH.png', 'graphs/overlay_graphs_66/23_GRAPH.png', 'graphs/overlay_graphs_66/24_GRAPH.png', 'graphs/overlay_graphs_67/1_GRAPH.png', 'graphs/overlay_graphs_67/2_GRAPH.png', 'graphs/overlay_graphs_67/3_GRAPH.png', 'graphs/overlay_graphs_67/4_GRAPH.png', 'graphs/overlay_graphs_67/5_GRAPH.png', 'graphs/overlay_graphs_67/6_GRAPH.png', 'graphs/overlay_graphs_67/7_GRAPH.png', 'graphs/overlay_graphs_67/8_GRAPH.png', 'graphs/overlay_graphs_67/9_GRAPH.png', 'graphs/overlay_graphs_67/10_GRAPH.png', 'graphs/overlay_graphs_67/11_GRAPH.png', 'graphs/overlay_graphs_67/12_GRAPH.png', 'graphs/overlay_graphs_67/13_GRAPH.png', 'graphs/overlay_graphs_67/14_GRAPH.png', 'graphs/overlay_graphs_67/15_GRAPH.png', 'graphs/overlay_graphs_67/16_GRAPH.png', 'graphs/overlay_graphs_67/17_GRAPH.png', 'graphs/overlay_graphs_67/18_GRAPH.png', 'graphs/overlay_graphs_67/19_GRAPH.png', 'graphs/overlay_graphs_67/20_GRAPH.png', 'graphs/overlay_graphs_67/21_GRAPH.png', 'graphs/overlay_graphs_67/22_GRAPH.png', 'graphs/overlay_graphs_67/23_GRAPH.png', 'graphs/overlay_graphs_67/24_GRAPH.png', 'graphs/overlay_graphs_68/1_GRAPH.png', 'graphs/overlay_graphs_68/2_GRAPH.png', 'graphs/overlay_graphs_68/3_GRAPH.png', 'graphs/overlay_graphs_68/4_GRAPH.png', 'graphs/overlay_graphs_68/5_GRAPH.png', 'graphs/overlay_graphs_68/6_GRAPH.png', 'graphs/overlay_graphs_68/7_GRAPH.png', 'graphs/overlay_graphs_68/8_GRAPH.png', 'graphs/overlay_graphs_68/9_GRAPH.png', 'graphs/overlay_graphs_68/10_GRAPH.png', 'graphs/overlay_graphs_68/11_GRAPH.png', 'graphs/overlay_graphs_68/12_GRAPH.png', 'graphs/overlay_graphs_68/13_GRAPH.png', 'graphs/overlay_graphs_68/14_GRAPH.png', 'graphs/overlay_graphs_68/15_GRAPH.png', 'graphs/overlay_graphs_68/16_GRAPH.png', 'graphs/overlay_graphs_68/17_GRAPH.png', 'graphs/overlay_graphs_68/18_GRAPH.png', 'graphs/overlay_graphs_68/19_GRAPH.png', 'graphs/overlay_graphs_68/20_GRAPH.png', 'graphs/overlay_graphs_68/21_GRAPH.png', 'graphs/overlay_graphs_68/22_GRAPH.png', 'graphs/overlay_graphs_68/23_GRAPH.png', 'graphs/overlay_graphs_68/24_GRAPH.png', 'graphs/overlay_graphs_69/1_GRAPH.png', 'graphs/overlay_graphs_69/2_GRAPH.png', 'graphs/overlay_graphs_69/3_GRAPH.png', 'graphs/overlay_graphs_69/4_GRAPH.png', 'graphs/overlay_graphs_69/5_GRAPH.png', 'graphs/overlay_graphs_69/6_GRAPH.png', 'graphs/overlay_graphs_69/7_GRAPH.png', 'graphs/overlay_graphs_69/8_GRAPH.png', 'graphs/overlay_graphs_69/9_GRAPH.png', 'graphs/overlay_graphs_69/10_GRAPH.png', 'graphs/overlay_graphs_69/11_GRAPH.png', 'graphs/overlay_graphs_69/12_GRAPH.png', 'graphs/overlay_graphs_69/13_GRAPH.png', 'graphs/overlay_graphs_69/14_GRAPH.png', 'graphs/overlay_graphs_69/15_GRAPH.png', 'graphs/overlay_graphs_69/16_GRAPH.png', 'graphs/overlay_graphs_69/17_GRAPH.png', 'graphs/overlay_graphs_69/18_GRAPH.png', 'graphs/overlay_graphs_69/19_GRAPH.png', 'graphs/overlay_graphs_69/20_GRAPH.png', 'graphs/overlay_graphs_69/21_GRAPH.png', 'graphs/overlay_graphs_69/22_GRAPH.png', 'graphs/overlay_graphs_69/23_GRAPH.png', 'graphs/overlay_graphs_69/24_GRAPH.png', 'graphs/overlay_graphs_70/1_GRAPH.png', 'graphs/overlay_graphs_70/2_GRAPH.png', 'graphs/overlay_graphs_70/3_GRAPH.png', 'graphs/overlay_graphs_70/4_GRAPH.png', 'graphs/overlay_graphs_70/5_GRAPH.png', 'graphs/overlay_graphs_70/6_GRAPH.png', 'graphs/overlay_graphs_70/7_GRAPH.png', 'graphs/overlay_graphs_70/8_GRAPH.png', 'graphs/overlay_graphs_70/9_GRAPH.png', 'graphs/overlay_graphs_70/10_GRAPH.png', 'graphs/overlay_graphs_70/11_GRAPH.png', 'graphs/overlay_graphs_70/12_GRAPH.png', 'graphs/overlay_graphs_70/13_GRAPH.png', 'graphs/overlay_graphs_70/14_GRAPH.png', 'graphs/overlay_graphs_70/15_GRAPH.png', 'graphs/overlay_graphs_70/16_GRAPH.png', 'graphs/overlay_graphs_70/17_GRAPH.png', 'graphs/overlay_graphs_70/18_GRAPH.png', 'graphs/overlay_graphs_70/19_GRAPH.png', 'graphs/overlay_graphs_70/20_GRAPH.png', 'graphs/overlay_graphs_70/21_GRAPH.png', 'graphs/overlay_graphs_70/22_GRAPH.png', 'graphs/overlay_graphs_70/23_GRAPH.png', 'graphs/overlay_graphs_70/24_GRAPH.png', 'graphs/overlay_graphs_71/1_GRAPH.png', 'graphs/overlay_graphs_71/2_GRAPH.png', 'graphs/overlay_graphs_71/3_GRAPH.png', 'graphs/overlay_graphs_71/4_GRAPH.png', 'graphs/overlay_graphs_71/5_GRAPH.png', 'graphs/overlay_graphs_71/6_GRAPH.png', 'graphs/overlay_graphs_71/7_GRAPH.png', 'graphs/overlay_graphs_71/8_GRAPH.png', 'graphs/overlay_graphs_71/9_GRAPH.png', 'graphs/overlay_graphs_71/10_GRAPH.png', 'graphs/overlay_graphs_71/11_GRAPH.png', 'graphs/overlay_graphs_71/12_GRAPH.png', 'graphs/overlay_graphs_71/13_GRAPH.png', 'graphs/overlay_graphs_71/14_GRAPH.png', 'graphs/overlay_graphs_71/15_GRAPH.png', 'graphs/overlay_graphs_71/16_GRAPH.png', 'graphs/overlay_graphs_71/17_GRAPH.png', 'graphs/overlay_graphs_71/18_GRAPH.png', 'graphs/overlay_graphs_71/19_GRAPH.png', 'graphs/overlay_graphs_71/20_GRAPH.png', 'graphs/overlay_graphs_71/21_GRAPH.png', 'graphs/overlay_graphs_71/22_GRAPH.png', 'graphs/overlay_graphs_71/23_GRAPH.png', 'graphs/overlay_graphs_71/24_GRAPH.png', 'graphs/overlay_graphs_72/1_GRAPH.png', 'graphs/overlay_graphs_72/2_GRAPH.png', 'graphs/overlay_graphs_72/3_GRAPH.png', 'graphs/overlay_graphs_72/4_GRAPH.png', 'graphs/overlay_graphs_72/5_GRAPH.png', 'graphs/overlay_graphs_72/6_GRAPH.png', 'graphs/overlay_graphs_72/7_GRAPH.png', 'graphs/overlay_graphs_72/8_GRAPH.png', 'graphs/overlay_graphs_72/9_GRAPH.png', 'graphs/overlay_graphs_72/10_GRAPH.png', 'graphs/overlay_graphs_72/11_GRAPH.png', 'graphs/overlay_graphs_72/12_GRAPH.png', 'graphs/overlay_graphs_72/13_GRAPH.png', 'graphs/overlay_graphs_72/14_GRAPH.png', 'graphs/overlay_graphs_72/15_GRAPH.png', 'graphs/overlay_graphs_72/16_GRAPH.png', 'graphs/overlay_graphs_72/17_GRAPH.png', 'graphs/overlay_graphs_72/18_GRAPH.png', 'graphs/overlay_graphs_72/19_GRAPH.png', 'graphs/overlay_graphs_72/20_GRAPH.png', 'graphs/overlay_graphs_72/21_GRAPH.png', 'graphs/overlay_graphs_72/22_GRAPH.png', 'graphs/overlay_graphs_72/23_GRAPH.png', 'graphs/overlay_graphs_72/24_GRAPH.png', 'graphs/overlay_graphs_73/1_GRAPH.png', 'graphs/overlay_graphs_73/2_GRAPH.png', 'graphs/overlay_graphs_73/3_GRAPH.png', 'graphs/overlay_graphs_73/4_GRAPH.png', 'graphs/overlay_graphs_73/5_GRAPH.png', 'graphs/overlay_graphs_73/6_GRAPH.png', 'graphs/overlay_graphs_73/7_GRAPH.png', 'graphs/overlay_graphs_73/8_GRAPH.png', 'graphs/overlay_graphs_73/9_GRAPH.png', 'graphs/overlay_graphs_73/10_GRAPH.png', 'graphs/overlay_graphs_73/11_GRAPH.png', 'graphs/overlay_graphs_73/12_GRAPH.png', 'graphs/overlay_graphs_73/13_GRAPH.png', 'graphs/overlay_graphs_73/14_GRAPH.png', 'graphs/overlay_graphs_73/15_GRAPH.png', 'graphs/overlay_graphs_73/16_GRAPH.png', 'graphs/overlay_graphs_73/17_GRAPH.png', 'graphs/overlay_graphs_73/18_GRAPH.png', 'graphs/overlay_graphs_73/19_GRAPH.png', 'graphs/overlay_graphs_73/20_GRAPH.png', 'graphs/overlay_graphs_73/21_GRAPH.png', 'graphs/overlay_graphs_73/22_GRAPH.png', 'graphs/overlay_graphs_73/23_GRAPH.png', 'graphs/overlay_graphs_73/24_GRAPH.png', 'graphs/overlay_graphs_74/1_GRAPH.png', 'graphs/overlay_graphs_74/2_GRAPH.png', 'graphs/overlay_graphs_74/3_GRAPH.png', 'graphs/overlay_graphs_74/4_GRAPH.png', 'graphs/overlay_graphs_74/5_GRAPH.png', 'graphs/overlay_graphs_74/6_GRAPH.png', 'graphs/overlay_graphs_74/7_GRAPH.png', 'graphs/overlay_graphs_74/8_GRAPH.png', 'graphs/overlay_graphs_74/9_GRAPH.png', 'graphs/overlay_graphs_74/10_GRAPH.png', 'graphs/overlay_graphs_74/11_GRAPH.png', 'graphs/overlay_graphs_74/12_GRAPH.png', 'graphs/overlay_graphs_74/13_GRAPH.png', 'graphs/overlay_graphs_74/14_GRAPH.png', 'graphs/overlay_graphs_74/15_GRAPH.png', 'graphs/overlay_graphs_74/16_GRAPH.png', 'graphs/overlay_graphs_74/17_GRAPH.png', 'graphs/overlay_graphs_74/18_GRAPH.png', 'graphs/overlay_graphs_74/19_GRAPH.png', 'graphs/overlay_graphs_74/20_GRAPH.png', 'graphs/overlay_graphs_74/21_GRAPH.png', 'graphs/overlay_graphs_74/22_GRAPH.png', 'graphs/overlay_graphs_74/23_GRAPH.png', 'graphs/overlay_graphs_74/24_GRAPH.png', 'graphs/overlay_graphs_75/1_GRAPH.png', 'graphs/overlay_graphs_75/2_GRAPH.png', 'graphs/overlay_graphs_75/3_GRAPH.png', 'graphs/overlay_graphs_75/4_GRAPH.png', 'graphs/overlay_graphs_75/5_GRAPH.png', 'graphs/overlay_graphs_75/6_GRAPH.png', 'graphs/overlay_graphs_75/7_GRAPH.png', 'graphs/overlay_graphs_75/8_GRAPH.png', 'graphs/overlay_graphs_75/9_GRAPH.png', 'graphs/overlay_graphs_75/10_GRAPH.png', 'graphs/overlay_graphs_75/11_GRAPH.png', 'graphs/overlay_graphs_75/12_GRAPH.png', 'graphs/overlay_graphs_75/13_GRAPH.png', 'graphs/overlay_graphs_75/14_GRAPH.png', 'graphs/overlay_graphs_75/15_GRAPH.png', 'graphs/overlay_graphs_75/16_GRAPH.png', 'graphs/overlay_graphs_75/17_GRAPH.png', 'graphs/overlay_graphs_75/18_GRAPH.png', 'graphs/overlay_graphs_75/19_GRAPH.png', 'graphs/overlay_graphs_75/20_GRAPH.png', 'graphs/overlay_graphs_75/21_GRAPH.png', 'graphs/overlay_graphs_75/22_GRAPH.png', 'graphs/overlay_graphs_75/23_GRAPH.png', 'graphs/overlay_graphs_75/24_GRAPH.png', 'graphs/overlay_graphs_76/1_GRAPH.png', 'graphs/overlay_graphs_76/2_GRAPH.png', 'graphs/overlay_graphs_76/3_GRAPH.png', 'graphs/overlay_graphs_76/4_GRAPH.png', 'graphs/overlay_graphs_76/5_GRAPH.png', 'graphs/overlay_graphs_76/6_GRAPH.png', 'graphs/overlay_graphs_76/7_GRAPH.png', 'graphs/overlay_graphs_76/8_GRAPH.png', 'graphs/overlay_graphs_76/9_GRAPH.png', 'graphs/overlay_graphs_76/10_GRAPH.png', 'graphs/overlay_graphs_76/11_GRAPH.png', 'graphs/overlay_graphs_76/12_GRAPH.png', 'graphs/overlay_graphs_76/13_GRAPH.png', 'graphs/overlay_graphs_76/14_GRAPH.png', 'graphs/overlay_graphs_76/15_GRAPH.png', 'graphs/overlay_graphs_76/16_GRAPH.png', 'graphs/overlay_graphs_76/17_GRAPH.png', 'graphs/overlay_graphs_76/18_GRAPH.png', 'graphs/overlay_graphs_76/19_GRAPH.png', 'graphs/overlay_graphs_76/20_GRAPH.png', 'graphs/overlay_graphs_76/21_GRAPH.png', 'graphs/overlay_graphs_76/22_GRAPH.png', 'graphs/overlay_graphs_76/23_GRAPH.png', 'graphs/overlay_graphs_76/24_GRAPH.png', 'graphs/overlay_graphs_77/1_GRAPH.png', 'graphs/overlay_graphs_77/2_GRAPH.png', 'graphs/overlay_graphs_77/3_GRAPH.png', 'graphs/overlay_graphs_77/4_GRAPH.png', 'graphs/overlay_graphs_77/5_GRAPH.png', 'graphs/overlay_graphs_77/6_GRAPH.png', 'graphs/overlay_graphs_77/7_GRAPH.png', 'graphs/overlay_graphs_77/8_GRAPH.png', 'graphs/overlay_graphs_77/9_GRAPH.png', 'graphs/overlay_graphs_77/10_GRAPH.png', 'graphs/overlay_graphs_77/11_GRAPH.png', 'graphs/overlay_graphs_77/12_GRAPH.png', 'graphs/overlay_graphs_77/13_GRAPH.png', 'graphs/overlay_graphs_77/14_GRAPH.png', 'graphs/overlay_graphs_77/15_GRAPH.png', 'graphs/overlay_graphs_77/16_GRAPH.png', 'graphs/overlay_graphs_77/17_GRAPH.png', 'graphs/overlay_graphs_77/18_GRAPH.png', 'graphs/overlay_graphs_77/19_GRAPH.png', 'graphs/overlay_graphs_77/20_GRAPH.png', 'graphs/overlay_graphs_77/21_GRAPH.png', 'graphs/overlay_graphs_77/22_GRAPH.png', 'graphs/overlay_graphs_77/23_GRAPH.png', 'graphs/overlay_graphs_77/24_GRAPH.png', 'graphs/overlay_graphs_78/1_GRAPH.png', 'graphs/overlay_graphs_78/2_GRAPH.png', 'graphs/overlay_graphs_78/3_GRAPH.png', 'graphs/overlay_graphs_78/4_GRAPH.png', 'graphs/overlay_graphs_78/5_GRAPH.png', 'graphs/overlay_graphs_78/6_GRAPH.png', 'graphs/overlay_graphs_78/7_GRAPH.png', 'graphs/overlay_graphs_78/8_GRAPH.png', 'graphs/overlay_graphs_78/9_GRAPH.png', 'graphs/overlay_graphs_78/10_GRAPH.png', 'graphs/overlay_graphs_78/11_GRAPH.png', 'graphs/overlay_graphs_78/12_GRAPH.png', 'graphs/overlay_graphs_78/13_GRAPH.png', 'graphs/overlay_graphs_78/14_GRAPH.png', 'graphs/overlay_graphs_78/15_GRAPH.png', 'graphs/overlay_graphs_78/16_GRAPH.png', 'graphs/overlay_graphs_78/17_GRAPH.png', 'graphs/overlay_graphs_78/18_GRAPH.png', 'graphs/overlay_graphs_78/19_GRAPH.png', 'graphs/overlay_graphs_78/20_GRAPH.png', 'graphs/overlay_graphs_78/21_GRAPH.png', 'graphs/overlay_graphs_78/22_GRAPH.png', 'graphs/overlay_graphs_78/23_GRAPH.png', 'graphs/overlay_graphs_78/24_GRAPH.png', 'graphs/overlay_graphs_79/1_GRAPH.png', 'graphs/overlay_graphs_79/2_GRAPH.png', 'graphs/overlay_graphs_79/3_GRAPH.png', 'graphs/overlay_graphs_79/4_GRAPH.png', 'graphs/overlay_graphs_79/5_GRAPH.png', 'graphs/overlay_graphs_79/6_GRAPH.png', 'graphs/overlay_graphs_79/7_GRAPH.png', 'graphs/overlay_graphs_79/8_GRAPH.png', 'graphs/overlay_graphs_79/9_GRAPH.png', 'graphs/overlay_graphs_79/10_GRAPH.png', 'graphs/overlay_graphs_79/11_GRAPH.png', 'graphs/overlay_graphs_79/12_GRAPH.png', 'graphs/overlay_graphs_79/13_GRAPH.png', 'graphs/overlay_graphs_79/14_GRAPH.png', 'graphs/overlay_graphs_79/15_GRAPH.png', 'graphs/overlay_graphs_79/16_GRAPH.png', 'graphs/overlay_graphs_79/17_GRAPH.png', 'graphs/overlay_graphs_79/18_GRAPH.png', 'graphs/overlay_graphs_79/19_GRAPH.png', 'graphs/overlay_graphs_79/20_GRAPH.png', 'graphs/overlay_graphs_79/21_GRAPH.png', 'graphs/overlay_graphs_79/22_GRAPH.png', 'graphs/overlay_graphs_79/23_GRAPH.png', 'graphs/overlay_graphs_79/24_GRAPH.png', 'graphs/overlay_graphs_80/1_GRAPH.png', 'graphs/overlay_graphs_80/2_GRAPH.png', 'graphs/overlay_graphs_80/3_GRAPH.png', 'graphs/overlay_graphs_80/4_GRAPH.png', 'graphs/overlay_graphs_80/5_GRAPH.png', 'graphs/overlay_graphs_80/6_GRAPH.png', 'graphs/overlay_graphs_80/7_GRAPH.png', 'graphs/overlay_graphs_80/8_GRAPH.png', 'graphs/overlay_graphs_80/9_GRAPH.png', 'graphs/overlay_graphs_80/10_GRAPH.png', 'graphs/overlay_graphs_80/11_GRAPH.png', 'graphs/overlay_graphs_80/12_GRAPH.png', 'graphs/overlay_graphs_80/13_GRAPH.png', 'graphs/overlay_graphs_80/14_GRAPH.png', 'graphs/overlay_graphs_80/15_GRAPH.png', 'graphs/overlay_graphs_80/16_GRAPH.png', 'graphs/overlay_graphs_80/17_GRAPH.png', 'graphs/overlay_graphs_80/18_GRAPH.png', 'graphs/overlay_graphs_80/19_GRAPH.png', 'graphs/overlay_graphs_80/20_GRAPH.png', 'graphs/overlay_graphs_80/21_GRAPH.png', 'graphs/overlay_graphs_80/22_GRAPH.png', 'graphs/overlay_graphs_80/23_GRAPH.png', 'graphs/overlay_graphs_80/24_GRAPH.png', 'graphs/overlay_graphs_81/1_GRAPH.png', 'graphs/overlay_graphs_81/2_GRAPH.png', 'graphs/overlay_graphs_81/3_GRAPH.png', 'graphs/overlay_graphs_81/4_GRAPH.png', 'graphs/overlay_graphs_81/5_GRAPH.png', 'graphs/overlay_graphs_81/6_GRAPH.png', 'graphs/overlay_graphs_81/7_GRAPH.png', 'graphs/overlay_graphs_81/8_GRAPH.png', 'graphs/overlay_graphs_81/9_GRAPH.png', 'graphs/overlay_graphs_81/10_GRAPH.png', 'graphs/overlay_graphs_81/11_GRAPH.png', 'graphs/overlay_graphs_81/12_GRAPH.png', 'graphs/overlay_graphs_81/13_GRAPH.png', 'graphs/overlay_graphs_81/14_GRAPH.png', 'graphs/overlay_graphs_81/15_GRAPH.png', 'graphs/overlay_graphs_81/16_GRAPH.png', 'graphs/overlay_graphs_81/17_GRAPH.png', 'graphs/overlay_graphs_81/18_GRAPH.png', 'graphs/overlay_graphs_81/19_GRAPH.png', 'graphs/overlay_graphs_81/20_GRAPH.png', 'graphs/overlay_graphs_82/1_GRAPH.png', 'graphs/overlay_graphs_82/2_GRAPH.png', 'graphs/overlay_graphs_82/3_GRAPH.png', 'graphs/overlay_graphs_82/4_GRAPH.png', 'graphs/overlay_graphs_82/5_GRAPH.png', 'graphs/overlay_graphs_82/6_GRAPH.png', 'graphs/overlay_graphs_82/7_GRAPH.png', 'graphs/overlay_graphs_82/8_GRAPH.png', 'graphs/overlay_graphs_82/9_GRAPH.png', 'graphs/overlay_graphs_82/10_GRAPH.png', 'graphs/overlay_graphs_82/11_GRAPH.png', 'graphs/overlay_graphs_82/12_GRAPH.png', 'graphs/overlay_graphs_82/13_GRAPH.png', 'graphs/overlay_graphs_82/14_GRAPH.png', 'graphs/overlay_graphs_82/15_GRAPH.png', 'graphs/overlay_graphs_82/16_GRAPH.png', 'graphs/overlay_graphs_82/17_GRAPH.png', 'graphs/overlay_graphs_82/18_GRAPH.png', 'graphs/overlay_graphs_82/19_GRAPH.png', 'graphs/overlay_graphs_82/20_GRAPH.png', 'graphs/overlay_graphs_82/21_GRAPH.png', 'graphs/overlay_graphs_82/22_GRAPH.png', 'graphs/overlay_graphs_82/23_GRAPH.png', 'graphs/overlay_graphs_82/24_GRAPH.png', 'graphs/overlay_graphs_83/1_GRAPH.png', 'graphs/overlay_graphs_83/2_GRAPH.png', 'graphs/overlay_graphs_83/3_GRAPH.png', 'graphs/overlay_graphs_83/4_GRAPH.png', 'graphs/overlay_graphs_83/5_GRAPH.png', 'graphs/overlay_graphs_83/6_GRAPH.png', 'graphs/overlay_graphs_83/7_GRAPH.png', 'graphs/overlay_graphs_83/8_GRAPH.png', 'graphs/overlay_graphs_83/9_GRAPH.png', 'graphs/overlay_graphs_83/10_GRAPH.png', 'graphs/overlay_graphs_83/11_GRAPH.png', 'graphs/overlay_graphs_83/12_GRAPH.png', 'graphs/overlay_graphs_83/13_GRAPH.png', 'graphs/overlay_graphs_83/14_GRAPH.png', 'graphs/overlay_graphs_83/15_GRAPH.png', 'graphs/overlay_graphs_83/16_GRAPH.png', 'graphs/overlay_graphs_83/17_GRAPH.png', 'graphs/overlay_graphs_83/18_GRAPH.png', 'graphs/overlay_graphs_83/19_GRAPH.png', 'graphs/overlay_graphs_83/20_GRAPH.png', 'graphs/overlay_graphs_83/21_GRAPH.png', 'graphs/overlay_graphs_83/22_GRAPH.png', 'graphs/overlay_graphs_83/23_GRAPH.png', 'graphs/overlay_graphs_83/24_GRAPH.png', 'graphs/overlay_graphs_84/1_GRAPH.png', 'graphs/overlay_graphs_84/2_GRAPH.png', 'graphs/overlay_graphs_84/3_GRAPH.png', 'graphs/overlay_graphs_84/4_GRAPH.png', 'graphs/overlay_graphs_84/5_GRAPH.png', 'graphs/overlay_graphs_84/6_GRAPH.png', 'graphs/overlay_graphs_84/7_GRAPH.png', 'graphs/overlay_graphs_84/8_GRAPH.png', 'graphs/overlay_graphs_84/9_GRAPH.png', 'graphs/overlay_graphs_84/10_GRAPH.png', 'graphs/overlay_graphs_84/11_GRAPH.png', 'graphs/overlay_graphs_84/12_GRAPH.png', 'graphs/overlay_graphs_84/13_GRAPH.png', 'graphs/overlay_graphs_84/14_GRAPH.png', 'graphs/overlay_graphs_84/15_GRAPH.png', 'graphs/overlay_graphs_84/16_GRAPH.png', 'graphs/overlay_graphs_84/17_GRAPH.png', 'graphs/overlay_graphs_84/18_GRAPH.png', 'graphs/overlay_graphs_84/19_GRAPH.png', 'graphs/overlay_graphs_84/20_GRAPH.png', 'graphs/overlay_graphs_84/21_GRAPH.png', 'graphs/overlay_graphs_84/22_GRAPH.png', 'graphs/overlay_graphs_84/23_GRAPH.png', 'graphs/overlay_graphs_84/24_GRAPH.png', 'graphs/overlay_graphs_85/1_GRAPH.png', 'graphs/overlay_graphs_85/2_GRAPH.png', 'graphs/overlay_graphs_85/3_GRAPH.png', 'graphs/overlay_graphs_85/4_GRAPH.png', 'graphs/overlay_graphs_85/5_GRAPH.png', 'graphs/overlay_graphs_85/6_GRAPH.png', 'graphs/overlay_graphs_85/7_GRAPH.png', 'graphs/overlay_graphs_85/8_GRAPH.png', 'graphs/overlay_graphs_85/9_GRAPH.png', 'graphs/overlay_graphs_85/10_GRAPH.png', 'graphs/overlay_graphs_85/11_GRAPH.png', 'graphs/overlay_graphs_85/12_GRAPH.png', 'graphs/overlay_graphs_85/13_GRAPH.png', 'graphs/overlay_graphs_85/14_GRAPH.png', 'graphs/overlay_graphs_85/15_GRAPH.png', 'graphs/overlay_graphs_85/16_GRAPH.png', 'graphs/overlay_graphs_85/17_GRAPH.png', 'graphs/overlay_graphs_85/18_GRAPH.png', 'graphs/overlay_graphs_85/19_GRAPH.png', 'graphs/overlay_graphs_85/20_GRAPH.png', 'graphs/overlay_graphs_85/21_GRAPH.png', 'graphs/overlay_graphs_85/22_GRAPH.png', 'graphs/overlay_graphs_85/23_GRAPH.png', 'graphs/overlay_graphs_85/24_GRAPH.png', 'graphs/overlay_graphs_86/1_GRAPH.png', 'graphs/overlay_graphs_86/2_GRAPH.png', 'graphs/overlay_graphs_86/3_GRAPH.png', 'graphs/overlay_graphs_86/4_GRAPH.png', 'graphs/overlay_graphs_86/5_GRAPH.png', 'graphs/overlay_graphs_86/6_GRAPH.png', 'graphs/overlay_graphs_86/7_GRAPH.png', 'graphs/overlay_graphs_86/8_GRAPH.png', 'graphs/overlay_graphs_86/9_GRAPH.png', 'graphs/overlay_graphs_86/10_GRAPH.png', 'graphs/overlay_graphs_86/11_GRAPH.png', 'graphs/overlay_graphs_86/12_GRAPH.png', 'graphs/overlay_graphs_86/13_GRAPH.png', 'graphs/overlay_graphs_86/14_GRAPH.png', 'graphs/overlay_graphs_86/15_GRAPH.png', 'graphs/overlay_graphs_86/16_GRAPH.png', 'graphs/overlay_graphs_86/17_GRAPH.png', 'graphs/overlay_graphs_86/18_GRAPH.png', 'graphs/overlay_graphs_86/19_GRAPH.png', 'graphs/overlay_graphs_86/20_GRAPH.png', 'graphs/overlay_graphs_86/21_GRAPH.png', 'graphs/overlay_graphs_86/22_GRAPH.png', 'graphs/overlay_graphs_86/23_GRAPH.png', 'graphs/overlay_graphs_86/24_GRAPH.png', 'graphs/overlay_graphs_87/1_GRAPH.png', 'graphs/overlay_graphs_87/2_GRAPH.png', 'graphs/overlay_graphs_87/3_GRAPH.png', 'graphs/overlay_graphs_87/4_GRAPH.png', 'graphs/overlay_graphs_87/5_GRAPH.png', 'graphs/overlay_graphs_87/6_GRAPH.png', 'graphs/overlay_graphs_87/7_GRAPH.png', 'graphs/overlay_graphs_87/8_GRAPH.png', 'graphs/overlay_graphs_87/9_GRAPH.png', 'graphs/overlay_graphs_87/10_GRAPH.png', 'graphs/overlay_graphs_87/11_GRAPH.png', 'graphs/overlay_graphs_87/12_GRAPH.png', 'graphs/overlay_graphs_87/13_GRAPH.png', 'graphs/overlay_graphs_87/14_GRAPH.png', 'graphs/overlay_graphs_87/15_GRAPH.png', 'graphs/overlay_graphs_87/16_GRAPH.png', 'graphs/overlay_graphs_87/17_GRAPH.png', 'graphs/overlay_graphs_87/18_GRAPH.png', 'graphs/overlay_graphs_87/19_GRAPH.png', 'graphs/overlay_graphs_87/20_GRAPH.png', 'graphs/overlay_graphs_87/21_GRAPH.png', 'graphs/overlay_graphs_87/22_GRAPH.png', 'graphs/overlay_graphs_87/23_GRAPH.png', 'graphs/overlay_graphs_87/24_GRAPH.png', 'graphs/overlay_graphs_88/1_GRAPH.png', 'graphs/overlay_graphs_88/2_GRAPH.png', 'graphs/overlay_graphs_88/3_GRAPH.png', 'graphs/overlay_graphs_88/4_GRAPH.png', 'graphs/overlay_graphs_88/5_GRAPH.png', 'graphs/overlay_graphs_88/6_GRAPH.png', 'graphs/overlay_graphs_88/7_GRAPH.png', 'graphs/overlay_graphs_88/8_GRAPH.png', 'graphs/overlay_graphs_88/9_GRAPH.png', 'graphs/overlay_graphs_88/10_GRAPH.png', 'graphs/overlay_graphs_88/11_GRAPH.png', 'graphs/overlay_graphs_88/12_GRAPH.png', 'graphs/overlay_graphs_88/13_GRAPH.png', 'graphs/overlay_graphs_88/14_GRAPH.png', 'graphs/overlay_graphs_88/15_GRAPH.png', 'graphs/overlay_graphs_88/16_GRAPH.png', 'graphs/overlay_graphs_88/17_GRAPH.png', 'graphs/overlay_graphs_88/18_GRAPH.png', 'graphs/overlay_graphs_88/19_GRAPH.png', 'graphs/overlay_graphs_88/20_GRAPH.png', 'graphs/overlay_graphs_88/21_GRAPH.png', 'graphs/overlay_graphs_88/22_GRAPH.png', 'graphs/overlay_graphs_88/23_GRAPH.png', 'graphs/overlay_graphs_88/24_GRAPH.png', 'graphs/overlay_graphs_89/1_GRAPH.png', 'graphs/overlay_graphs_89/2_GRAPH.png', 'graphs/overlay_graphs_89/3_GRAPH.png', 'graphs/overlay_graphs_89/4_GRAPH.png', 'graphs/overlay_graphs_89/5_GRAPH.png', 'graphs/overlay_graphs_89/6_GRAPH.png', 'graphs/overlay_graphs_89/7_GRAPH.png', 'graphs/overlay_graphs_89/8_GRAPH.png', 'graphs/overlay_graphs_89/9_GRAPH.png', 'graphs/overlay_graphs_89/10_GRAPH.png', 'graphs/overlay_graphs_89/11_GRAPH.png', 'graphs/overlay_graphs_89/12_GRAPH.png', 'graphs/overlay_graphs_89/13_GRAPH.png', 'graphs/overlay_graphs_89/14_GRAPH.png', 'graphs/overlay_graphs_89/15_GRAPH.png', 'graphs/overlay_graphs_89/16_GRAPH.png', 'graphs/overlay_graphs_89/17_GRAPH.png', 'graphs/overlay_graphs_89/18_GRAPH.png', 'graphs/overlay_graphs_89/19_GRAPH.png', 'graphs/overlay_graphs_89/20_GRAPH.png', 'graphs/overlay_graphs_89/21_GRAPH.png', 'graphs/overlay_graphs_89/22_GRAPH.png', 'graphs/overlay_graphs_89/23_GRAPH.png', 'graphs/overlay_graphs_89/24_GRAPH.png', 'graphs/overlay_graphs_90/1_GRAPH.png', 'graphs/overlay_graphs_90/2_GRAPH.png', 'graphs/overlay_graphs_90/3_GRAPH.png', 'graphs/overlay_graphs_90/4_GRAPH.png', 'graphs/overlay_graphs_90/5_GRAPH.png', 'graphs/overlay_graphs_90/6_GRAPH.png', 'graphs/overlay_graphs_90/7_GRAPH.png', 'graphs/overlay_graphs_90/8_GRAPH.png', 'graphs/overlay_graphs_90/9_GRAPH.png', 'graphs/overlay_graphs_90/10_GRAPH.png', 'graphs/overlay_graphs_90/11_GRAPH.png', 'graphs/overlay_graphs_90/12_GRAPH.png', 'graphs/overlay_graphs_90/13_GRAPH.png', 'graphs/overlay_graphs_90/14_GRAPH.png', 'graphs/overlay_graphs_90/15_GRAPH.png', 'graphs/overlay_graphs_90/16_GRAPH.png', 'graphs/overlay_graphs_90/17_GRAPH.png', 'graphs/overlay_graphs_90/18_GRAPH.png', 'graphs/overlay_graphs_90/19_GRAPH.png', 'graphs/overlay_graphs_90/20_GRAPH.png', 'graphs/overlay_graphs_90/21_GRAPH.png', 'graphs/overlay_graphs_90/22_GRAPH.png', 'graphs/overlay_graphs_90/23_GRAPH.png', 'graphs/overlay_graphs_90/24_GRAPH.png', 'graphs/overlay_graphs_91/1_GRAPH.png', 'graphs/overlay_graphs_91/2_GRAPH.png', 'graphs/overlay_graphs_91/3_GRAPH.png', 'graphs/overlay_graphs_91/4_GRAPH.png', 'graphs/overlay_graphs_91/5_GRAPH.png', 'graphs/overlay_graphs_91/6_GRAPH.png', 'graphs/overlay_graphs_91/7_GRAPH.png', 'graphs/overlay_graphs_91/8_GRAPH.png', 'graphs/overlay_graphs_91/9_GRAPH.png', 'graphs/overlay_graphs_91/10_GRAPH.png', 'graphs/overlay_graphs_91/11_GRAPH.png', 'graphs/overlay_graphs_91/12_GRAPH.png', 'graphs/overlay_graphs_91/13_GRAPH.png', 'graphs/overlay_graphs_91/14_GRAPH.png', 'graphs/overlay_graphs_91/15_GRAPH.png', 'graphs/overlay_graphs_91/16_GRAPH.png', 'graphs/overlay_graphs_91/17_GRAPH.png', 'graphs/overlay_graphs_91/18_GRAPH.png', 'graphs/overlay_graphs_91/19_GRAPH.png', 'graphs/overlay_graphs_91/20_GRAPH.png', 'graphs/overlay_graphs_91/21_GRAPH.png', 'graphs/overlay_graphs_91/22_GRAPH.png', 'graphs/overlay_graphs_91/23_GRAPH.png', 'graphs/overlay_graphs_91/24_GRAPH.png', 'graphs/overlay_graphs_92/1_GRAPH.png', 'graphs/overlay_graphs_92/2_GRAPH.png', 'graphs/overlay_graphs_92/3_GRAPH.png', 'graphs/overlay_graphs_92/4_GRAPH.png', 'graphs/overlay_graphs_92/5_GRAPH.png', 'graphs/overlay_graphs_92/6_GRAPH.png', 'graphs/overlay_graphs_92/7_GRAPH.png', 'graphs/overlay_graphs_92/8_GRAPH.png', 'graphs/overlay_graphs_92/9_GRAPH.png', 'graphs/overlay_graphs_92/10_GRAPH.png', 'graphs/overlay_graphs_92/11_GRAPH.png', 'graphs/overlay_graphs_92/12_GRAPH.png', 'graphs/overlay_graphs_92/13_GRAPH.png', 'graphs/overlay_graphs_92/14_GRAPH.png', 'graphs/overlay_graphs_92/15_GRAPH.png', 'graphs/overlay_graphs_92/16_GRAPH.png', 'graphs/overlay_graphs_92/17_GRAPH.png', 'graphs/overlay_graphs_92/18_GRAPH.png', 'graphs/overlay_graphs_92/19_GRAPH.png', 'graphs/overlay_graphs_92/20_GRAPH.png', 'graphs/overlay_graphs_92/21_GRAPH.png', 'graphs/overlay_graphs_92/22_GRAPH.png', 'graphs/overlay_graphs_92/23_GRAPH.png', 'graphs/overlay_graphs_92/24_GRAPH.png', 'graphs/overlay_graphs_93/1_GRAPH.png', 'graphs/overlay_graphs_93/2_GRAPH.png', 'graphs/overlay_graphs_93/3_GRAPH.png', 'graphs/overlay_graphs_93/4_GRAPH.png', 'graphs/overlay_graphs_93/5_GRAPH.png', 'graphs/overlay_graphs_93/6_GRAPH.png', 'graphs/overlay_graphs_93/7_GRAPH.png', 'graphs/overlay_graphs_93/8_GRAPH.png', 'graphs/overlay_graphs_93/9_GRAPH.png', 'graphs/overlay_graphs_93/10_GRAPH.png', 'graphs/overlay_graphs_93/11_GRAPH.png', 'graphs/overlay_graphs_93/12_GRAPH.png', 'graphs/overlay_graphs_93/13_GRAPH.png', 'graphs/overlay_graphs_93/14_GRAPH.png', 'graphs/overlay_graphs_93/15_GRAPH.png', 'graphs/overlay_graphs_93/16_GRAPH.png', 'graphs/overlay_graphs_93/17_GRAPH.png', 'graphs/overlay_graphs_93/18_GRAPH.png', 'graphs/overlay_graphs_93/19_GRAPH.png', 'graphs/overlay_graphs_93/20_GRAPH.png', 'graphs/overlay_graphs_93/21_GRAPH.png', 'graphs/overlay_graphs_93/22_GRAPH.png', 'graphs/overlay_graphs_93/23_GRAPH.png', 'graphs/overlay_graphs_93/24_GRAPH.png', 'graphs/overlay_graphs_94/1_GRAPH.png', 'graphs/overlay_graphs_94/2_GRAPH.png', 'graphs/overlay_graphs_94/3_GRAPH.png', 'graphs/overlay_graphs_94/4_GRAPH.png', 'graphs/overlay_graphs_94/5_GRAPH.png', 'graphs/overlay_graphs_94/6_GRAPH.png', 'graphs/overlay_graphs_94/7_GRAPH.png', 'graphs/overlay_graphs_94/8_GRAPH.png', 'graphs/overlay_graphs_94/9_GRAPH.png', 'graphs/overlay_graphs_94/10_GRAPH.png', 'graphs/overlay_graphs_94/11_GRAPH.png', 'graphs/overlay_graphs_94/12_GRAPH.png', 'graphs/overlay_graphs_94/13_GRAPH.png', 'graphs/overlay_graphs_94/14_GRAPH.png', 'graphs/overlay_graphs_94/15_GRAPH.png', 'graphs/overlay_graphs_94/16_GRAPH.png', 'graphs/overlay_graphs_94/17_GRAPH.png', 'graphs/overlay_graphs_94/18_GRAPH.png', 'graphs/overlay_graphs_94/19_GRAPH.png', 'graphs/overlay_graphs_94/20_GRAPH.png', 'graphs/overlay_graphs_94/21_GRAPH.png', 'graphs/overlay_graphs_94/22_GRAPH.png', 'graphs/overlay_graphs_94/23_GRAPH.png', 'graphs/overlay_graphs_94/24_GRAPH.png', 'graphs/overlay_graphs_95/1_GRAPH.png', 'graphs/overlay_graphs_95/2_GRAPH.png', 'graphs/overlay_graphs_95/3_GRAPH.png', 'graphs/overlay_graphs_95/4_GRAPH.png', 'graphs/overlay_graphs_95/5_GRAPH.png', 'graphs/overlay_graphs_95/6_GRAPH.png', 'graphs/overlay_graphs_95/7_GRAPH.png', 'graphs/overlay_graphs_95/8_GRAPH.png', 'graphs/overlay_graphs_95/9_GRAPH.png', 'graphs/overlay_graphs_95/10_GRAPH.png', 'graphs/overlay_graphs_95/11_GRAPH.png', 'graphs/overlay_graphs_95/12_GRAPH.png', 'graphs/overlay_graphs_95/13_GRAPH.png', 'graphs/overlay_graphs_95/14_GRAPH.png', 'graphs/overlay_graphs_95/15_GRAPH.png', 'graphs/overlay_graphs_95/16_GRAPH.png', 'graphs/overlay_graphs_95/17_GRAPH.png', 'graphs/overlay_graphs_95/18_GRAPH.png', 'graphs/overlay_graphs_95/19_GRAPH.png', 'graphs/overlay_graphs_95/20_GRAPH.png', 'graphs/overlay_graphs_95/21_GRAPH.png', 'graphs/overlay_graphs_95/22_GRAPH.png', 'graphs/overlay_graphs_95/23_GRAPH.png', 'graphs/overlay_graphs_95/24_GRAPH.png', 'graphs/overlay_graphs_96/1_GRAPH.png', 'graphs/overlay_graphs_96/2_GRAPH.png', 'graphs/overlay_graphs_96/3_GRAPH.png', 'graphs/overlay_graphs_96/4_GRAPH.png', 'graphs/overlay_graphs_96/5_GRAPH.png', 'graphs/overlay_graphs_96/6_GRAPH.png', 'graphs/overlay_graphs_96/7_GRAPH.png', 'graphs/overlay_graphs_96/8_GRAPH.png', 'graphs/overlay_graphs_96/9_GRAPH.png', 'graphs/overlay_graphs_96/10_GRAPH.png', 'graphs/overlay_graphs_96/11_GRAPH.png', 'graphs/overlay_graphs_96/12_GRAPH.png', 'graphs/overlay_graphs_96/13_GRAPH.png', 'graphs/overlay_graphs_96/14_GRAPH.png', 'graphs/overlay_graphs_96/15_GRAPH.png', 'graphs/overlay_graphs_96/16_GRAPH.png', 'graphs/overlay_graphs_96/17_GRAPH.png', 'graphs/overlay_graphs_96/18_GRAPH.png', 'graphs/overlay_graphs_96/19_GRAPH.png', 'graphs/overlay_graphs_96/20_GRAPH.png', 'graphs/overlay_graphs_96/21_GRAPH.png', 'graphs/overlay_graphs_96/22_GRAPH.png', 'graphs/overlay_graphs_96/23_GRAPH.png', 'graphs/overlay_graphs_96/24_GRAPH.png', 'graphs/overlay_graphs_97/1_GRAPH.png', 'graphs/overlay_graphs_97/2_GRAPH.png', 'graphs/overlay_graphs_97/3_GRAPH.png', 'graphs/overlay_graphs_97/4_GRAPH.png', 'graphs/overlay_graphs_97/5_GRAPH.png', 'graphs/overlay_graphs_97/6_GRAPH.png', 'graphs/overlay_graphs_97/7_GRAPH.png', 'graphs/overlay_graphs_97/8_GRAPH.png', 'graphs/overlay_graphs_97/9_GRAPH.png', 'graphs/overlay_graphs_97/10_GRAPH.png', 'graphs/overlay_graphs_97/11_GRAPH.png', 'graphs/overlay_graphs_97/12_GRAPH.png', 'graphs/overlay_graphs_97/13_GRAPH.png', 'graphs/overlay_graphs_97/14_GRAPH.png', 'graphs/overlay_graphs_97/15_GRAPH.png', 'graphs/overlay_graphs_97/16_GRAPH.png', 'graphs/overlay_graphs_97/17_GRAPH.png', 'graphs/overlay_graphs_97/18_GRAPH.png', 'graphs/overlay_graphs_97/19_GRAPH.png', 'graphs/overlay_graphs_97/20_GRAPH.png', 'graphs/overlay_graphs_98/1_GRAPH.png', 'graphs/overlay_graphs_98/2_GRAPH.png', 'graphs/overlay_graphs_98/3_GRAPH.png', 'graphs/overlay_graphs_98/4_GRAPH.png', 'graphs/overlay_graphs_98/5_GRAPH.png', 'graphs/overlay_graphs_98/6_GRAPH.png', 'graphs/overlay_graphs_98/7_GRAPH.png', 'graphs/overlay_graphs_98/8_GRAPH.png', 'graphs/overlay_graphs_98/9_GRAPH.png', 'graphs/overlay_graphs_98/10_GRAPH.png', 'graphs/overlay_graphs_98/11_GRAPH.png', 'graphs/overlay_graphs_98/12_GRAPH.png', 'graphs/overlay_graphs_98/13_GRAPH.png', 'graphs/overlay_graphs_98/14_GRAPH.png', 'graphs/overlay_graphs_98/15_GRAPH.png', 'graphs/overlay_graphs_98/16_GRAPH.png', 'graphs/overlay_graphs_98/17_GRAPH.png', 'graphs/overlay_graphs_98/18_GRAPH.png', 'graphs/overlay_graphs_98/19_GRAPH.png', 'graphs/overlay_graphs_98/20_GRAPH.png', 'graphs/overlay_graphs_98/21_GRAPH.png', 'graphs/overlay_graphs_98/22_GRAPH.png', 'graphs/overlay_graphs_98/23_GRAPH.png', 'graphs/overlay_graphs_98/24_GRAPH.png', 'graphs/overlay_graphs_99/1_GRAPH.png', 'graphs/overlay_graphs_99/2_GRAPH.png', 'graphs/overlay_graphs_99/3_GRAPH.png', 'graphs/overlay_graphs_99/4_GRAPH.png', 'graphs/overlay_graphs_99/5_GRAPH.png', 'graphs/overlay_graphs_99/6_GRAPH.png', 'graphs/overlay_graphs_99/7_GRAPH.png', 'graphs/overlay_graphs_99/8_GRAPH.png', 'graphs/overlay_graphs_99/9_GRAPH.png', 'graphs/overlay_graphs_99/10_GRAPH.png', 'graphs/overlay_graphs_99/11_GRAPH.png', 'graphs/overlay_graphs_99/12_GRAPH.png', 'graphs/overlay_graphs_99/13_GRAPH.png', 'graphs/overlay_graphs_99/14_GRAPH.png', 'graphs/overlay_graphs_99/15_GRAPH.png', 'graphs/overlay_graphs_99/16_GRAPH.png', 'graphs/overlay_graphs_99/17_GRAPH.png', 'graphs/overlay_graphs_99/18_GRAPH.png', 'graphs/overlay_graphs_99/19_GRAPH.png', 'graphs/overlay_graphs_99/20_GRAPH.png', 'graphs/overlay_graphs_99/21_GRAPH.png', 'graphs/overlay_graphs_99/22_GRAPH.png', 'graphs/overlay_graphs_99/23_GRAPH.png', 'graphs/overlay_graphs_99/24_GRAPH.png'];

console.log('Number of images:', images.length);
let currentImageIndex = 0;

const currentImageButton = document.getElementById('currentImageButton');
const prevImageButton = document.getElementById('prevImageButton');
const nextImageButton = document.getElementById('nextImageButton');
const hideImageButton = document.getElementById('hideImageButton');
const imageOverlay = document.getElementById('overlay-image');

function extractNumbersFromOverlayName(name) {
    const regex = /overlay_graphs_(\d+)\/(\d+)_GRAPH\.png/;
    const match = name.match(regex);

    if (match) {
        const firstNumber = parseInt(match[1], 10);
        const secondNumber = parseInt(match[2], 10);
        return [firstNumber, secondNumber];
    } else {
        return null;
    }
}

images.forEach((image, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `Image: ${image.split('/')[1]}/${image.split('/')[2]}`;
    currentImageDropdown.appendChild(option);
});

function updateImage() {
    const currentImage = images[currentImageIndex];
    document.getElementById('overlay-image').src = currentImage;
    currentImageDropdown.value = currentImageIndex;
    numbers = extractNumbersFromOverlayName(currentImage);
}

updateImage();

nextImageButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateImage();
});

prevImageButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateImage();
});

currentImageDropdown.addEventListener('change', (event) => {
    currentImageIndex = parseInt(event.target.value);
    updateImage();
});

let imageVisible = true;

hideImageButton.addEventListener('click', () => {
    imageVisible = !imageVisible;
    if (imageVisible) {
        imageOverlay.style.visibility = 'visible'
    } else {
        imageOverlay.style.visibility = 'hidden'
    }

    //console.log([camera.position.x, camera.position.y, camera.position.z]);
})


// ---
const getFinetuneData = false; // ONLY SET TO TRUE IF saveFiles IS FALSE - update: this is useless
const ddbModel = 'dots'; // old, new, dots
const seqLength = getRandomNumber(10, 50);
const timeoutTime = 200;
const polyOrder = getRandomNumber(3, 5);

// could consider not setting random position and rotation
const positionZ = 17.5; // was 21
const positionX = 0; // was 142.5
const positionY = -3.25; // was 0
const rotationX = 0; // was  0.01

const iterCount = parseInt(sessionStorage.getItem('count'));
// ---



// Add a basic light
const ambientLight = new THREE.AmbientLight(0xeeeeee, 0.5);
scene.add(ambientLight);

//const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 4); // works better
directionalLight.position.set(1, 1, 0).normalize();

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048; // Increase shadow map size for better quality
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 1.0; // Adjust near and far planes
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.bias = -0.005; // Reduce shadow acne
scene.add(directionalLight);

// Add a PointLight
//const pointLight = new THREE.PointLight(0xffffff, 1, 100);
const pointLight = new THREE.PointLight(0xffffff, 0, 100);
pointLight.position.set(5, 5, 5); // Position is x, y, z

pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048; // Increase shadow map size for better quality
pointLight.shadow.mapSize.height = 2048;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 500;
//scene.add(pointLight);

//let material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const filmPass = new ShaderPass(FilmShader);
filmPass.uniforms['intensity'].value = 0.35; // Adjust film grain intensity
filmPass.uniforms['grayscale'].value = 0;
composer.addPass(filmPass);

// display the session id
//document.addEventListener('DOMContentLoaded', () => {
    const sessionDisplay = document.getElementById('sessionDisplay');

    // Function to generate a unique 8-character identifier
    function generateShortUUID() {
        return 'xxxxxxxx'.replace(/[x]/g, function() {
            const r = Math.random() * 36 | 0;
            return r.toString(36);
        });
    }

//});

function linspace(xMin, xMax, n) {
    const step = (xMax - xMin) / (n - 1);
    return Array.from({ length: n }, (v, i) => xMin + i * step);
}

// NOTE coeffs must be in increasing powers of x
function getFromPolynomial(coeffs, range, n) {
    function f(x) {
        let out = 0;
        for (let i = 0; i<coeffs.length; i++) {
            out = out + (x**i)*coeffs[i]
        }
        return out
    }

    let x_vals = linspace(-10, 10, n); // 10 can be modified
    let y_vals = [];
    for (let x of x_vals) {
        y_vals.push(f(x))
    }

    let y_max = Math.max(...y_vals)
    let y_min = Math.min(...y_vals)

    let y_rescaled = y_vals.map(y => (y - y_min) / (y_max - y_min) * (range[1] - range[0]) + range[0]);
    return y_rescaled
}

// function to generate random gaussians
function getRandomGaussian(mean = 0, standardDeviation = 1) {
    let u1 = Math.random();
    let u2 = Math.random();
    let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * standardDeviation + mean;
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// function to take a screenshot
function takeScreenshot() {
    renderer.render(scene, camera); // might be better to call animate
    const imgData = renderer.domElement.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${numbers[0]}_folder/${numbers[1]}_image.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    document.dispatchEvent(new CustomEvent('screenshotSaved')); // Promise resolution
}

function extractNumbers(input) {
    // Regular expression to match the numbers after the semicolon
    const regex = /:\s*(-?\d+(\.\d+)?)/g;
    let match;
    const numbers = [];
  
    // Iterate over all matches
    while ((match = regex.exec(input)) !== null) {
      numbers.push(parseFloat(match[1])); // Convert matched string to float
    }
  
    return numbers[0];
  }

function getKeyByValue(obj, value) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === value) {
            return key;
        }
    }
    return null; // Return null if the value is not found
}

// function to set a random expression
//allowedIndices, allowedRanges, morphTargetKeys, morphTargetDictionary, meshes
function generateFacialExpression(indices, ranges, dict, meshes) {
    let coords = [];

    for (let i = 0; i < indices.length; i++) {
        let index = indices[i];
        let key = getKeyByValue(dict, index);

        let amount = getRandomNumber(ranges[i][0], ranges[i][1]);
        for (let mesh of meshes) {
            setMorphTargetInfluence(mesh, key, amount);
        }
        
        let coord = getMorphTargetInfluence(meshes[0], key);
        coord = extractNumbers(coord);
        coords.push(coord);
    }
    console.log('Set morph targets to new values.');
    return coords;
}

// function to alter morph target influences
function setMorphTargetInfluence(mesh, morphTargetName, value) {
    const morphTargetDictionary = mesh.morphTargetDictionary;
    const morphTargetInfluences = mesh.morphTargetInfluences;

    const index = morphTargetDictionary[morphTargetName];
    if (index !== undefined) {
        morphTargetInfluences[index] = value; // PROBLEMATIC LINE
    } else {
        console.error(`Morph target ${morphTargetName} not found`);
    }
}

function getMorphTargetInfluence(mesh, morphTargetName) {
    const morphTargetDictionary = mesh.morphTargetDictionary;
    const morphTargetInfluences = mesh.morphTargetInfluences;

    const index = morphTargetDictionary[morphTargetName];
    if (index !== undefined) {
        return `${morphTargetName}: ${morphTargetInfluences[index]}`;
    } else {
        console.error(`Morph target ${morphTargetName} not found`);
        return null;
    }
}

function setFacialExpression(indices, dict, meshes, coordinates) {
    let coords = [];

    for (let j = 0; j < indices.length; j++) {
        let index = indices[j];
        let key = getKeyByValue(dict, index);
        let new_value = coordinates[j];

        for (let mesh of meshes) {
            setMorphTargetInfluence(mesh, key, new_value);
        }

        let coord = getMorphTargetInfluence(meshes[0], key);
        coord = extractNumbers(coord);
        coords.push(coord);
    }
    console.log('Set morph targets to new values');
    return coords;
}

function generateRandomCoefficients(max) {
    const coeffs = [];
    for (let i = 0; i < max; i++) {
        const randomCoeff = (Math.random() * 10) - 5;
        coeffs.push(randomCoeff);
    }
    return coeffs;
}

function transposeArray(array) {
    // Get the number of rows and columns
    const numRows = array.length;
    const numCols = array[0].length;

    // Initialize a new array with swapped dimensions
    const transposedArray = Array.from({ length: numCols }, () => Array(numRows).fill(0));

    // Fill the transposed array with swapped values
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            transposedArray[j][i] = array[i][j];
        }
    }
    return transposedArray;
}

//function to save the coordinates to a file
function saveCoords(coords) {
    let jsonCoords = JSON.stringify(coords);
    let blob = new Blob([jsonCoords], { type: 'text/plain' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${numbers[0]}_folder/${numbers[1]}_coordinates.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getRandomBoolean() {
    return Math.random() >= 0.5;
  }

// add event listener to take screenshots

// 2. Load the GLB Model
const loader = new GLTFLoader();
// Assuming loader.load() has already been called
const modelGlb = 'dd1_dots.glb';

loader.load(modelGlb, function (gltf) {

    const object = gltf.scene;
    meshes = object.children[0].children
    const mesh = meshes[0];

    const morphTargetDictionary = mesh.morphTargetDictionary;
    const morphTargetInfluences = mesh.morphTargetInfluences;
    const morphTargetKeys = Object.keys(morphTargetDictionary);

    //const allowedIndices = [263, 279, 285]; // original 3

    const allowedIndices = [263, 279, 285, 280, 291];
    // 263 - mouth open
    // 279 - mouth open and thin
    // 285 - kiss
    // 280 - lips pursed
    // 291 - side grin


    // 280, 282, 291
    // 283 -> tongue

    let allowedRanges = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

    let inputCoords = [0, 0, 0, 0, 0];
    let coord_count = 0;

    let faceCoords = []

    for (let idx = 0; idx < allowedIndices.length; idx++) {
        let coeffs = generateRandomCoefficients(polyOrder);
        faceCoords.push(getFromPolynomial(coeffs, allowedRanges[idx], seqLength));
    }
    faceCoords = transposeArray(faceCoords)
    
    // Add controls

        
    animate();

    scene.add(object);


    // Compute the bounding box after adding the model to the scene
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());

    // Move the camera to focus on the center of the bounding box
    camera.position.x = center.x;
    camera.position.y = center.y;
    // Adjust the Z position based on the size of the model for a good view distance
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));

    // Perhaps a bit far back
    camera.position.z = 30; // Adjust the 1.5 as needed

    // Update the camera's matrices
    camera.updateProjectionMatrix();

    // Point the camera to the center of the model
    camera.lookAt(center);

    // Update controls to rotate around the center of the model
    controls.target.set(center.x, center.y, center.z);
    controls.update();

    if (ddbModel == 'new') {
        camera.position.z = 0.38;
        camera.position.y = 0.16;
    } else if (ddbModel == 'old') {
        camera.position.z = 32;
        camera.position.y = 148;
    } else if (ddbModel == 'dots') {
        camera.position.z = positionZ;
        camera.position.y = positionY;
        camera.position.x = positionX;
        scene.rotation.x = rotationX;
    }

    const sliders = ['slider1', 'slider2', 'slider3', 'slider4', 'slider5'];
    sliders.forEach((sliderId, index) => {
        const slider = document.getElementById(sliderId);
        const sliderValue = document.getElementById(`${sliderId}Value`);
        slider.value = inputCoords[index];
        sliderValue.textContent = slider.value;
        slider.addEventListener('input', (event) => {
            inputCoords[index] = parseFloat(event.target.value);
            sliderValue.textContent = event.target.value;
            setFacialExpression(allowedIndices, morphTargetDictionary, meshes, inputCoords);
            //animate();
        });
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        inputCoords.fill(0);
        sliders.forEach((sliderId, index) => {
            const slider = document.getElementById(sliderId);
            const sliderValue = document.getElementById(`${sliderId}Value`);
            slider.value = 0;
            sliderValue.textContent = 0;
        });
        setFacialExpression(allowedIndices, morphTargetDictionary, meshes, inputCoords);
        //animate();
    });


    function downloadCoords() {
        takeScreenshot();
        let coords = [];

        for (let j = 0; j < allowedIndices.length; j++) {
            let index = allowedIndices[j];
            let key = getKeyByValue(morphTargetDictionary, index);
    
            let coord = getMorphTargetInfluence(meshes[0], key);
            coord = extractNumbers(coord);
            coords.push(coord);
        }
        console.log(coords);

        let jsonCoords = JSON.stringify(coords);
        let blob = new Blob([jsonCoords], { type: 'text/plain' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${numbers[0]}_folder/${numbers[1]}_coordinates.txt`;
    
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    document.getElementById('saveCoordinates').addEventListener('click', downloadCoords);

    

}, undefined, function (error) {
    console.error(error);
});

// 3. Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// REMOVE THESE HARDCODED VALUES TO MOVE THE SHAPE AROUND

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
