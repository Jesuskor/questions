import{d,N as s,_ as f,$ as m,a0 as y}from"./runtime-dom.esm-bundler.Cf2R47Zf.js";const S=()=>{},A=d({props:{value:String,name:String,hydrate:{type:Boolean,default:!0}},setup({name:n,value:t,hydrate:r}){if(!t)return()=>null;let a=r?"astro-slot":"astro-static-slot";return()=>s(a,{name:n,innerHTML:t})}}),h=n=>async(t,r,a,{client:i})=>{if(!n.hasAttribute("ssr"))return;const l=t.name?`${t.name} Host`:void 0,o={};for(const[e,p]of Object.entries(a))o[e]=()=>s(A,{value:p,name:e==="default"?void 0:e});const u=i!=="only",c=(u?f:m)({name:l,render(){let e=s(t,r,o);return b(t.setup)&&(e=s(y,null,e)),e}});await S(),c.mount(n,u),n.addEventListener("astro:unmount",()=>c.unmount(),{once:!0})};function b(n){const t=n?.constructor;return t&&t.name==="AsyncFunction"}export{h as default};
