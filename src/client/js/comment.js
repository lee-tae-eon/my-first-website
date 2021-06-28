const { default: fetch } = require("node-fetch");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const commentLists = document.getElementById("commentList");
const deleteBtns = commentLists.querySelectorAll("button");

const addComment = (text, newCommentId) => {
  const writeDate = new Date().toLocaleString("ko-KR");

  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = newCommentId;
  newComment.className = "video__comment";

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

  videoComments.prepend(newComment);

  button.addEventListener("click", handleCommentDelete);
};

const handleCommentSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  textarea.value = "";
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleCommentDelete = async (event) => {
  console.log(event);
  if (confirm("Are you sure???") === true) {
    const comment = event.target.parentNode.parentNode;
    const commentId = comment.dataset.id;
    const response = await fetch(`/api/comments/${commentId}/comment`, {
      method: "DELETE",
    });
    if (response.status === 200) {
      comment.remove();
    }
  } else {
    return;
  }
};

if (form) {
  form.addEventListener("submit", handleCommentSubmit);
}

for (const delBtn of deleteBtns) {
  delBtn.addEventListener("click", handleCommentDelete);
}
