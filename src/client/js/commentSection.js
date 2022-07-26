const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");



const handleSubmit = (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.videoid
    fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        body: {// req.body를 만드는 과정
            text,
        }
    })
};

if(form){
    form.addEventListener("submit", handleSubmit);
} // form이 로그인 한 상태에서만 보이기 떄문임.
