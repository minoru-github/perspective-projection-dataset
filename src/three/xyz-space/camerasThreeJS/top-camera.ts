import * as THREE from 'three';
import { Scene } from 'three';
import { intersectedObject } from '../annotation/box-3d';
import { ArcballControls } from "three/examples/jsm/controls/ArcballControls"
import { sceneXyz } from '../xyz-space';

const canvas = document.getElementById("topCameraCanvas") as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#topCameraCanvas') as HTMLCanvasElement
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.width, canvas.height);

const topCamera = new THREE.OrthographicCamera(-canvas.width / 20, canvas.width / 20, canvas.height / 20, -canvas.height / 20, -1000, 1000);
topCamera.position.set(0, 1, 0);
topCamera.lookAt(new THREE.Vector3(0, 0, 0));
topCamera.zoom = 2.5;
topCamera.updateProjectionMatrix();

const controls = new ArcballControls(topCamera, renderer.domElement, sceneXyz);
controls.enableRotate = false;
controls.enablePan = false;
controls.update();

export function tickTopCamera(scene: Scene) {
    if (intersectedObject != undefined) {
        topCamera.position.set(intersectedObject.position.x, intersectedObject.position.y + 1.0, intersectedObject.position.z);
        topCamera.lookAt(intersectedObject.position);
    }
    renderer.render(scene, topCamera);
}