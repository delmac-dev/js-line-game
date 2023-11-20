const GAME_HOME = document.querySelector(".game-home");
const START_MENU = document.querySelector(".start-menu");

var proceedToMenu = () => {
    GAME_HOME.classList.remove("show");
    START_MENU.classList.add("show");
}