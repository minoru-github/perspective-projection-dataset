import { computeDot } from "../math/matrix";

class IntrinsicParameter {
    fx_pix: number;
    fy_pix: number;
    cx_pix: number;
    cy_pix: number;
    constructor(fx_pix: number, fy_pix: number, cx_pix: number, cy_pix: number) {
        this.fx_pix = fx_pix;
        this.fy_pix = fy_pix;
        this.cx_pix = cx_pix;
        this.cy_pix = cy_pix;
    }

    get_matrix() {
        return [
            [this.fx_pix, 0.0, this.cx_pix],
            [0.0, this.fy_pix, this.cy_pix],
            [0.0, 0.0, 1.0],
        ]
    }
}

class ExtrinsicParameter {
    r: number[][];
    tx_mm: number;
    ty_mm: number;
    tz_mm: number;
    constructor(tx_mm: number, ty_mm: number, tz_mm: number) {
        this.r = [
            [1.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.0],
        ];
        this.tx_mm = tx_mm;
        this.ty_mm = ty_mm;
        this.tz_mm = tz_mm;
    }

    get_matrix() {
        return [
            [this.r[0][0], this.r[0][1], this.r[0][2], this.tx_mm],
            [this.r[1][0], this.r[1][1], this.r[1][2], this.ty_mm],
            [this.r[2][0], this.r[2][1], this.r[2][2], this.tz_mm],
        ]
    }
}

export class CameraParameter {
    mat3x4: number[][] = [];
    pos = {
        x_m: 0.0,
        y_m: 0.0,
        z_m: 0.0,
    };
    fov = {
        x_deg: 0.0,
        y_deg: 0.0,
        x_rad: 0.0,
        y_rad: 0.0,
    }
    intrinsic: IntrinsicParameter | null = null;
    extrinsic: ExtrinsicParameter | null = null;
    constructor() {

    }

    async parse(file: File) {
        const jsonString = await file.text();
        const json = JSON.parse(jsonString);
        this.pos.x_m = json.SensorPosition.x_m;
        this.pos.y_m = json.SensorPosition.y_m;
        this.pos.z_m = json.SensorPosition.z_m;
        this.fov.x_deg = json.FieldOfView.fovx_deg;
        this.fov.y_deg = json.FieldOfView.fovx_deg * (json.Size.height_pix / json.Size.width_pix);
        this.fov.x_rad = this.fov.x_deg * Math.PI / 180;
        this.fov.y_rad = this.fov.y_deg * Math.PI / 180;
        this.intrinsic = new IntrinsicParameter(
            json.FocalLength.fx_pix,
            json.FocalLength.fy_pix,
            json.OpticalCenter.cx_pix,
            json.OpticalCenter.cy_pix
        );
        // TODO 仮
        this.extrinsic = new ExtrinsicParameter(
            json.SensorPosition.x_m,
            json.SensorPosition.y_m,
            json.SensorPosition.z_m
        );
        this.mat3x4 = this.computeProjectMatrix();
        return await Promise.resolve();
    }

    computeProjectMatrix = () => {
        let mat3x4: number[][] = [
            [0.0, 0.0, 0.0, 0.0,],
            [0.0, 0.0, 0.0, 0.0,],
            [0.0, 0.0, 0.0, 0.0,],
        ];

        if (this.intrinsic == null || this.extrinsic == null) {
            console.assert("intrinsic or extrinsic camera parameter is null");
            return mat3x4;
        }

        mat3x4 = computeDot(
            this.intrinsic.get_matrix(),
            this.extrinsic.get_matrix()
        );

        return mat3x4;
    };

    getProjectionMatrix() {
        return this.mat3x4;
    }
}