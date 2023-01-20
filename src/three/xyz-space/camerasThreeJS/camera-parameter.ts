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
    constructor(tx_mm:number, ty_mm:number, tz_mm:number) {
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