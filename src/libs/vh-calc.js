// fix vh bug for mobile phones
function calcVH() {
    const windowHeight = (document
        && document.documentElement
        && document.documentElement.clientHeight) || window.innerHeight;

    let vh = windowHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

calcVH()
window.addEventListener('resize', calcVH);