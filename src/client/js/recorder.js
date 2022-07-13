const startBtn = document.getElementById("startBtn");
const initBtn = document.getElementById("initBtn");
const video = document.getElementById("preview");


let stream;
let recorder;
let videoFile;

const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "MyRecording.webm"; // href(url)을 다운로드 함. => 다운할 때 파일명을 넣어주면 됨.
    document.body.appendChild(a);
    a.click();
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
        track.stop();
    });
    stream = null;
    video.src = null;
    startBtn.innerText = "Start Recording";
    startBtn.removeEventListener("click",handleDownload);
    startBtn.addEventListener("click", handleStart);
    startBtn.classList.add("hidden");
    video.classList.add("hidden");
    initBtn.classList.remove("hidden");
};

const handleStop = () => {
    startBtn.innerText = "Dowload Recording";
    startBtn.removeEventListener("click",handleStop);
    startBtn.addEventListener("click", handleDownload);
    recorder.stop();
};

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    recorder = new window.MediaRecorder(stream);//stream을 record가능한 형태로 만들어줌.
    recorder.ondataavailable = (event) => {// recorder data에 접근함. / event를 감지함. event가 발생하면 다음의 것들이 실행됨. 
        //console.log(event.data);// 녹화된 비디오 파일.
        videoFile = URL.createObjectURL(event.data); // 브라우저 메모리 상에 저장을 해두고, 우리가 그 파일에 접근할 수 있는 URL을 준거.
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    };
    recorder.start();
};

const init = async() => {
    startBtn.classList.remove("hidden");
    video.classList.remove("hidden");
    initBtn.classList.add("hidden");
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    });
    video.srcObject = stream; // video에 stream넣어주기 -> stream이 object라서 video.src가 아니라 video.Object임.
    video.play();
};

initBtn.addEventListener("click", init);
startBtn.addEventListener("click", handleStart);