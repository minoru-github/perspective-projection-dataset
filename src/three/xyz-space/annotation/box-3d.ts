import * as THREE from "three";
import { image } from "../../rgb-image/rgb-image";

import { sceneXyz } from "../xyz-space";

import { text } from "../../../html/element";
import { Camera, Scene } from "three";

function setBox() {
    // TODO: 右手座標系から左手座標系に変える
    const center_m = box3d.center_m;
    const size_m = box3d.size_m;
    const rotation = box3d.rotation;

    addBoxToGroup(center_m, size_m, rotation);

    const points = createLinePoints(center_m, size_m, rotation);
    image?.addLinesToImage(points);
}

function setBox0() {
    const center_m = new THREE.Vector3(4.65, -0.1, 13.67);
    const size_m = new THREE.Vector3(1.8, 1.9, 4.4);
    const rotation = new Rotation(0.0, 32.0, 0);
    addBoxToGroup(center_m, size_m, rotation);

    const points = createLinePoints(center_m, size_m, rotation);
    image?.addLinesToImage(points);
}

function setBox1() {
    const center_m = new THREE.Vector3(-1.65, 0.0, 5.97);
    const size_m = new THREE.Vector3(0.6, 1.75, 1.6);
    const rotation = new Rotation(0.0, 6.0, 0);
    addBoxToGroup(center_m, size_m, rotation);

    const points = createLinePoints(center_m, size_m, rotation);
    image?.addLinesToImage(points);
}

function setBox2() {
    const center_m = new THREE.Vector3(-6.3, 0.0, 8.7);
    const size_m = new THREE.Vector3(0.6, 1.68, 1.0);
    const rotation = new Rotation(0.0, 35.0, 0);
    addBoxToGroup(center_m, size_m, rotation);

    const points = createLinePoints(center_m, size_m, rotation);
    image?.addLinesToImage(points);
}

function setBox3() {
    const center_m = new THREE.Vector3(4.8, 0.0, 7.44);
    const size_m = new THREE.Vector3(0.3, 1.2, 0.6);
    const rotation = new Rotation(0.0, 0.0, 0);
    addBoxToGroup(center_m, size_m, rotation);
    
    const points = createLinePoints(center_m, size_m, rotation);
    image?.addLinesToImage(points);
}

export const annotatedBoxes = new Array<THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>>;
function addBoxToGroup(center_m: THREE.Vector3, size_m: THREE.Vector3, rotation: Rotation) {
    const geometry = new THREE.BoxGeometry(size_m.x, size_m.y, size_m.z);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff,transparent:true,opacity:0.4 });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(center_m.x, center_m.y + size_m.y / 2, center_m.z);
    box.setRotationFromEuler(rotation.euler);
    box.name = "annotatedBox";
    annotatedBoxes.push(box);

    sceneXyz.add(box);

    function debug() {
        let str = "";
        for (let index = 0; index < annotatedBoxes.length; index++) {
            const annotationBox = annotatedBoxes[index];
            str += annotationBox.name + " : (" + annotationBox.position.x + ", " + annotationBox.position.y + ", " + annotationBox.position.z + ")\n";
            text.value = str;
        }
    }
}

function createLinePoints(center: THREE.Vector3, size: THREE.Vector3, rotation: Rotation) {
    const p0 = new THREE.Vector3(center.x - size.x / 2, center.y, center.z - size.z / 2);
    const p1 = new THREE.Vector3(center.x - size.x / 2, center.y, center.z + size.z / 2);
    const p2 = new THREE.Vector3(center.x + size.x / 2, center.y, center.z + size.z / 2);
    const p3 = new THREE.Vector3(center.x + size.x / 2, center.y, center.z - size.z / 2);

    const p4 = new THREE.Vector3(center.x - size.x / 2, center.y + size.y, center.z - size.z / 2);
    const p5 = new THREE.Vector3(center.x - size.x / 2, center.y + size.y, center.z + size.z / 2);
    const p6 = new THREE.Vector3(center.x + size.x / 2, center.y + size.y, center.z + size.z / 2);
    const p7 = new THREE.Vector3(center.x + size.x / 2, center.y + size.y, center.z - size.z / 2);

    const vertexVec = new Array<THREE.Vector3>;
    vertexVec.push(p0);
    vertexVec.push(p1);
    vertexVec.push(p2);
    vertexVec.push(p3);
    vertexVec.push(p4);
    vertexVec.push(p5);
    vertexVec.push(p6);
    vertexVec.push(p7);

    for (let index = 0; index < vertexVec.length; index++) {
        const vertex = vertexVec[index];
        vertex.sub(center);
        vertex.applyEuler(rotation.euler);
        vertex.add(center);
    }

    const linePoints = new Array<THREE.Vector3>;
    linePoints.push(vertexVec[0]);
    linePoints.push(vertexVec[1]);
    linePoints.push(vertexVec[2]);
    linePoints.push(vertexVec[3]);
    linePoints.push(vertexVec[0]);

    linePoints.push(vertexVec[4]);
    linePoints.push(vertexVec[5]);
    linePoints.push(vertexVec[6]);
    linePoints.push(vertexVec[7]);
    linePoints.push(vertexVec[4]);

    linePoints.push(vertexVec[5]);
    linePoints.push(vertexVec[1]);
    linePoints.push(vertexVec[2]);
    linePoints.push(vertexVec[6]);
    linePoints.push(vertexVec[7]);
    linePoints.push(vertexVec[3]);

    return linePoints;
}

class Rotation {
    readonly pitch: { deg: number, rad: number };
    readonly yaw: { deg: number, rad: number };
    readonly roll: { deg: number, rad: number };
    readonly euler: THREE.Euler;

    private toRad(deg: number) {
        return deg * Math.PI / 180.0;
    };

    constructor(pitch_deg: number, yaw_deg: number, roll_deg: number) {
        this.pitch = { deg: pitch_deg, rad: this.toRad(pitch_deg) };
        this.yaw = { deg: yaw_deg, rad: this.toRad(yaw_deg) };
        this.roll = { deg: roll_deg, rad: this.toRad(roll_deg) };
        this.euler = new THREE.Euler(this.toRad(pitch_deg), this.toRad(yaw_deg), this.toRad(roll_deg), 'XYZ');
    }

    setPitch(degree: number) {
        this.pitch.deg = degree;
        this.pitch.rad = this.toRad(degree);
        this.euler.x = this.toRad(degree);
    }

    setYaw(degree: number) {
        this.yaw.deg = degree;
        this.yaw.rad = this.toRad(degree);
        this.euler.y = this.toRad(degree);
    }

    setRoll(degree: number) {
        this.roll.deg = degree;
        this.roll.rad = this.toRad(degree);
        this.euler.z = this.toRad(degree);
    }
}

export const box3d = {
    x_m: 0,
    y_m: -1,
    z_m: 4,
    center_m: new THREE.Vector3(0, -1, 5),
    w_m: 2.0,
    h_m: 2.0,
    d_m: 2.0,
    size_m: new THREE.Vector3(2, 2, 2),
    pitch_deg: 0.0,
    yaw_deg: 0.0,
    roll_deg: 0.0,
    rotation: new Rotation(0.0, 0.0, 0.0),
    set: function () { setBox() },
    set0: function () { setBox0() },
    set1: function () { setBox1() },
    set2: function () { setBox2() },
    set3: function () { setBox3() },
}

// TODO: クリックでアノテボックス配置
document.addEventListener('mousedown', addAnnotationBox, false);
function addAnnotationBox(event: MouseEvent) {
    // X座標
    let x = event.offsetX;
    let y = event.offsetY;
    // console.log("(w,h) = (%d, %d)", canvas.width, canvas.height);
    // console.log("offset (x,y) = (%d, %d)", event.offsetX, event.offsetY);
    // console.log("client (x,y) = (%d, %d)", event.clientX, event.clientY);
    // console.log(event);
}

const mainCameraCanvas = document.getElementById("mainCameraCanvas") as HTMLCanvasElement;
mainCameraCanvas.addEventListener('mousemove', handleMouseMove);
mainCameraCanvas.addEventListener('mousedown', handleMouseDown);

const mouse = new THREE.Vector2();
function handleMouseMove(event: any) {
    const element = event.currentTarget;
    // canvas要素上のXY座標
    const x_pix = event.offsetX;
    const y_pix = event.offsetY;
    // canvas要素の幅・高さ
    const width_pix = element.offsetWidth;
    const height_pix = element.offsetHeight;

    // -1〜+1の範囲で現在のマウス座標を登録する
    mouse.x = (x_pix / width_pix) * 2 - 1;
    mouse.y = 1 - (y_pix / height_pix) * 2;
}

export let intersectedObject: THREE.Object3D<THREE.Event> | undefined = undefined;
function handleMouseDown(event: any) {
    annotatedBoxes.forEach(box => {
        if (intersectedObject != undefined && box.id == intersectedObject.id) {
            box.material.opacity = 0.6;
            console.log(intersectedObject.position);
        } else {
            box.material.opacity = 0.4;
        }
    });
}

const raycaster = new THREE.Raycaster();
export const searchBoxAtCursor = (scene:Scene, camera:Camera) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    intersectedObject = undefined;
    for (let index = 0; index < intersects.length; index++) {
        const id = intersects[index].object.id;
        const intersect = scene.getObjectById(id);
        if (intersect?.name == "annotatedBox") {
            intersectedObject = intersect;
            break;
        }
    }
}
