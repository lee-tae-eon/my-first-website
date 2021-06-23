const body = document.querySelector("body");

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let recordedVideo;

const handleDownload = () => {
  const downLink = document.createElement("a");
  downLink.href = recordedVideo;
  downLink.download = "RecordFile.webm";
  body.appendChild(downLink);
  downLink.click();
};

const handleStop = () => {
  startBtn.innerText = "Download recorded video";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

  recorder.ondataavailable = (e) => {
    recordedVideo = URL.createObjectURL(e.data);
    video.srcObject = null;
    video.src = recordedVideo;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 200, height: 100 },
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
