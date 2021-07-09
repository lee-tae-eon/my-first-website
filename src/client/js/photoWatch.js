const photoBox = document.getElementById("photoBox");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const photoList = document.querySelectorAll(".photo--lists");

console.log(photoList);
if (photoList.length <= 1) {
  leftBtn.remove();
  rightBtn.remove();
}
let photoLists = [...photoList];

let currentImage = photoLists[0];

console.log(currentImage);

const handleImageScroll = (event) => {
  console.log(event);
  for (let i = 0; i < photoLists.length; i++) {
    currentImage = photoLists[i];
    console.log(currentImage);
  }
};

rightBtn.addEventListener("click", handleImageScroll);
