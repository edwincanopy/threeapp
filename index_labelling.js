import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';

import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/ShaderPass.js';
import { FilmShader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/shaders/FilmShader.js';

// const remoteUrl = "http://34.32.228.101:8080/generate_animation"
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


// ---
const saveFiles = false;
// ---


const images = [];
for (let i = 0; i <= 23; i++) {
    images.push(`graphs/${i}_GRAPH.png`);
}
let currentImageIndex = 0;

const currentImageButton = document.getElementById('currentImageButton');
const prevImageButton = document.getElementById('prevImageButton');
const nextImageButton = document.getElementById('nextImageButton');
const hideImageButton = document.getElementById('hideImageButton');
const imageOverlay = document.getElementById('overlay-image')

function updateImage() {
    const currentImage = images[currentImageIndex];
    document.getElementById('overlay-image').src = currentImage;
    currentImageButton.textContent = `Image: ${currentImage.split('/').pop()}`;
}

nextImageButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateImage();
});

prevImageButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
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

// modify this value for each new set of finetune cordinates
if (!saveFiles) {
    sessionStorage.setItem('count', 1);
}

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
if (saveFiles) {
    sessionStorage.setItem('count', iterCount + 1);
}
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

    // Check if a session ID already exists in sessionStorage
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        // Generate a new session ID if it doesn't exist
        sessionId = generateShortUUID();
        sessionStorage.setItem('sessionId', sessionId);
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
    link.download = `${count}_image(${iterCount}).png`;
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
    link.download = `${count}_coordinates(${iterCount}).txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getRandomBoolean() {
    return Math.random() >= 0.5;
  }

// add event listener to take screenshots
document.getElementById('screenshotButton').addEventListener('click', takeScreenshot);

console.log(sessionId);

// 2. Load the GLB Model
const loader = new GLTFLoader();
// Assuming loader.load() has already been called
let modelGlb;
if (ddbModel == 'new') {
    modelGlb = 'dd1_new.glb'
} else if (ddbModel == 'old') {
    modelGlb = 'dd1_old.glb'
} else if (ddbModel == 'dots') {
    modelGlb = 'dd1_dots.glb'
}

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

    if (saveFiles == true) {
        allowedRanges = [[0, 1.9], [-0.5, 1.2], [-0.5, 1.2], [-0.6, 0.6], [-0.6, 0.6]];
    } else if (saveFiles == false && getFinetuneData == true) {
        let intervalId = setInterval(() => {
            inputCoords = all_coords[coord_count];
            allowedRanges = inputCoords.map(element => [element, element]);
            let coords = generateFacialExpression(allowedIndices, allowedRanges, morphTargetDictionary, meshes);
            console.log(coord_count + 1);
            console.log(coords);
            document.getElementById('screenshotButton').click();
            coord_count ++;
            count ++;


            if (coord_count >= 24) {
                clearInterval(intervalId);
            }
            
        }, 500);
    } else if (saveFiles == false && getFinetuneData == false) {
        allowedRanges = [[0, 3.5], [-0.5, 1.5], [-0.5, 1.5], [-1.0, 1.0], [-1.0, 1.0]];
        allowedRanges = inputCoords.map(element => [element, element]);
    }

    let faceCoords = []

    for (let idx = 0; idx < allowedIndices.length; idx++) {
        let coeffs = generateRandomCoefficients(polyOrder);
        faceCoords.push(getFromPolynomial(coeffs, allowedRanges[idx], seqLength));
    }
    faceCoords = transposeArray(faceCoords)
    
    if (saveFiles == false) {
        let coords = generateFacialExpression(allowedIndices, allowedRanges, morphTargetDictionary, meshes);
        console.log(coords)
    }
    
    // Add controls

        
    animate();

    count = 1;

    const getData = async() => {
        if (count > seqLength) {
            location.reload();
            return;
        }

        let coords = setFacialExpression(allowedIndices, morphTargetDictionary, meshes, faceCoords[count-1]);
        saveCoords(coords);

        await new Promise((resolve) => {
            const handleScreenshot = () => {
                document.removeEventListener('screenshotSaved', handleScreenshot);
                resolve();
            }

            document.addEventListener('screenshotSaved', handleScreenshot);

            setTimeout(() => {
                document.getElementById('screenshotButton').click();
            }, timeoutTime);
        });

        count++;
        getData();
    }

    if (saveFiles) {
        getData();
    }

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
        link.download = `coordinates.txt`;
    
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