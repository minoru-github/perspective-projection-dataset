import { depth } from "../xyz-space/depth/depth";
import { image } from "../rgb-image/rgb-image";
import { DepthSensorParameter } from "../xyz-space/depth/depth-sensor-parameter";
import { CameraParameter } from "../rgb-image/camera-parameter";

export async function onChangeInputFiles(event: any) {
    let files = event.target.files as FileList;

    let depthSensorParam: DepthSensorParameter = new DepthSensorParameter();
    let cameraParam: CameraParameter = new CameraParameter();

    let promises: Array<Promise<any>> = [];

    for (let index = 0; index < files.length; index++) {
        const file = files[index];

        if (file.name.match(/\.pcd/)) {
            promises.push(depth.parse(file));
        } else if (file.name.match(/\.(png|bmp|jpg)/)) {
            promises.push(image.parseToPath(file));
        } else if (file.name.match(/\.json/) && file.name.match(/depth/)) {
            promises.push(depthSensorParam.parse(file));
        } else if (file.name.match(/\.json/) && file.name.match(/image/)) {
            promises.push(cameraParam.parse(file));
        } else {
            // README.md等描画に関係ないファイル読み込んだとき用
            console.assert(); ("Unexpexted filename extention.");
        }
    }

    await Promise.all(promises);

    image.setCalib(cameraParam);
    await image.draw();
    await depth.draw();

    const points = depth.getPoints();
    image.addPointsToImage(points);
}
