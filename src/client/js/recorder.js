import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { async } from "regenerator-runtime";
const startBtn = document.getElementById("startBtn");
const initBtn = document.getElementById("initBtn");
const video = document.getElementById("preview");


let stream;
let recorder;
let videoFile;

const handleDownload = async() => {
    const ffmpeg = createFFmpeg({corePath: "/findFfmpeg/ffmpeg-core.js" ,log: true});
    await ffmpeg.load(); // await사용: 사용자가 ffmpeg소프트웨어(도와주는 도구 같은거임)를 사용할 것이기 때문. 사용자가 JS가 아닌 코드를 사용하는 거임, 무언가를 설치해서. 우리 웹사이트에서 다른 소프트웨어를 사용하는 거임. 소프트웨어가 무거울 수 있기 때문에 기다려야함.

    // 2단계: 비디오 파일 생성 및 mp4로 파일 변환
    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile)); // 파일 생성 -> recording.webm은 생성하는 파일 이름, fetchFile -> 우리가 만든 videoFile(Blob파일에 접근할 수 있는 url로 만든 것임 즉, 이 데이터는 Blob이므로 binary data형식임.) 
    await ffmpeg.run("-i", "recording.webm", "-r", "60", "outputs.mp4");//fmpeg.run("-i", input, output): 파일 변환 과정. 가상 컴퓨터에 이미 존재하는 파일을 input으로 받는 것임. -> input을 output으로 변형하겠다. -i: input으로 받겠다는 뜻임.
    
    //썸네일 만들기
    await ffmpeg.run("-i", "recording.webm", "-ss", "00:00:01", "-frames:v", "1", "thumbnail.jpg");

    // 3단계: 변환된 mp4파일 접근
    const mp4File = ffmpeg.FS("readFile", "outputs.mp4"); 
    //console.log(mp4File);
    console.log("buffer",mp4File.buffer); 
    const thumbnailFile = ffmpeg.FS("readFile", "thumbnail.jpg");

    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"}); // 변환된 output파일의 ArrayBuffer(raw binary data buffer를 나타내는 object)를 아용하여 video의 mp4형태의 Blob(binary파일 형식)으로 만들어준다. // blob으로 만들거기 때문에 input data를 binary형식으로 해줌.
    const thumbnailBlob = new Blob([thumbnailFile.buffer], {type: "image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob); // 위에서 만든 Blob에 접근할 수 있도록 url부여
    const thumbnailUrl = URL.createObjectURL(thumbnailBlob);

    const a = document.createElement("a");
    a.href = mp4Url;
    a.download = "MyRecording.mp4"; // href(url)을 다운로드 함. => 다운할 때 파일명을 넣어주면 됨.
    document.body.appendChild(a);
    a.click();

    const thumbA = document.createElement("a");
    thumbA.href = thumbnailUrl;
    thumbA.download = "MyThumbnail.jpg"; 
    document.body.appendChild(thumbA);
    thumbA.click();

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
        videoFile = URL.createObjectURL(event.data); // 브라우저 메모리 상에 저장을 해두고, 우리가 그 파일에 접근할 수 있는 URL을 준거. -> object url: 영상의 모든 정보를 담음. // event.datad에 binary data가 있는데 파일일 수도 있는 binary data에 createObjectURL을 이용해서 접근할 수 있어야함. / event.data: Blob data형태임.
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