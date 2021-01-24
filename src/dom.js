let mainContent = document.querySelectorAll(".main");

function openNav() {
    document.getElementById("side-nav").style.width = "300px";
    mainContent.forEach(section => section.style.marginLeft = "0");

    document.querySelectorAll('.menu-item').forEach(item => item.style.opacity = 1);
    
}

function closeNav() {
    document.getElementById("side-nav").style.width = "100px";
    mainContent.forEach(section => section.style.marginLeft = "-200px");
    document.querySelectorAll('.menu-item').forEach(item => item.style.opacity = 0);
}

export {openNav, closeNav};