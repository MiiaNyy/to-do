import "./styles/main.css"
import {
    closeNav,
    openNav,
    toggleFolderDisplay,
} from "./dom"

let navIcon = document.querySelector('#nav-icon');
let projectsBtn = document.querySelector(".project-btn");
let filterFolderBtn = document.querySelector(".filter-btn");

let navIsOpen = true;

navIcon.addEventListener('click', function () {
    this.classList.toggle("open");
    if (navIsOpen) {
        closeNav();
        navIsOpen = false;

    } else if (!navIsOpen) {
        openNav();
        navIsOpen = true;
    }
})

projectsBtn.addEventListener('click', function(event) {
    toggleFolderDisplay(event);
})

filterFolderBtn.addEventListener('click', function(event) {
    toggleFolderDisplay(event);
})







if (module.hot) {
    module.hot.accept()
}