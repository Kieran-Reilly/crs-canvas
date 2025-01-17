import "./../../src/managers/grid-manager.js";
import "./../../src/managers/text-manager.js";


export default class Text extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        this.canvas = this.element.querySelector("canvas");

        const ready = async () => {
            this.canvas.removeEventListener("ready", ready);
            this.canvas.__engine.setHardwareScalingLevel(0.5/ window.devicePixelRatio);
            this.canvas.__layers[0].clearColor = new BABYLON.Color3(1, 1, 1);
            //await crs.call("gfx_grid", "add", { element: this.canvas, attributes: [{ fn: "Float", name: "min", value: 0.1 }] });
            await crs.call("gfx_text", "add", { element: this.canvas, text: "Hello World", position: {y: 0.5}, attributes: [
                {
                    fn: "Float",
                    name: "min",
                    value: 0.2
                },
                {
                    fn: "Float",
                    name: "max",
                    value: 0.5
                }
            ]});
            await crs.call("gfx_text", "add", { element: this.canvas, text: "10", position: {x: 0.25, y: 0.05} });
        }

        if (this.canvas.dataset.ready == "true") {
            await ready();
        }
        else {
            this.canvas.addEventListener("ready", ready);
        }
    }

    preLoad() {
        this.setProperty("min", 0.01);
        this.setProperty("max", 1.0);
    }

    async minChanged(newValue) {
        this.canvas?.__layers[0].meshes[0].material.setFloat("min", newValue);
    }

    async maxChanged(newValue) {
        this.canvas?.__layers[0].meshes[0].material.setFloat("max", newValue);
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }
}