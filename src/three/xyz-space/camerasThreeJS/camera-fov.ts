import * as THREE from "three";
import { sceneXyz } from "../xyz-space";

export function drawCameraFov(camera_pos: { x_m: number, y_m: number, z_m: number }, fov: { x_rad: number, y_rad: number }) {
    addCameraMeshToScene(camera_pos);
    drawImageArea(camera_pos, fov);
}

function addCameraMeshToScene(camera_pos: { x_m: number, y_m: number, z_m: number }) {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    const box = new THREE.Mesh(geometry, material);
    box.name = "cameraThreeJS";
    box.position.set(camera_pos.x_m, camera_pos.y_m, camera_pos.z_m);
    sceneXyz.add(box);
}

function drawImageArea(camera_pos: { x_m: number, y_m: number, z_m: number }, fov: { x_rad: number, y_rad: number }) {
    const distance_m = 10;
    const width_m = distance_m * Math.tan(fov.x_rad / 2);
    const height_m = distance_m * Math.tan(fov.y_rad / 2);

    const left = camera_pos.x_m + width_m;
    const right = camera_pos.x_m - width_m;
    const down = camera_pos.y_m - height_m;
    const up = camera_pos.y_m + height_m;
    const leftdown = new THREE.Vector3(left, down, camera_pos.z_m + distance_m);
    const leftUp = new THREE.Vector3(left, up, camera_pos.z_m + distance_m);
    const rightdown = new THREE.Vector3(right, down, camera_pos.z_m + distance_m);
    const rightUp = new THREE.Vector3(right, up, camera_pos.z_m + distance_m);
    const cameraPos = new THREE.Vector3(camera_pos.x_m, camera_pos.y_m, camera_pos.z_m);

    const points = [];
    points.push(leftdown);
    points.push(leftUp);
    points.push(rightUp);
    points.push(rightdown);

    points.push(cameraPos);
    points.push(leftdown);
    points.push(cameraPos);
    points.push(leftUp);
    points.push(cameraPos);
    points.push(rightUp);
    points.push(cameraPos);
    points.push(rightdown);
    points.push(leftdown);

    const material = new THREE.LineBasicMaterial({ color: 0xFF00FF });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.name = "line";
    const line = new THREE.Line(geometry, material);
    sceneXyz.add(line);
}
