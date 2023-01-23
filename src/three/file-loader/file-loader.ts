import { Depth } from "../xyz-space/depth/depth";
import { RgbImage } from "../rgb-image/rgb-image";
import { DepthSensorParameter } from "../xyz-space/depth/depth-sensor-parameter";
import { CameraParameter } from "../rgb-image/camera-parameter";

export let image: RgbImage | null = null;

export async function onChangeInputFiles(event: any) {
    let files = event.target.files as FileList;

    let depth: Depth | null = null;
    let depthSensorParam: DepthSensorParameter | null = null;
    let cameraParam: CameraParameter | null = null;

    for (let index = 0; index < files.length; index++) {
        const file = files[index];

        if (file.name.match(/\.pcd/)) {
            depth = new Depth(file);
        } else if (file.name.match(/\.(png|bmp|jpg)/)) {
            image = new RgbImage(file);
        } else if (file.name.match(/\.json/) && file.name.match(/depth/)) {
            depthSensorParam = new DepthSensorParameter(file);
        } else if (file.name.match(/\.json/) && file.name.match(/image/)) {
            cameraParam = new CameraParameter(file);
        } else {
            // README.md等描画に関係ないファイル読み込んだとき用
            console.assert(); ("Unexpexted filename extention.");
        }
    }

    Promise.resolve()
        .then(() => {
            if (depth != null && image != null && depthSensorParam != null && cameraParam != null) {
                return Promise.resolve();
            } else {
                return Promise.reject();
            }
        }).then(() => {
            cameraParam?.parse().then(() => {
                if (image != null && cameraParam != null) {
                    image.setCalib(cameraParam);
                    return Promise.resolve();
                }
            })
        }).then(() => {
            depth?.generatePoints().then(() => {
                image?.draw()
                    .then(() => {
                        depth?.draw()
                    })
                    .then(() => {
                        if (depth != null && image != null) {
                            const points = depth.getPoints();
                            image.addPointsToImage(points);
                        }
                    });
            });
        });


    //const promise = image.draw();
    //promise.then(() => { depth.draw() });
}
