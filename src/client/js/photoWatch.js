const photoBox = document.getElementById("photoBox");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const photoList = document.querySelectorAll(".photo--lists");

if (photoList.length <= 1) {
  rightBtn.remove();
  leftBtn.remove();
}

let currentImage = 1;

const handlerightImage = (e) => {
  if (currentImage === photoList.length) {
    currentImage = 0;
  }
  for (let i = 0; i < photoList.length; i++) {
    photoList[i].style.display = "none";
  }
  photoList[currentImage].style.display = "flex";
  currentImage++;
};

const handleleftImage = () => {
  if (currentImage === 0) {
    currentImage = photoList.length;
  }
  for (let i = 0; i < photoList.length; i++) {
    photoList[i].style.display = "none";
  }
  currentImage--;
  photoList[currentImage].style.display = "flex";
};

rightBtn.addEventListener("click", handlerightImage);
leftBtn.addEventListener("click", handleleftImage);
