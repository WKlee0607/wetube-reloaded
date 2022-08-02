const { async } = require("regenerator-runtime");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const addCommentBtn = form.querySelector("button");
const removeBtns = document.querySelectorAll(".removeBtn");

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
        const { newCommentId } = await response.json(); // 백엔드로부터 보내온 걸 쓸려면 이렇게 const data = await response.json()을 해야 쓸 수 있음.
        addComment(text, newCommentId);
    }
};

const handleRemoveComment = async (event) => {
    //const videoId = videoContainer.dataset.videoid
    const child = event.target.parentElement;
    const commentid = child.dataset.id;
    const response = await fetch(`/api/comment/${commentid}/remove`, {
        method : "DELETE",
    });
    if(response.status === 200){
        child.remove();
    };
};

const handleKeyPress = (event) => {
    if(event.keyCode === 13){
        addCommentBtn.click();
    }
};

if(form){
    form.addEventListener("submit", handleSubmit);
} // form이 로그인 한 상태에서만 보이기 떄문임.

Array.from(removeBtns).forEach(btn => btn.addEventListener("click", handleRemoveComment)); // rmvBtn이 여러개니까 queryselectAll로 다 선언하고,(이 선언된 것의 type은 object이므로 이를 array로 바꾸고) 이 array를 forEach를 통해 각각의 btn에다가 이벤트 리스너 부여함.

window.addEventListener("keyup", handleKeyPress);