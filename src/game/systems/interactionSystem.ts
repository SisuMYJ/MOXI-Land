export const emitIslandEvent = (name:string, detail?:unknown) => window.dispatchEvent(new CustomEvent(name,{detail}));
