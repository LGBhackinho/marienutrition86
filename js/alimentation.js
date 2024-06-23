const carouselImages = document.querySelector('.carousel-images');
const totalImages = document.querySelectorAll('.carousel-images img').length;
let index = 0;

function showNextImage() {
    index = (index + 1) % totalImages;
    const offset = -index * 100;
    carouselImages.style.transform = `translateX(${offset}%)`;
}

setInterval(showNextImage, 4000);

function moveSlide() {
   
    showNextImage();
}