import * as ffmpegWebWorker from "./modules/ffmpeg-webworker.js";

console.log(`ffmpegWebWorker:`, ffmpegWebWorker);

const workerClient = new ffmpegWebWorker.FFMPEGWebworkerClient(
  "https://unpkg.com/videoconverter@0.1.0/build/ffmpeg-all-codecs.js"
);
console.log(`workerClient:`, workerClient);

workerClient.on("onReady", () => {
  console.log("workerClient onReady");
});

workerClient.on("onStdout", (msg) => {
  console.log(msg);
});
