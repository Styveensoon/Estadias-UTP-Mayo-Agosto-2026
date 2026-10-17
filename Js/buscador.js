/* ==========================================
   BUSCADOR GENERAL DEL SITIO
   Agrega el botón "Buscar" al encabezado y abre un panel que busca en todo Cheficas UTP:
   temas y sus apartados, páginas, alimentos del SMAE, datos curiosos, videos y recursos.
   El índice (Js/buscador-indice.js) se genera con scripts/generar-indice-buscador.js y,
   junto con la base del SMAE, se carga solo la primera vez que se abre el buscador.
   Atajos: "/" o Ctrl+K para abrir, flechas para moverse, Enter para abrir y Esc para cerrar.
   ========================================== */
(() => {
  // La raíz del sitio se calcula desde este archivo, así funciona en index.html y en Views/
  const RAIZ = new URL("../", document.currentScript.src);
  const enRaiz = (ruta) => new URL(ruta, RAIZ).href;

  const SUGERENCIAS = ["IMC", "Agua", "Plato del Bien Comer", "Recetas", "Ejercicio", "Sellos de advertencia", "Al vapor", "Aguacate"];
  const PALABRAS_VACIAS = new Set(["de", "la", "el", "los", "las", "y", "en", "con", "del", "para", "un", "una", "que", "como", "al", "a", "o", "mi", "es", "se", "por", "lo"]);
  const GRUPOS = {
    tema: { nombre: "Temas", icono: "fa-book-open" },
    pagina: { nombre: "Secciones del sitio", icono: "fa-compass" },
    alimento: { nombre: "Alimentos (SMAE)", icono: "fa-apple-whole" },
    dato: { nombre: "Datos curiosos", icono: "fa-lightbulb" },
    video: { nombre: "Videos", icono: "fa-circle-play" },
    recurso: { nombre: "Recursos oficiales", icono: "fa-file-lines" }
  };
  const GRUPO_DE = { tema: "tema", apartado: "tema", pagina: "pagina", seccion: "pagina", alimento: "alimento", dato: "dato", video: "video", recurso: "recurso" };
  const LIMITE_GRUPO = { tema: 6, pagina: 4, alimento: 6, dato: 4, video: 4, recurso: 4 };
  // Al ordenar los grupos, los temas y las páginas ganan a los alimentos cuando la coincidencia es parecida
  const PESO_GRUPO = { tema: 6, pagina: 3, alimento: 0, dato: 0, video: 0, recurso: 0 };
  const PESO_TIPO = { tema: 4, pagina: 3, apartado: 1.5, seccion: 1, alimento: 0, dato: 0, video: 0.5, recurso: 0.5 };
  const CLAVE_RECIENTES = "buscador-recientes";

  /** Quita acentos y mayúsculas sin cambiar la longitud, para poder resaltar sobre el texto original. */
  const normal = (cadena) => [...String(cadena).normalize("NFC")]
    .map((c) => c.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()[0] || c)
    .join("");
  const escapar = (cadena) => String(cadena).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const formatoNumero = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 });

  /* ---------- Carga diferida del índice y de los alimentos ---------- */
  let indice = null;
  let alimentos = null;
  let cargando = null;

  function cargarScript(ruta) {
    return new Promise((resolver, rechazar) => {
      const s = document.createElement("script");
      s.src = enRaiz(ruta);
      s.onload = resolver;
      s.onerror = rechazar;
      document.head.appendChild(s);
    });
  }

  function cargarDatos() {
    if (cargando) return cargando;
    const pedirIndice = window.INDICE_BUSCADOR ? Promise.resolve() : cargarScript("Js/buscador-indice.js");
    // smae-datos.js declara constantes: si la página ya lo trae, no se vuelve a cargar
    const pedirSmae = typeof SMAE_ALIMENTOS !== "undefined" ? Promise.resolve() : cargarScript("Js/smae-datos.js");

    cargando = Promise.allSettled([pedirIndice, pedirSmae]).then(() => {
      indice = (window.INDICE_BUSCADOR || []).map((e) => ({
        ...e,
        tN: normal(e.titulo),
        dN: normal(`${e.en || ""} ${e.desc || ""}`),
        eN: e.etiquetas || ""
      }));
      if (typeof SMAE_ALIMENTOS !== "undefined") {
        const vistos = new Set();
        alimentos = [];
        for (const [nombre, grupo, cantidad, unidad, , , energia] of SMAE_ALIMENTOS) {
          if (vistos.has(nombre)) continue;
          vistos.add(nombre);
          const partes = [SMAE_GRUPOS[grupo]?.nombre, `${formatoNumero.format(cantidad)} ${unidad}`];
          if (energia != null) partes.push(`${formatoNumero.format(energia)} kcal`);
          alimentos.push({
            tipo: "alimento", titulo: nombre, en: partes.filter(Boolean).join(" · "),
            url: `Views/directorio_alimentos.html#q=${encodeURIComponent(nombre)}`,
            tN: normal(nombre), dN: "", eN: "", claves: ""
          });
        }
      }
    });
    return cargando;
  }

  /* ---------- Búsqueda ---------- */
  function terminos(consulta) {
    const todos = normal(consulta).split(/[^a-z0-9ñ%-]+/).filter(Boolean);
    const utiles = todos.filter((t) => !PALABRAS_VACIAS.has(t));
    return utiles.length ? utiles : todos;
  }

  /** Variantes para que "verduras" encuentre "verdura" y al revés. */
  function variantes(t) {
    const v = [t];
    if (t.length > 4 && t.endsWith("es")) v.push(t.slice(0, -2));
    if (t.length > 3 && t.endsWith("s")) v.push(t.slice(0, -1));
    return v;
  }

  /** Puntaje de una entrada; 0 si falta alguna palabra. "debil" indica que solo coincidió en el texto de fondo. */
  function puntaje(entrada, lista, frase) {
    let total = 0;
    let debil = true;
    for (const termino of lista) {
      let mejor = 0;
      for (const t of variantes(termino)) {
        const inicioPalabra = new RegExp(`(^|[^a-z0-9ñ])${t.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&")}`);
        if (inicioPalabra.test(entrada.tN)) mejor = Math.max(mejor, 10);
        // En los alimentos solo cuenta el inicio de palabra: "vapor" no debe traer "leche evaporada"
        else if (t.length > 2 && entrada.tipo !== "alimento" && entrada.tN.includes(t)) mejor = Math.max(mejor, 6);
        else if (t.length > 7 && new RegExp(`(^|[^a-z0-9ñ])${t.slice(0, -3)}`).test(entrada.tN)) mejor = Math.max(mejor, 7); // "sostenible" → "sostenibilidad"
        else if (inicioPalabra.test(entrada.eN)) mejor = Math.max(mejor, 5);
        else if (t.length > 2 && entrada.dN.includes(t)) mejor = Math.max(mejor, 3);
        else if (t.length > 2 && entrada.claves.includes(t)) mejor = Math.max(mejor, 1.5);
      }
      if (!mejor) return { p: 0 }; // cada palabra de la búsqueda debe aparecer
      if (mejor > 1.5) debil = false;
      total += mejor;
    }
    if (entrada.tN === frase) total += 12;
    else if (entrada.tN.startsWith(frase)) total += 6;
    return { p: total + PESO_TIPO[entrada.tipo], debil };
  }

  function buscar(consulta) {
    const lista = terminos(consulta);
    if (!lista.length || !indice) return [];
    const frase = lista.join(" ");
    let encontradas = [];
    for (const entrada of [...indice, ...(alimentos || [])]) {
      const { p, debil } = puntaje(entrada, lista, frase);
      if (p) encontradas.push({ entrada, p, debil });
    }
    // Si hay suficientes coincidencias claras, se omiten las que solo aparecen de pasada
    if (encontradas.filter((f) => !f.debil).length >= 3) encontradas = encontradas.filter((f) => !f.debil);

    const grupos = {};
    for (const f of encontradas) (grupos[GRUPO_DE[f.entrada.tipo]] ||= []).push(f);

    return Object.entries(grupos)
      .map(([g, filas]) => {
        filas.sort((a, b) => b.p - a.p || a.entrada.titulo.length - b.entrada.titulo.length);
        return { g, mejor: filas[0].p + PESO_GRUPO[g], total: filas.length, filas: filas.slice(0, LIMITE_GRUPO[g]).map((f) => f.entrada) };
      })
      .sort((a, b) => b.mejor - a.mejor);
  }

  /** Envuelve en <mark> las partes del texto que coinciden con la búsqueda. */
  function resaltarTexto(textoOriginal, lista) {
    const n = normal(textoOriginal);
    const marcas = new Array(n.length).fill(false);
    for (const termino of lista) {
      for (const t of variantes(termino)) {
        let i = n.indexOf(t);
        while (t.length && i !== -1) {
          for (let k = i; k < i + t.length; k++) marcas[k] = true;
          i = n.indexOf(t, i + t.length);
        }
      }
    }
    const letras = [...String(textoOriginal).normalize("NFC")];
    let html = "";
    let abierto = false;
    letras.forEach((c, i) => {
      if (marcas[i] && !abierto) { html += "<mark>"; abierto = true; }
      if (!marcas[i] && abierto) { html += "</mark>"; abierto = false; }
      html += escapar(c);
    });
    return abierto ? html + "</mark>" : html;
  }

  /* ---------- Búsquedas recientes (solo en este navegador) ---------- */
  function leerRecientes() {
    try {
      const lista = JSON.parse(localStorage.getItem(CLAVE_RECIENTES) || "[]");
      return Array.isArray(lista) ? lista.slice(0, 5) : [];
    } catch (err) {
      return [];
    }
  }
  function guardarReciente(consulta) {
    const limpia = consulta.trim();
    if (limpia.length < 2) return;
    const lista = [limpia, ...leerRecientes().filter((r) => normal(r) !== normal(limpia))].slice(0, 5);
    try { localStorage.setItem(CLAVE_RECIENTES, JSON.stringify(lista)); } catch (err) { /* sin almacenamiento */ }
  }

  /* ---------- Interfaz ---------- */
  function construir() {
    const contenedor = document.querySelector(".header-site .nav-container");
    if (!contenedor) return null;

    const abrir = document.createElement("button");
    abrir.type = "button";
    abrir.className = "buscador-abrir";
    abrir.setAttribute("aria-haspopup", "dialog");
    abrir.setAttribute("aria-controls", "buscador");
    abrir.setAttribute("aria-keyshortcuts", "/ Control+K");
    abrir.innerHTML = `<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><span class="buscador-abrir-texto">Buscar</span><span class="sr-only"> en el sitio</span>`;
    contenedor.appendChild(abrir);

    const dialogo = document.createElement("dialog");
    dialogo.className = "buscador";
    dialogo.id = "buscador";
    dialogo.setAttribute("aria-labelledby", "buscador-titulo");
    dialogo.innerHTML = `
      <div class="buscador-hoja">
        <h2 class="sr-only" id="buscador-titulo">Buscar en Cheficas UTP</h2>
        <form class="buscador-barra" role="search" autocomplete="off">
          <label class="sr-only" for="buscador-campo">Escribe lo que buscas</label>
          <i class="fa-solid fa-magnifying-glass buscador-lupa" aria-hidden="true"></i>
          <input id="buscador-campo" class="buscador-campo" type="search" enterkeyhint="search" spellcheck="false"
            placeholder="Busca un tema, un alimento o una duda"
            role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="buscador-resultados">
          <button type="button" class="buscador-cerrar" aria-label="Cerrar el buscador"><span aria-hidden="true">Esc</span><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        </form>
        <div class="buscador-cuerpo" id="buscador-cuerpo">
          <div class="buscador-resultados" id="buscador-resultados" role="listbox" aria-label="Resultados"></div>
        </div>
        <p class="buscador-estado sr-only" id="buscador-estado" aria-live="polite"></p>
        <p class="buscador-ayuda" aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> para moverte</span>
          <span><kbd>Enter</kbd> para abrir</span>
          <span><kbd>Esc</kbd> para cerrar</span>
        </p>
      </div>`;
    document.body.appendChild(dialogo);
    return { abrir, dialogo };
  }

  function iniciar() {
    const partes = construir();
    if (!partes) return;
    const { abrir, dialogo } = partes;
    const campo = dialogo.querySelector("#buscador-campo");
    const resultados = dialogo.querySelector("#buscador-resultados");
    const cuerpo = dialogo.querySelector("#buscador-cuerpo");
    const estado = dialogo.querySelector("#buscador-estado");
    const formulario = dialogo.querySelector("form");
    let opciones = [];
    let activa = -1;
    let ultimaConsulta = "";

    const castor = (mensaje) => `
      <div class="buscador-castor">
        <img src="${enRaiz("Resources/marca/castor-sabio.svg")}" alt="" width="72" height="72">
        <p class="buscador-globo">${mensaje}</p>
      </div>`;

    const chip = (texto, icono) => `<button type="button" class="buscador-chip" data-consulta="${escapar(texto)}">${icono ? `<i class="fa-solid ${icono}" aria-hidden="true"></i>` : ""}${escapar(texto)}</button>`;

    function pintarInicio() {
      const recientes = leerRecientes();
      resultados.innerHTML = `
        ${castor("¡Hola, soy Cheficas UTP! ¿Qué quieres aprender hoy? Escribe un tema, un alimento o una duda y te llevo a donde está.")}
        ${recientes.length ? `
          <div class="buscador-sugerencias">
            <p class="buscador-subtitulo">Lo que buscaste antes</p>
            <div class="buscador-chips">${recientes.map((r) => chip(r, "fa-clock-rotate-left")).join("")}</div>
          </div>` : ""}
        <div class="buscador-sugerencias">
          <p class="buscador-subtitulo">Prueba con</p>
          <div class="buscador-chips">${SUGERENCIAS.map((s) => chip(s)).join("")}</div>
        </div>`;
      opciones = [];
      activa = -1;
      campo.setAttribute("aria-expanded", "false");
      campo.removeAttribute("aria-activedescendant");
      estado.textContent = "";
    }

    function fila(entrada, lista, id) {
      const g = GRUPO_DE[entrada.tipo];
      const marca = entrada.num
        ? `<span class="buscador-marca buscador-num">${entrada.num}</span>`
        : `<span class="buscador-marca"><i class="fa-solid ${GRUPOS[g].icono}" aria-hidden="true"></i></span>`;
      const meta = entrada.tipo === "apartado" ? `En el tema ${entrada.num}: ${entrada.en}`
        : entrada.tipo === "tema" ? `Tema ${entrada.num}`
        : entrada.tipo === "seccion" ? `En ${entrada.en}`
        : entrada.tipo === "recurso" ? `${entrada.formato ? `${entrada.formato} · ` : ""}${entrada.en}`
        : entrada.en || "";
      const externo = entrada.externo ? ` target="_blank" rel="noopener noreferrer"` : "";
      return `
        <a class="buscador-fila" role="option" id="${id}" aria-selected="false" href="${escapar(enRaiz(entrada.url))}"${externo}>
          ${marca}
          <span class="buscador-fila-texto">
            <span class="buscador-fila-titulo">${resaltarTexto(entrada.titulo, lista)}</span>
            ${meta ? `<span class="buscador-fila-meta">${escapar(meta)}</span>` : ""}
            ${entrada.desc && entrada.tipo !== "video" ? `<span class="buscador-fila-desc">${resaltarTexto(entrada.desc, lista)}</span>` : ""}
          </span>
          <i class="fa-solid ${entrada.externo ? "fa-arrow-up-right-from-square" : "fa-arrow-right"} buscador-flecha" aria-hidden="true"></i>
          ${entrada.externo ? `<span class="sr-only">(abre en otra pestaña)</span>` : ""}
        </a>`;
    }

    function pintar() {
      const consulta = campo.value.trim();
      ultimaConsulta = consulta;
      if (!consulta) return pintarInicio();
      if (!indice) {
        resultados.innerHTML = `<p class="buscador-cargando">Buscando…</p>`;
        return;
      }

      const lista = terminos(consulta);
      const grupos = buscar(consulta);
      const directorio = `
        <a class="buscador-fila buscador-fila-directorio" role="option" id="buscador-op-directorio" aria-selected="false"
           href="${escapar(enRaiz(`Views/directorio_alimentos.html#q=${encodeURIComponent(consulta)}`))}">
          <span class="buscador-marca"><i class="fa-solid fa-table-list" aria-hidden="true"></i></span>
          <span class="buscador-fila-texto">
            <span class="buscador-fila-titulo">Ver «${escapar(consulta)}» en el directorio de alimentos</span>
            <span class="buscador-fila-meta">Energía, proteína, lípidos e hidratos de carbono de cada porción</span>
          </span>
          <i class="fa-solid fa-arrow-right buscador-flecha" aria-hidden="true"></i>
        </a>`;

      if (!grupos.length) {
        resultados.innerHTML = `
          ${castor(`No encontré nada sobre «${escapar(consulta)}». Revisa cómo se escribe o prueba con una palabra más general, como «agua» o «verduras».`)}
          <div class="buscador-grupo">${directorio}</div>
          <div class="buscador-sugerencias">
            <p class="buscador-subtitulo">Prueba con</p>
            <div class="buscador-chips">${SUGERENCIAS.map((s) => chip(s)).join("")}</div>
          </div>`;
        estado.textContent = `Sin resultados para ${consulta}.`;
      } else {
        let n = 0;
        let total = 0;
        resultados.innerHTML = grupos.map(({ g, filas, total: cuantos }) => {
          total += cuantos;
          const verMas = g === "alimento" && cuantos > filas.length ? directorio : "";
          return `
            <div class="buscador-grupo" role="group" aria-labelledby="buscador-g-${g}">
              <p class="buscador-subtitulo" id="buscador-g-${g}">${GRUPOS[g].nombre} <span class="buscador-cuenta">${cuantos}</span></p>
              ${filas.map((e) => fila(e, lista, `buscador-op-${n++}`)).join("")}
              ${verMas}
            </div>`;
        }).join("");
        estado.textContent = `${total} ${total === 1 ? "resultado" : "resultados"} para ${consulta}.`;
      }

      opciones = [...resultados.querySelectorAll(".buscador-fila")];
      campo.setAttribute("aria-expanded", String(opciones.length > 0));
      marcar(opciones.length ? 0 : -1, false);
      cuerpo.scrollTop = 0;
    }

    function marcar(i, desplazar = true) {
      opciones.forEach((o) => o.setAttribute("aria-selected", "false"));
      activa = i;
      if (i < 0 || !opciones[i]) {
        campo.removeAttribute("aria-activedescendant");
        return;
      }
      opciones[i].setAttribute("aria-selected", "true");
      campo.setAttribute("aria-activedescendant", opciones[i].id);
      if (desplazar) opciones[i].scrollIntoView({ block: "nearest" });
    }

    function abrirBuscador() {
      if (dialogo.open) return campo.focus();
      cerrarMenuMovil();
      dialogo.showModal();
      abrir.setAttribute("aria-expanded", "true");
      campo.focus();
      campo.select();
      pintar();
      cargarDatos().then(() => { if (dialogo.open) pintar(); });
    }

    function cerrarBuscador() {
      if (dialogo.open) dialogo.close();
    }

    function cerrarMenuMovil() {
      const menu = document.getElementById("nav-menu");
      if (menu?.classList.contains("active")) document.getElementById("nav-toggle")?.click();
    }

    abrir.addEventListener("click", abrirBuscador);
    dialogo.addEventListener("close", () => abrir.setAttribute("aria-expanded", "false"));
    dialogo.querySelector(".buscador-cerrar").addEventListener("click", cerrarBuscador);

    // Clic en el velo (fuera de la hoja) cierra
    dialogo.addEventListener("click", (e) => {
      if (e.target === dialogo) cerrarBuscador();
    });

    let espera;
    campo.addEventListener("input", () => {
      clearTimeout(espera);
      espera = setTimeout(pintar, 90);
    });

    campo.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" && opciones.length) {
        e.preventDefault();
        marcar((activa + 1) % opciones.length);
      } else if (e.key === "ArrowUp" && opciones.length) {
        e.preventDefault();
        marcar((activa - 1 + opciones.length) % opciones.length);
      }
    });

    formulario.addEventListener("submit", (e) => {
      e.preventDefault();
      clearTimeout(espera);
      if (campo.value.trim() !== ultimaConsulta) pintar();
      const elegida = opciones[activa] || opciones[0];
      if (elegida) elegida.click();
    });

    resultados.addEventListener("click", (e) => {
      const sugerencia = e.target.closest(".buscador-chip");
      if (sugerencia) {
        campo.value = sugerencia.dataset.consulta;
        campo.focus();
        pintar();
        return;
      }
      const elegida = e.target.closest(".buscador-fila");
      if (!elegida) return;
      guardarReciente(campo.value);
      // Si el destino es esta misma página (solo cambia el #), se cierra el panel para verlo
      if (!elegida.target) setTimeout(cerrarBuscador, 0);
    });

    resultados.addEventListener("mousemove", (e) => {
      const sobre = e.target.closest(".buscador-fila");
      const i = opciones.indexOf(sobre);
      if (i !== -1 && i !== activa) marcar(i, false);
    });

    // Atajos de teclado: "/" fuera de un campo de texto, o Ctrl/Cmd + K en cualquier lugar
    document.addEventListener("keydown", (e) => {
      const escribiendo = e.target.closest?.("input, textarea, select, [contenteditable='true']");
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        abrirBuscador();
      } else if (e.key === "/" && !escribiendo && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        abrirBuscador();
      }
    });

    // Precarga discreta cuando el navegador está libre, para que el primer uso sea inmediato
    const precargar = () => cargarDatos();
    if ("requestIdleCallback" in window) requestIdleCallback(precargar, { timeout: 4000 });
    else setTimeout(precargar, 2500);
  }

  /* ---------- Al llegar desde un resultado: ir al apartado y resaltarlo ---------- */
  function llevarAlResultado() {
    const parametros = new URLSearchParams(location.search);
    const buscado = parametros.get("resaltar");
    if (!buscado) return;

    // Se quita el parámetro para que la dirección quede limpia y no se repita al recargar
    parametros.delete("resaltar");
    const resto = parametros.toString();
    history.replaceState(history.state, "", location.pathname + (resto ? `?${resto}` : "") + location.hash);

    const objetivo = normal(buscado.trim());
    const candidatos = document.querySelectorAll("main h1, main h2, main h3, main h4, main strong");
    const titulo = [...candidatos].find((el) => normal(el.textContent.trim()) === objetivo);
    if (!titulo) return;

    // Si el título vive en un selector (por ejemplo, las formas de preparación), se elige
    const selector = titulo.closest("button[aria-pressed]");
    if (selector && selector.getAttribute("aria-pressed") !== "true") selector.click();

    const bloque = selector || titulo.closest("li, article, .feature-card, .card") || titulo;
    bloque.scrollIntoView({ behavior: "smooth", block: "center" });
    bloque.classList.remove("buscador-destino");
    void bloque.offsetWidth;
    bloque.classList.add("buscador-destino");
    bloque.addEventListener("animationend", () => bloque.classList.remove("buscador-destino"), { once: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    iniciar();
    // Los temas, datos y videos se dibujan al cargar la página; se espera a que existan
    setTimeout(llevarAlResultado, 120);
  });
})();
