import vm2 = require("vm2");
import future from "fp-future";
import type { ScriptingTransport } from "decentraland-rpc/lib/common/json-rpc/types";
import fetch from 'node-fetch'
import ws from 'ws'

// @ts-ingnore
const shell = require("raw-loader!./artifacts/cli.scene.system.js");

export async function runIvm(source: string, filename: string, transport: ScriptingTransport) {
  const vm = new vm2.VM({ eval: true });

  const codeDidRun = future<void>();

  vm.setGlobal("runCode", async function (_ignoredSource: string) {
    try {
      console.log("> server run: " + filename);
      vm.run(source, "file://" + filename);
      codeDidRun.resolve();
    } catch (e) {
      console.error("Error running " + filename);
      codeDidRun.reject(e);
    }
  });

  vm.setGlobal("postMessage", function (message: string) {
    transport.sendMessage(message);
  });

  vm.setGlobal("__env__error", function (error: Error) {
    console.error(error);
  });

  vm.setGlobal("__env__log", function (...args: any[]) {
    console.log(...args);
  });

  vm.run(
    `
    let __messageEventListeners = []
    let __errorEventListeners = []
    let __onUpdateFunctions = []

    global.__env__onTick = function(handler) {
      __onUpdateFunctions.push(handler)
    }

    global.__tick = function(dt) {
      for (let handle of __onUpdateFunctions) {
        handle(dt)
      }
    }

    global.self = global;

    global.onmessage = null;
    global.onerror = null;

    global.__handleMessage = function(event) {
      if (global.onmessage) {
        global.onmessage(event)
      }
      for (let handle of __messageEventListeners) {
        handle(event)
      }
    }

    global.__handleError = function(event) {
      if (global.onerror) {
        global.onerror(event)
      }
      for (let handle of __errorEventListeners) {
        handle(event)
      }
    }

    global.addEventListener = function(event, handler) {
      if (event == 'message'){
        __messageEventListeners.push(handler)
      } else if (event == 'error'){
        __errorEventListeners.push(handler)
      } else {
        throw new Error('Event type "' + event + '" is not supported')
      }
    }
`,
    "file://env.js"
  );

  vm.setGlobal("setTimeout", (callback: any, delay: number, ...args: any[]) => {
    return setTimeout(callback(...args), delay);
  });

  vm.setGlobal("fetch", (url: string, opts: any) => {
    return fetch(url, opts);
  });

  const location = {
    "href": "http://127.0.0.1:8000/",
    "ancestorOrigins": {},
    "origin": "http://127.0.0.1:8000",
    "protocol": "http:",
    "host": "127.0.0.1:8000",
    "hostname": "127.0.0.1",
    "port": "8000",
    "pathname": "/",
    "search": "",
    "hash": ""
  }

  vm.setGlobal("location", location);

  vm.setGlobal("WebSocket", ws);

  vm.setGlobal("btoa", (txt: string) => Buffer.from(txt, 'binary').toString('base64'));
  vm.setGlobal("atob", (txt: string) => Buffer.from(txt, 'base64').toString('binary'));

  transport.onMessage((data) => {
    try {
      vm.getGlobal("__handleMessage")({ data });
    } catch (e) {
      console.error("onMessage error", e);
    }
  });

  if (transport.onError) {
    transport.onError((e) => {
      console.error("error", e);
      transport.onMessage((data) => vm.getGlobal("__handleError")({ data }));
    });
  }

  if (transport.onConnect) {
    transport.onConnect(() => {
      console.log("Transport connected");
    });
  }

  vm.run(shell, "shell.js");

  codeDidRun.then(() => {
    let start = Date.now();

    setInterval(() => {
      const x = Date.now();
      const dt = x - start;
      start = x;

      let time = dt / 1000;

      vm.getGlobal("__tick")(time);
    }, 1000 / 30);
  });

  return [codeDidRun];
}