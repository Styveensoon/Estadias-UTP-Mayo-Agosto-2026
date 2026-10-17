/* ==========================================
   DIRECTORIO DE ALIMENTOS (Views/directorio_alimentos.html)
   - Reparte los 2,323 alimentos del SMAE (Js/smae-datos.js) en nueve categorías de cocina.
   - Buscador en tiempo real sobre toda la base o dentro de la categoría abierta.
   - La categoría y la búsqueda viven en la dirección (#cat=lacteos&q=queso): Atrás funciona.
   ========================================== */
(() => {
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const escapar = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const normal = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const fmt = (n, dec = 1) => (n == null || !Number.isFinite(n) ? "ND" :
    n.toLocaleString("es-MX", { minimumFractionDigits: dec, maximumFractionDigits: dec }));
  const fmtCant = (n) => {
    if (n == null) return "";
    const e = Math.floor(n + 1e-9), r = n - e;
    const f = [[1 / 4, "1/4"], [1 / 3, "1/3"], [1 / 2, "1/2"], [2 / 3, "2/3"], [3 / 4, "3/4"], [1 / 5, "1/5"]].find(([v]) => Math.abs(r - v) < 0.02);
    if (r < 0.02) return String(e);
    if (f) return e ? `${e} ${f[1]}` : f[1];
    return String(Math.round(n * 100) / 100);
  };
  const sinMov = () => typeof sinMovimiento !== "undefined" && sinMovimiento.matches;

  /* ---------- Categorías ---------- */
  const CATEGORIAS = [
    { id: "frutas-verduras", nombre: "Frutas y verduras", icono: "fa-apple-whole", color: "#15803d",
      texto: "Vitaminas, minerales, fibra y agua para cada comida." },
    { id: "cereales-tuberculos", nombre: "Cereales y tubérculos", icono: "fa-wheat-awn", color: "#f2b705", tintaIcono: "#0f2a1c",
      texto: "Tortilla, arroz, avena, pan, papa y camote: tu energía." },
    { id: "leguminosas", nombre: "Leguminosas", icono: "fa-seedling", color: "#c2410c",
      texto: "Frijol, lenteja, garbanzo y haba: proteína vegetal y fibra." },
    { id: "proteinas-carnes", nombre: "Proteínas y carnes", icono: "fa-drumstick-bite", color: "#d62839",
      texto: "Pollo, res, cerdo, huevo y embutidos." },
    { id: "lacteos", nombre: "Lácteos", icono: "fa-cheese", color: "#be185d",
      texto: "Leche, yogur, quesos y bebidas lácteas." },
    { id: "grasas", nombre: "Grasas saludables", icono: "fa-bottle-droplet", color: "#9a6a00",
      texto: "Aceites, aguacate y aderezos. Prefiere los de origen vegetal." },
    { id: "pescados-mariscos", nombre: "Pescados y mariscos", icono: "fa-fish", color: "#0f766e",
      texto: "Atún, sardina, tilapia, camarón y más: proteína y omega 3." },
    { id: "semillas", nombre: "Semillas y frutos secos", icono: "fa-leaf", color: "#6e3f1f",
      texto: "Nueces, almendras, cacahuate, chía y pepitas." },
    { id: "bebidas", nombre: "Agua y bebidas", icono: "fa-glass-water", color: "#0369a1",
      texto: "Agua, café, té, jugos, refrescos y bebidas alcohólicas." }
  ];
  const OTROS = { id: "otros", nombre: "Azúcares y condimentos", icono: "fa-candy-cane", color: "#3f5648",
    texto: "Dulces, mermeladas, especias y otros alimentos del SMAE que no entran en las nueve categorías." };
  const TODAS = [...CATEGORIAS, OTROS];

  const PESCADO = /\b(pescado|atun|salmon|sardina|tilapia|mojarra|huachinango|guachinango|robalo|bacalao|almeja|ostion|ostra|calamar|pulpo|camaron|langost|jaiba|cangrejo|mero|trucha|anchoa|charal|marlin|sierra|cazon|abulon|mejillon|callo|surimi|caracol|pampano|lenguado|merluza|macarela|arenque|bagre|carpa|bonito|cabrilla|corvina|dorado|esmedregal|lisa|pargo|peto|raya|rubia|tiburon|caviar|hueva|filete de pescado|mariscos?|langostino|acociles|acocil|ahuahutle|ahuahutie|boquerones?|basa|huevas?)\b/;
  const LACTEO = /\b(queso|yogur|yoghurt|yogurt|requeson|jocoque|leche|kefir|labneh|panela|cottage|ricotta|mozzarella|danonino|petit|bebida lactea)\b/;
  const SEMILLA = /\b(ajonjoli|almendra|avellana|cacahuate|cacahuates|cacao|chia|linaza|nuez|nueces|pistache|pistaches|pepita|pepitas|semilla|semillas|pinon|pinones|macadamia|girasol|kkwate|hot nuts|mafer|coroso|mazapan|tahini|hummus|falafel|castana|marañon|maranon)\b/;
  const EMBUTIDO = /\b(chorizo|chistorra|chilorio|jamon|tocino|salami|pepperoni|longaniza|salchicha|mortadela|queso de puerco|chicharron|cecina|manteca de cerdo|carnitas)\b/;
  const BEBIDA = /\b(agua|cafe|te|refresco|refrescos|bebida|bebidas|jugo|jugos|nectar|limonada|naranjada|gatorade|powerade|monster|energizante|coca|sidral|soda|decaf|nescafe|capuchino|frappe|licor|cerveza|vino|tequila|mezcal|ron|vodka|whisky|brandy|ginebra|champana|sidra|pulque|kool|boing|squirt|sprite|fanta|pepsi|electrolit|suero|infusion|tisana|horchata|jamaica|tepache|atole)\b/;

  function categoriaDe(nombre, grupo) {
    const n = normal(nombre);
    if (grupo === "verduras" || grupo === "frutas") return "frutas-verduras";
    if (grupo.startsWith("cereales")) return "cereales-tuberculos";
    if (grupo === "leguminosas") return "leguminosas";
    if (grupo.startsWith("leche")) return "lacteos";
    if (grupo.startsWith("aoa")) {
      if (PESCADO.test(n)) return "pescados-mariscos";
      if (LACTEO.test(n)) return "lacteos";
      return "proteinas-carnes";
    }
    if (grupo.startsWith("grasas")) {
      if (EMBUTIDO.test(n)) return "proteinas-carnes";
      if (SEMILLA.test(n) && !/^(aceite|margarina|mantequilla|manteca)\b/.test(n)) return "semillas";
      return "grasas";
    }
    if (grupo === "alcohol") return "bebidas";
    if (/\b(yogur|yoghurt|yogurt|danonino|leche condensada|leche evaporada)\b/.test(n)) return "lacteos";
    if (BEBIDA.test(n) && !/\b(en polvo|polvo para|gelatina|caldo|consome|paleta|helad[oa]|vinagre|jarabe|mermelada|dulce de)\b/.test(n)) return "bebidas";
    return "otros";
  }

  const GRUPOS = typeof SMAE_GRUPOS !== "undefined" ? SMAE_GRUPOS : {};
  const ALIMENTOS = (typeof SMAE_ALIMENTOS !== "undefined" ? SMAE_ALIMENTOS : []).map((f, id) => {
    const [n, g, c, u, b, w, e, p, l, h, a] = f;
    return { id, n, g, c, u: u || "g", b, w, e, p, l, h, a: a ?? null, cat: categoriaDe(n, g), clave: normal(n) };
  });
  const porCategoria = Object.fromEntries(TODAS.map((c) => [c.id, ALIMENTOS.filter((a) => a.cat === c.id)]));

  /* ---------- Búsqueda ---------- */
  function coincide(a, palabras) {
    return palabras.every((p) => a.clave.includes(p));
  }
  function filtrar(lista, consulta) {
    const palabras = normal(consulta).split(/\s+/).filter(Boolean);
    if (!palabras.length) return lista;
    return lista.filter((a) => coincide(a, palabras))
      // Primero los que empiezan con lo buscado
      .sort((x, y) => (y.clave.startsWith(palabras[0]) - x.clave.startsWith(palabras[0])) || x.n.localeCompare(y.n, "es"));
  }
  function resaltar(texto, consulta) {
    const palabras = normal(consulta).split(/\s+/).filter((p) => p.length > 0);
    if (!palabras.length) return escapar(texto);
    const base = normal(texto);
    const marcas = new Array(texto.length).fill(false);
    palabras.forEach((p) => {
      let i = base.indexOf(p);
      while (i !== -1) { for (let k = i; k < i + p.length; k++) marcas[k] = true; i = base.indexOf(p, i + p.length); }
    });
    let html = "", abierto = false;
    [...texto].forEach((ch, i) => {
      if (marcas[i] && !abierto) { html += "<mark>"; abierto = true; }
      if (!marcas[i] && abierto) { html += "</mark>"; abierto = false; }
      html += escapar(ch);
    });
    return html + (abierto ? "</mark>" : "");
  }

  /* ---------- Estado y dirección ---------- */
  const ORDENES = {
    nombre: (x, y) => x.n.localeCompare(y.n, "es"),
    e: (x, y) => (y.e ?? -1) - (x.e ?? -1),
    p: (x, y) => (y.p ?? -1) - (x.p ?? -1),
    l: (x, y) => (y.l ?? -1) - (x.l ?? -1),
    h: (x, y) => (y.h ?? -1) - (x.h ?? -1),
    "e-asc": (x, y) => (x.e ?? 1e9) - (y.e ?? 1e9)
  };
  let estado = { cat: null, q: "", grupo: "todos", orden: "nombre", limite: 60 };

  function leerDireccion() {
    const p = new URLSearchParams(location.hash.slice(1));
    const cat = p.get("cat");
    return { cat: TODAS.some((c) => c.id === cat) ? cat : null, q: p.get("q") || "" };
  }
  function escribirDireccion(reemplazar) {
    const p = new URLSearchParams();
    if (estado.cat) p.set("cat", estado.cat);
    if (estado.q) p.set("q", estado.q);
    const hash = p.toString() ? "#" + p.toString() : location.pathname + location.search;
    if (reemplazar) history.replaceState(null, "", hash);
    else history.pushState(null, "", hash);
  }

  /* ---------- Interfaz ---------- */
  const el = {};
  document.addEventListener("DOMContentLoaded", () => {
    Object.assign(el, {
      buscar: $("#da-buscar"), limpiar: $("#da-limpiar"), ambito: $("#da-ambito"), ambitoNombre: $("#da-ambito-nombre"),
      ambitoQuitar: $("#da-ambito-quitar"), anuncio: $("#da-anuncio"), inicio: $("#da-inicio"), grid: $("#da-grid"),
      otros: $("#da-otros"), vista: $("#da-vista"), total: $("#da-total")
    });
    if (!el.grid) return;
    el.total.textContent = ALIMENTOS.length.toLocaleString("es-MX");
    dibujarGrid();

    const inicial = leerDireccion();
    estado.cat = inicial.cat;
    estado.q = inicial.q;
    el.buscar.value = estado.q;
    render({ animar: false });

    let pendiente = null;
    el.buscar.addEventListener("input", () => {
      estado.q = el.buscar.value;
      estado.limite = 60;
      render();
      clearTimeout(pendiente);
      pendiente = setTimeout(() => escribirDireccion(true), 300);
    });
    el.buscar.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && el.buscar.value) { e.preventDefault(); limpiarBusqueda(); }
    });
    el.limpiar.addEventListener("click", () => { limpiarBusqueda(); el.buscar.focus(); });
    el.ambitoQuitar.addEventListener("click", () => irA(null, { conservarBusqueda: true }));

    // "/" enfoca el buscador desde cualquier parte
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        el.buscar.focus();
      }
    });

    el.grid.addEventListener("click", (e) => {
      const tarjeta = e.target.closest("[data-cat]");
      if (tarjeta) irA(tarjeta.dataset.cat);
    });
    el.otros.addEventListener("click", () => irA("otros"));
    el.vista.addEventListener("click", (e) => {
      if (e.target.closest(".da-volver")) return irA(null);
      const chip = e.target.closest("[data-grupo]");
      if (chip) { estado.grupo = chip.dataset.grupo; estado.limite = 60; render({ soloLista: true }); return; }
      const ir = e.target.closest("[data-ir]");
      if (ir) return irA(ir.dataset.ir, { conservarBusqueda: true });
      if (e.target.closest(".da-mas")) { estado.limite += 120; render({ soloLista: true, conservarScroll: true }); }
    });
    el.vista.addEventListener("change", (e) => {
      if (e.target.matches("#da-orden")) { estado.orden = e.target.value; render({ soloLista: true }); }
    });
    window.addEventListener("popstate", () => {
      const d = leerDireccion();
      estado = { ...estado, cat: d.cat, q: d.q, grupo: "todos", limite: 60 };
      el.buscar.value = estado.q;
      render();
    });
  });

  function limpiarBusqueda() {
    el.buscar.value = "";
    estado.q = "";
    estado.limite = 60;
    render();
    escribirDireccion(true);
  }

  function irA(cat, { conservarBusqueda = false } = {}) {
    estado.cat = cat;
    estado.grupo = "todos";
    estado.orden = "nombre";
    estado.limite = 60;
    if (!conservarBusqueda) { estado.q = ""; el.buscar.value = ""; }
    escribirDireccion(false);
    render();
    const destino = document.getElementById("da-buscador-zona");
    if (destino.getBoundingClientRect().top < 0 || cat) {
      destino.scrollIntoView({ behavior: sinMov() ? "auto" : "smooth", block: "start" });
    }
  }

  function dibujarGrid() {
    el.grid.innerHTML = CATEGORIAS.map((c) => `
      <li>
        <button type="button" class="da-tarjeta" data-cat="${c.id}" style="--c:${c.color};--ci:${c.tintaIcono || "#fff"};--ii:${c.tintaIcono || c.color}">
          <span class="da-tarjeta-icono" aria-hidden="true"><i class="fa-solid ${c.icono}"></i></span>
          <span class="da-tarjeta-nombre">${c.nombre}</span>
          <span class="da-tarjeta-texto">${c.texto}</span>
          <span class="da-tarjeta-pie"><strong>${porCategoria[c.id].length.toLocaleString("es-MX")}</strong> alimentos
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
        </button>
      </li>`).join("");
    el.otros.querySelector("strong").textContent = porCategoria.otros.length.toLocaleString("es-MX");
  }

  function transicion(fn, animar) {
    if (animar && document.startViewTransition && !sinMov()) document.startViewTransition(fn);
    else fn();
  }

  function render({ animar = true, soloLista = false, conservarScroll = false } = {}) {
    const cat = estado.cat ? TODAS.find((c) => c.id === estado.cat) : null;
    const q = estado.q.trim();

    // Ámbito del buscador
    el.ambito.hidden = !cat;
    if (cat) el.ambitoNombre.textContent = cat.nombre;
    el.limpiar.hidden = !estado.q;
    document.title = (cat ? `${cat.nombre} - ` : q ? `«${q}» - ` : "") + "Directorio de alimentos - WellDataLab";

    if (soloLista) { dibujarLista(cat, q, { conservarScroll }); return; }

    transicion(() => {
      const enInicio = !cat && !q;
      el.inicio.hidden = !enInicio;
      el.vista.hidden = enInicio;
      if (enInicio) {
        el.anuncio.textContent = "";
        if (animar && typeof escalonar === "function") escalonar(el.grid.children);
        return;
      }
      el.vista.innerHTML = cabeceraVista(cat, q) + `<div id="da-lista"></div>`;
      dibujarLista(cat, q, { animar });
    }, animar && !soloLista);
  }

  function cabeceraVista(cat, q) {
    if (!cat) {
      return `
        <div class="da-vista-cabeza">
          <button type="button" class="da-volver"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Todas las categorías</button>
          <h2 class="da-vista-titulo">Resultados para «${escapar(q)}»</h2>
          <p class="da-vista-texto">Búsqueda en todo el directorio. Elige una categoría para ver solo sus alimentos.</p>
        </div>
        <div class="da-controles" id="da-controles"></div>`;
    }
    return `
      <div class="da-vista-cabeza" style="--c:${cat.color};--ci:${cat.tintaIcono || "#fff"};--ii:${cat.tintaIcono || cat.color}">
        <button type="button" class="da-volver"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Todas las categorías</button>
        <div class="da-vista-titular">
          <span class="da-tarjeta-icono" aria-hidden="true"><i class="fa-solid ${cat.icono}"></i></span>
          <div>
            <h2 class="da-vista-titulo">${cat.nombre}</h2>
            <p class="da-vista-texto">${cat.texto}</p>
          </div>
        </div>
      </div>
      <div class="da-controles" id="da-controles"></div>`;
  }

  function dibujarLista(cat, q, { animar = false, conservarScroll = false } = {}) {
    const base = cat ? porCategoria[cat.id] : ALIMENTOS;
    let lista = filtrar(base, q);

    // Subgrupos del SMAE presentes (chips de filtro)
    const conteo = {};
    lista.forEach((a) => { conteo[a.g] = (conteo[a.g] || 0) + 1; });
    const grupos = Object.keys(GRUPOS).filter((g) => conteo[g]);
    if (estado.grupo !== "todos" && !conteo[estado.grupo]) estado.grupo = "todos";
    if (estado.grupo !== "todos") lista = lista.filter((a) => a.g === estado.grupo);
    if (!q || estado.orden !== "nombre") lista = [...lista].sort(ORDENES[estado.orden]);

    const controles = document.getElementById("da-controles");
    controles.innerHTML = `
      ${grupos.length > 1 ? `
        <div class="da-chips" role="group" aria-label="Filtrar por grupo del SMAE">
          <button type="button" class="filtro" data-grupo="todos" aria-pressed="${estado.grupo === "todos"}">Todos <span class="filtro-total">${Object.values(conteo).reduce((s, v) => s + v, 0)}</span></button>
          ${grupos.map((g) => `<button type="button" class="filtro" data-grupo="${g}" aria-pressed="${estado.grupo === g}"><span class="da-punto" style="--c:${GRUPOS[g].color}"></span>${escapar(GRUPOS[g].nombre)} <span class="filtro-total">${conteo[g]}</span></button>`).join("")}
        </div>` : ""}
      <div class="da-orden">
        <label for="da-orden">Ordenar por</label>
        <select id="da-orden" class="da-select">
          ${[["nombre", "Nombre (A-Z)"], ["e", "Más energía"], ["e-asc", "Menos energía"], ["p", "Más proteína"], ["l", "Más lípidos"], ["h", "Más hidratos de carbono"]]
            .map(([v, t]) => `<option value="${v}"${estado.orden === v ? " selected" : ""}>${t}</option>`).join("")}
        </select>
      </div>`;

    const contenedor = document.getElementById("da-lista");
    const total = lista.length;
    el.anuncio.textContent = `${total.toLocaleString("es-MX")} ${total === 1 ? "alimento" : "alimentos"}${q ? ` con «${q}»` : ""}${cat ? ` en ${cat.nombre}` : ""}.`;

    if (!total) {
      const enOtras = q && cat ? filtrar(ALIMENTOS, q) : [];
      const sugerencias = [...new Set(enOtras.map((a) => a.cat))].slice(0, 4);
      contenedor.innerHTML = `
        <div class="da-vacio">
          <p><strong>No encontramos «${escapar(q)}»${cat ? ` en ${escapar(cat.nombre)}` : " en el SMAE"}.</strong></p>
          ${sugerencias.length ? `<p>Sí aparece en: ${sugerencias.map((id) => {
            const c = TODAS.find((x) => x.id === id);
            return `<button type="button" class="da-enlace" data-ir="${id}">${escapar(c.nombre)}</button>`;
          }).join(", ")}${cat ? ` o <button type="button" class="da-enlace" data-ir="">en todo el directorio</button>` : ""}.</p>`
          : `<p>Revisa la ortografía o prueba con una palabra más corta, por ejemplo «pollo» en lugar de «pechuga de pollo asada».</p>`}
        </div>`;
      return;
    }

    const visibles = lista.slice(0, estado.limite);
    contenedor.innerHTML = `
      <p class="da-conteo"><strong>${total.toLocaleString("es-MX")}</strong> ${total === 1 ? "alimento" : "alimentos"} · valores por un equivalente del SMAE</p>
      <div class="da-tabla-caja">
        <table class="da-tabla">
          <caption class="sr-only">Alimentos y su aporte por equivalente</caption>
          <thead>
            <tr>
              <th scope="col">Alimento</th>
              <th scope="col">Equivalente</th>
              <th scope="col" class="num">Energía <span>(kcal)</span></th>
              <th scope="col" class="num">Proteína <span>(g)</span></th>
              <th scope="col" class="num">Lípidos <span>(g)</span></th>
              <th scope="col" class="num">HC <span>(g)</span></th>
            </tr>
          </thead>
          <tbody>${visibles.map((a) => filaHTML(a, q, !cat)).join("")}</tbody>
        </table>
      </div>
      ${total > visibles.length ? `<button type="button" class="ca-boton-suave da-mas">Mostrar más <span>(${(total - visibles.length).toLocaleString("es-MX")} restantes)</span></button>` : ""}`;
    if (animar && typeof escalonar === "function") escalonar(contenedor.querySelectorAll("tbody tr"));
  }

  function filaHTML(a, q, mostrarCategoria) {
    const cat = TODAS.find((c) => c.id === a.cat);
    const kp = (a.p || 0) * 4, kl = (a.l || 0) * 9, kh = (a.h || 0) * 4, kt = kp + kl + kh;
    const barra = kt ? `
      <span class="da-mini" aria-hidden="true">
        <span style="flex-grow:${kp}" class="m-p"></span><span style="flex-grow:${kl}" class="m-l"></span><span style="flex-grow:${kh}" class="m-h"></span>
      </span>` : "";
    const peso = a.w != null && a.u !== "g" ? ` <span class="da-peso">(${fmt(a.w, 0)} g)</span>` : "";
    return `
      <tr>
        <th scope="row">
          <span class="da-nombre">${resaltar(a.n, q)}</span>
          <span class="da-grupo"><span class="da-punto" style="--c:${GRUPOS[a.g]?.color}"></span>${mostrarCategoria ? `${escapar(cat.nombre)} · ` : ""}${escapar(GRUPOS[a.g]?.nombre || "")}</span>
          ${barra}
        </th>
        <td class="da-equivalente" data-etiqueta="Equivalente">${escapar(fmtCant(a.c))} ${escapar(a.u)}${peso}</td>
        <td class="num da-kcal" data-etiqueta="kcal">${fmt(a.e, 0)}</td>
        <td class="num" data-etiqueta="Prot. (g)">${fmt(a.p)}</td>
        <td class="num" data-etiqueta="Líp. (g)">${fmt(a.l)}</td>
        <td class="num" data-etiqueta="HC (g)">${fmt(a.h)}</td>
      </tr>`;
  }

  window.directorioAlimentos = { categoriaDe, porCategoria, filtrar };
})();
