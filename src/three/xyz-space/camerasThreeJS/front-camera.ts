import * as THREE from 'three';
import { Scene } from 'three';
import { intersectedObject } from '../annotation/box-3d';
import { ArcballControls } from "three/examples/jsm/controls/ArcballControls"
import { sceneXyz } from '../xyz-space';

const canvas = document.getElementById("frontCameraCanvas") as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#frontCameraCanvas') as HTMLCanvasElement
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.width, canvas.height);

const frontCamera = new THREE.OrthographicCamera(-canvas.width / 20, canvas.width / 20, canvas.height / 20, -canvas.height / 20, -7.5, 7.5);
frontCamera.position.set(0, 0, -1);
frontCamera.lookAt(new THREE.Vector3(0, 0, 0));
frontCamera.zoom = 2.5;
frontCamera.updateProjectionMatrix();

const controls = new ArcballControls(frontCamera, renderer.domElement, sceneXyz);
controls.enableRotate = false;
controls.enablePan = false;
controls.update();

export function tickFrontCamera(scene: Scene) {
    if (intersectedObject != undefined) {
        frontCamera.position.set(intersectedObject.position.x, intersectedObject.position.y, intersectedObject.position.z-1);
        frontCamera.lookAt(intersectedObject.position);
    }
    renderer.render(scene, frontCamera);
}
