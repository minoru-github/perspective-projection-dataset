import { depth } from "../xyz-space/depth/depth";
import { image } from "../rgb-image/rgb-image";
import { CameraParameter } from "../rgb-image/camera-parameter";

export function onChangeInputFiles(event: any) {
    let files = event.target.files as FileList;

    const results = new Array<Promise<any>>();
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const result = parseFile(file);

        results.push(result);
    }

    function parseFile(file: File) {
        return new Promise<any>((resolve, reject) => {
            if (file.name.match(/\.pcd/)) {
                return resolve(depth.addData(file));
            } else if (file.name.match(/\.(png|bmp|jpg)/)) {
                return resolve(image.addData(file));
            } else if (file.name.match(/\.json/)) {
                if (file.name.match(/depth/)) {
                    return resolve(depth.setCalib(file));
                } else if (file.name.match(/image/)) {
                    const camera_param = new CameraParameter(file);
                    return resolve(image.setCalib(camera_param));
                }
            } else {
                // README.md等描画に関係ないファイル読み込んだとき用
                return reject("Unexpexted filename extention.");
            }
        })
    }

    Promise.all(results).then(() => {
        const promise = image.draw();
        promise.then(() => { depth.draw() });
    })

}
