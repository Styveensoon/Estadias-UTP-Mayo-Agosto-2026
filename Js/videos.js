/* ==========================================
   VIDEOTECA
   Videos de canales oficiales verificados (IMSS, IMSS Bienestar, Secretaría de Salud,
   Gobierno de México, Profeco y UNICEF México). El reproductor se carga al hacer clic.
   ========================================== */
const videos = [
  { id: "_EFtzm-zmy8", titulo: "Plato del Bien Comer", canal: "IMSS Bienestar", duracion: "4:02", tema: "alimentacion", destacado: true },
  { id: "YVFNcxKMWgI", titulo: "Alimentación saludable", canal: "Gobierno de México", duracion: "1:43", tema: "alimentacion" },
  { id: "UTEpJWu9rR4", titulo: "Pura Salud: la dieta de la milpa", canal: "IMSS Bienestar", duracion: "1:11", tema: "alimentacion" },
  { id: "V44k-F0XlOA", titulo: "Pura Salud: el nopal, un alimento saludable", canal: "IMSS Bienestar", duracion: "0:57", tema: "alimentacion" },
  { id: "mArOCe6WZXA", titulo: "Alimentos saludables", canal: "UNICEF México", duracion: "2:31", tema: "alimentacion" },
  { id: "BFAmD3-IlOk", titulo: "¡Alerta antojo! Tips para comer rico y saludable", canal: "IMSS", duracion: "0:59", tema: "alimentacion" },
  { id: "6Q0OhrfyPVk", titulo: "Sustituye ingredientes con alto valor calórico", canal: "IMSS", duracion: "0:49", tema: "recetas" },
  { id: "ReGxeeUQmwA", titulo: "Enchiladas poblanas", canal: "Profeco · Platillo Sabio", duracion: "2:15", tema: "recetas" },
  { id: "hNQskcpAlgo", titulo: "Refrigerios escolares saludables", canal: "Profeco · Platillo Sabio", duracion: "5:01", tema: "recetas" },
  { id: "8-I3Xtii8BY", titulo: "Ensalada de quinoa con pollo a la parrilla", canal: "Profeco · Platillo Sabio", duracion: "6:35", tema: "recetas" },
  { id: "KiKX_FNR5Hk", titulo: "Champiñones en su jugo", canal: "Profeco · Platillo Sabio", duracion: "5:01", tema: "recetas" },
  { id: "egDvDYDjqAk", titulo: "Macarrones con brócoli", canal: "Profeco · Platillo Sabio", duracion: "9:27", tema: "recetas" },
  { id: "wi4YL_8vLfM", titulo: "Panuchos saludables", canal: "Profeco · Platillo Sabio", duracion: "13:12", tema: "recetas" },
  { id: "Xka3irPGgoo", titulo: "¡Hidrátate!", canal: "Secretaría de Salud", duracion: "0:38", tema: "hidratacion" },
  { id: "dqx_cC8acgQ", titulo: "Toma agua natural y de frutas sin azúcar", canal: "IMSS Bienestar", duracion: "0:42", tema: "hidratacion" },
  { id: "_C8R7gWgbBY", titulo: "Los sellos de advertencia", canal: "Secretaría de Salud", duracion: "0:31", tema: "etiquetado" },
  { id: "Y6nhJvmBIX4", titulo: "Publicidad en alimentos y bebidas", canal: "UNICEF México", duracion: "1:55", tema: "etiquetado" },
  { id: "QSFJwkafeSM", titulo: "Día Mundial de la Actividad Física", canal: "IMSS Bienestar", duracion: "3:39", tema: "actividad" },
  { id: "uq-ua3SDMzQ", titulo: "Alimentación y salud mental: ¿nos comemos nuestras emociones?", canal: "IMSS Bienestar", duracion: "1:18:38", tema: "actividad" }
];

const temasVideo = {
  todos: "Todos",
  recetas: "Recetas",
  alimentacion: "Alimentación",
  hidratacion: "Hidratación",
  etiquetado: "Etiquetado y publicidad",
  actividad: "Actividad física y bienestar"
};

document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("videos-lista");
  const filtros = document.getElementById("videos-filtros");
  const destacado = document.getElementById("video-destacado");
  if (!lista || !filtros) return;

  const miniatura = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const enYoutube = (id) => `https://www.youtube.com/watch?v=${id}`;

  // Reproductor: miniatura con botón; al hacer clic se cambia por el iframe
  function reproductor(v) {
    return `
      <div class="video-marco">
        <button type="button" class="video-play" data-id="${v.id}" aria-label="Reproducir: ${v.titulo}">
          <img src="${miniatura(v.id)}" alt="" loading="lazy" width="480" height="360">
          <span class="video-icono" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
          <span class="video-duracion">${v.duracion}</span>
        </button>
      </div>`;
  }

  function cargarIframe(boton) {
    const v = videos.find((x) => x.id === boton.dataset.id);
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`;
    iframe.title = v.titulo;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    boton.replaceWith(iframe);
    iframe.focus();
  }

  // Video destacado
  const principal = videos.find((v) => v.destacado);
  if (destacado && principal) {
    destacado.innerHTML = `
      ${reproductor(principal)}
      <div class="destacado-texto">
        <h2>${principal.titulo}</h2>
        <p class="video-canal">${principal.canal} · ${principal.duracion}</p>
        <p>Cómo repartir tus alimentos en cada comida según la guía oficial: verduras y frutas, cereales, leguminosas y alimentos de origen animal.</p>
        <a class="enlace-flecha" href="${enYoutube(principal.id)}" target="_blank" rel="noopener noreferrer">Ver en YouTube <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i><span class="sr-only"> (abre en otra pestaña)</span></a>
      </div>`;
  }

  // Filtros
  Object.entries(temasVideo).forEach(([clave, nombre]) => {
    const total = videos.filter((v) => !v.destacado && (clave === "todos" || v.tema === clave)).length;
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "filtro";
    boton.dataset.tema = clave;
    boton.setAttribute("aria-pressed", String(clave === "todos"));
    boton.innerHTML = `${nombre} <span class="filtro-total">${total}</span>`;
    filtros.appendChild(boton);
  });

  function mostrar(tema) {
    const visibles = videos.filter((v) => !v.destacado && (tema === "todos" || v.tema === tema));
    lista.innerHTML = visibles.map((v) => `
      <li class="video">
        ${reproductor(v)}
        <h3>${v.titulo}</h3>
        <p class="video-canal">${v.canal}</p>
        <a class="video-yt" href="${enYoutube(v.id)}" target="_blank" rel="noopener noreferrer">Ver en YouTube<span class="sr-only"> (abre en otra pestaña)</span></a>
      </li>`).join("");
    filtros.querySelectorAll(".filtro").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tema === tema)));
    if (typeof escalonar === "function") escalonar(lista.children);
  }

  filtros.addEventListener("click", (e) => {
    const boton = e.target.closest(".filtro");
    if (boton) mostrar(boton.dataset.tema);
  });

  document.addEventListener("click", (e) => {
    const boton = e.target.closest(".video-play");
    if (boton) cargarIframe(boton);
  });

  // Permite abrir la videoteca filtrada, por ejemplo videos.html?tema=recetas
  const inicial = new URLSearchParams(window.location.search).get("tema");
  mostrar(temasVideo[inicial] ? inicial : "todos");
});
