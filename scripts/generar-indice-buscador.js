/* ==========================================
   GENERADOR DEL ÍNDICE DEL BUSCADOR
   Lee el contenido real del sitio (páginas, temas, datos curiosos, videos y recursos)
   y escribe Js/buscador-indice.js, que usa el buscador del encabezado.
   Vuelve a correrlo cada vez que cambie el contenido:  node scripts/generar-indice-buscador.js
   Los alimentos no van aquí: el buscador los lee de Js/smae-datos.js al momento.
   ========================================== */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.join(__dirname, "..");
const leer = (archivo) => fs.readFileSync(path.join(RAIZ, archivo), "utf8");

/* ---------- Utilidades de texto ---------- */
const ENTIDADES = { amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " ", "#39": "'", apos: "'" };
function texto(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#?\w+);/g, (m, e) => ENTIDADES[e] ?? (e.startsWith("#") ? String.fromCharCode(+e.slice(1)) : m))
    .replace(/\$\{[^}]*\}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function recortar(cadena, max = 150) {
  if (cadena.length <= max) return cadena;
  const corte = cadena.slice(0, max);
  return corte.slice(0, corte.lastIndexOf(" ")) + "…";
}
/** Palabras clave: texto sin acentos, en minúsculas y sin repetir palabras. */
function claves(cadena, max = 1800) {
  const palabras = cadena
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .match(/[a-z0-9ñ%-]{3,}/g) || [];
  return [...new Set(palabras)].join(" ").slice(0, max);
}

/** Dirección que, al abrirse, desplaza la página hasta ese título y lo resalta (ver Js/buscador.js). */
const resaltar = (pagina, titulo, hash = "") => `${pagina}?resaltar=${encodeURIComponent(titulo)}${hash}`;

const entradas = [];
function agregar(entrada) {
  if (!entrada.titulo) return;
  const repetida = entradas.some((e) => e.url === entrada.url && e.titulo === entrada.titulo);
  if (!repetida) entradas.push(entrada);
}

/* ---------- Páginas y sus secciones ---------- */
const PAGINAS = [
  { archivo: "index.html", url: "index.html", nombre: "Inicio",
    extra: "inicio portada plato bien comer grupos alimentos" },
  { archivo: "Views/quienes_somos.html", url: "Views/quienes_somos.html", nombre: "¿Quiénes somos?",
    extra: "nosotros equipo mision vision utp universidad proyecto" },
  { archivo: "Views/calculadora.html", url: "Views/calculadora.html", nombre: "Calculadora",
    extra: "imc tmb calorias metabolismo basal agua hidratacion masa muscular peso estatura edad requerimiento" },
  { archivo: "Views/directorio_alimentos.html", url: "Views/directorio_alimentos.html", nombre: "Directorio de alimentos",
    extra: "smae equivalentes alimentos calorias proteina lipidos grasas carbohidratos tabla nutrimental" },
  { archivo: "Views/calculadora_alimentos.html", url: "Views/calculadora_alimentos.html", nombre: "Calculadora de alimentos",
    extra: "receta recetas pdf foto ingredientes calorias smae gastronomia porciones" },
  { archivo: "Views/sabias_que.html", url: "Views/sabias_que.html", nombre: "¿Sabías qué?",
    extra: "datos curiosos curiosidades" },
  { archivo: "Views/videos.html", url: "Views/videos.html", nombre: "Videos",
    extra: "videoteca videos youtube imss" },
  { archivo: "Views/recursos.html", url: "Views/recursos.html", nombre: "Recursos",
    extra: "guias documentos pdf descargar instituciones fuentes oficiales" },
  { archivo: "Views/tu_opinion.html", url: "Views/tu_opinion.html", nombre: "Tu opinión",
    extra: "encuesta opinion comentarios sugerencias contacto" }
];

for (const pagina of PAGINAS) {
  const html = leer(pagina.archivo);
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [html])[0];
  const lead = main.match(/<p class="(?:lead|mesa-lead|portada-lead)[^"]*"[^>]*>([\s\S]*?)<\/p>/);

  agregar({
    tipo: "pagina",
    titulo: pagina.nombre,
    desc: recortar(texto(lead ? lead[1] : (main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || ["", ""])[1])),
    url: pagina.url,
    etiquetas: claves(pagina.extra),
    claves: claves(texto(main))
  });

  // Cada <section> con id y un h2 se vuelve una entrada con ancla
  const secciones = main.match(/<section[^>]*\bid="[^"]+"[\s\S]*?<\/section>/g) || [];
  for (const seccion of secciones) {
    const id = seccion.match(/\bid="([^"]+)"/)[1];
    const h2 = seccion.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
    if (!h2 || pagina.archivo === "Views/recursos.html") continue;
    const p = seccion.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    agregar({
      tipo: "seccion",
      titulo: texto(h2[1]),
      en: pagina.nombre,
      desc: recortar(p ? texto(p[1]) : ""),
      url: `${pagina.url}#${id}`,
      claves: claves(texto(seccion))
    });
  }
}

/* ---------- Recursos oficiales (enlaces externos) ---------- */
const recursos = leer("Views/recursos.html").match(/<li>\s*<a href="http[\s\S]*?<\/li>/g) || [];
for (const li of recursos) {
  const href = li.match(/href="([^"]+)"/)[1];
  const titulo = texto((li.match(/<strong>([\s\S]*?)<\/strong>/) || ["", ""])[1]);
  const fuente = texto((li.match(/class="recurso-fuente">([\s\S]*?)<\/span>/) || ["", ""])[1]);
  const desc = texto((li.match(/<\/span>\s*<span>([\s\S]*?)<\/span>/) || ["", ""])[1]);
  const formato = texto((li.match(/class="recurso-tipo[^"]*">([\s\S]*?)<\/span>/) || ["", ""])[1]);
  agregar({ tipo: "recurso", titulo, en: fuente, desc: recortar(desc), url: href, externo: true, formato,
    claves: claves(`${titulo} ${fuente} ${desc} ${formato}`) });
}

/* ---------- Temas (se dibujan con JavaScript, así que se ejecutan aquí) ---------- */
const contexto = {
  document: { addEventListener() {}, getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; } },
  window: { location: { hash: "", pathname: "", search: "" }, matchMedia: () => ({ matches: false }) },
  localStorage: { getItem() { return null; }, setItem() {} },
  console
};
contexto.window.document = contexto.document;
vm.createContext(contexto);
for (const archivo of ["Js/temas.js", "Js/preparacion.js", "Js/sabias_que.js", "Js/videos.js"]) {
  // const/let de primer nivel no quedan en el contexto: se exponen como var
  vm.runInContext(leer(archivo).replace(/^(const|let) /gm, "var "), contexto, { filename: archivo });
}

const FUNCIONES_TEMA = {
  "1": "getTema1HTML", "2": "getTema2HTML", "3": "getTema3HTML", "4": "getTema4HTML",
  "5": "getTema5HTML", "6": "getTema6FallbackHTML", "7": "getTema7HTML",
  "8": "getTema8FallbackHTML", "9": "getTema9HTML", "10": "getTema10HTML"
};
const EXTRA_TEMAS = {
  "1": "incmnsz alimentacion saludable dieta correcta comer bien",
  "2": "guias alimentarias 2023 recomendaciones",
  "3": "agua hidratacion bebidas refresco jugo cafe te leche vasos",
  "4": "plato bien comer nom-043 grupos verduras frutas cereales leguminosas origen animal",
  "5": "sostenibilidad medio ambiente planeta cowspiracy desperdicio",
  "6": "ejercicio actividad fisica deporte cardio fuerza caminar oms",
  "7": "recetas cocina desayuno comida cena",
  "8": "nom normas ley etiquetado habitos menu planificacion",
  "9": "comparar comparador alimentos calorias azucar sodio grasa",
  "10": "preparar cocinar hervir vapor horno freir asar plancha metodos coccion"
};

for (const [n, fn] of Object.entries(FUNCIONES_TEMA)) {
  const html = contexto[fn]();
  const titulo = contexto.TITULOS_TEMAS[n];
  const url = `Views/temas.html#tema-${n}`;
  const p = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);

  agregar({ tipo: "tema", num: +n, titulo, desc: recortar(p ? texto(p[1]) : ""), url,
    etiquetas: claves(EXTRA_TEMAS[n]), claves: claves(texto(html)) });

  // Cada subtítulo del tema (h2/h3) es una entrada propia para búsquedas específicas
  const partes = html.split(/(?=<h[23][\s>])/).slice(1);
  for (const parte of partes) {
    const h = parte.match(/^<h[23][^>]*>([\s\S]*?)<\/h[23]>/);
    if (!h) continue;
    const subtitulo = texto(h[1]);
    if (!subtitulo || subtitulo === titulo || subtitulo.length < 4) continue;
    const parrafo = parte.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    agregar({ tipo: "apartado", num: +n, titulo: subtitulo, en: titulo,
      desc: recortar(parrafo ? texto(parrafo[1]) : ""), url: resaltar("Views/temas.html", subtitulo, `#tema-${n}`),
      claves: claves(texto(parte).slice(0, 600)) });
  }
}

// Métodos de preparación del tema 10 (se dibujan desde datos)
for (const m of contexto.METODOS_PREPARACION || []) {
  const nombre = m.nombre || m.titulo;
  if (!nombre) continue;
  const desc = m.descripcion || m.desc || m.resumen || "";
  agregar({ tipo: "apartado", num: 10, titulo: nombre, en: contexto.TITULOS_TEMAS["10"],
    desc: recortar(texto(String(desc))), url: resaltar("Views/temas.html", nombre, "#tema-10"),
    claves: claves(texto(JSON.stringify(m))) });
}

/* ---------- Datos curiosos ---------- */
for (const d of contexto.datosCuriosos) {
  agregar({ tipo: "dato", titulo: d.titulo, en: contexto.categoriasDatos[d.categoria], desc: d.descripcion,
    url: resaltar("Views/sabias_que.html", d.titulo), claves: claves(`${d.titulo} ${d.descripcion} ${d.categoria}`) });
}

/* ---------- Videos ---------- */
for (const v of contexto.videos) {
  agregar({ tipo: "video", titulo: v.titulo, en: v.canal, desc: `${contexto.temasVideo[v.tema]} · ${v.duracion}`,
    url: `${resaltar("Views/videos.html", v.titulo)}&tema=${v.tema}`, claves: claves(`${v.titulo} ${v.canal} ${contexto.temasVideo[v.tema]}`) });
}

/* ---------- Escritura ---------- */
const salida = `/* ==========================================
   ÍNDICE DEL BUSCADOR — archivo generado, no editar a mano.
   Se regenera con: node scripts/generar-indice-buscador.js
   ========================================== */
window.INDICE_BUSCADOR = ${JSON.stringify(entradas)};
`;
fs.writeFileSync(path.join(RAIZ, "Js/buscador-indice.js"), salida);

const cuenta = entradas.reduce((t, e) => ({ ...t, [e.tipo]: (t[e.tipo] || 0) + 1 }), {});
console.log(`Índice escrito: ${entradas.length} entradas`, cuenta, `${(salida.length / 1024).toFixed(1)} KB`);
