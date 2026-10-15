/* ==========================================
   MOVIMIENTO COMPARTIDO
   - Listas que aparecen escalonadas al entrar en pantalla.
   - Números que cuentan hasta su valor (calculadoras).
   Todo respeta "reducir movimiento" y el contenido es visible sin JavaScript.
   ========================================== */
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

/**
 * Cuenta desde 0 hasta el valor final en un elemento de texto.
 * @param {HTMLElement} el      elemento donde se escribe el número
 * @param {number} valor        valor final
 * @param {object} opciones     decimales y formato (es-MX)
 */
function contarHasta(el, valor, { decimales = 0, duracion = 700 } = {}) {
  if (!el) return;
  const formato = (n) => n.toLocaleString("es-MX", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
  if (sinMovimiento.matches || !Number.isFinite(valor)) {
    el.textContent = formato(valor);
    return;
  }
  const inicio = performance.now();
  cancelAnimationFrame(el._conteo);
  const paso = (ahora) => {
    const t = Math.min(1, (ahora - inicio) / duracion);
    const suave = 1 - Math.pow(1 - t, 4); // desaceleración natural
    el.textContent = formato(valor * suave);
    if (t < 1) el._conteo = requestAnimationFrame(paso);
  };
  el._conteo = requestAnimationFrame(paso);
}

/**
 * Marca los elementos de una lista para que aparezcan escalonados.
 * Se usa al dibujar listas nuevas (filtros) y al entrar en pantalla.
 */
function escalonar(elementos) {
  if (sinMovimiento.matches) return;
  Array.from(elementos).forEach((el, i) => {
    el.style.setProperty("--orden", Math.min(i, 8)); // el retraso total queda acotado
    el.classList.remove("aparece");
    void el.offsetWidth;
    el.classList.add("aparece");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("con-movimiento");
  if (sinMovimiento.matches || !("IntersectionObserver" in window)) return;

  // Índices con filetes: aparecen cuando la lista entra en pantalla
  const listas = document.querySelectorAll(
    ".temas-lista, .principios, .herramientas, .recursos, .tabla-imc tbody, .formulas dl, .footer-enlaces"
  );
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      escalonar(entrada.target.children);
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: "0px 0px -12% 0px" });

  listas.forEach((lista) => {
    // Solo se ocultan las listas que todavía no se ven; lo visible al cargar no espera
    if (lista.getBoundingClientRect().top > window.innerHeight) {
      Array.from(lista.children).forEach((el) => el.classList.add("por-aparecer"));
      observador.observe(lista);
    }
  });
});
