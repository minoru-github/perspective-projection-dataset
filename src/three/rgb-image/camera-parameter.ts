export class IntrinsicParameter {
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

export class ExtrinsicParameter {
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
    constructor(file: File) {
        const promise = file.text();
        promise.then((jsonString) => {
            const json = JSON.parse(jsonString);
            this.pos.x_m = json.sensor_position.x_m;
            this.pos.y_m = json.sensor_position.y_m;
            this.pos.z_m = json.sensor_position.z_m;
            this.fov.x_deg = json.field_of_view.fovx_deg;
            this.fov.y_deg = json.field_of_view.fovx_deg * (json.size.height_pix / json.size.width_pix);
            this.fov.x_rad = this.fov.x_deg * Math.PI / 180;
            this.fov.y_rad = this.fov.y_deg * Math.PI / 180;
            this.intrinsic = new IntrinsicParameter(json.focal_length.fx_pix, json.focal_length.fy_pix, json.optical_center.cx_pix, json.optical_center.cy_pix)
            // TODO 仮
            this.extrinsic = new ExtrinsicParameter(0.0, 0.0, 0.0);
        });
    }
}