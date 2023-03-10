import { CameraParameter } from "./camera-parameter";
import { computeDot } from "../math/matrix";
import { drawCameraFov } from "../xyz-space/camerasThreeJS/camera-fov";

class RgbImage {
    path: string = "";
    camera_param: CameraParameter | null = null;

    constructor() {

    }

    async parseToPath(file: File) {
        this.path = await createDataURL(file);
    }

    setCalib(camera_param: CameraParameter) {
        this.camera_param = camera_param;
    }
    
    async draw() {
        if (this.path == "") {
            console.assert("image path is invalid");
            return Promise.reject();
        }
        if (this.camera_param == null) {
            console.assert("camera param is null");
            return Promise.reject();
        }
        
        drawCameraFov(this.camera_param.pos, this.camera_param.fov);
        return await setImageToCanvas(this.path);

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
        const projectFromXYZ = (x_m: number, y_m: number, z_m: number) => {
            if (this.camera_param == null) {
                console.assert("camera param is null");
                const x_pix = 0;
                const y_pix = 0;
                return { x_pix, y_pix };
            }

            const mat3x4 = this.camera_param.getProjectionMatrix();
            // three.js???camera????????????xy???????????????????????????
            // ????????????????????????????????????????????????????????????
            const xyz = [
                [-1 * x_m],
                [-1 * y_m],
                [z_m],
                [1],
            ];

            // xyz??????????????????????????????z'????????????????????????????????????
            const mat3x1 = computeDot(mat3x4, xyz);
            const x_pix = mat3x1[0][0] / mat3x1[2][0];
            const y_pix = mat3x1[1][0] / mat3x1[2][0];

            return { x_pix, y_pix };
        }

        const { x_pix, y_pix } = projectFromXYZ(x_m, y_m, z_m);
        return { x_pix, y_pix };
    }

    addLinesToImage(points: THREE.Vector3[]) {
        const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
        let context = canvas.getContext("2d");
        if (context != null) {
            context.fillStyle = "red";
            context.beginPath();
            context.strokeStyle = "#00FFFF";
            for (let index = 0; index < points.length; index++) {
                const { x_pix, y_pix } = this.projectToImage(points[index].x, points[index].y, points[index].z);

                if (index == 0) {
                    context.moveTo(x_pix, y_pix);
                }
                context.lineTo(x_pix, y_pix);
            }
            context.stroke();
        }
    }

    addPointsToImage(points: THREE.Vector3[]) {
        const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
        let context = canvas.getContext("2d");
        if (context != null) {
            context.fillStyle = "red";
            context.beginPath();
            for (let index = 0; index < points.length; index++) {
                const { x_pix, y_pix } = this.projectToImage(points[index].x, points[index].y, points[index].z);
                context.fillRect(x_pix - 5, y_pix - 5, 10, 10);
            }
        }
    }
}

function createDataURL(file: File) {
    const promise = new Promise<string>((resolve, reject) => {
        //FileReader???????????????????????????
        const reader = new FileReader();
        // onload = ????????????????????????????????????????????????????????????
        reader.onload = (event) => {
            resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    });
    return promise;
}

export const image = new RgbImage();
