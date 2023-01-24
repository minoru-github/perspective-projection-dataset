export class DepthSensorParameter {
    pos = {
        x_m: 0.0,
        y_m: 0.0,
        z_m: 0.0,
    };
    constructor() {

    }

    async parse(file:File) {
        const jsonString = await file.text();
        const json = await JSON.parse(jsonString);
        this.pos.x_m = json.sensor_position.x_m;
        this.pos.y_m = json.sensor_position.y_m;
        this.pos.z_m = json.sensor_position.z_m;
        return await Promise.resolve();
    }
}