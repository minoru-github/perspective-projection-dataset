import * as THREE from "three";
import { Float32BufferAttribute } from "three";
import { addPointsToXyzSpace } from "../xyz-space";

class Depth {
    xyzVec1D: number[] = [];
    rgbVec1D: number[] = [];
    points = new Array<THREE.Vector3>;

    sensor_position = {
        "x_m": 0.0,
        "y_m": 0.0,
        "z_m": 0.0
    };
    constructor() {

    }

    async parse(file: File) {
        const data = await file.text();
        const { xyzVec1D, rgbVec1D } = this.extractData(data);
        this.xyzVec1D = xyzVec1D;
        this.rgbVec1D = rgbVec1D;
        const length = xyzVec1D.length / 3;
        for (var i = 0; i < length; i++) {
            const point = new THREE.Vector3(xyzVec1D[3 * i + 0], xyzVec1D[3 * i + 1], xyzVec1D[3 * i + 2]);
            this.points.push(point);
        }
        return await Promise.resolve();
    }

    setCalib() {
        // TODO
    }

    draw() {
        this.addPcdToXyzSpace()
        return Promise.resolve();
    }

    addPcdToXyzSpace() {
        this.generateTHREEPoints().then((threePoints: THREE.Points) => {
            addPointsToXyzSpace(threePoints);
        })
    }

    generateTHREEPoints = () => {
        const geometry = new THREE.BufferGeometry();
        geometry.name = "pcd";
        const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, color: 0xffffff });
        const threePoints = new THREE.Points(geometry, material);

        if (this.xyzVec1D.length > 0 && this.rgbVec1D.length > 0) {
            threePoints.geometry.setAttribute("position", new Float32BufferAttribute(this.xyzVec1D, 3));
            threePoints.geometry.setAttribute("color", new Float32BufferAttribute(this.rgbVec1D, 3));
        } else {
            alert("data is empty");
        }

        return Promise.resolve(threePoints);
    }

    extractData = (data: string) => {
        const headerOfPoints = "POINTS ";
        const beginOfPoints = data.indexOf(headerOfPoints) + headerOfPoints.length;
        //pcdFile.match(/POINTS (.*)/);
        // ()で囲まれたところを抽出してくれる
        const matchResultOfPoints = data.match(/POINTS (.*)/);
        let points = 0;
        if (matchResultOfPoints != null) {
            points = parseInt(matchResultOfPoints[1]);
        }

        // とりあえずascii固定
        const headerOfData = "DATA ascii";
        let lineFeedCode;
        if (data.match(headerOfData + "\r\n")) {
            lineFeedCode = "\r\n";
        } else if (data.match(headerOfData + "\n")) {
            lineFeedCode = "\n";
        } else {
            console.assert("改行コードが異常");
        }

        const xyzVec1D = [];
        const rgbVec1D = [];

        const matchResultOfData = data.match(/DATA ascii(\n|\r\n)/);
        let beginOfData;
        let dataHeaderLength;
        if (matchResultOfData != null) {
            const dataHeader = matchResultOfData[0];
            dataHeaderLength = dataHeader.length;
            beginOfData = data.search(/DATA ascii(\n|\r\n)/) + dataHeaderLength;
        }
        const dataVec = data.slice(beginOfData).split(/\n|\r\n/);

        for (let cnt = 0; cnt < points; cnt++) {
            const data = dataVec[cnt].split(" ");
            const x_m = parseFloat(data[1]) + this.sensor_position.x_m;
            const y_m = parseFloat(data[2]) + this.sensor_position.y_m;
            const z_m = parseFloat(data[0]) + this.sensor_position.z_m;
            xyzVec1D.push(x_m);
            xyzVec1D.push(y_m);
            xyzVec1D.push(z_m);

            const r = 1.0;
            const g = 0.5;
            const b = 0.0;

            rgbVec1D.push(r);
            rgbVec1D.push(g);
            rgbVec1D.push(b);
        }

        return { xyzVec1D, rgbVec1D };
    }

    getPoints() {
        return this.points;
    }
}

export const depth = new Depth();