const username = "vaacostal";
const repository = "notion-carousel";
const folder = "images";

const apiURL = `https://api.github.com/repos/${username}/${repository}/contents/${folder}`;

let images = [];
let currentIndex = 0;

const imageElement = document.getElementById("carousel-image");
const counterElement = document.getElementById("counter");

async function loadImages() {

    try {

        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("No se pudieron obtener las imágenes.");
        }

        const files = await response.json();

        images = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name))
            .map(file => file.download_url);

        if (images.length === 0) {
            counterElement.textContent = "No hay imágenes todavía.";
            return;
        }

        showImage();

    } catch (error) {

        console.error(error);
        counterElement.textContent = "Error al cargar las imágenes.";

    }
}

function showImage() {

    imageElement.src = images[currentIndex];

    counterElement.textContent =
        `${currentIndex + 1} / ${images.length}`;
}

document.getElementById("next").addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= images.length) {
        currentIndex = 0;
    }

    showImage();
});

document.getElementById("prev").addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }

    showImage();
});

loadImages();
