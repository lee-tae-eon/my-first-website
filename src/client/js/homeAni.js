const section = document.getElementById("chooseSection");
const videoRoute = document.getElementById("homevideoRoute");
const photoRoute = document.getElementById("homephotoRoute");

const handleSelectSection = (event) => {
  console.log(event.target);
  sectionId = event.path[2].id;
  if (sectionId === "homevideoRoute") {
    photoRoute.style.display = "none";
  } else if (sectionId === "homephotoRoute") {
    videoRoute.style.display = "none";
  } else {
    photoRoute.style.display = "unset";
    videoRoute.style.display = "unset";
    // section.removeEventListener("mouseover", handleSelectSection);
  }
};

const handleLeaveSection = (event) => {
  photoRoute.style.display = "unset";
  videoRoute.style.display = "unset";
};

section.addEventListener("mouseover", handleSelectSection);
section.addEventListener("mouseleave", handleLeaveSection);
