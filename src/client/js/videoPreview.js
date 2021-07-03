const videoGrid = document.getElementById("videoGrid");
const videos = videoGrid.querySelectorAll("video");

const handlePreviewEnd = (event) => {
  const video = event.target;
  video.pause();
  video.currentTime = 0;
  video.removeEventListener("mouseout", handlePreviewEnd);
  video.addEventListener("mouseover", handlePreview);
};

const handlePreview = (event) => {
  const video = event.target;
  video.muted = true;
  video.play();
  video.removeEventListener("mouseover", handlePreview);
  video.addEventListener("mouseout", handlePreviewEnd);
};

for (let video of videos) {
  video.addEventListener("mouseover", handlePreview);
}
