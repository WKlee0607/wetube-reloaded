const menuBars = document.querySelectorAll(".menuBar");
const menu = document.querySelector(".menu");

const handleMenuBarClick = () => {
    menu.classList.toggle("hidden");
}

if(menuBars){
    Array.from(menuBars).forEach((menuBar) => menuBar.addEventListener("click", handleMenuBarClick)); 
}

