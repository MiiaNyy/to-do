let mainContent = document.querySelectorAll(".main");


function openNav() {
    document.getElementById("side-nav").style.width = "300px";
    mainContent.forEach(section => section.style.marginLeft = "0");
    document.querySelectorAll('.menu-item').forEach(item => item.style.opacity = 1);
    document.querySelector('#side-btn').style.opacity = 1;

}

function closeNav() {
    document.getElementById("side-nav").style.width = "100px";
    mainContent.forEach(section => section.style.marginLeft = "-200px");
    document.querySelectorAll('.menu-item').forEach(item => item.style.opacity = 0);
    document.querySelector('#side-btn').style.opacity = 0;
}

function toggleFolderDisplay(e) {
    let targetId = e.target.id;    
    if(targetId == 'projects') {
        document.querySelector(".project-menu").classList.toggle("menu-visible");
        document.querySelector(".filter-folder").classList.toggle('filter-margin-top');
        document.querySelector(".project-span").classList.toggle("rotate-span")
    } else if(targetId == 'filter') {
        document.querySelector(".filter-menu").classList.toggle("menu-visible");
        document.querySelector(".filter-span").classList.toggle("rotate-span")

    }
    console.log('You clicked ' + targetId);
}


export {
    openNav,
    closeNav,
    toggleFolderDisplay,
};