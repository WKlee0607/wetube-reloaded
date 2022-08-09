const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;

let videoPlayStatus = false;
let setVideoPlayStatus = false;

let changeVolume = 0.5;
let volumeValue = 0.5;
video.volume = volumeValue;


const handlePlayClick = (e) => {
    if(video.paused){
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
    changeVolume = volumeValue;
    video.volume = volumeValue;
};

const handleVolumeInput = (event) => {
    const {target : {value} } = event;
    if(video.muted){
        video.muted = false; 
        muteBtnIcon.classList = "fas fa-volume-up";
    } 
    volumeValue = value;
    video.volume = value;
    if(value === "0"){
        video.muted = true;
        muteBtnIcon.classList = "fas fa-volume-mute";
        volumeValue = changeVolume;
    }
};

const handleVolumeChange = (event) => {
    const {target : {value} } = event;
    changeVolume = value;
};

const formatTime = (seconds) => {
    if(seconds < 3600){
        return new Date(seconds * 1000).toISOString().substring(14,19);
    } 
    return new Date(seconds * 1000).toISOString().substring(11,19);
}

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);// 비디오의 현재 진행시간을 타임라인에 나타내줌.
    if(Number(timeline.value) === Math.floor(video.duration)){
        playBtnIcon.classList ="fas fa-play";
    }
};

const handleTimelineChange = (event) => {
    const {target: { value },} = event;
    if (!setVideoPlayStatus) {
    videoPlayStatus = video.paused ? false : true;
    setVideoPlayStatus = true;
    }
    video.pause();
    video.currentTime = value;
};

const handleTimelineSet = () => {
    videoPlayStatus ? video.play() : video.pause();
    setVideoPlayStatus = false;
    };

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;//현재 fullscreen인 개체 보여줌.
    if(fullscreen){
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    } else{
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
};

const hideControls = () => videoControls.classList.remove("showing");

const handelMouseMove = () => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout);//이러면 timeout이 취소될 것임.
        controlsTimeout = null;
    }
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 2000);
};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 2000); //2초 뒤에 컨트롤러 사라짐. / Timeout의 id=39임. 즉, return값이 39라는 뜻임.
    //console.log(controlsTimeout);
};

const handleSpacePress = (event) => {
    if(event.code === "Space") {
        handlePlayClick();
    }
};

const handleEnded = () => {
    const { videoid } = videoContainer.dataset;
    fetch(`/api/videos/${videoid}/view`, {
        method:"POST",
    }); 
};

const focus = (event) => {
    const eventTarget = event.target;
    if(eventTarget === video){
        window.addEventListener("keyup", handleSpacePress);
    } else{
        window.removeEventListener("keyup", handleSpacePress);
    }
    
}

playBtn.addEventListener("click", handlePlayClick);
video.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeInput);
volumeRange.addEventListener("change", handleVolumeChange);
video.addEventListener("canplay", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
timeline.addEventListener("change", handleTimelineSet);
fullScreenBtn.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("mousemove", handelMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
window.addEventListener("pointerdown", focus);
