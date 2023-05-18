const workerFile = () => {
  const now = Date.now;

  function print(text) {
    postMessage({ type: "stdout", data: text });
  }

  onmessage = function (event) {
    const message = event.data;

    if (message.type === "load") {
      console.log("LOAD");
      importScripts(message.ffmpegPath);
      postMessage({ type: "ready" });
    } else if (message.type === "command") {
      const Module = {
        arguments: message.arguments || [],
        files: message.files || [],
        print: print,
        printErr: print,
        TOTAL_MEMORY: message.totalMemory || 33554432,
      };

      postMessage({
        data: Module.arguments.join(" "),
        type: "start",
      });
      postMessage({
        data: `Received command: ${Module.arguments.join(" ")}${
          Module.TOTAL_MEMORY
            ? `.  Processing with ${Module.TOTAL_MEMORY} bits.`
            : ""
        }`,
        type: "stdout",
      });

      const time = now();
      const result = ffmpeg_run(Module);
      const totalTime = now() - time;

      postMessage({
        data: "Finished processing (took " + totalTime + "ms)",
        type: "stdout",
      });
      postMessage({
        data: result,
        time: totalTime,
        type: "done",
      });
    }
  };
};

export default workerFile;
