import {TIMELINE_SCALE} from "../timeline_scale.js";
import "../../../src/managers/mesh-factory-manager.js";

class HeaderManager {

    #bgMesh;
    #headerMesh;

    dispose() {
        this.#bgMesh?.dispose();
        this.#bgMesh = null;

        this.#headerMesh?.dispose();
        this.#headerMesh = null;
    }

    async render(startDate, endDate, scale, canvas) {
        await this.#observeCamera(canvas)

        scale = scale || TIMELINE_SCALE.MONTH;

        const dayCount = getDaysBetweenDates(startDate, endDate);
        this.#bgMesh = await this.#createBgMesh(canvas, dayCount);
        this.#headerMesh = await this.#createMesh(canvas);

        const bufferMatrices = new Float32Array(16 * dayCount);
        const bufferColors = new Float32Array(4 * dayCount);

        let colors = [];

        const offset = 0.5

        for (let i = 0; i < dayCount; i++) {

            startDate.setUTCDate(startDate.getUTCDate() + 1);

            const x = offset + i;

            const matrix = BABYLON.Matrix.Translation(x, -0.25, 0);

            matrix.copyToArray(bufferMatrices, i * 16);
            const dayNumber = startDate.getUTCDay();

            if (dayNumber % 6 === 0 || dayNumber % 7 === 0) {
                //TODO find better way to add to array
                colors.push(...[0.933, 0.933, 0.933, 1]);
            } else {
                colors.push(...[1, 1, 1, 1]);
            }
        }

        bufferColors.set(colors);
        this.#headerMesh.thinInstanceSetBuffer("matrix", bufferMatrices);
        this.#headerMesh.thinInstanceSetBuffer("color", bufferColors, 4);
    }

    async #observeCamera(canvas) {
        const camera = canvas.__camera;

        // camera.onViewMatrixChangedObservable.add((camera)=> {
        //     for (let i = 0; i < this.count; i++) {
        //         const x = this.offset+i;
        //         const matrix2 = BABYLON.Matrix.Translation(x, -0.25 + camera.position.y, 0)
        //         // this.headerMesh.thinInstanceSetMatrixAt(i, matrix2);
        //     }
        // })
    }

    async #createMesh(canvas) {
        const meshes = await crs.call("gfx_mesh_factory", "create", {
            element: canvas, mesh: {
                id: "timeline_header", type: "plane", options: {
                    width: 0.98, height: 0.48
                }
            }, material: {
                id: "timeline_header", color: canvas._theme.header_bg,
            }, positions: [{x: 0, y: 0, z: 0}]
        })

        return meshes[0];
    }

    async #createBgMesh(canvas, size) {
        const meshes = await crs.call("gfx_mesh_factory", "create", {
            element: canvas, mesh: {
                id: "timeline_header_border", type: "plane", options: {
                    width: size, height: 0.5
                }
            }, material: {
                id: "timeline_header_border", color: canvas._theme.header_border,
            }, positions: [{x: size / 2, y: -0.25, z: 0}]
        })

        return meshes[0];
    }
}

export class HeaderManagerActions {
    static async perform(step, context, process, item) {
        return this[step.action]?.(step, context, process, item);
    }

    static async initialize(step, context, process, item) {
        const canvas = await crs.dom.get_element(step, context, process, item);
        canvas.__headers = new HeaderManager();
    }

    static async dispose(step, context, process, item) {
        const canvas = await crs.dom.get_element(step, context, process, item);
        canvas.__headers = canvas.__headers?.dispose();
    }

    static async render(step, context, process, item) {
        const canvas = await crs.dom.get_element(step, context, process, item);

        const startDate = await crs.process.getValue(step.args.start_date, context, process, item);
        const endDate = await crs.process.getValue(step.args.end_date, context, process, item);
        const scale = await crs.process.getValue(step.args.scale, context, process, item);
        const layer = (await crs.process.getValue(step.args.layer, context, process, item)) || 0;
        const scene = canvas.__layers[layer];

        canvas.__headers.render(startDate, endDate, scale, canvas, scene);
    }
}

function getDaysBetweenDates(firstDate, secondDate) {
    // This function can be removed when Kieran got the timeline manager going
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    return diffDays;
}

crs.intent.gfx_timeline_header = HeaderManagerActions;