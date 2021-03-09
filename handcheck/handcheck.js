"use strict";

let wasm;
const go = new Go();
const wasmReadyEvent = new Event("wasmReady");
const wasmCallback = function (obj) {
    wasm = obj.instance;
    go.run(wasm);

    // dom is ready... right??
    const resultEl = document.getElementById("result");
    const errorEl = document.getElementById("error");
    document.getElementById("btnCheck").onclick = () => {
        const h = document.getElementById("inpHand").value;
        const split = document.getElementById("chkSplit").checked;
        const memo = document.getElementById("chkMemo").checked;

        optCheck(h, (result, error) => {
            if (error != null) {
                resultEl.textContent = "";
                errorEl.textContent = error;
                console.error(error);
            } else {
                resultEl.textContent = result;
                errorEl.textContent = "";
            }
        }, split, memo);
    };
    document.getElementById("btnCheck").disabled = false;
    errorEl.textContent = "";
    console.log("ready");
};

if ('instantiateStreaming' in WebAssembly) {
    WebAssembly.instantiateStreaming(fetch("handcheck.wasm"), go.importObject).then(wasmCallback)
} else {
    fetch("handcheck.wasm").then(
        resp => resp.arrayBuffer()
    ).then(
        bytes => WebAssembly.instantiate(bytes, go.importObject).then(wasmCallback)
    );
}
