// ========================================
// CONFIGURACIÓN
// ========================================

const username = "vaacostal";
const repository = "notion-carousel";

// ========================================
// OBTENER LA CARPETA DESDE LA URL
// ========================================

const params = new URLSearchParams(window.location.search);

const selectedFolder = params.get("folder");

const folder = selectedFolder
    ? `images/${selectedFolder}`
    : "images";

// ========================================
// CONSTRUIR URL DE LA API
// ========================================

const apiURL =
    `https://api.github.com/repos/${username}/${repository}/contents/${folder}`;

// ========================================
// VARIABLES
// ========================================

let images = [];
let currentIndex = 0;

const imageElement =
    document.getElementById("carousel-image");

const counterElement =
    document.getElementById("counter");

// ========================================
// CARGAR IMÁGENES
// ========================================

async function loadImages() {

    try {

        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error(
                `Error ${response.status}: no se pudo acceder a la carpeta.`
            );
        }

        const files = await response.json();

        images = files
            .filter(file =>
                /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
            )
            .map(file => file.download_url);

        if (images.length === 0) {

            counterElement.textContent =
                "No hay imágenes en esta carpeta.";

            return;
        }

        showImage();

    } catch (error) {

        console.error(error);

        counterElement.textContent =
            "No se pudieron cargar las imágenes.";

    }
}

// ========================================
// MOSTRAR IMAGEN
// ========================================

function showImage() {

    imageElement.src = images[currentIndex];

    counterElement.textContent =
        `${currentIndex + 1} / ${images.length}`;
}

// ========================================
// BOTÓN SIGUIENTE
// ========================================

document.getElementById("next").addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= images.length) {
        currentIndex = 0;
    }

    showImage();
});

// ========================================
// BOTÓN ANTERIOR
// ========================================

document.getElementById("prev").addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }

    showImage();
});

// ========================================
// INICIAR
// ========================================

loadImages();
