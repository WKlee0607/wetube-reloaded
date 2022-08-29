const headerMenuBar = document.querySelector("header .menuBar");
const menu = document.querySelector(".menu");
const menuMenuBar = menu.querySelector(".menuBar");

// menu animation
const handleHeaderMenuBarClick = () => {
    menu.classList.remove("hiddenMenu");
    menu.classList.remove("hidden");
    menu.classList.add("showMenu");

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
            div.remove();
             menu.classList.remove("showMenu");
            menu.classList.add("hiddenMenu");
    })

}

const handleMenuMenuBarClick = () => {
    menu.classList.remove("showMenu");
    menu.classList.add("hiddenMenu");

    // screen Lock 없애기
    document.querySelector("#dimmed").remove();
}

headerMenuBar.addEventListener("click", handleHeaderMenuBarClick)
menuMenuBar.addEventListener("click", handleMenuMenuBarClick)

//

