import { depth } from "../xyz-space/depth/depth";
import { leftImage, rightImage } from "../rgb-image/rgb-image";

export function onChangeInputFiles(event: any) {
    let files = event.target.files as FileList;

    const results = new Array<Promise<File>>();
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const result = parseFile(file);

        results.push(result);
    }

    function parseFile(file: File) {
        return new Promise<File>((resolve) => {
            if (file.name.match(/\.pcd/)) {
                return resolve(depth.addData(file));
            } else if (file.name.match(/\.(png|bmp|jpg)/)) {
                if (file.name.match(/left_image/)) {
                    return resolve(leftImage.addData(file));
                } else if (file.name.match(/right_image/)) {
                    return resolve(rightImage.addData(file));
                }
            } else if (file.name.match(/\.json/)) {
                if (file.name.match(/depth/)) {
                    return resolve(depth.setCalib(file));
                } else if (file.name.match(/left_image/)) {
                    return resolve(leftImage.setCalib(file));
                } else if (file.name.match(/right_image/)) {
                    return resolve(rightImage.setCalib(file));
                }
            } else {
                // README.md等描画に関係ないファイル読み込んだとき用
                return resolve(file);
            }
        })
    }

    Promise.all(results).then(() => {
        const frame = 0;
        depth.draw(frame);
        leftImage.draw(frame);
        rightImage.draw(frame);
    })

}
