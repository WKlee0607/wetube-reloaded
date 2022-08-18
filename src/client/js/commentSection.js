const { async } = require("regenerator-runtime");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const addCommentBtn = form.querySelector("button");
const removeBtns = document.querySelectorAll(".removeBtn");
const editBtns = document.querySelectorAll(".editBtn");

addCommentBtn.disabled = true;

const addComment = async (text, id, user) => {
    const videoComments = document.querySelector(".video__comments ul");

    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";

    const userIcon = document.createElement("div");
    userIcon.className = "userIcon";
    let imgThis;
    if(!user.avatarUrl){
        imgThis = document.createElement("span");
        imgThis.innerText = "😎";
    }
    else{
        imgThis = document.createElement("img");
        if(user.avatarUrl.split("/")[0] === "uploads"){
            imgThis.src = "/" + user.avatarUrl;
        }
        else {
            imgThis.src = user.avatarUrl;
        }

    }
    userIcon.append(imgThis);

    const videoCommentContent = document.createElement("div");
    videoCommentContent.className = "video__comment-content"
    const videoCommentUsername = document.createElement("div");
    videoCommentUsername.className = "video__comment-username";
    const thisUsername = document.createElement("span");
    thisUsername.innerText = user.username
    videoCommentUsername.append(thisUsername);
    videoCommentContent.append(videoCommentUsername);

    const videoCommentText = document.createElement("div");
    videoCommentText.className = "video__comment-text";
    const commentText = document.createElement("span")
    commentText.innerText = `${text}`;
    videoCommentText.append(commentText);

    const videoCommentControls = document.createElement("div");
    videoCommentControls.className = "video__comment-controls";
    const commentLike = document.createElement("span");
    commentLike.className = "comment-like";
    const likeIcon = document.createElement("i");
    likeIcon.className = "far fa-thumbs-up";
    const commentLikeNum = document.createElement("span");
    commentLikeNum.className = "comment-likeNum"
    commentLike.append(likeIcon);
    commentLike.append(commentLikeNum);
    const rmvBtn = document.createElement("span");
    rmvBtn.innerText = " ❌"
    rmvBtn.className = "removeBtn";
    rmvBtn.addEventListener("click", handleRemoveComment);
    const editbtn = document.createElement("span");
    editbtn.innerText = " Edit";
    editbtn.className = "editBtn";
    editbtn.addEventListener("click", showEditComment);
    videoCommentControls.append(commentLike);
    videoCommentControls.append(editbtn);
    videoCommentControls.append(rmvBtn);

    videoCommentContent.append(videoCommentUsername);
    videoCommentContent.append(videoCommentText);
    videoCommentContent.append(videoCommentControls);
    
    newComment.append(userIcon);
    newComment.append(videoCommentContent);

    videoComments.prepend(newComment);
    
    addCommentBtn.disabled = true;
    addCommentBtn.style.backgroundColor = "grey";
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
        const { newCommentId, user} = await response.json(); // 백엔드로부터 보내온 걸 쓸려면 이렇게 const data = await response.json()을 해야 쓸 수 있음.
        addComment(text, newCommentId, user);
    }
};

const handleRemoveComment = async (event) => {
    //const videoId = videoContainer.dataset.videoid
    const child = event.target.parentElement.parentElement.parentElement;
    const commentid = child.dataset.id;
    const response = await fetch(`/api/comment/${commentid}/remove`, {
        method : "DELETE",
    });
    if(response.status === 200){
        child.remove();
    };
};

const handleKeyPress = (event) => {
    const btn = event.target.parentElement.querySelector("button");
    if(!btn){
        return;
    }
    if(event.keyCode === 13){
        btn.click();
    }
};

if(form){
    form.addEventListener("submit", handleSubmit);
} // form이 로그인 한 상태에서만 보이기 떄문임.

if(removeBtns){
    Array.from(removeBtns).forEach(btn => btn.addEventListener("click", handleRemoveComment)); // rmvBtn이 여러개니까 queryselectAll로 다 선언하고,(이 선언된 것의 type은 object이므로 이를 array로 바꾸고) 이 array를 forEach를 통해 각각의 btn에다가 이벤트 리스너 부여함.
}

window.addEventListener("keyup", handleKeyPress);

 // comment edit
 const handleEditSubmit = async (event) => {
    event.preventDefault();
    const li = event.target.parentElement.parentElement.parentElement;
    const commentid = li.dataset.id;
    const span = document.querySelector(".video__comment-text span");
    const input = event.target.querySelector("input");
    const text = input.value.trim();
    if(text === ""){
        return; //사용자가 아무것도 입력하지 않으면 req를 보내지 않음.
    }
    const response =  await fetch(`/api/comment/${commentid}/edit`, {
        method: "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            text,// text(value값)만 보내면 object형태가 아닌 string형식의 text만 보내는 것임.
        })
    });
    if(response.status === 200){
        span.innerText = input.value;
        input.value ="";
        input.focus();
    }
};

const handleExitForm = (event) => {
    const li = event.target.parentElement.parentElement;
    const form = event.target.parentElement;
    form.remove();
};

const showEditComment = (event) => {
    const li = event.target.parentElement;
    const alreadyForm = li.querySelector("form");
    const form = document.createElement("form");
    form.addEventListener("submit", handleEditSubmit); 
    const input = document.createElement("input");
    input.type = "text";
    input.value = li.querySelector("span").innerText;
    const btn = document.createElement("button");
    btn.innerText = "Edit";
    const exit = document.createElement("span");
    exit.className = "far fa-times-circle";
    exit.addEventListener("click", handleExitForm);
    form.appendChild(input);
    form.appendChild(btn);
    form.appendChild(exit);
    li.appendChild(form);
    input.focus();
};

const handleTextAndBtn = (event) => {
    if(!event.target.value){
        addCommentBtn.disabled = true;
        addCommentBtn.style.backgroundColor = "grey";
    }else {
        addCommentBtn.disabled = false;
        addCommentBtn.style.backgroundColor = "#3DA6FF";
    }
}

if(editBtns){
    Array.from(editBtns).forEach((editBtn) => editBtn.addEventListener("click", showEditComment)); 
};


textarea.addEventListener("input", handleTextAndBtn);


    
