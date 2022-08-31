const headerMenuBar = document.querySelector("header .menuBar");
const menu = document.querySelector(".menu");
const menuMenuBar = menu.querySelector(".menuBar");

//메뉴창 구독자 생성
const createSubscriptionUser = (subscribing) => {
    const menuSubscription = document.querySelector(".menu__subscription");
    const ul = document.createElement("ul");
    menuSubscription.append(ul);
    Array.from(subscribing).forEach((sub) => {
        const a = document.createElement("a")
        a.href = `/users/${sub._id}`
        const li = document.createElement("li");
        li.className = "menu__subscription-li";
        const userIcon = document.createElement("div");
        userIcon.className = "menu__subscription-userIcon"
        if(sub.avatarUrl){
            const img = document.createElement("img");
            if (sub.avatarUrl.split("/")[0] === "uploads"){
                img.src = "/" + sub.avatarUrl
            }else {
                img.src = sub.avatarUrl
            }
            userIcon.append(img)
        } else {
            const span = document.createElement("span");
            span.innerText = "😎"
            userIcon.append(span)
        }
        const username = document.createElement("div");
        username.className = "menu__subscription-username"
        username.innerText = sub.username;
        
        //추가
        li.append(userIcon);
        li.append(username);
        a.append(li);
        ul.append(a);
    })
}
//메뉴창 구독자 없애기
const removeSubscriptionUser = () => {
    const menuSubscriptionUl = document.querySelector(".menu__subscription ul");
    if(menuSubscriptionUl){
        menuSubscriptionUl.remove();
    }
}

// --------


// menu animation
const handleHeaderMenuBarClick = async () => {
    //screen Lock 생성
    const div = document.createElement("div");
    div.id = "dimmed"
    document.body.append(div);
    document.querySelector("#dimmed").addEventListener("scroll touchmove touchend mousewheel",
    function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false
    })
    document.querySelector("#dimmed").addEventListener("click", function() {
        handleMenuMenuBarClick();
    })

    //구독한 유저 데이터 가져오기
    const userId = menu.dataset.user;
    if(userId){
        const response = await fetch(`/api/users/${userId}/subscription`, {
            method:"GET",
        }); 
        if(response.status === 200){
            const {subscribing} = await response.json();
            if(subscribing){
                createSubscriptionUser(subscribing);
            }
        }
    }
    
    //메뉴 창  보이기
    menu.classList.remove("hiddenMenu");
    menu.classList.remove("hidden");
    menu.classList.add("showMenu");
}

//메뉴바의 메뉴 아이콘 누르기
const handleMenuMenuBarClick = () => {
    menu.classList.remove("showMenu");
    menu.classList.add("hiddenMenu");

    // screen Lock 없애기
    document.querySelector("#dimmed").remove();

    //구독한 유저 데이터 없애기
    removeSubscriptionUser();
}

headerMenuBar.addEventListener("click", handleHeaderMenuBarClick)
menuMenuBar.addEventListener("click", handleMenuMenuBarClick)