const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

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
    playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
    changeVolume = volumeValue;
    video.volume = volumeValue;
};

const handleVolumeInput = (event) => {
    const {target : {value} } = event;
    if(video.muted){
        video.muted = false; 
        muteBtn.innerText = "Mute";
    } 
    volumeValue = value;
    video.volume = value;
    if(value === "0"){
        video.muted = true;
        muteBtn.innerText = "Unmute"
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

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeInput);
volumeRange.addEventListener("change", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
timeline.addEventListener("change", handleTimelineSet);

