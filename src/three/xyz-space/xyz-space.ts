import * as THREE from "three";
import { Scene } from "three";

import { tickMainCamera } from "./camerasThreeJS/main-camera";

// シーンを作成
const scene = new THREE.Scene();
export const sceneXyz = scene;

export function addPointsToXyzSpace(points:THREE.Points) {
    scene.add(points);
}

// ヘルパー追加
addHelpers(scene);

// 平行光源
addLight(scene);

export function tick3dSpace() {
    tickMainCamera(scene);
}

function addHelpers(scene: Scene) {
    // グリッド追加
    const gridHelper = new THREE.GridHelper(5, 20);
    scene.add(gridHelper);

    // 座標軸追加 X軸は赤、Y軸は緑色、Z軸は青。
    // TODO: 右手座標系から左手座標系に変える
    const axesHelper = new THREE.AxesHelper(100);
    axesHelper.position.setY(0);
    scene.add(axesHelper);
}

function addLight(scene: Scene) {
    const light = new THREE.DirectionalLight(0xFFFFFF);
    light.intensity = 2; // 光の強さを倍に
    light.position.set(1, 1, 1);
    scene.add(light);
}
