const { async } = require("regenerator-runtime");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    const icon = document.createElement("i")
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    newComment.appendChild(icon);
    newComment.appendChild(span);
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
    const status = response.status;
    if(status === 201){
        addComment(text);
    }
    textarea.value ="";
};

if(form){
    form.addEventListener("submit", handleSubmit);
} // form이 로그인 한 상태에서만 보이기 떄문임.
