import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const like = document.querySelector(".like");
const likeIcon = like.querySelector("i");
const subscriptionBtn = document.querySelector(".owner__subscription button");

//videoLike
const fakeLikeNum = (likes, likeNum) => {
    likeIcon.className = "fas fa-thumbs-up"
    likeNum.innerText = likes.length;
};

const fakeDislikeNum = (likeNum) => {
    const currentLikeNum = likeNum.innerText;
    likeIcon.className = "far fa-thumbs-up";
    likeNum.innerText = currentLikeNum - 1;
};


const handleVideoLikeClick = async () => {
    const { videoid } = videoContainer.dataset;
    const likeNum = like.querySelector(".likeNum");
    const response = await fetch(`/api/videos/${videoid}/like`, {
        method:"POST",
    }); 
    if(response.status === 200){
        const {likes}= await response.json();
        return fakeLikeNum(likes, likeNum);
    };
    if(response.status === 404){
       return window.location.reload();
    };
    if(response.status === 204){
        return fakeDislikeNum(likeNum);
    };
};


//subscription
const handleSubscriptionClick = async (event) => {
    const userId = event.target.parentElement.dataset.userid;
    const btn = event.target;
    const ownerSubscription = event.target.parentElement;
    const response = await fetch(`/api/users/${userId}/subscription`, {
        method:"POST",
    });
    if(response.status === 404){
        return window.location.reload();
    }
    if(response.status === 204){
        btn.className = "owner__subscription-btn"
        btn.innerText = "Subscribe";
        const i = ownerSubscription.querySelector("i")
        i.remove(); 
    }
    if(response.status === 200){
        btn.className = "owner__subscription-after-btn"
        btn.innerText = "Subscribing";
        const i = document.createElement("i");
        i.className = "far fa-bell";
        ownerSubscription.append(i);
    }
};



//eventListener
if(like){
    like.addEventListener("click", handleVideoLikeClick);
}

if(subscriptionBtn){
    subscriptionBtn.addEventListener("click", handleSubscriptionClick);
}



