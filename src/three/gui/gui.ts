import { GUI } from 'lil-gui'

import { box3d } from '../xyz-space/annotation/box-3d';

const gui = new GUI();

export function initGUI() {
    const boxFolder = gui.addFolder("Box");
    boxFolder.add(box3d, "x_m", -50, 50).onChange(function setXyz(value: number) { box3d.center_m.x = value });
    boxFolder.add(box3d, "y_m", -50, 50).onChange(function setXyz(value: number) { box3d.center_m.y = value });
    boxFolder.add(box3d, "z_m", -50, 50).onChange(function setXyz(value: number) { box3d.center_m.z = value });
    boxFolder.add(box3d, "w_m", 0, 10).onChange(function setSize(value: number) { box3d.size_m.x = value });
    boxFolder.add(box3d, "h_m", 0, 10).onChange(function setSize(value: number) { box3d.size_m.y = value });
    boxFolder.add(box3d, "d_m", 0, 10).onChange(function setSize(value: number) { box3d.size_m.z = value });

    boxFolder.add(box3d, "pitch_deg", -180, 180).onChange(function setRotation(degree: number) { box3d.rotation.setPitch(degree) });
    boxFolder.add(box3d, "yaw_deg", -180, 180).onChange(function setRotation(degree: number) { box3d.rotation.setYaw(degree) });
    boxFolder.add(box3d, "roll_deg", -180, 180).onChange(function setRotation(degree: number) { box3d.rotation.setRoll(degree) });

    boxFolder.add(box3d, "set");

    const exampleFolder = gui.addFolder("Example");
    exampleFolder.add(box3d, "set0");
    exampleFolder.add(box3d, "set1");
    exampleFolder.add(box3d, "set2");
    exampleFolder.add(box3d, "set3");
}
