import "./styles/main.css"
import {closeNav, openNav} from "./dom"

let navIcon= document.querySelector('#nav-icon');


let navIsOpen = true;

navIcon.addEventListener('click', function() {    
    this.classList.toggle("open");
    if(navIsOpen) {
        closeNav();
        navIsOpen = false;
        
    } else if(!navIsOpen) {
        openNav();
        navIsOpen = true;
    }
})






if (module.hot) {
    module.hot.accept()
}