import { drawCameraFov } from "../xyz-space/camerasThreeJS/camera-fov";
import { depth } from "../xyz-space/depth/depth";
import { CameraParameter } from "./camera-parameter";
import { computeDot } from "../math/matrix";

class RgbImage {
    data: File | null = null;
    path: string = "";
    camera_param: CameraParameter | null = null;

    constructor() {

    }

    addData(file: File) {
        return new Promise<File>((resolve) => {
            this.data = file;
            createDataURL(this.data).then((path: string) => {
                this.path = path;
                resolve(file);
            });
        })
    }

    setCalib(camera_param: CameraParameter) {
        this.camera_param = camera_param;
    }

    draw() {
        return setImageToCanvas(this.path);

        function setImageToCanvas(path: string) {
            const image = new Image();
            image.src = path;
            return new Promise<void>((resolve) => {
                image.onload = function () {
                    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
                    let context = canvas.getContext("2d");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    if (context != null) {
                        resolve(context?.drawImage(image, 0, 0));
                    }
                }
            })
        }
    }

    projectToImage(x_m: number, y_m: number, z_m: number) {
        const computeProjectMatrix = () => {
            let mat3x4: number[][] = [
                [0.0, 0.0, 0.0, 0.0,],
                [0.0, 0.0, 0.0, 0.0,],
                [0.0, 0.0, 0.0, 0.0,],
            ];
            if (this.camera_param == null) {
                return mat3x4;
            }
            if (this.camera_param.intrinsic == null || this.camera_param.extrinsic == null) {
                return mat3x4;
            }

            mat3x4 = computeDot(
                this.camera_param.intrinsic.get_matrix(),
                this.camera_param.extrinsic.get_matrix()
            );

            return mat3x4;
        }

        const projectFromXYZ = (x_m: number, y_m: number, z_m: number) => {
            const mat3x4 = computeProjectMatrix();
            // three.jsとcamera座標系のxyが逆なので符号反転
            const xyz = [
                [-1 * x_m],
                [-1 * y_m],
                [z_m],
            ];

            // xyzとの行列積計算して、z'で割って同次座標系にする
            const mat3x1 = computeDot(mat3x4, xyz);
            const x_pix = mat3x1[0][0] / mat3x1[2][0];
            const y_pix = mat3x1[1][0] / mat3x1[2][0];

            return { x_pix, y_pix };
        }

        // lidar
        const { x_pix, y_pix } = projectFromXYZ(x_m, y_m, z_m);
        return { x_pix, y_pix };
    }
}

function createDataURL(file: File) {
    const promise = new Promise<string>((resolve, reject) => {
        //FileReaderオブジェクトの作成
        const reader = new FileReader();
        // onload = 読み込み完了したときに実行されるイベント
        reader.onload = (event) => {
            resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    });
    return promise;
}

export function addLinesToImage(points: THREE.Vector3[]) {
    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
    console.log(canvas);
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

export function addPointsToImage(points: THREE.Vector3[]) {
    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
    console.log(canvas);
    let context = canvas.getContext("2d");
    if (context != null) {
        context.fillStyle = "red";
        context.beginPath();
        for (let index = 0; index < points.length; index++) {
            const { x_m, y_m, z_m } = depth.toDepthSensorCoord(points[index].x, points[index].y, points[index].z);
            const { x_pix, y_pix } = image.projectToImage(x_m, y_m, z_m);
            context.fillRect(x_pix - 5, y_pix - 5, 10, 10);
        }
    }
}

export const image = new RgbImage();