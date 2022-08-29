const shareBox = document.querySelector(".share__box");

//shareVideo
const handleShaerboxClick = () => {
    //share 창 띄우기
    const shareContainer = document.querySelector("#shareContainer");
    shareContainer.classList.toggle("hidden");

    //link에 주소 넣기
    const input = shareContainer.querySelector(".share__link input");
    input.value = window.location.href;

    //link copy하기
    const shareLink = shareContainer.querySelector(".share__link");
    const linkInput = shareLink.querySelector("input");
    const copyBtn = shareLink.querySelector(".share__link-copy");
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(linkInput.value).then(() => {
            console.log("Link copied to clipboard...")
            linkInput.style.borderColor = "blue"
        }).catch(err => {
            console.log("Something went wrong", err);
        })
    })

    //닫기 버튼
    const exit = shareContainer.querySelector(".share__header i");
    exit.addEventListener("click", () => {
        shareContainer.classList.add("hidden");
        linkInput.style.borderColor = "#333333"
        div.remove();
    })

     //screen lock
     const div = document.createElement("div");
     div.id = "dimmed"
     document.body.append(div);
     document.querySelector("#dimmed").addEventListener("scroll touchmove touchend mousewheel",
     function (e) {
         e.preventDefault();
         e.stopPropagation();
         return false})
     document.querySelector("#dimmed").addEventListener("click", function() {
             div.remove();
             exit.click();
     })
    
    // 공유하기
       //카카오 공유
    const kakaoShare = shareContainer.querySelector(".share__icons-kakao");
    if(kakaoShare){
        Kakao.init('a49bae0fc61fcf4a825e3df56b72ff6d');
        Kakao.isInitialized();
        kakaoShare.addEventListener("click", () => {
            Kakao.Share.createCustomButton({
                container: kakaoShare,
                templateId: 82088,
                templateArgs: {
                    'title': 'itube',
                    'description': '개발 공부중인 이원규가 NodeJS로 구현한 첫 사이트 itube'
            }
      });
        })
        kakaoShare.click();
    }

    
}



if(shareBox){
    shareBox.addEventListener("click", handleShaerboxClick);
}