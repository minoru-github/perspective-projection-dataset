import * as THREE from "three";
import { depth } from "../xyz-space/depth/depth";
import { image } from "./rgb-image";

//let boxId = 0;
export function addAnnotationBoxToImage(points: THREE.Vector3[]) {
    // TODO: THREE.Vector3()にしてboxIdで管理

    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
    let context = canvas.getContext("2d");
    if (context != null) {
        context.fillStyle = "red";
        context.beginPath();
        context.strokeStyle = "#00FFFF";
        for (let index = 0; index < points.length; index++) {
            const { x_m, y_m, z_m } = depth.toDepthSensorCoord(points[index].x, points[index].y, points[index].z);
            const { x_pix, y_pix } = image.projectToImage(x_m, y_m, z_m);

            if (index == 0) {
                context.moveTo(x_pix, y_pix);
            }
            context.lineTo(x_pix, y_pix);
        }
        context.stroke();
    }
}
