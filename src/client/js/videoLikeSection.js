import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const like = document.querySelector(".like");
const likeIcon = like.querySelector("i");


const fakeLikeNum = (likes) => {
    const likeNum = like.querySelector(".likeNum");
    likeNum.remove();
    likeIcon.className = "fas fa-thumbs-up"
    const span = document.createElement("span");
    span.className = "likeNum";
    span.innerText = likes.length;
    like.append(span);
};

const fakeDislikeNum = () => {
    const likeNum = like.querySelector(".likeNum");
    const currentLikeNum = likeNum.innerText;
    likeNum.remove();
    likeIcon.className = "far fa-thumbs-up"
    const span = document.createElement("span");
    span.className = "likeNum";
    span.innerText = currentLikeNum - 1;
    like.append(span);
};


const handleVideoLikeClick = async () => {
    const { videoid } = videoContainer.dataset;
    const response = await fetch(`/api/videos/${videoid}/like`, {
        method:"POST",
    }); 
    if(response.status === 200){
        const {likes}= await response.json();
        return fakeLikeNum(likes);
    };
    if(response.status === 404){
       return window.location.reload();
    };
    if(response.status === 204){
        return fakeDislikeNum();
    };
};

if(like){
    like.addEventListener("click", handleVideoLikeClick);
}

