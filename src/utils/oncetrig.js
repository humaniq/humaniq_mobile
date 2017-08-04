let func = null;
let wasCall = false;

const setFunction = (fun) => { func = fun; };
const blockCall = (block) => { wasCall = block; };
const callFunction = () => { if (!wasCall && func) { blockCall(true); func(); } };

export default { setFunction, blockCall, callFunction };
