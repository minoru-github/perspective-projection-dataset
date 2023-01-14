import * as THREE from 'three';
import { Scene } from 'three';
import { intersectedObject } from '../annotation/box-3d';
import { ArcballControls } from "three/examples/jsm/controls/ArcballControls"
import { sceneXyz } from '../xyz-space';

const canvas = document.getElementById("sideCameraCanvas") as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#sideCameraCanvas') as HTMLCanvasElement
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.width, canvas.height);

const sideCamera = new THREE.OrthographicCamera(-canvas.width / 20, canvas.width / 20, canvas.height / 20, -canvas.height / 20, -7.5, 7.5);
sideCamera.position.set(1, 0, 0);
sideCamera.lookAt(new THREE.Vector3(0, 0, 0));
sideCamera.zoom = 2.5;
sideCamera.updateProjectionMatrix();

const controls = new ArcballControls(sideCamera, renderer.domElement, sceneXyz);
controls.enableRotate = false;
controls.enablePan = false;
controls.update();

export function tickSideCamera(scene: Scene) {
    if (intersectedObject != undefined) {
        sideCamera.position.set(intersectedObject.position.x-1, intersectedObject.position.y, intersectedObject.position.z);
        sideCamera.lookAt(intersectedObject.position);
    }
    renderer.render(scene, sideCamera);
}