import "./managers/camera-manager.js"

class GraphicsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async initialize(step, context, process, item) {
        const canvas = await crs.dom.get_element(step, context, process, item);
        const camera = await crs.process.getValue(step.args.camera)

        const engine = new BABYLON.Engine(canvas);
        const scene  = new BABYLON.Scene(engine);

        canvas.__layers = [];
        canvas.__layers.push(scene);
        canvas.__engine = engine;

        await crs.call("gfx_camera", "initialize", { element: canvas, type: camera });

        canvas.__renderLoop = renderLoop.bind(canvas);
        canvas.__engine.runRenderLoop(canvas.__renderLoop);
    }

    static async dispose(step, context, process, item) {
        const canvas = await crs.dom.get_element(step, context, process, item);

        canvas.__engine.stopRenderLoop(canvas.__renderLoop);
        canvas.__renderLoop = null;

        for (const scene of canvas.__layers) {
            scene.dispose();
        }

        canvas.__engine.dispose();
        canvas.__engine = null;
        canvas.__layers = null;
    }
}

function renderLoop() {
    for (const scene of this.__layers) {
        scene.render();
    }
}

crs.intent.gfx = GraphicsActions;