# Node runtime for decentraland scenes

It is meant to run from a host application like this:

```ts
function setDebugRunner(wss: WebSocket.Server) {
  wss.on("connection", (ws) => {
    if (ws.protocol == "dcl-scene") {
      // dist/index.js
      const file = require.resolve("dcl-node-runtime");

      const fork = childProcess.fork(file, [], {
        // enable two way IPC
        stdio: [0, 1, 2, "ipc"],
        cwd: process.cwd(),
      });

      console.log(`> Creating scene fork #` + fork.pid);

      fork.on("close", () => {
        if (ws.readyState == ws.OPEN) {
          ws.close();
        }
      });
      fork.on("message", (message) => {
        if (ws.readyState == ws.OPEN) {
          ws.send(message);
        }
      });
      ws.on("message", (data) => fork.send(data.toString()));
      ws.on("close", () => {
        console.log("> Killing fork #" + fork.pid);
        fork.kill();
      });
    }
  });
}
```
