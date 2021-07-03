const burgerMenu = document.getElementById("burgerMenu");
const burgerIcon = document.getElementById("burgerIcon");

const handleBurgerOpen = () => {
  if (burgerMenu.classList.contains("on")) {
    burgerMenu.classList.remove("on");
  } else {
    burgerMenu.classList.add("on");
  }
};

burgerIcon.addEventListener("click", handleBurgerOpen);
