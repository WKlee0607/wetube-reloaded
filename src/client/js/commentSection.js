const { async } = require("regenerator-runtime");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const addCommentBtn = form.querySelector("button");
const removeBtn = document.querySelector(".removeBtn");



const addComment = async (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i")
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const rmvBtn = document.createElement("span");
    rmvBtn.innerText = " ❌"
    rmvBtn.className = "removeBtn";
    rmvBtn.addEventListener("click", handleRemoveComment);
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(rmvBtn);
    videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.videoid
    if(text === ""){
        return; //사용자가 아무것도 입력하지 않으면 req를 보내지 않음.
    }
    const response =  await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            text,// text(value값)만 보내면 object형태가 아닌 string형식의 text만 보내는 것임.
        })
    });
    if(response.status === 201){
        textarea.value ="";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }
};

const handleRemoveComment = async (event) => {
    const videoId = videoContainer.dataset.videoid
    const child = event.target.parentElement;
    const commentid = child.dataset.id;
    const response = await fetch(`/api/videos/${videoId}/commentRemove`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({commentid}),
    });
    child.remove();
};

const handleKeyPress = (event) => {
    if(event.keyCode === 13){
        addCommentBtn.click();
    }
};

if(form){
    form.addEventListener("submit", handleSubmit);
} // form이 로그인 한 상태에서만 보이기 떄문임.
if(removeBtn){
    removeBtn.addEventListener("click", handleRemoveComment);
}
window.addEventListener("keyup", handleKeyPress);