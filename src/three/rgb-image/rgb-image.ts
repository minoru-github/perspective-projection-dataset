import { drawCameraFov } from "../xyz-space/camerasThreeJS/camera-fov";
import { depth } from "../xyz-space/depth/depth";
import { IntrinsicParameter, ExtrinsicParameter, CameraParameter } from "./camera-parameter";

class RgbImage {
    data: File[] = new Array();
    camera_param: CameraParameter | null = null;

    frames: number = 0;
    constructor() {
        this.data = new Array<File>();
    }

    addData(file: File) {
        return new Promise<File>((resolve) => {
            this.data.push(file);
            this.frames += 1;
            resolve(file);
        })
    }

    setCalib(camera_param: CameraParameter) {
        this.camera_param = camera_param;
    }

    draw(frame: number) {
        if (this.frames < frame || this.data.length == 0) {
            console.assert("invalid data");
        }
        return drawRgbImages(this.data[frame]);
    }

    totalFrames() {
        return this.frames;
    }

    projectToImage(x_m: number, y_m: number, z_m: number) {
        function computeDot(mat_a: number[][], mat_b: number[][]) {
            const mat_a_col_size = mat_a.length;
            const mat_b_row_size = mat_b[0].length;

            const mat_out: number[][] = [];
            for (var i = 0; i < mat_a_col_size; i++) {
                mat_out[i] = [];
                for (var j = 0; j < mat_b_row_size; j++) {
                    mat_out[i][j] = 0;
                }
            }

            for (var i = 0; i < mat_a_col_size; i++) {
                for (var j = 0; j < mat_b_row_size; j++) {
                    for (var k = 0; k < mat_a_col_size; k++) {
                        mat_out[i][j] += mat_a[i][k] * mat_b[k][j];
                    }
                }
            }

            return mat_out;
        }

        const computeProjectMatrix = () => {
            const mat3x4: number[][] = [
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
            let in_mat = this.camera_param.intrinsic.get_matrix();
            let ex_mat = this.camera_param.extrinsic.get_matrix();

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 4; j++) {
                    for (var k = 0; k < 3; k++) {
                        mat3x4[i][j] += in_mat[i][k] * ex_mat[k][j];
                    }
                }
            }

            let mat = computeDot(in_mat, ex_mat);
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 4; j++) {
                    console.assert(mat3x4[i][j] == mat[i][j], "i:", i, "j:", j, mat3x4[i][j], mat[i][j]);
                }
            }

            //mat3x4[0][0] = in_mat[0][0] * ex_mat[0][0] + in_mat[0][1] * ex_mat[1][0] + in_mat[0][2] * ex_mat[2][0];
            //mat3x4[0][1] = in_mat[0][0] * ex_mat[0][1] + in_mat[0][1] * ex_mat[1][1] + in_mat[0][2] * ex_mat[2][1];
            //mat3x4[0][2] = in_mat[0][0] * ex_mat[0][2] + in_mat[0][1] * ex_mat[1][2] + in_mat[0][2] * ex_mat[2][2];
            //mat3x4[0][3] = in_mat[0][0] * ex_mat[0][3] + in_mat[0][1] * ex_mat[1][3] + in_mat[0][2] * ex_mat[2][3];

            // mat3x4[1][0] = in_mat[1][0] * ex_mat[1][0] + in_mat[1][1] * ex_mat[1][0] + in_mat[1][2] * ex_mat[2][0];
            // mat3x4[1][1] = in_mat[1][0] * ex_mat[1][1] + in_mat[1][1] * ex_mat[1][1] + in_mat[1][2] * ex_mat[2][1];
            // mat3x4[1][2] = in_mat[1][0] * ex_mat[1][2] + in_mat[1][1] * ex_mat[1][2] + in_mat[1][2] * ex_mat[2][2];
            // mat3x4[1][3] = in_mat[1][0] * ex_mat[1][3] + in_mat[1][1] * ex_mat[1][3] + in_mat[1][2] * ex_mat[2][3];

            // mat3x4[2][0] = in_mat[2][0] * ex_mat[1][0] + in_mat[2][1] * ex_mat[1][0] + in_mat[2][2] * ex_mat[2][0];
            // mat3x4[2][1] = in_mat[2][0] * ex_mat[1][1] + in_mat[2][1] * ex_mat[1][1] + in_mat[2][2] * ex_mat[2][1];
            // mat3x4[2][2] = in_mat[2][0] * ex_mat[1][2] + in_mat[2][1] * ex_mat[1][2] + in_mat[2][2] * ex_mat[2][2];
            // mat3x4[2][3] = in_mat[2][0] * ex_mat[1][3] + in_mat[2][1] * ex_mat[1][3] + in_mat[2][2] * ex_mat[2][3];

            return mat3x4;
        }

        const projectFromXYZ = (inX_m: number, inY_m: number, inZ_m: number) => {
            const mat3x4 = computeProjectMatrix();
            // three.jsとcamera座標系のxyが逆なので符号反転
            const { x_pix, y_pix } = dot(-1 * inX_m, -1 * inY_m, inZ_m, mat3x4);

            return { x_pix, y_pix };
        }

        const dot = (x_m: number, y_m: number, z_m: number, mat3x4: number[][]) => {
            const mat3x1_0 = mat3x4[0][0] * x_m + mat3x4[0][1] * y_m + mat3x4[0][2] * z_m + mat3x4[0][3];
            const mat3x1_1 = mat3x4[1][0] * x_m + mat3x4[1][1] * y_m + mat3x4[1][2] * z_m + mat3x4[1][3];
            const mat3x1_2 = mat3x4[2][0] * x_m + mat3x4[2][1] * y_m + mat3x4[2][2] * z_m + mat3x4[2][3];
            const x_pix = mat3x1_0 / mat3x1_2;
            const y_pix = mat3x1_1 / mat3x1_2;

            return { x_pix, y_pix };
        }

        // lidar
        const { x_pix, y_pix } = projectFromXYZ(x_m, y_m, z_m);
        return { x_pix, y_pix };
    }
}

function drawRgbImages(file: File) {
    const result = file.name.match(/image/);
    if (result == null) {
        console.assert('failed at drawRgbImages');
    }

    return new Promise<void>((resolve) => {
        if (image.camera_param != null) {
            drawCameraFov(image.camera_param.pos, image.camera_param.fov);
        }

        const promise = createDataURL(file);
        promise.then((path: string) => {
            resolve(setImageToCanvas(path));
        })
    })

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