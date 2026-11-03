import { animate, cubicBezier, utils } from "animejs";
let currentImgElement = null;
let previouslyFocusedElement = null;
/* =========================
   DATOS
========================= */
const items = [
    {
        id: 1,
        image: "assets/dibujo1.webp",
        originalImage: "originals/dibujo1.jpg",
        title: "MISIDE: MITA",
        description: "Este es mi primer dibujo",
        filename: "dibujo-1.jpg",
        premiumLink: "https://www.patreon.com/tu_usuario",
        isPremium: true,
    },
    {
        id: 2,
        image: "assets/dibujo2.webp",
        originalImage: "originals/dibujo2.jpg",
        title: "RAORA PANTHERA: NURSE OUTFIT",
        description: "Otro dibujo",
        filename: "dibujo-2.jpg",
        premiumLink: "https://www.patreon.com/tu_usuario",
        isPremium: false,
    },
    {
        id: 3,
        image: "assets/dibujo3.webp",
        originalImage: "originals/dibujo3.jpg",
        title: "SAYNOZ X SLUMLORD: CROSS",
        description: "Un tercer dibujo",
        filename: "dibujo-3.jpg",
        premiumLink: "https://www.patreon.com/tu_usuario",
        isPremium: false,
    },
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
/* =========================
   RENDER
========================= */
function renderGallery() {
    gallery.innerHTML = "";
    items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "gallery-item";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Open ${item.title}: ${item.description}`);
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = `${item.title} — ${item.description}`;
        img.loading = "lazy";
        img.decoding = "async";
        const overlay = document.createElement("div");
        overlay.className = "overlay";
        const title = document.createElement("span");
        title.className = "overlay-title";
        title.textContent = item.title;
        overlay.appendChild(title);
        card.appendChild(img);
        card.appendChild(overlay);
        card.onclick = () => {
            utils.remove(img);
            animate(img, {
                scale: [1, 0.96, 1],
                duration: 220,
                ease: "outQuad",
                onComplete: () => {
                    img.style.transform = "";
                },
            });
            setTimeout(() => {
                openModal(item, img);
            }, 120);
        };
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                card.click();
            }
        });
        if (item.isPremium) {
            const badge = document.createElement("div");
            badge.className = "premium-badge";
            badge.textContent = "EXTRA CONTENT ON PATREON";
            card.appendChild(badge);
        }
        card.addEventListener("mouseenter", () => {
            const text = card.querySelector(".overlay-title");
            if (text) {
                animate(text, {
                    translateY: [20, 0],
                    opacity: [0, 1],
                    duration: 400,
                    ease: "outQuad",
                });
            }
        });
        card.addEventListener("mouseleave", () => {
            const text = card.querySelector(".overlay-title");
            text.style.opacity = "0";
            text.style.transform = "translateY(20px)";
        });
        gallery.appendChild(card);
    });
}
/* =========================
   MODAL
========================= */
function openModal(item, imgElement) {
    previouslyFocusedElement = imgElement.closest(".gallery-item");
    currentItem = item;
    modal.classList.toggle("modal-premium", Boolean(item.isPremium));
    currentImgElement = imgElement;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
    const rect = imgElement.getBoundingClientRect();
    // Crear clon
    const clone = document.createElement("img");
    clone.src = item.image;
    clone.style.position = "fixed";
    clone.style.top = rect.top + "px";
    clone.style.left = rect.left + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.objectFit = "cover";
    clone.style.borderRadius = "12px";
    clone.style.zIndex = "9999";
    document.body.appendChild(clone);
    // Preparar modal (invisible)
    modal.classList.add("show");
    modal.style.opacity = "0";
    closeBtn.focus();
    modalImage.src = item.image;
    modalImage.alt = `${item.title} — ${item.description}`;
    modalTitle.textContent = item.title;
    const modalDesc = document.getElementById("modalDesc");
    if (modalDesc) {
        modalDesc.textContent = item.description;
    }
    if (currentItem.isPremium) {
        premiumBtn.style.display = "block";
        premiumBtn.textContent = "Get Patreon Content";
    }
    else {
        premiumBtn.style.display = "none";
    }
    const premiumNote = document.getElementById("premiumNote");
    if (currentItem.isPremium) {
        premiumNote.textContent = "Includes high resolution and extra content";
    }
    else {
        premiumNote.textContent = "";
    }
    const content = modal.querySelector(".modal-content");
    content.style.opacity = "0";
    // Esperar layout
    requestAnimationFrame(() => {
        const targetRect = modalImage.getBoundingClientRect();
        animate(clone, {
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            duration: 550,
            ease: cubicBezier(0.22, 1, 0.36, 1),
            onComplete: () => {
                clone.remove();
                // Mostrar modal real
                modal.style.opacity = "1";
                animate(".modal-content", {
                    scale: [0.95, 1],
                    opacity: [0, 1],
                    duration: 350,
                    ease: cubicBezier(0.22, 1, 0.36, 1),
                });
                animate(premiumBtn, {
                    scale: [1, 1.05, 1],
                    duration: 600,
                    ease: "inOutQuad",
                    delay: 180,
                });
            },
        });
    });
}
function closeModal() {
    if (!currentImgElement) {
        modal.classList.remove("modal-premium");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        previouslyFocusedElement?.focus();
        previouslyFocusedElement = null;
        currentItem = null;
        return;
    }
    const imageToRestore = currentImgElement;
    const elementToRestoreFocus = previouslyFocusedElement;
    const modalRect = modalImage.getBoundingClientRect();
    const targetRect = currentImgElement.getBoundingClientRect();
    // Crear clon desde el modal
    const clone = document.createElement("img");
    clone.src = modalImage.src;
    clone.style.position = "fixed";
    clone.style.top = modalRect.top + "px";
    clone.style.left = modalRect.left + "px";
    clone.style.width = modalRect.width + "px";
    clone.style.height = modalRect.height + "px";
    clone.style.objectFit = "cover";
    clone.style.borderRadius = "12px";
    clone.style.zIndex = "9999";
    document.body.appendChild(clone);
    // Ocultar modal visualmente
    modal.style.opacity = "0";
    // Animación de regreso
    animate(clone, {
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
        duration: 400,
        ease: "inOutQuad",
        onComplete: () => {
            clone.remove();
            modal.classList.remove("show");
            utils.remove(imageToRestore);
            imageToRestore.style.transform = "";
            modal.setAttribute("aria-hidden", "true");
            elementToRestoreFocus?.focus();
            previouslyFocusedElement = null;
            currentImgElement = null;
            currentItem = null;
        },
    });
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
}
/* =========================
   DESCARGA
========================= */
function downloadImage() {
    if (!currentItem)
        return;
    const a = document.createElement("a");
    a.href = currentItem.originalImage;
    a.download = currentItem.filename;
    a.click();
}
function goToPremium() {
    if (!currentItem)
        return;
    window.open(currentItem.premiumLink, "_blank", "noopener,noreferrer");
}
/* =========================
   EVENTOS
========================= */
function setupEvents() {
    modal.addEventListener("keydown", (e) => {
        if (e.key !== "Tab")
            return;
        const focusableElements = Array.from(modal.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((element) => {
            return element.getClientRects().length > 0;
        });
        if (focusableElements.length === 0) {
            e.preventDefault();
            modal.focus();
            return;
        }
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
        else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    });
    closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal)
            closeModal();
    };
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
            closeModal();
        }
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
