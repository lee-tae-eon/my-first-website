import regeneratorRuntime from "regenerator-runtime";
const videoContainer = document.getElementById("videoContainer");
const clickBox = document.getElementById("clickBox");
const thumbsUp = document.getElementById("thumbsUp");

const thumbCounting = (ratingCount) => {
  const thumbCount = clickBox.querySelector("span");
  thumbCount.innerText = `좋아요 ${ratingCount}개`;
};

const handleThumbs = async () => {
  const { id } = videoContainer.dataset;
  const response = await fetch(`/api/videos/${id}/rating`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 201) {
    const { ratingCount } = await response.json();

    thumbCounting(ratingCount);
  }
};

thumbsUp.addEventListener("click", handleThumbs);
