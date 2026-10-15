/* ==========================================
   INICIO: plato interactivo, IMC rápido y datos curiosos
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  initPlato();
  initImcRapido();
  initDatoCurioso();
});

/* ------------------------------------------
   1. EL PLATO DEL BIEN COMER
   Se dibuja a partir de la lista #grupos (cada <li> trae su
   porcentaje, color y foto), así el contenido vive en el HTML.
   ------------------------------------------ */
// porScroll: en el Inicio el grupo que cruza el centro de la pantalla se activa solo.
// En el tema 4 (temas.html) se usa sin esa opción: solo con clic o teclado.
function initPlato({ porScroll = true } = {}) {
  const svg = document.getElementById("plato-svg");
  const grupos = Array.from(document.querySelectorAll("#grupos .grupo"));
  const globo = document.getElementById("castor-globo");
  if (!svg || !grupos.length || svg.dataset.listo) return;
  svg.dataset.listo = "true";
  if (porScroll && !(typeof sinMovimiento !== "undefined" && sinMovimiento.matches)) svg.classList.add("sirviendo");

  const NS = "http://www.w3.org/2000/svg";
  const C = 300;          // centro del plato
  const R_BORDE = 298;    // borde exterior del plato
  const R_POZO = 262;     // fondo del plato
  const R_COMIDA = 248;   // radio de las fotos
  const LEVANTE = 16;     // cuánto se separa el sector activo

  const punto = (angulo, radio) => {
    const rad = (angulo * Math.PI) / 180;
    return [C + radio * Math.cos(rad), C + radio * Math.sin(rad)];
  };

  const crear = (etiqueta, atributos = {}) => {
    const el = document.createElementNS(NS, etiqueta);
    Object.entries(atributos).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };

  // Plato: borde blanco y fondo ligeramente hundido
  const defs = crear("defs");
  svg.appendChild(defs);
  svg.appendChild(crear("circle", { cx: C, cy: C, r: R_BORDE, fill: "#ffffff" }));
  svg.appendChild(crear("circle", { cx: C, cy: C, r: R_POZO, fill: "#eef3ee" }));
  svg.appendChild(crear("circle", { cx: C, cy: C, r: R_BORDE - 10, fill: "none", stroke: "#e6ece7", "stroke-width": 1.5 }));

  // Verduras y frutas ocupan la mitad izquierda; el resto sigue en el sentido del reloj
  let angulo = 90;
  const sectores = new Map();

  grupos.forEach((li) => {
    const id = li.dataset.grupo;
    const pct = parseFloat(li.dataset.pct);
    const color = li.dataset.color;
    const tinta = li.dataset.tinta || "#ffffff";
    const a0 = angulo;
    const a1 = angulo + (pct / 100) * 360;
    const medio = (a0 + a1) / 2;
    angulo = a1;

    li.style.setProperty("--grupo-color", color);
    li.style.setProperty("--grupo-tinta", tinta);

    // En celular el plato queda arriba; la foto del grupo activo se muestra en la propia lista
    const miniatura = document.createElement("img");
    miniatura.src = li.dataset.foto;
    miniatura.alt = "";
    miniatura.loading = "lazy";
    miniatura.className = "grupo-foto";
    li.querySelector(".grupo-boton")?.after(miniatura);

    const [x0, y0] = punto(a0, R_COMIDA);
    const [x1, y1] = punto(a1, R_COMIDA);
    const arcoGrande = a1 - a0 > 180 ? 1 : 0;
    const d = `M ${C} ${C} L ${x0} ${y0} A ${R_COMIDA} ${R_COMIDA} 0 ${arcoGrande} 1 ${x1} ${y1} Z`;

    // Caja que contiene al sector, para encuadrar la foto dentro de él
    const xs = [C, x0, x1];
    const ys = [C, y0, y1];
    [0, 90, 180, 270, 360, 450].forEach((eje) => {
      if (eje > a0 && eje < a1) {
        const [ex, ey] = punto(eje, R_COMIDA);
        xs.push(ex);
        ys.push(ey);
      }
    });
    const caja = {
      x: Math.min(...xs), y: Math.min(...ys),
      w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys)
    };

    const clip = crear("clipPath", { id: `sector-clip-${id}` });
    clip.appendChild(crear("path", { d }));
    defs.appendChild(clip);

    const [dx, dy] = punto(medio, LEVANTE).map((v) => v - C);
    const g = crear("g", { class: "sector", "data-grupo": id });
    g.style.setProperty("--orden", Number(id) - 1);
    g.style.setProperty("--dx", `${dx}px`);
    g.style.setProperty("--dy", `${dy}px`);

    const foto = crear("image", {
      href: li.dataset.foto,
      x: caja.x, y: caja.y, width: caja.w, height: caja.h,
      preserveAspectRatio: "xMidYMid slice",
      "clip-path": `url(#sector-clip-${id})`,
      class: "sector-foto"
    });
    g.appendChild(foto);

    // Ribete de color del grupo en la orilla del sector
    const rRibete = R_COMIDA - 6;
    const [rx0, ry0] = punto(a0, rRibete);
    const [rx1, ry1] = punto(a1, rRibete);
    g.appendChild(crear("path", {
      d: `M ${rx0} ${ry0} A ${rRibete} ${rRibete} 0 ${arcoGrande} 1 ${rx1} ${ry1}`,
      fill: "none", stroke: color, "stroke-width": 12
    }));

    // Separación blanca entre sectores
    g.appendChild(crear("path", { d, fill: "none", stroke: "#ffffff", "stroke-width": 4, "stroke-linejoin": "round" }));

    // Número del grupo
    const [nx, ny] = punto(medio, pct < 10 ? R_COMIDA * 0.74 : R_COMIDA * 0.6);
    g.appendChild(crear("circle", { cx: nx, cy: ny, r: 21, fill: color, stroke: "#ffffff", "stroke-width": 3 }));
    const num = crear("text", {
      x: nx, y: ny, fill: tinta, "text-anchor": "middle", "dominant-baseline": "central", class: "sector-num"
    });
    num.textContent = id;
    g.appendChild(num);

    g.addEventListener("click", () => activar(id, { desplazar: true }));
    svg.appendChild(g);
    sectores.set(id, g);
  });

  let activo = null;

  function activar(id, { desplazar = false } = {}) {
    if (id === activo) return;
    activo = id;

    svg.classList.add("hay-activo");
    sectores.forEach((g, gid) => {
      const on = gid === id;
      g.classList.toggle("activo", on);
      g.style.transform = on ? "translate(var(--dx), var(--dy))" : "";
    });

    grupos.forEach((li) => {
      const on = li.dataset.grupo === id;
      li.classList.toggle("activo", on);
      li.querySelector(".grupo-boton")?.setAttribute("aria-pressed", String(on));
      if (on && globo) {
        globo.textContent = li.dataset.castor;
        globo.classList.remove("cambia");
        void globo.offsetWidth;
        globo.classList.add("cambia");
      }
    });

    if (desplazar && porScroll && escritorio.matches) {
      const li = grupos.find((g) => g.dataset.grupo === id);
      li?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  grupos.forEach((li) => {
    li.querySelector(".grupo-boton")?.addEventListener("click", () => activar(li.dataset.grupo, { desplazar: true }));
  });

  // En escritorio, el grupo que cruza el centro de la pantalla se levanta del plato
  const escritorio = window.matchMedia("(min-width: 901px)");
  if (porScroll && "IntersectionObserver" in window) {
    const observador = new IntersectionObserver((entradas) => {
      if (!escritorio.matches) return;
      entradas.forEach((e) => {
        if (e.isIntersecting) activar(e.target.dataset.grupo);
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    grupos.forEach((li) => observador.observe(li));
  }
}

/* ------------------------------------------
   2. IMC RÁPIDO (mismos rangos que Js/calculadora.js)
   ------------------------------------------ */
function initImcRapido() {
  const form = document.getElementById("ficha-imc");
  if (!form) return;

  const peso = document.getElementById("imc-peso");
  const estatura = document.getElementById("imc-estatura");
  const error = document.getElementById("imc-error");
  const vacio = document.getElementById("imc-vacio");
  const lectura = document.getElementById("imc-lectura");
  const valor = document.getElementById("imc-valor");
  const categoria = document.getElementById("imc-categoria");
  const marca = document.getElementById("imc-marca");

  const marcarError = (input, mensaje) => {
    input.setAttribute("aria-invalid", "true");
    error.textContent = mensaje;
    input.focus();
  };

  [peso, estatura].forEach((input) => {
    input.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");
      error.textContent = "";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const kg = parseFloat(peso.value);
    const cm = parseFloat(estatura.value);

    if (!kg || kg < 20 || kg > 300) {
      marcarError(peso, "Escribe tu peso en kilogramos, entre 20 y 300.");
      return;
    }
    if (!cm || cm < 100 || cm > 230) {
      marcarError(estatura, "Escribe tu estatura en centímetros, entre 100 y 230.");
      return;
    }

    const m = cm / 100;
    // Se clasifica con el valor redondeado que ve el usuario (evita "25.0 Peso normal")
    const imc = Math.round((kg / (m * m)) * 10) / 10;

    let nivel, texto, posicion;
    if (imc < 18.5) {
      nivel = "bajo"; texto = "Bajo peso";
      posicion = Math.max(3, (imc / 18.5) * 25);
    } else if (imc < 25) {
      nivel = "normal"; texto = "Peso normal";
      posicion = 25 + ((imc - 18.5) / 6.5) * 25;
    } else if (imc < 30) {
      nivel = "sobre"; texto = "Sobrepeso";
      posicion = 50 + ((imc - 25) / 5) * 25;
    } else {
      nivel = "obes"; texto = "Obesidad";
      posicion = Math.min(97, 75 + ((imc - 30) / 10) * 25);
    }

    if (typeof contarHasta === "function") contarHasta(valor, imc, { decimales: 1 });
    else valor.textContent = imc.toFixed(1);
    categoria.textContent = texto;
    categoria.dataset.nivel = nivel;
    vacio.hidden = true;
    lectura.hidden = false;
    requestAnimationFrame(() => { marca.style.left = `${posicion}%`; });

    // La calculadora completa abre con los mismos datos
    const enlace = form.querySelector(".ficha-nota a");
    if (enlace) enlace.href = `Views/calculadora.html?peso=${kg}&estatura=${cm}`;
  });
}

/* ------------------------------------------
   3. ¿SABÍAS QUÉ? (usa los datos de Js/sabias_que.js)
   ------------------------------------------ */
function initDatoCurioso() {
  const boton = document.getElementById("dato-otro");
  const titulo = document.getElementById("dato-titulo");
  const desc = document.getElementById("dato-desc");
  const tarjeta = titulo?.parentElement;
  if (!boton || !titulo || !desc || typeof datosCuriosos === "undefined" || !datosCuriosos.length) {
    boton?.setAttribute("hidden", "");
    return;
  }

  let actual = datosCuriosos.findIndex((d) => d.titulo === titulo.textContent.trim());

  boton.addEventListener("click", () => {
    let siguiente = actual;
    while (siguiente === actual && datosCuriosos.length > 1) {
      siguiente = Math.floor(Math.random() * datosCuriosos.length);
    }
    actual = siguiente;
    titulo.textContent = datosCuriosos[actual].titulo;
    desc.textContent = datosCuriosos[actual].descripcion;
    tarjeta.classList.remove("cambia");
    void tarjeta.offsetWidth;
    tarjeta.classList.add("cambia");
  });
}

