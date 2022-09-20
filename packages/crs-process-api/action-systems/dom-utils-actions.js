import{callFunctionOnPath as c}from"./action-actions.js";import"./dom-interactive-actions.js";class o{static async perform(t,a,e,r){await this[t.action]?.(t,a,e,r)}static async call_on_element(t,a,e,r){const n=await crs.dom.get_element(t.args.element,a,e,r),s=await c(n,t,a,e,r);return t.args.target!=null&&await crs.process.setValue(t.args.target,s,a,e,r),s}static async get_property(t,a,e,r){const n=await crs.dom.get_element(t,a,e,r),s=await crsbinding.utils.getValueOnPath(n,t.args.property);return t.args.target!=null&&await crs.process.setValue(t.args.target,s,a,e,r),s}static async set_properties(t,a,e,r){const n=await crs.dom.get_element(t,a,e,r),s=await crs.process.getValue(t.args.properties,a,e,r),i=Object.keys(s);for(let l of i)n[l]=await crs.process.getValue(s[l],a,e,r)}static async open_tab(t,a,e,r){let n=await crs.call("string","inflate",{template:t.args.url,parameters:t.args.parameters},a,e,r);window.open(n,"_blank")}static async get_element_bounds(t,a,e,r){const s=(await crs.dom.get_element(t.args.element,a,e,r)).getBoundingClientRect();return t.args.target!=null&&await crs.process.setValue(t.args.target,s,a,e,r),s}}crs.intent.dom_utils=o;export{o as DomUtilsActions};
