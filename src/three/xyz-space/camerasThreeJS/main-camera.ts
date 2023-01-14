import * as THREE from 'three';
import { Scene } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { DragControls } from "three/examples/jsm/controls/DragControls"

import { searchBoxAtCursor, annotatedBoxes, intersectedObject } from '../annotation/box-3d';
import { sceneXyz } from '../xyz-space';

const canvas = document.getElementById("mainCameraCanvas") as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#mainCameraCanvas') as HTMLCanvasElement
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.width, canvas.height);

const mainCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 10000);
mainCamera.position.set(0, 15, -20);

const controls = new OrbitControls(mainCamera, canvas);
controls.maxPolarAngle = Math.PI / 2;

const dragControls = new DragControls(annotatedBoxes, mainCamera, renderer.domElement);

// add event listener to highlight dragged objects
let enableSelection = false;
dragControls.addEventListener('onKeyDown', function (event) {
    enableSelection = true;
});
dragControls.addEventListener('onKeyUp', function (event) {
    enableSelection = false;
});
dragControls.addEventListener('onClick', function (event: THREE.Event) {
    event.preventDefault();
    if (enableSelection) {
        const draggableObjects = dragControls.getObjects();
        draggableObjects.length = 0;
        if (intersectedObject != undefined) {
            sceneXyz.attach(intersectedObject);
        }
    }
});

export function tickMainCamera(scene: Scene) {
    searchBoxAtCursor(scene, mainCamera);

    if (intersectedObject != undefined) {
        controls.enablePan = false;
        controls.enableRotate = false;
        controls.enableZoom = false;
    } else {
        controls.enablePan = true;
        controls.enableRotate = true;
        controls.enableZoom = true;
    }
    controls.update();
    renderer.render(scene, mainCamera);
}