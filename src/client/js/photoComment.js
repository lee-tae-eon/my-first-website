const { default: fetch } = require("node-fetch");

const photoContainer = document.getElementById("photoContainer");
const photoForm = document.getElementById("photoCommentForm");
const photoTextarea = photoForm.querySelector("textarea");
const photoSubmitBtn = photoForm.querySelector("button");
const photoCommentLists = document.getElementById("photoCommentList");
const photoCommentDel = photoCommentLists.querySelectorAll("button");

const addComment = (text, photoCommentId) => {
  const writeDate = new Date().toLocaleString("ko-KR");

  const photoComment = document.querySelector(".photo__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = photoCommentId;
  newComment.className = "photo__comment";

  const contentDiv = document.createElement("div");
  contentDiv.className = "comment__content";
  const textDiv = document.createElement("div");
  textDiv.className = "comment__text";

  const deleteDiv = document.createElement("div");
  deleteDiv.className = "comment__delete";

  const commentIcon = document.createElement("i");
  commentIcon.className = "fas fa-comment";
  const textSpan = document.createElement("span");
  textSpan.innerText = ` ${text}`;
  textDiv.appendChild(commentIcon);
  textDiv.appendChild(textSpan);

  const dateSpan = document.createElement("span");
  dateSpan.className = "comment__date";
  dateSpan.innerText = `${writeDate}`;
  const button = document.createElement("button");
  button.innerText = "🗑";

  contentDiv.appendChild(textDiv);
  contentDiv.appendChild(dateSpan);

  deleteDiv.appendChild(button);

  newComment.appendChild(contentDiv);
  newComment.appendChild(deleteDiv);

  photoComment.prepend(newComment);

  button.addEventListener("click", handleCommentDelete);
};

const handleCommentSubmit = async (event) => {
  event.preventDefault();
  const text = photoTextarea.value;
  const photoId = photoContainer.dataset.id;

  if (text.trim() === "") {
    return;
  }
  const response = await fetch(`/api/photos/${photoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  photoTextarea.value = "";
  if (response.status === 201) {
    const { photoCommentId } = await response.json();
    addComment(text, photoCommentId);
  }
};

const handleEnterKey = (event) => {
  if (event.key === "Enter") {
    if (!event.shiftKey) {
      photoSubmitBtn.click();
    }
  } else {
    return;
  }
};
const handleCommentDelete = async (event) => {
  if (confirm("Are you sure???") === true) {
    const comment = event.target.parentNode.parentNode;
    const commentId = comment.dataset.id;
    const response = await fetch(`/api/comments/${commentId}/delete`, {
      method: "DELETE",
    });
    if (response.status === 200) {
      comment.remove();
    }
  } else {
    return;
  }
};

if (photoForm) {
  photoForm.addEventListener("submit", handleCommentSubmit);
  photoTextarea.addEventListener("keypress", handleEnterKey);
}

for (const delBtn of photoCommentDel) {
  delBtn.addEventListener("click", handleCommentDelete);
}
