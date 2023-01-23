import * as THREE from "three";
import { Float32BufferAttribute } from "three";
import { addPointsToImage } from "../../rgb-image/rgb-image";
import { addPointsToXyzSpace } from "../xyz-space";

class Depth {
    data: Array<File>;
    sensor_position = {
        "x_m": 0.0,
        "y_m": 0.0,
        "z_m": 0.0
    };
    constructor() {
        this.data = new Array<File>();
    }

    addData(file: File) {
        return new Promise<File>((resolve) => {
            this.data.push(file);
            resolve(file);
        })
    }

    setCalib(file: File) {
        return new Promise<File>((resolve) => {
            const promise = file.text();
            promise.then((jsonString: string) => {
                const json = JSON.parse(jsonString);
                this.sensor_position.x_m = json.sensor_position.x_m;
                this.sensor_position.y_m = json.sensor_position.y_m;
                this.sensor_position.z_m = json.sensor_position.z_m;
                resolve(file);
            });
        })
    }

    draw() {
        console.assert(this.data.length > 0, "depth sensor : data length is 0");

        const promise = this.loadPcd(this.data[0]);
        promise.then((pcdFiles: string) => {
            const { xyzVec, rgbVec } = this.extractData(pcdFiles);

            this.addPcdToXyzSpace(xyzVec, rgbVec);
            this.addPcdToImage(xyzVec);
        });
    }

    loadPcd(file: File) {
        return file.text();
    }

    addPcdToXyzSpace(xyzVec: number[], rgbVec: number[]) {
        const points = this.addPcdToPoints(xyzVec, rgbVec);
        addPointsToXyzSpace(points);
    }

    addPcdToImage(xyzVec: number[]) {
        const points = new Array<THREE.Vector3>;
        const length = xyzVec.length / 3;
        for (var i = 0; i < length; i++) {
            const point = new THREE.Vector3(xyzVec[3 * i + 0], xyzVec[3 * i + 1], xyzVec[3 * i + 2]);
            points.push(point);
        }
        addPointsToImage(points);
    }

    addPcdToPoints = (xyzVec: number[], rgbVec: number[]) => {
        const createPoints = () => {
            const geometry = new THREE.BufferGeometry();
            geometry.name = "pcd";
            const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, color: 0xffffff });
            const points = new THREE.Points(geometry, material);
            return points;
        }

        const points = createPoints();
        if (xyzVec.length > 0 && rgbVec.length > 0) {
            points.geometry.setAttribute("position", new Float32BufferAttribute(xyzVec, 3));
            points.geometry.setAttribute("color", new Float32BufferAttribute(rgbVec, 3));
        } else {
            alert("data is empty");
        }
        return points;
    }

    extractData = (pcdFile: string) => {
        const headerOfPoints = "POINTS ";
        const beginOfPoints = pcdFile.indexOf(headerOfPoints) + headerOfPoints.length;
        //pcdFile.match(/POINTS (.*)/);
        // ()で囲まれたところを抽出してくれる
        const matchResultOfPoints = pcdFile.match(/POINTS (.*)/);
        let points = 0;
        if (matchResultOfPoints != null) {
            points = parseInt(matchResultOfPoints[1]);
        }

        // とりあえずascii固定
        const headerOfData = "DATA ascii";
        let lineFeedCode;
        if (pcdFile.match(headerOfData + "\r\n")) {
            lineFeedCode = "\r\n";
        } else if (pcdFile.match(headerOfData + "\n")) {
            lineFeedCode = "\n";
        } else {
            console.assert("改行コードが異常");
        }

        const xyzVec = [];
        const rgbVec = [];

        const matchResultOfData = pcdFile.match(/DATA ascii(\n|\r\n)/);
        let beginOfData;
        let dataHeaderLength;
        if (matchResultOfData != null) {
            const dataHeader = matchResultOfData[0];
            dataHeaderLength = dataHeader.length;
            beginOfData = pcdFile.search(/DATA ascii(\n|\r\n)/) + dataHeaderLength;
        }
        const dataVec = pcdFile.slice(beginOfData).split(/\n|\r\n/);

        for (let cnt = 0; cnt < points; cnt++) {
            const data = dataVec[cnt].split(" ");
            const x_m = parseFloat(data[1]) + this.sensor_position.x_m;
            const y_m = parseFloat(data[2]) + this.sensor_position.y_m;
            const z_m = parseFloat(data[0]) + this.sensor_position.z_m;
            xyzVec.push(x_m);
            xyzVec.push(y_m);
            xyzVec.push(z_m);

            const r = 1.0;
            const g = 0.5;
            const b = 0.0;

            rgbVec.push(r);
            rgbVec.push(g);
            rgbVec.push(b);
        }

        return { xyzVec, rgbVec };
    }

    toDepthSensorCoord(inX_m: number, inY_m: number, inZ_m: number) {
        //  測距センサーから路面におろしたところを本ツールの原点(ステカメの場合は真ん中)とする。座標系はthree.jsに従う。
        const x_m = inX_m - this.sensor_position.x_m;
        const y_m = inY_m - this.sensor_position.y_m;
        const z_m = inZ_m - this.sensor_position.z_m;
        return { x_m, y_m, z_m };
    }
}

export const depth = new Depth();
