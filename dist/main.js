"use strict";
let currentImgElement = null;
/* =========================
   DATOS
========================= */
const items = [
    {
        id: 1,
        image: "assets/dibujo1.jpg",
        title: "Dibujo 1",
        description: "Este es mi primer dibujo",
        filename: "dibujo-1.jpg",
        premiumLink: "https://www.patreon.com/tu_usuario",
        isPremium: true
    },
    {
        id: 2,
        image: "assets/dibujo2.jpg",
        title: "Dibujo 2",
        description: "Otro dibujo",
        filename: "dibujo-2.jpg",
        premiumLink: "https://www.patreon.com/tu_usuario",
        isPremium: false
    },
    {
        id: 3,
        image: "assets/dibujo3.jpg",
        title: "Dibujo 3",
        description: "Un tercer dibujo",
        filename: "dibujo-3.jpg",
        premiumLink: "https://www.patreon.com/tu_usuario",
        isPremium: false
    }
];
/* =========================
   ESTADO
========================= */
let currentItem = null;
/* =========================
   DOM
========================= */
const gallery = document.getElementById("gallery");
if (!gallery) {
    throw new Error("No existe #gallery en el HTML");
}
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const closeBtn = document.getElementById("closeModal");
const downloadBtn = document.getElementById("downloadBtn");
const premiumBtn = document.getElementById("premiumBtn");
if (premiumBtn) {
    premiumBtn.onclick = goToPremium;
}
/* =========================
   RENDER
========================= */
function renderGallery() {
    gallery.innerHTML = "";
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "gallery-item";
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.title;
        const overlay = document.createElement("div");
        overlay.className = "overlay";
        const title = document.createElement("span");
        title.className = "overlay-title";
        title.textContent = item.title;
        overlay.appendChild(title);
        card.appendChild(img);
        card.appendChild(overlay);
        card.onclick = () => {
            openModal(item, img);
        };
        if (item.isPremium) {
            const badge = document.createElement("div");
            badge.className = "premium-badge";
            badge.textContent = "EXTRA CONTENT ON PATREON";
            card.appendChild(badge);
        }
        gallery.appendChild(card);
    });
}
/* =========================
   MODAL
========================= */
function openModal(item, imgElement) {
    currentImgElement = imgElement || null;
    currentItem = item;
    if (!imgElement)
        return;
    const rect = imgElement.getBoundingClientRect();
    document.body.classList.add("modal-open");
    // Crear clon
    const clone = document.createElement("img");
    clone.src = item.image;
    clone.style.position = "fixed";
    clone.style.top = rect.top + "px";
    clone.style.left = rect.left + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.objectFit = "cover";
    clone.style.zIndex = "9999";
    clone.style.borderRadius = "12px";
    document.body.appendChild(clone);
    // 🔥 Preparamos modal (pero oculto)
    modal.classList.add("active");
    modal.style.opacity = "0";
    modalImage.src = item.image;
    modalTitle.textContent = item.title;
    document.body.style.overflow = "hidden";
    modal.classList.add("active");
    modal.style.opacity = "0";
    /* 🔥 ocultar contenido */
    const content = modal.querySelector(".modal-content");
    content.style.opacity = "0";
    content.style.transform = "scale(0.95)";
    // 🔥 Esperar a que el modal esté en layout
    requestAnimationFrame(() => {
        const targetRect = modalImage.getBoundingClientRect();
        anime({
            targets: modal,
            opacity: [0, 1],
            duration: 300,
            easing: "easeOutQuad"
        });
        anime({
            targets: clone,
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            duration: 400,
            easing: "easeInOutQuad",
            complete: () => {
                clone.remove();
                modal.style.opacity = "1";
                anime({
                    targets: ".modal-content",
                    scale: [0.95, 1],
                    opacity: [0, 1],
                    duration: 250,
                    easing: "cubicBezier(0.4, 0, 0.2, 1)"
                });
                anime({
                    targets: "#modalTitle, #modalDesc, #downloadBtn",
                    opacity: [0, 1],
                    translateY: [10, 0],
                    delay: anime.stagger(80),
                    duration: 250,
                    easing: "easeOutQuad"
                });
            }
        });
    });
}
function closeModal() {
    if (!currentImgElement) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
        return;
    }
    const modalRect = modalImage.getBoundingClientRect();
    const targetRect = currentImgElement.getBoundingClientRect();
    document.body.classList.remove("modal-open");
    const clone = document.createElement("img");
    clone.src = modalImage.src;
    clone.style.position = "fixed";
    clone.style.top = modalRect.top + "px";
    clone.style.left = modalRect.left + "px";
    clone.style.width = modalRect.width + "px";
    clone.style.height = modalRect.height + "px";
    clone.style.objectFit = "cover";
    clone.style.zIndex = "9999";
    clone.style.borderRadius = "12px";
    document.body.appendChild(clone);
    modal.classList.remove("active");
    modal.style.opacity = "0";
    setTimeout(() => {
        modal.classList.remove("active");
    }, 180);
    anime({
        targets: modal,
        opacity: [1, 0],
        duration: 200,
        easing: "easeInQuad"
    });
    anime({
        targets: clone,
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
        duration: 400,
        easing: "cubicBezier(0.4, 0, 0.2, 1)",
        complete: () => {
            clone.remove();
        }
    });
    document.body.style.overflow = "";
}
/* =========================
   DESCARGA
========================= */
function downloadImage() {
    if (!currentItem)
        return;
    const a = document.createElement("a");
    a.href = currentItem.image;
    a.download = currentItem.filename;
    a.click();
}
function goToPremium() {
    if (!currentItem)
        return;
    const confirmRedirect = confirm("Este contenido completo está disponible en Patreon. Necesitas una suscripción para acceder. ¿Quieres continuar?");
    if (confirmRedirect) {
        window.open(currentItem.premiumLink, "_blank");
    }
}
/* =========================
   EVENTOS
========================= */
function setupEvents() {
    closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal)
            closeModal();
    };
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape")
            closeModal();
    });
    downloadBtn.onclick = downloadImage;
    premiumBtn.onclick = goToPremium;
}
/* =========================
   INIT
========================= */
function init() {
    renderGallery();
    setupEvents();
}
init();
//# sourceMappingURL=main.js.map