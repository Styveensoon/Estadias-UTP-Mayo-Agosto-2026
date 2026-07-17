// Asegura que el script se ejecute hasta que el HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            // Activa o desactiva la clase "active" en el menú para mostrarlo/ocultarlo
            navMenu.classList.toggle("active");
            
            // Cambia el icono dinámicamente entre el menú de hamburguesa (bars) y la equis (xmark)
            const icon = navToggle.querySelector("i");
            if (navMenu.classList.contains("active")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });
    }
});