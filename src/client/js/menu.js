const headerMenuBar = document.querySelector("header .menuBar");
const menu = document.querySelector(".menu");
const menuMenuBar = menu.querySelector(".menuBar");

// menu animation
const handleHeaderMenuBarClick = () => {
    menu.classList.remove("hiddenMenu");
    menu.classList.remove("hidden");
    menu.classList.add("showMenu");
}

const handleMenuMenuBarClick = () => {
    menu.classList.remove("showMenu");
    menu.classList.add("hiddenMenu");
}

headerMenuBar.addEventListener("click", handleHeaderMenuBarClick)
menuMenuBar.addEventListener("click", handleMenuMenuBarClick)

//

