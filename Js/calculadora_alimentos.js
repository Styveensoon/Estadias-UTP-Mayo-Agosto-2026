/* ==========================================
   CALCULADORA DE ALIMENTOS (Views/calculadora_alimentos.html)
   - Lee recetas o listas de compras en PDF, imagen o texto (pdf.js y Tesseract.js, cargados al usarse).
   - Reconoce cantidad, unidad e ingrediente de cada renglón y lo empareja con el SMAE (Js/smae-datos.js).
   - Calcula equivalentes, peso neto y bruto, energía y macronutrimentos de cada insumo y de toda la receta.
   - Escala la receta según las porciones que se quieran preparar.
   ========================================== */
(() => {
  const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const TESSERACT = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
  const CLAVE_GUARDADO = "calcAlimentosReceta";

  const RECETA_EJEMPLO = `Arroz a la mexicana con pollo
Rinde 4 porciones

Ingredientes:
- 1 taza de arroz crudo
- 2 jitomates
- 1/4 de cebolla
- 1 diente de ajo
- 2 cucharadas de aceite
- 400 g de pechuga de pollo sin piel
- 1 zanahoria
- 1/2 taza de chícharos
- 2 tazas de caldo de pollo
- Sal al gusto

Preparación:
Lava el arroz y fríelo en el aceite hasta que esté dorado.`;

  /* ---------- Utilidades ---------- */
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const escapar = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sinAcentos = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const fmt = (n, dec = 1) => (n == null || !Number.isFinite(n) ? "—" :
    n.toLocaleString("es-MX", { minimumFractionDigits: dec, maximumFractionDigits: dec }));
  const fmtCant = (n) => {
    if (n == null || !Number.isFinite(n)) return "";
    const enteros = Math.floor(n + 1e-9);
    const resto = n - enteros;
    const fracciones = [[1 / 4, "1/4"], [1 / 3, "1/3"], [1 / 2, "1/2"], [2 / 3, "2/3"], [3 / 4, "3/4"]];
    const f = fracciones.find(([v]) => Math.abs(resto - v) < 0.02);
    if (resto < 0.02) return String(enteros);
    if (f) return enteros ? `${enteros} ${f[1]}` : f[1];
    return fmt(n, n < 10 ? 2 : 1).replace(/,?0+$/, "").replace(/\.$/, "");
  };
  const sinMov = () => typeof sinMovimiento !== "undefined" && sinMovimiento.matches;

  function cargarScript(url) {
    return new Promise((resolver, rechazar) => {
      if (document.querySelector(`script[src="${url}"]`)) return resolver();
      const s = document.createElement("script");
      s.src = url;
      s.onload = resolver;
      s.onerror = () => rechazar(new Error("No se pudo cargar " + url));
      document.head.appendChild(s);
    });
  }

  /* ---------- Unidades ---------- */
  // Masa en gramos y volumen en mililitros; lo demás son unidades de conteo
  const MASA = { g: 1, kg: 1000, mg: 0.001, oz: 28.35, lb: 453.6 };
  const VOLUMEN = { ml: 1, l: 1000, taza: 240, cucharada: 15, cucharadita: 5, vaso: 240, copa: 150 };
  const SINONIMOS_UNIDAD = [
    [/^(g|gr|grs|gramos?)$/, "g"], [/^(kg|kgs|kilos?|kilogramos?)$/, "kg"], [/^(mg|miligramos?)$/, "mg"],
    [/^(ml|mililitros?|cc)$/, "ml"], [/^(l|lt|lts|litros?)$/, "l"],
    [/^(oz|onzas?)$/, "oz"], [/^(lb|lbs|libras?)$/, "lb"],
    [/^(tazas?|tz)$/, "taza"], [/^(cucharadas?|cdas?|cda|c\/s|cs)$/, "cucharada"],
    [/^(cucharaditas?|cditas?|cdtas?|cdta|c\/c|cc\.)$/, "cucharadita"],
    [/^(piezas?|pzas?|pz|pzs|unidad(es)?)$/, "pieza"], [/^(rebanadas?|reb)$/, "rebanada"],
    [/^(latas?)$/, "lata"], [/^(dientes?)$/, "diente"], [/^(hojas?)$/, "hoja"], [/^(ramas?|ramitas?)$/, "rama"],
    [/^(manojos?)$/, "manojo"], [/^(vasos?)$/, "vaso"], [/^(copas?)$/, "copa"], [/^(sobres?)$/, "sobre"],
    [/^(paquetes?)$/, "paquete"], [/^(bolsas?)$/, "bolsa"], [/^(frascos?)$/, "frasco"], [/^(barras?)$/, "barra"],
    [/^(pizcas?)$/, "pizca"], [/^(filetes?)$/, "filete"], [/^(tiras?)$/, "tira"], [/^(trozos?)$/, "trozo"]
  ];
  const unidadDe = (palabra) => {
    const p = sinAcentos(palabra.toLowerCase()).replace(/\.$/, "");
    const s = SINONIMOS_UNIDAD.find(([re]) => re.test(p));
    return s ? s[1] : null;
  };
  // Unidad del SMAE reducida a su palabra base ("pieza pequeña" → "pieza")
  const unidadBase = (u) => {
    const p = sinAcentos((u || "").toLowerCase());
    if (!p) return "g";
    return unidadDe(p.split(/\s+/)[0]) || unidadDe(p) || p.split(/\s+/)[0];
  };
  const tipoUnidad = (u) => (u in MASA ? "masa" : u in VOLUMEN ? "volumen" : "conteo");

  /* ---------- Base de datos ---------- */
  const PALABRAS_VACIAS = new Set(["de", "del", "la", "el", "los", "las", "en", "con", "y", "a", "al", "para", "o", "u",
    "un", "una", "unos", "unas", "tipo", "estilo", "grande", "grandes", "mediano", "mediana", "medianos", "medianas",
    "chico", "chica", "chicos", "chicas", "pequeno", "pequena", "fresco", "fresca", "frescos", "frescas", "picado",
    "picada", "picados", "picadas", "finamente", "rallado", "rallada", "troceado", "trozos", "cubos", "aprox",
    "aproximadamente", "gusto", "natural", "maduro", "madura", "limpio", "limpia", "lavado", "lavada", "desinfectado"]);
  const PROCESADOS = new Set(["polvo", "deshidratado", "enlatado", "concentrado", "congelado", "light", "industrializado",
    "instantaneo", "liofilizado", "almibar", "salmuera", "miniatura", "cambray", "cereza", "baby", "ahumado", "empanizado", "capeado", "adobado", "marinado", "glass", "ahumada", "empanizada",
    "capeada", "adobada", "marinada"]);
  // Peso aproximado de una pieza mediana (parte comestible, g) para convertir "2 jitomates" o "1 zanahoria"
  const PESO_PIEZA = { jitomate: 120, cebolla: 150, zanahoria: 80, ajo: 5, papa: 150, limon: 40, aguacate: 150,
    manzana: 150, platano: 120, naranja: 150, pepino: 200, calabacita: 120, pimiento: 150, chile: 10, huevo: 50,
    pera: 150, durazno: 100, mango: 200, elote: 150, nopal: 80, camote: 150, tortilla: 30, bolillo: 60, telera: 70 };
  const ESTADOS = new Set(["crudo", "cocido", "cocida", "asado", "frito", "hervido", "enlatado", "seco", "deshidratado", "horneado"]);
  const SINONIMOS = { jitomates: "jitomate", chicharos: "chicharo", papas: "papa",
    patata: "papa", huevos: "huevo", blanquillo: "huevo", frijoles: "frijol", porotos: "frijol", ejotes: "ejote",
    calabacitas: "calabacita", zanahorias: "zanahoria", cebollas: "cebolla", limones: "limon", ajos: "ajo",
    harina: "harina", mantequilla: "mantequilla", azucar: "azucar", leche: "leche", aceite: "aceite" };

  const raiz = (palabra) => {
    let p = SINONIMOS[palabra] || palabra;
    if (p.length > 4 && /[lnrdj]es$/.test(p)) p = p.slice(0, -2);
    else if (p.length > 3 && p.endsWith("s") && !p.endsWith("ss")) p = p.slice(0, -1);
    if (p.endsWith("a") && ESTADOS.has(p.slice(0, -1) + "o")) p = p.slice(0, -1) + "o";
    return p;
  };
  const fichas = (texto) => sinAcentos(texto.toLowerCase())
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !PALABRAS_VACIAS.has(t) && !/^\d+$/.test(t))
    .map(raiz);

  const ALIMENTOS = (typeof SMAE_ALIMENTOS !== "undefined" ? SMAE_ALIMENTOS : []).map((f, id) => {
    const [n, g, c, u, b, w, e, p, l, h, a] = f;
    const ub = unidadBase(u);
    return { id, n, g, c: c || (ub === "g" ? w : 1), u: u || "g", ub, b: b ?? w, w: w ?? b, e, p, l, h, a: a ?? null, t: fichas(n) };
  });
  const GRUPOS = typeof SMAE_GRUPOS !== "undefined" ? SMAE_GRUPOS : {};

  function puntuar(consulta, alimento) {
    if (!consulta.length) return 0;
    let puntos = 0;
    consulta.forEach((q, i) => {
      const exacta = alimento.t.includes(q);
      const prefijo = !exacta && q.length >= 4 && alimento.t.some((t) => t.startsWith(q) || (t.length >= 4 && q.startsWith(t)));
      if (exacta || prefijo) puntos += (i === 0 ? 2 : 1) * (exacta ? 1 : 0.7);
    });
    if (!puntos) return 0;
    if (alimento.t[0] === consulta[0]) puntos += 1;
    // Prefiere el alimento básico ("Cebolla blanca") a uno preparado o de marca
    const sobran = alimento.t.filter((t) => !consulta.includes(t)).length;
    puntos -= sobran * 0.18;
    const pideEstado = consulta.some((q) => ESTADOS.has(q));
    if (!pideEstado && alimento.t.includes("crudo")) puntos += 0.35;
    else if (!pideEstado && alimento.t.some((t) => ESTADOS.has(t))) puntos -= 0.3;
    if (alimento.t.some((t) => PROCESADOS.has(t) && !consulta.includes(t))) puntos -= 0.4;
    if (alimento.g === "libres" || alimento.g === "alcohol") puntos -= 0.1;
    return puntos;
  }

  function buscar(texto, limite = 8) {
    const consulta = fichas(texto);
    if (!consulta.length) return [];
    return ALIMENTOS.map((a) => [puntuar(consulta, a), a])
      .filter(([p]) => p > 0.6)
      .sort((x, y) => y[0] - x[0] || x[1].n.length - y[1].n.length)
      .slice(0, limite)
      .map(([p, a]) => ({ puntos: p, alimento: a }));
  }

  /* ---------- Lectura de renglones ---------- */
  const NUMEROS = { un: 1, una: 1, uno: 1, medio: 0.5, media: 0.5, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6,
    siete: 7, ocho: 8, nueve: 9, diez: 10, doce: 12, docena: 12 };
  const FRACCIONES_UNICODE = { "½": " 1/2", "¼": " 1/4", "¾": " 3/4", "⅓": " 1/3", "⅔": " 2/3", "⅛": " 1/8" };
  const RE_CANT = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?)(?:\s*(?:-|a)\s*\d+(?:[.,]\d+)?)?/;

  const valorCantidad = (t) => {
    t = t.trim().replace(",", ".");
    if (t.includes(" ")) return t.split(/\s+/).reduce((s, p) => s + valorCantidad(p), 0);
    if (t.includes("/")) { const [a, b] = t.split("/").map(Number); return b ? a / b : NaN; }
    return parseFloat(t);
  };

  function leerRenglon(original) {
    let linea = original;
    Object.entries(FRACCIONES_UNICODE).forEach(([k, v]) => { linea = linea.split(k).join(v); });
    linea = linea.replace(/^[\s\-–—•*·●○▪►✓✔·]+/, "").replace(/^\d+[.)]\s+(?=\d|[a-záéíóúñ])/i, "").replace(/\s+/g, " ").trim();
    if (!linea) return null;

    let cantidad = null, unidad = null, nombre = linea, alGusto = /al gusto|c\/n|cantidad necesaria|lo necesario/i.test(linea);
    const minus = linea.toLowerCase();

    let m = minus.match(RE_CANT);
    let resto;
    if (m) {
      cantidad = valorCantidad(m[1]);
      resto = linea.slice(m[0].length).trim();
    } else {
      const palabra = minus.split(" ")[0];
      if (palabra in NUMEROS) { cantidad = NUMEROS[palabra]; resto = linea.slice(palabra.length).trim(); }
    }
    if (resto != null) {
      const [primera, ...demas] = resto.split(" ");
      const u = primera ? unidadDe(primera.replace(/[.,:]$/, "")) : null;
      if (u) { unidad = u; resto = demas.join(" "); }
      nombre = resto.replace(/^(de|del)\s+/i, "");
    } else {
      // "Pechuga de pollo 250 g" o "Pechuga de pollo: 250 g"
      const fin = linea.match(/^(.*?)[:\-–]?\s+(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?)\s*([a-zA-ZáéíóúÁÉÍÓÚ./]+)?\.?$/);
      if (fin && fin[1].trim().length > 1) {
        const u = fin[3] ? unidadDe(fin[3]) : null;
        if (!fin[3] || u) {
          nombre = fin[1];
          cantidad = valorCantidad(fin[2]);
          unidad = u;
        }
      }
    }
    nombre = nombre.replace(/\(.*?\)/g, " ").replace(/\b(al gusto|c\/n|cantidad necesaria)\b/gi, " ")
      .replace(/[,;:.]+\s*$/, "").replace(/\s+/g, " ").trim();
    if (!nombre || nombre.length < 2) return null;
    if (cantidad == null && !alGusto) return { nombre, cantidad: null, unidad: null, sinCantidad: true, original };
    if (unidad === "pizca") { unidad = "g"; cantidad = (cantidad || 1) * 0.3; }
    if (unidad === "diente") unidad = "pieza";
    return { nombre, cantidad: alGusto && cantidad == null ? 0 : cantidad, unidad, alGusto, original };
  }

  const ENCABEZADO_INGREDIENTES = /^\s*(ingredientes|lista de compras?|lista del super|insumos|necesitas)\s*:?\s*$/i;
  const ENCABEZADO_FIN = /^\s*(preparaci[oó]n|procedimiento|modo de preparaci[oó]n|elaboraci[oó]n|instrucciones|pasos|m[eé]todo)\b/i;

  function analizarTexto(texto) {
    const lineas = texto.split(/\r?\n/);
    const hayEncabezado = lineas.some((l) => ENCABEZADO_INGREDIENTES.test(l));
    let dentro = !hayEncabezado;
    let porciones = null;
    const ingredientes = [];
    for (const l of lineas) {
      const rinde = l.match(/(?:rinde|porciones|raciones|para)\s*:?\s*(\d+)\s*(?:porciones|personas|raciones|comensales)?/i);
      if (rinde && !porciones && /rinde|porci|raci|persona|comensal/i.test(l)) { porciones = parseInt(rinde[1], 10); continue; }
      if (ENCABEZADO_INGREDIENTES.test(l)) { dentro = true; continue; }
      if (ENCABEZADO_FIN.test(l)) { if (hayEncabezado) dentro = false; continue; }
      if (!dentro) continue;
      const r = leerRenglon(l);
      if (!r) continue;
      // Sin cantidad y con muchas palabras: es un título o una instrucción, no un ingrediente
      if (r.sinCantidad && (r.nombre.split(" ").length > 5 || !hayEncabezado)) continue;
      if (r.sinCantidad) { r.cantidad = 0; r.alGusto = true; }
      ingredientes.push(r);
    }
    return { porciones, ingredientes };
  }

  /* ---------- Motor de cálculo ---------- */
  // Densidad (g/ml) de un alimento que el SMAE da en gramos, tomada de otro registro del mismo alimento
  // que sí viene en tazas o cucharadas ("Arroz crudo 20 g" ← "Arroz ... 1/4 taza 47 g")
  const densidades = new Map();
  function densidad(a) {
    if (densidades.has(a.id)) return densidades.get(a.id);
    const estado = a.t.find((t) => ESTADOS.has(t));
    let mejor = null, mejorPuntos = -1;
    ALIMENTOS.forEach((b) => {
      if (b.t[0] !== a.t[0] || tipoUnidad(b.ub) !== "volumen" || !b.w || !b.c) return;
      let puntos = b.t.filter((t) => a.t.includes(t)).length - b.t.length * 0.1;
      if (estado && b.t.includes(estado)) puntos += 2;
      if (b.t.some((t) => PROCESADOS.has(t))) puntos -= 1;
      if (puntos > mejorPuntos) { mejorPuntos = puntos; mejor = b; }
    });
    const r = mejor ? { valor: mejor.w / (mejor.c * VOLUMEN[mejor.ub]), de: mejor.n } : null;
    densidades.set(a.id, r);
    return r;
  }

  function calcular(fila) {
    const a = ALIMENTOS[fila.alimentoId];
    const vacio = { eq: null, neto: null, bruto: null, e: null, p: null, l: null, h: null, aviso: "" };
    if (!a) return { ...vacio, aviso: "Elige el alimento del SMAE" };
    const cant = Number(fila.cantidad) || 0;
    const u = fila.unidad || a.ub;
    let eq = null, aviso = "";
    // Los gramos de la receta son peso neto (lo que entra al platillo); el bruto sale del SMAE
    if (tipoUnidad(u) === "masa") {
      eq = (cant * MASA[u]) / a.w;
    } else if (u === a.ub) {
      eq = cant / a.c;
    } else if (tipoUnidad(u) === "volumen") {
      const ml = cant * VOLUMEN[u];
      if (tipoUnidad(a.ub) === "volumen") eq = ml / (a.c * VOLUMEN[a.ub]);
      else {
        const d = a.ub === "g" || a.ub === "ml" ? densidad(a) : null;
        if (d) { eq = (ml * d.valor) / a.w; aviso = `1 taza ≈ ${fmt(240 * d.valor, 0)} g (según «${d.de}»)`; }
        else { eq = ml / a.w; aviso = "Aproximado: 1 ml ≈ 1 g"; }
      }
    } else if (u === "pieza" && PESO_PIEZA[a.t[0]] && !a.t.some((t) => PROCESADOS.has(t))) {
      eq = (cant * PESO_PIEZA[a.t[0]]) / a.w;
      aviso = `Pieza mediana ≈ ${PESO_PIEZA[a.t[0]]} g (aprox.)`;
    } else {
      return { ...vacio, aviso: `Escríbelo en gramos o en ${a.ub}` };
    }
    const por = (v) => (v == null ? null : v * eq);
    return { eq, neto: eq * a.w, bruto: eq * a.b, e: por(a.e), p: por(a.p), l: por(a.l), h: por(a.h), aviso };
  }

  /* ---------- Estado ---------- */
  let estado = { porciones: 1, preparar: 1, filas: [] };
  let siguienteId = 1;

  function guardar() {
    try { localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(estado)); } catch (err) { /* sin almacenamiento */ }
  }
  function recuperar() {
    try {
      const d = JSON.parse(localStorage.getItem(CLAVE_GUARDADO) || "null");
      if (d && Array.isArray(d.filas)) {
        estado = { porciones: d.porciones || 1, preparar: d.preparar || d.porciones || 1, filas: d.filas.filter((f) => ALIMENTOS[f.alimentoId] || f.alimentoId == null) };
        siguienteId = estado.filas.reduce((m, f) => Math.max(m, f.id), 0) + 1;
      }
    } catch (err) { /* sin almacenamiento */ }
  }

  function nuevaFila(ing) {
    const candidatos = buscar(ing.nombre, 8);
    let elegido = candidatos[0] && candidatos[0].puntos >= 1.2 ? candidatos[0].alimento : null;
    // Entre opciones casi igual de buenas, prefiere la que usa la misma unidad que la receta
    // ("2 jitomates" → «Jitomate bola», que viene por pieza)
    if (elegido) {
      const pedida = ing.unidad || "pieza";
      const mismoTipo = (a) => a.ub === pedida || (tipoUnidad(pedida) !== "conteo" && tipoUnidad(a.ub) === tipoUnidad(pedida));
      if (!mismoTipo(elegido)) {
        const mejor = candidatos.find((c) => c.puntos >= candidatos[0].puntos - 0.6 && mismoTipo(c.alimento) && c.alimento.t[0] === elegido.t[0]
          && !c.alimento.t.some((t) => PROCESADOS.has(t)));
        if (mejor) elegido = mejor.alimento;
      }
    }
    let unidad = ing.unidad;
    let cantidad = ing.cantidad;
    if (elegido && !unidad) unidad = tipoUnidad(elegido.ub) === "conteo" ? elegido.ub : "pieza";
    if (!unidad) unidad = "pieza";
    return { id: siguienteId++, texto: ing.original ? ing.original.replace(/^[\s\-–—•*·●▪►✓✔]+/, "").trim() : ing.nombre, nombre: ing.nombre, cantidad: cantidad ?? 0,
      unidad, alimentoId: elegido ? elegido.id : null, candidatos: candidatos.map((c) => c.alimento.id), alGusto: !!ing.alGusto };
  }

  /* ---------- Interfaz ---------- */
  const el = {};
  document.addEventListener("DOMContentLoaded", () => {
    Object.assign(el, {
      zona: $("#ca-zona"), archivo: $("#ca-archivo"), estado: $("#ca-estado"), progreso: $("#ca-progreso"),
      progresoBarra: $("#ca-progreso span"), texto: $("#ca-texto"), analizar: $("#ca-analizar"), ejemplo: $("#ca-ejemplo"),
      buscar: $("#ca-buscar"), sugerencias: $("#ca-sugerencias"), agregarCant: $("#ca-agregar-cant"),
      agregarUnidad: $("#ca-agregar-unidad"), agregar: $("#ca-agregar"), agregarAyuda: $("#ca-agregar-ayuda"),
      porciones: $("#ca-porciones"), preparar: $("#ca-preparar"), factor: $("#ca-factor"),
      cuerpo: $("#ca-cuerpo"), pie: $("#ca-pie"), vacio: $("#ca-vacio"), tablaCaja: $("#ca-tabla-caja"),
      totales: $("#ca-totales"), barra: $("#ca-barra"), grupos: $("#ca-grupos"), limpiar: $("#ca-limpiar"),
      csv: $("#ca-csv"), imprimir: $("#ca-imprimir"), conteo: $("#ca-conteo"), resultados: $("#ca-resultados")
    });
    if (!el.cuerpo) return;
    $("#ca-total-alimentos").textContent = ALIMENTOS.length.toLocaleString("es-MX");

    recuperar();
    iniciarCarga();
    iniciarAgregar();
    iniciarControles();
    dibujar();
  });

  /* Carga de archivos */
  function avisar(texto, tipo = "") {
    el.estado.textContent = texto;
    el.estado.dataset.tipo = tipo;
  }
  function progreso(valor) {
    el.progreso.hidden = valor == null;
    if (valor != null) el.progresoBarra.style.transform = `scaleX(${Math.max(0.02, Math.min(1, valor))})`;
  }

  function iniciarCarga() {
    ["dragenter", "dragover"].forEach((ev) => el.zona.addEventListener(ev, (e) => {
      e.preventDefault();
      el.zona.classList.add("arrastrando");
    }));
    ["dragleave", "dragend", "drop"].forEach((ev) => el.zona.addEventListener(ev, (e) => {
      if (ev === "dragleave" && el.zona.contains(e.relatedTarget)) return;
      el.zona.classList.remove("arrastrando");
    }));
    el.zona.addEventListener("drop", (e) => {
      e.preventDefault();
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) procesarArchivo(f);
    });
    el.archivo.addEventListener("change", () => {
      if (el.archivo.files[0]) procesarArchivo(el.archivo.files[0]);
      el.archivo.value = "";
    });
    el.analizar.addEventListener("click", () => aplicarTexto(el.texto.value, "texto"));
    el.ejemplo.addEventListener("click", () => {
      el.texto.value = RECETA_EJEMPLO;
      aplicarTexto(RECETA_EJEMPLO, "ejemplo");
    });
  }

  async function procesarArchivo(archivo) {
    const nombre = archivo.name || "archivo";
    const esPdf = archivo.type === "application/pdf" || /\.pdf$/i.test(nombre);
    const esImagen = /^image\//.test(archivo.type) || /\.(png|jpe?g|webp|bmp|gif)$/i.test(nombre);
    const esTexto = /^text\//.test(archivo.type) || /\.(txt|csv|md)$/i.test(nombre);
    if (!esPdf && !esImagen && !esTexto) {
      avisar(`«${nombre}» no es un PDF, una imagen ni un texto. Sube un archivo PDF, JPG, PNG o TXT.`, "error");
      return;
    }
    if (archivo.size > 15 * 1024 * 1024) {
      avisar("El archivo pesa más de 15 MB. Prueba con una foto más ligera o con menos páginas.", "error");
      return;
    }
    el.zona.classList.add("leyendo");
    try {
      let texto = "";
      if (esTexto) {
        texto = await archivo.text();
      } else if (esPdf) {
        texto = await leerPdf(archivo);
      } else {
        avisar(`Leyendo la imagen «${nombre}»…`);
        texto = await reconocer(archivo, (p) => progreso(p));
      }
      progreso(null);
      if (!texto.trim()) {
        avisar("No encontramos texto en el archivo. Prueba con una foto más nítida o escribe la receta a mano.", "error");
        return;
      }
      el.texto.value = texto.trim();
      aplicarTexto(texto, nombre);
    } catch (err) {
      progreso(null);
      avisar("No pudimos leer el archivo. Revisa tu conexión a internet (el lector se descarga al usarse) o pega el texto a mano.", "error");
    } finally {
      el.zona.classList.remove("leyendo");
    }
  }

  async function leerPdf(archivo) {
    avisar("Abriendo el PDF…");
    progreso(0.05);
    await cargarScript(PDFJS);
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
    const pdf = await window.pdfjsLib.getDocument({ data: await archivo.arrayBuffer() }).promise;
    const paginas = Math.min(pdf.numPages, 10);
    let texto = "";
    for (let i = 1; i <= paginas; i++) {
      avisar(`Leyendo la página ${i} de ${paginas}…`);
      const pagina = await pdf.getPage(i);
      const contenido = await pagina.getTextContent();
      // Reconstruye renglones agrupando los fragmentos por su altura en la página
      const renglones = new Map();
      contenido.items.forEach((it) => {
        const y = Math.round(it.transform[5] / 3) * 3;
        if (!renglones.has(y)) renglones.set(y, []);
        renglones.get(y).push(it);
      });
      let textoPagina = [...renglones.entries()].sort((a, b) => b[0] - a[0])
        .map(([, items]) => items.sort((a, b) => a.transform[4] - b.transform[4]).map((it) => it.str).join(" ").replace(/\s+/g, " ").trim())
        .filter(Boolean).join("\n");
      if (textoPagina.replace(/\s/g, "").length < 20) {
        // PDF escaneado: se dibuja la página y se lee con OCR
        const vista = pagina.getViewport({ scale: 2 });
        const lienzo = document.createElement("canvas");
        lienzo.width = vista.width;
        lienzo.height = vista.height;
        await pagina.render({ canvasContext: lienzo.getContext("2d"), viewport: vista }).promise;
        avisar(`La página ${i} es una imagen; reconociendo el texto…`);
        textoPagina = await reconocer(lienzo, (p) => progreso((i - 1 + p) / paginas));
      }
      texto += textoPagina + "\n";
      progreso(i / paginas);
    }
    return texto;
  }

  async function reconocer(imagen, alAvanzar) {
    await cargarScript(TESSERACT);
    const trabajador = await window.Tesseract.createWorker("spa", 1, {
      logger: (m) => { if (m.status === "recognizing text") alAvanzar(m.progress); }
    });
    try {
      const { data } = await trabajador.recognize(imagen);
      return data.text || "";
    } finally {
      await trabajador.terminate();
    }
  }

  function aplicarTexto(texto, origen) {
    const { porciones, ingredientes } = analizarTexto(texto || "");
    if (!ingredientes.length) {
      avisar("No reconocimos ingredientes. Escribe uno por renglón, por ejemplo «200 g de pechuga de pollo».", "error");
      return;
    }
    estado.filas = ingredientes.map(nuevaFila);
    if (porciones) { estado.porciones = porciones; estado.preparar = porciones; }
    const sin = estado.filas.filter((f) => f.alimentoId == null).length;
    const de = origen === "texto" ? "el texto" : origen === "ejemplo" ? "la receta de ejemplo" : `«${origen}»`;
    avisar(`Encontramos ${estado.filas.length} ingredientes en ${de}` +
      (sin ? `; ${sin} necesita${sin === 1 ? "" : "n"} que elijas el alimento.` : ". Revisa que cada uno coincida."), "ok");
    dibujar({ animar: true });
    if (window.matchMedia("(max-width: 1100px)").matches) {
      el.resultados.scrollIntoView({ behavior: sinMov() ? "auto" : "smooth", block: "start" });
    }
  }

  /* Buscador con lista de sugerencias (combobox accesible) */
  function crearBuscador(input, lista, { alElegir, candidatosIniciales = () => [] }) {
    let opciones = [], activo = -1;
    const cerrar = () => { lista.hidden = true; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); activo = -1; };
    const marcar = (i) => {
      activo = i;
      lista.querySelectorAll("[role=option]").forEach((o, k) => o.setAttribute("aria-selected", String(k === i)));
      const o = lista.children[i];
      if (o) { input.setAttribute("aria-activedescendant", o.id); o.scrollIntoView({ block: "nearest" }); }
    };
    const mostrar = () => {
      const q = input.value.trim();
      opciones = q.length >= 2 ? buscar(q, 8).map((r) => r.alimento) : candidatosIniciales();
      if (!opciones.length) {
        lista.innerHTML = q.length >= 2 ? `<li class="ca-sin-resultados">Sin coincidencias en el SMAE</li>` : "";
        lista.hidden = q.length < 2;
        input.setAttribute("aria-expanded", String(!lista.hidden));
        return;
      }
      lista.innerHTML = opciones.map((a, i) => `
        <li role="option" id="${lista.id}-${i}" aria-selected="false" data-i="${i}">
          <span class="ca-op-nombre">${escapar(a.n)}</span>
          <span class="ca-op-detalle"><span class="ca-punto" style="--c:${GRUPOS[a.g]?.color}"></span>${escapar(GRUPOS[a.g]?.nombre || "")} · ${fmtCant(a.c)} ${escapar(a.u)} · ${fmt(a.e, 0)} kcal</span>
        </li>`).join("");
      lista.hidden = false;
      input.setAttribute("aria-expanded", "true");
      activo = -1;
    };
    input.addEventListener("input", mostrar);
    input.addEventListener("focus", () => { if (candidatosIniciales().length || input.value.trim().length >= 2) mostrar(); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); if (lista.hidden) mostrar(); marcar(Math.min(opciones.length - 1, activo + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); marcar(Math.max(0, activo - 1)); }
      else if (e.key === "Enter") {
        if (!lista.hidden && opciones.length) { e.preventDefault(); elegir(activo >= 0 ? activo : 0); }
      } else if (e.key === "Escape") { cerrar(); }
    });
    lista.addEventListener("mousedown", (e) => e.preventDefault());
    lista.addEventListener("click", (e) => {
      const o = e.target.closest("[role=option]");
      if (o) elegir(Number(o.dataset.i));
    });
    input.addEventListener("blur", () => setTimeout(cerrar, 120));
    function elegir(i) {
      const a = opciones[i];
      if (!a) return;
      cerrar();
      alElegir(a);
    }
    return { cerrar };
  }

  let elegidoManual = null;
  function opcionesUnidad(a, actual) {
    const lista = ["g", "kg", "ml", "l", "taza", "cucharada", "cucharadita", "pieza"];
    if (a && !lista.includes(a.ub)) lista.push(a.ub);
    if (actual && !lista.includes(actual)) lista.push(actual);
    return lista.map((u) => `<option value="${escapar(u)}"${u === actual ? " selected" : ""}>${escapar(u)}</option>`).join("");
  }

  function iniciarAgregar() {
    el.agregarUnidad.innerHTML = opcionesUnidad(null, "g");
    crearBuscador(el.buscar, el.sugerencias, {
      alElegir: (a) => {
        elegidoManual = a;
        el.buscar.value = a.n;
        el.agregarUnidad.innerHTML = opcionesUnidad(a, a.ub);
        el.agregarCant.value = fmtCant(a.c).includes("/") ? a.c.toFixed(2).replace(/\.?0+$/, "") : fmtCant(a.c);
        el.agregarAyuda.textContent = `1 equivalente = ${fmtCant(a.c)} ${a.u} (${fmt(a.w, 0)} g netos), ${fmt(a.e, 0)} kcal.`;
        el.agregarCant.focus();
        el.agregarCant.select();
      }
    });
    el.buscar.addEventListener("input", () => { elegidoManual = null; el.agregarAyuda.textContent = ""; });
    el.agregar.addEventListener("click", (e) => {
      e.preventDefault();
      if (!elegidoManual) {
        const r = buscar(el.buscar.value, 1)[0];
        if (!r) { el.agregarAyuda.textContent = "Escribe un alimento y elígelo de la lista."; el.buscar.focus(); return; }
        elegidoManual = r.alimento;
      }
      const cant = parseFloat(String(el.agregarCant.value).replace(",", "."));
      if (!Number.isFinite(cant) || cant < 0) { el.agregarAyuda.textContent = "Escribe una cantidad válida."; el.agregarCant.focus(); return; }
      estado.filas.push({ id: siguienteId++, texto: elegidoManual.n, nombre: elegidoManual.n, cantidad: cant,
        unidad: el.agregarUnidad.value, alimentoId: elegidoManual.id, candidatos: [elegidoManual.id] });
      el.agregarAyuda.textContent = `Agregaste ${elegidoManual.n}.`;
      elegidoManual = null;
      el.buscar.value = "";
      el.agregarCant.value = "";
      dibujar({ nueva: estado.filas[estado.filas.length - 1].id });
      el.buscar.focus();
    });
  }

  /* Porciones, limpiar y exportar */
  function iniciarControles() {
    const paso = (input, delta) => {
      const v = Math.max(1, Math.min(500, (parseInt(input.value, 10) || 1) + delta));
      input.value = v;
      input.dispatchEvent(new Event("input"));
    };
    document.querySelectorAll("[data-paso]").forEach((b) => b.addEventListener("click", () => {
      paso(document.getElementById(b.dataset.objetivo), Number(b.dataset.paso));
    }));
    el.porciones.addEventListener("input", () => { estado.porciones = Math.max(1, parseInt(el.porciones.value, 10) || 1); dibujar(); });
    el.preparar.addEventListener("input", () => { estado.preparar = Math.max(1, parseInt(el.preparar.value, 10) || 1); dibujar(); });
    el.limpiar.addEventListener("click", () => {
      if (!estado.filas.length) return;
      if (!confirm("¿Quitar todos los ingredientes de la receta?")) return;
      estado.filas = [];
      avisar("");
      dibujar();
    });
    el.csv.addEventListener("click", descargarCsv);
    el.imprimir.addEventListener("click", () => window.print());

    // Edición dentro de la tabla (delegada)
    el.cuerpo.addEventListener("input", (e) => {
      const tr = e.target.closest("tr[data-id]");
      if (!tr) return;
      const fila = estado.filas.find((f) => f.id === Number(tr.dataset.id));
      if (e.target.matches(".ca-cant")) {
        const v = parseFloat(e.target.value.replace(",", "."));
        fila.cantidad = Number.isFinite(v) && v >= 0 ? v : 0;
        actualizarFila(tr, fila);
      }
    });
    el.cuerpo.addEventListener("change", (e) => {
      const tr = e.target.closest("tr[data-id]");
      if (!tr || !e.target.matches(".ca-unidad")) return;
      const fila = estado.filas.find((f) => f.id === Number(tr.dataset.id));
      fila.unidad = e.target.value;
      actualizarFila(tr, fila);
    });
    el.cuerpo.addEventListener("click", (e) => {
      const tr = e.target.closest("tr[data-id]");
      if (!tr) return;
      const fila = estado.filas.find((f) => f.id === Number(tr.dataset.id));
      if (e.target.closest(".ca-quitar")) {
        estado.filas = estado.filas.filter((f) => f !== fila);
        const siguiente = tr.nextElementSibling || tr.previousElementSibling;
        dibujar();
        const foco = siguiente && el.cuerpo.querySelector(`tr[data-id="${siguiente.dataset.id}"] .ca-quitar`);
        (foco || el.buscar).focus();
      } else if (e.target.closest(".ca-cambiar")) {
        abrirCambio(tr, fila);
      } else if (e.target.closest(".ca-menos, .ca-mas")) {
        const delta = e.target.closest(".ca-mas") ? 1 : -1;
        const a = ALIMENTOS[fila.alimentoId];
        const salto = tipoUnidad(fila.unidad) === "masa" && fila.unidad === "g" ? 10 : fila.unidad === "ml" ? 10 : (a && fila.unidad === a.ub ? a.c : 1) >= 1 ? 1 : 0.25;
        fila.cantidad = Math.max(0, Math.round(((fila.cantidad || 0) + delta * salto) * 100) / 100);
        tr.querySelector(".ca-cant").value = fmtNumero(fila.cantidad);
        actualizarFila(tr, fila);
      }
    });
  }

  const fmtNumero = (n) => String(Math.round((n || 0) * 100) / 100);

  function abrirCambio(tr, fila) {
    const celda = tr.querySelector(".ca-celda-alimento");
    const id = `ca-cambio-${fila.id}`;
    celda.insertAdjacentHTML("beforeend", `
      <div class="ca-cambio">
        <label class="sr-only" for="${id}">Buscar otro alimento del SMAE para ${escapar(fila.nombre)}</label>
        <input id="${id}" class="ca-cambio-input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false"
               aria-controls="${id}-lista" autocomplete="off" placeholder="Busca en el SMAE" value="${escapar(fila.nombre)}">
        <ul class="ca-sugerencias" id="${id}-lista" role="listbox" hidden></ul>
      </div>`);
    const input = celda.querySelector(".ca-cambio-input");
    const lista = celda.querySelector(".ca-sugerencias");
    const quitar = () => celda.querySelector(".ca-cambio")?.remove();
    crearBuscador(input, lista, {
      candidatosIniciales: () => (input.value === fila.nombre ? fila.candidatos.map((i) => ALIMENTOS[i]).filter(Boolean) : []),
      alElegir: (a) => {
        fila.alimentoId = a.id;
        if (tipoUnidad(fila.unidad) === "conteo" && fila.unidad !== a.ub) fila.unidad = tipoUnidad(a.ub) === "conteo" ? a.ub : "g";
        dibujar({ nueva: fila.id });
        el.cuerpo.querySelector(`tr[data-id="${fila.id}"] .ca-cambiar`)?.focus();
      }
    });
    input.addEventListener("keydown", (e) => { if (e.key === "Escape") { quitar(); tr.querySelector(".ca-cambiar")?.focus(); } });
    input.addEventListener("blur", () => setTimeout(() => { if (!celda.contains(document.activeElement)) quitar(); }, 160));
    input.focus();
    input.select();
  }

  /* Dibujo de la tabla y los totales */
  const factor = () => estado.preparar / estado.porciones;

  function celdasNumericas(r) {
    const f = factor();
    const v = (x, d = 1) => (x == null ? "—" : fmt(x * f, d));
    return `
      <td class="num" data-col="neto" data-etiqueta="Neto (g)">${v(r.neto, 0)}</td>
      <td class="num" data-col="bruto" data-etiqueta="Bruto (g)">${v(r.bruto, 0)}</td>
      <td class="num" data-col="eq" data-etiqueta="Equiv.">${r.eq == null ? "—" : fmt(r.eq * f, 1)}</td>
      <td class="num" data-col="e" data-etiqueta="kcal">${v(r.e, 0)}</td>
      <td class="num" data-col="p" data-etiqueta="Prot. (g)">${v(r.p)}</td>
      <td class="num" data-col="l" data-etiqueta="Líp. (g)">${v(r.l)}</td>
      <td class="num" data-col="h" data-etiqueta="HC (g)">${v(r.h)}</td>`;
  }

  const avisoDe = (fila, r) => (fila.alGusto && !fila.cantidad ? "Al gusto: escribe una cantidad para contarlo" : r.aviso || "");

  function filaHTML(fila) {
    const a = ALIMENTOS[fila.alimentoId];
    const r = calcular(fila);
    const g = a ? GRUPOS[a.g] : null;
    const idCant = `ca-cant-${fila.id}`;
    return `
      <tr data-id="${fila.id}" class="${a ? "" : "sin-alimento"}">
        <th scope="row" class="ca-celda-alimento">
          <span class="ca-detectado">${escapar(fila.texto)}</span>
          ${a ? `
            <span class="ca-alimento"><span class="ca-punto" style="--c:${g?.color}"></span>${escapar(a.n)}</span>
            <span class="ca-grupo">${escapar(g?.nombre || "")} · 1 eq = ${fmtCant(a.c)} ${escapar(a.u)} (${fmt(a.w, 0)} g)</span>`
            : `<span class="ca-alimento ca-falta"><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> Sin coincidencia en el SMAE</span>`}
          <button type="button" class="ca-cambiar">${a ? "Cambiar alimento" : "Elegir alimento"}</button>
        </th>
        <td class="ca-celda-cantidad">
          <div class="ca-cantidad">
            <button type="button" class="ca-menos" aria-label="Menos ${escapar(fila.nombre)}"><i class="fa-solid fa-minus" aria-hidden="true"></i></button>
            <label class="sr-only" for="${idCant}">Cantidad de ${escapar(fila.nombre)}</label>
            <input id="${idCant}" class="ca-cant" type="text" inputmode="decimal" value="${fmtNumero(fila.cantidad)}">
            <button type="button" class="ca-mas" aria-label="Más ${escapar(fila.nombre)}"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>
          </div>
          <label class="sr-only" for="${idCant}-u">Unidad de ${escapar(fila.nombre)}</label>
          <select id="${idCant}-u" class="ca-unidad">${opcionesUnidad(a, fila.unidad)}</select>
          <span class="ca-aviso" role="status">${escapar(avisoDe(fila, r))}</span>
        </td>
        ${celdasNumericas(r)}
        <td class="ca-celda-quitar"><button type="button" class="ca-quitar" aria-label="Quitar ${escapar(fila.nombre)}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></td>
      </tr>`;
  }

  function actualizarFila(tr, fila) {
    const r = calcular(fila);
    const nuevas = document.createElement("tbody");
    nuevas.innerHTML = `<tr>${celdasNumericas(r)}</tr>`;
    nuevas.querySelectorAll("td").forEach((td) => {
      const actual = tr.querySelector(`td[data-col="${td.dataset.col}"]`);
      if (actual.textContent !== td.textContent) {
        actual.textContent = td.textContent;
        actual.classList.remove("cambia");
        void actual.offsetWidth;
        actual.classList.add("cambia");
      }
    });
    tr.querySelector(".ca-aviso").textContent = avisoDe(fila, r);
    totales();
    guardar();
  }

  function dibujar({ animar = false, nueva = null } = {}) {
    el.porciones.value = estado.porciones;
    el.preparar.value = estado.preparar;
    const f = factor();
    el.factor.textContent = f === 1 ? "Receta original" : `Receta ×${fmtCant(f) || fmt(f, 2)}`;
    el.factor.dataset.cambia = String(f !== 1);

    const hay = estado.filas.length > 0;
    el.vacio.hidden = hay;
    el.tablaCaja.hidden = !hay;
    el.conteo.textContent = hay ? `${estado.filas.length} ${estado.filas.length === 1 ? "ingrediente" : "ingredientes"}` : "";
    el.cuerpo.innerHTML = estado.filas.map(filaHTML).join("");
    if (animar && typeof escalonar === "function") escalonar(el.cuerpo.children);
    if (nueva != null) {
      const tr = el.cuerpo.querySelector(`tr[data-id="${nueva}"]`);
      if (tr && !sinMov()) tr.classList.add("ca-recien");
    }
    totales();
    guardar();
  }

  const totalesCeldas = (suma, entre) => `
        <td class="num" data-etiqueta="Neto (g)">${fmt(suma.neto / entre, 0)}</td>
        <td class="num" data-etiqueta="Bruto (g)">${fmt(suma.bruto / entre, 0)}</td>
        <td class="num ca-sin-dato">—</td>
        <td class="num" data-etiqueta="kcal">${fmt(suma.e / entre, 0)}</td>
        <td class="num" data-etiqueta="Prot. (g)">${fmt(suma.p / entre)}</td>
        <td class="num" data-etiqueta="Líp. (g)">${fmt(suma.l / entre)}</td>
        <td class="num" data-etiqueta="HC (g)">${fmt(suma.h / entre)}</td><td></td>`;

  function totales() {
    const f = factor();
    const suma = { neto: 0, bruto: 0, e: 0, p: 0, l: 0, h: 0 };
    const porGrupo = {};
    estado.filas.forEach((fila) => {
      const r = calcular(fila);
      if (r.eq == null) return;
      Object.keys(suma).forEach((k) => { suma[k] += (r[k] || 0) * f; });
      const g = ALIMENTOS[fila.alimentoId].g;
      porGrupo[g] = (porGrupo[g] || 0) + r.eq * f;
    });

    el.pie.innerHTML = estado.filas.length ? `
      <tr>
        <th scope="row">Total (${estado.preparar} ${estado.preparar === 1 ? "porción" : "porciones"})</th>
        <td></td>
        ${totalesCeldas(suma, 1)}
      </tr>
      <tr class="ca-por-porcion">
        <th scope="row">Por porción</th>
        <td></td>
        ${totalesCeldas(suma, estado.preparar)}
      </tr>` : "";

    // Tarjetas de totales con conteo animado
    const porciones = estado.preparar;
    const datos = { "tot-e": suma.e, "tot-e-porcion": suma.e / porciones, "tot-p": suma.p / porciones, "tot-l": suma.l / porciones,
      "tot-h": suma.h / porciones, "tot-neto": suma.neto };
    Object.entries(datos).forEach(([id, valor]) => {
      const nodo = document.getElementById(id);
      if (!nodo) return;
      const dec = id === "tot-e" || id === "tot-e-porcion" || id === "tot-neto" ? 0 : 1;
      if (nodo.dataset.valor === String(valor.toFixed(dec))) return;
      nodo.dataset.valor = valor.toFixed(dec);
      if (typeof contarHasta === "function") contarHasta(nodo, valor, { decimales: dec, duracion: 500 });
      // Si la pestaña está en segundo plano el conteo se pausa: el valor final queda escrito de todos modos
      clearTimeout(nodo._final);
      nodo._final = setTimeout(() => {
        cancelAnimationFrame(nodo._conteo);
        nodo.textContent = fmt(valor, dec);
      }, 650);
    });

    // Distribución de la energía (proteína y carbohidratos 4 kcal/g; lípidos 9 kcal/g)
    const kp = suma.p * 4, kl = suma.l * 9, kh = suma.h * 4;
    const kt = kp + kl + kh;
    const pct = (k) => (kt ? (k / kt) * 100 : 0);
    [["p", kp], ["l", kl], ["h", kh]].forEach(([k, v]) => {
      const tramo = el.barra.querySelector(`[data-macro="${k}"]`);
      tramo.style.flexGrow = kt ? pct(v) : 1;
      document.getElementById(`pct-${k}`).textContent = kt ? `${fmt(pct(v), 0)} %` : "—";
    });
    el.barra.classList.toggle("vacia", !kt);

    // Equivalentes por grupo del SMAE
    const orden = Object.keys(GRUPOS);
    const filas = Object.entries(porGrupo).filter(([, v]) => v > 0.005).sort((a, b) => orden.indexOf(a[0]) - orden.indexOf(b[0]));
    el.grupos.innerHTML = filas.length ? filas.map(([g, v]) => `
      <li><span class="ca-punto" style="--c:${GRUPOS[g].color}"></span><span>${escapar(GRUPOS[g].nombre)}</span>
      <strong>${fmt(v / porciones, 1)}</strong><span class="ca-grupos-total">${fmt(v, 1)} en total</span></li>`).join("")
      : `<li class="ca-grupos-vacio">Aparecerán cuando agregues ingredientes.</li>`;
  }

  function descargarCsv() {
    if (!estado.filas.length) return;
    const f = factor();
    const enc = ["Ingrediente detectado", "Alimento SMAE", "Grupo", "Cantidad", "Unidad", "Peso neto (g)", "Peso bruto (g)",
      "Equivalentes", "Energía (kcal)", "Proteína (g)", "Lípidos (g)", "Hidratos de carbono (g)"];
    const num = (x, d = 1) => (x == null ? "" : (x * f).toFixed(d));
    const filas = estado.filas.map((fila) => {
      const a = ALIMENTOS[fila.alimentoId];
      const r = calcular(fila);
      return [fila.texto, a ? a.n : "", a ? GRUPOS[a.g]?.nombre : "", fmtNumero(fila.cantidad * f), fila.unidad,
        num(r.neto, 0), num(r.bruto, 0), num(r.eq, 2), num(r.e, 0), num(r.p), num(r.l), num(r.h)];
    });
    const csv = [enc, ...filas, [], ["Porciones", estado.preparar]]
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const enlace = Object.assign(document.createElement("a"), { href: url, download: "desglose-receta-smae.csv" });
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Para pruebas desde la consola
  window.calculadoraAlimentos = { analizarTexto, buscar, calcular: (f) => calcular(f), leerRenglon };
})();
