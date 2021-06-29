const videoGrid = document.getElementById("videoGrid");
const videos = videoGrid.querySelectorAll(".thumb__video");

const handlePreview = (event) => {
  const video = event.target;
  video.autoplay = true;
  video.onplay = true;
};

const handlePreviewEnd = () => {};

for (const video of videos) {
  video.addEventListener("mousemove", handlePreview);
  video.addEventListener("mouseleave", handlePreviewEnd);
}
