const navSearch = document.getElementById("navSearch");
const form = navSearch.querySelector("form");
const select = navSearch.querySelector("select");

console.log(select);
const handleFormaction = (event) => {
  const value = select.value;
  if (value === "video") {
    form.action = "/videos/search";
  } else if (value === "photo") {
    form.action = "/photos/search";
  } else {
    alert("choose media");
  }
};

select.addEventListener("change", handleFormaction);
