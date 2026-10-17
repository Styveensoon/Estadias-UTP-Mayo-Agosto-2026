/* ==========================================
   TEMA 10: FORMAS DE PREPARAR LOS ALIMENTOS
   - Índice de métodos ordenado del más al menos recomendable, con filtro por semáforo.
   - Ficha del método: la foto entra con un recorte circular (el plato), los medidores
     se llenan y las ventajas y desventajas aparecen escalonadas.
   - "Reto en la cocina": elige la mejor forma de preparar cada alimento.
   Basado en las Guías Alimentarias Saludables y Sostenibles para la Población Mexicana 2023,
   que recomiendan preparar los alimentos al vapor, hervidos, asados, a la plancha o al horno
   en lugar de fritos, capeados o empanizados.
   ========================================== */

// nivel: recomendado | moderado | ocasional
// medidores de 0 a 4: grasa añadida, nutrientes que conserva, calor intenso (riesgo de quemar)
const METODOS_PREPARACION = [
  {
    id: "vapor", nombre: "Al vapor", icono: "fa-cloud", nivel: "recomendado",
    resumen: "El alimento se cuece con el vapor del agua, sin tocarla.",
    alt: "Verduras de hoja verde con zanahoria cocidas en una vaporera de acero",
    grasa: 0, nutrientes: 4, calor: 0,
    ventajas: [
      "Es de las formas que mejor conserva vitaminas como la C y las del complejo B, porque el alimento no se sumerge en agua.",
      "No necesita aceite ni grasa.",
      "Las verduras mantienen su color, textura y sabor natural.",
      "Es difícil que se queme o se pegue."
    ],
    desventajas: [
      "El sabor es suave; sin especias puede parecer simple.",
      "Las piezas grandes o gruesas tardan más en cocerse.",
      "Necesitas vaporera, aunque un colador sobre una olla tapada también funciona."
    ],
    ideal: ["Brócoli", "Calabacitas", "Zanahoria", "Pescado", "Pollo"],
    consejo: "Sazona con limón, ajo, cilantro o chile en lugar de sal extra. ¡El sabor cambia por completo!"
  },
  {
    id: "hervido", nombre: "Hervido o cocido", icono: "fa-droplet", nivel: "recomendado",
    resumen: "El alimento se cuece sumergido en agua o caldo caliente.",
    alt: "Elotes cocidos dentro de una olla con agua",
    grasa: 0, nutrientes: 2, calor: 0,
    ventajas: [
      "No lleva grasa añadida.",
      "Es sencillo y económico: solo necesitas una olla.",
      "Ablanda leguminosas y cereales como frijoles, lentejas, garbanzos y arroz.",
      "En sopas y caldos aprovechas los nutrientes que pasan al agua."
    ],
    desventajas: [
      "Parte de las vitaminas y minerales se quedan en el agua; si la tiras, se pierden.",
      "Si se cuece de más, la verdura pierde color, sabor y textura.",
      "Tarda más que otras formas en alimentos duros."
    ],
    ideal: ["Frijoles", "Lentejas", "Elotes", "Arroz", "Caldos"],
    consejo: "Usa poca agua, tapa la olla y no recuezas. Ese caldo con vitaminas sirve para una sopa."
  },
  {
    id: "plancha", nombre: "A la plancha o al comal", icono: "fa-fire-burner", nivel: "recomendado",
    resumen: "Se cocina sobre una superficie caliente con muy poco o nada de aceite.",
    alt: "Pechugas de pollo a la plancha servidas con ensalada y jitomate",
    grasa: 1, nutrientes: 3, calor: 2,
    ventajas: [
      "Es rápido: un filete está listo en pocos minutos.",
      "Basta una gota de aceite, o nada si el comal o sartén es antiadherente.",
      "Sella el alimento y lo deja jugoso con un dorado rico."
    ],
    desventajas: [
      "Si se quema o se carboniza, se forman compuestos dañinos para la salud.",
      "Las piezas gruesas pueden quedar crudas por dentro.",
      "Sin cuidado, el alimento se pega y se reseca."
    ],
    ideal: ["Pechuga de pollo", "Pescado", "Nopales", "Queso panela", "Bistec magro"],
    consejo: "Corta piezas delgadas y voltéalas una sola vez. Si se ennegrece, quita esa parte."
  },
  {
    id: "horno", nombre: "Al horno", icono: "fa-temperature-half", nivel: "recomendado",
    resumen: "El calor seco del horno rodea el alimento y lo cocina parejo.",
    alt: "Pollo entero horneado sobre una cama de papas y zanahorias",
    grasa: 1, nutrientes: 3, calor: 2,
    ventajas: [
      "Necesita poco o nada de aceite.",
      "Cocina piezas grandes de forma uniforme.",
      "Puedes preparar proteína y verduras en la misma charola.",
      "Logra un dorado crujiente sin freír."
    ],
    desventajas: [
      "Tarda más y gasta más gas o electricidad.",
      "A temperaturas muy altas el alimento se puede quemar.",
      "Si le pones mucha mantequilla, crema o empanizado, deja de ser ligero."
    ],
    ideal: ["Pollo", "Pescado", "Camote", "Calabaza", "Papa con cáscara"],
    consejo: "Envuelve pescado o verduras en papel aluminio con hierbas: se cuecen en su propio jugo."
  },
  {
    id: "salteado", nombre: "Salteado", icono: "fa-utensils", nivel: "recomendado",
    resumen: "Trozos pequeños que se mueven rápido en un sartén caliente con poco aceite.",
    alt: "Verduras salteadas con una pala de madera en un sartén sobre la estufa",
    grasa: 2, nutrientes: 3, calor: 1,
    ventajas: [
      "La cocción es muy corta, así que las verduras quedan crujientes y conservan nutrientes.",
      "Usa solo una cucharadita de aceite.",
      "Es ideal para combinar verduras con un poco de proteína en un solo plato."
    ],
    desventajas: [
      "Es fácil pasarse de aceite sin darte cuenta.",
      "Las salsas comerciales (soya, teriyaki) aportan mucho sodio.",
      "Requiere atención constante para que no se queme."
    ],
    ideal: ["Ejotes", "Pimiento", "Champiñones", "Tofu", "Tiras de pollo"],
    consejo: "Mide el aceite con una cuchara en lugar de servirlo directo de la botella."
  },
  {
    id: "freidora-aire", nombre: "Freidora de aire", icono: "fa-wind", nivel: "moderado",
    resumen: "Aire muy caliente circula alrededor del alimento para dorarlo.",
    alt: "Papas en rodajas doradas dentro de la canasta de una freidora de aire",
    grasa: 1, nutrientes: 3, calor: 3,
    ventajas: [
      "Dora y deja crujiente con mucho menos aceite que la fritura tradicional.",
      "Es rápida y fácil de limpiar.",
      "Sirve para recalentar sin que el alimento quede aguado."
    ],
    desventajas: [
      "Las papas y harinas muy doradas pueden formar acrilamida, un compuesto que conviene evitar.",
      "Invita a preparar más seguido productos ultraprocesados como nuggets o papas congeladas.",
      "La canasta es pequeña para cocinar en familia."
    ],
    ideal: ["Verduras en trozos", "Garbanzos tostados", "Pescado", "Camote"],
    consejo: "Busca un dorado claro, no café oscuro, y úsala sobre todo con alimentos frescos."
  },
  {
    id: "parrilla", nombre: "A la parrilla o al carbón", icono: "fa-fire", nivel: "moderado",
    resumen: "Se cocina sobre fuego directo, brasas o carbón.",
    alt: "Carne y elotes cocinándose en un asador de carbón",
    grasa: 0, nutrientes: 3, calor: 4,
    ventajas: [
      "La grasa de la carne escurre y no se le agrega aceite.",
      "Da un sabor ahumado muy apreciado.",
      "Las verduras asadas quedan dulces y llenas de sabor."
    ],
    desventajas: [
      "Las partes quemadas y el humo forman compuestos asociados a mayor riesgo de cáncer.",
      "El fuego directo es difícil de controlar.",
      "Suele acompañarse de carnes rojas, embutidos y porciones grandes."
    ],
    ideal: ["Nopales", "Cebollitas", "Elote", "Pescado", "Pollo sin piel"],
    consejo: "Asa más verduras que carne, evita que la flama toque el alimento y quita lo carbonizado."
  },
  {
    id: "frito", nombre: "Frito en aceite", icono: "fa-oil-can", nivel: "ocasional",
    resumen: "El alimento se sumerge en aceite muy caliente.",
    alt: "Papas cortadas en bastones friéndose en un sartén con aceite",
    grasa: 4, nutrientes: 1, calor: 4,
    ventajas: [
      "Es rápido y deja una textura crujiente que a casi todos les gusta.",
      "Es parte de platillos tradicionales para celebrar de vez en cuando."
    ],
    desventajas: [
      "El alimento absorbe mucho aceite y sus calorías se multiplican.",
      "Reutilizar el aceite genera compuestos dañinos.",
      "Las papas y los empanizados muy dorados forman acrilamida.",
      "Su consumo frecuente se relaciona con sobrepeso, colesterol alto y enfermedades del corazón."
    ],
    ideal: ["Solo en ocasiones especiales"],
    consejo: "Si lo haces, que sea de vez en cuando: escurre sobre servilleta y no reutilices el aceite."
  }
];

const NIVELES_PREPARACION = {
  recomendado: { texto: "Recomendado", corto: "Recomendadas", semaforo: "bajo" },
  moderado: { texto: "Con moderación", corto: "Con moderación", semaforo: "moderado" },
  ocasional: { texto: "Solo de vez en cuando", corto: "De vez en cuando", semaforo: "alto" }
};

// masEsMejor decide de qué color se pinta el medidor
const MEDIDORES_PREPARACION = [
  { clave: "grasa", nombre: "Grasa añadida", escala: ["Nada", "Muy poca", "Poca", "Media", "Mucha"] },
  { clave: "nutrientes", nombre: "Nutrientes que conserva", escala: ["Muy pocos", "Pocos", "Regular", "Muchos", "Casi todos"], masEsMejor: true },
  { clave: "calor", nombre: "Riesgo de quemar", escala: ["Nulo", "Bajo", "Medio", "Alto", "Muy alto"] }
];

const RETO_PREPARACION = [
  {
    alimento: "Brócoli",
    opciones: [
      { texto: "Al vapor, 5 minutos", correcta: true },
      { texto: "Capeado y frito" },
      { texto: "Hervido 30 minutos" }
    ],
    explicacion: "Al vapor y por poco tiempo conserva su color verde, lo crujiente y la mayor parte de su vitamina C."
  },
  {
    alimento: "Pechuga de pollo",
    opciones: [
      { texto: "Empanizada y frita" },
      { texto: "A la plancha con limón", correcta: true },
      { texto: "Asada hasta quedar negra" }
    ],
    explicacion: "A la plancha casi no lleva aceite y queda jugosa. Lo quemado forma compuestos que conviene evitar."
  },
  {
    alimento: "Papas",
    opciones: [
      { texto: "A la francesa, fritas" },
      { texto: "Fritas en aceite reutilizado" },
      { texto: "Al horno con cáscara", correcta: true }
    ],
    explicacion: "Horneadas con cáscara conservan fibra y potasio, y no absorben aceite como las fritas."
  },
  {
    alimento: "Frijoles",
    opciones: [
      { texto: "De la olla", correcta: true },
      { texto: "Refritos con manteca" },
      { texto: "Charros con chorizo" }
    ],
    explicacion: "Los frijoles de la olla dan fibra y proteína sin la grasa saturada de la manteca o el chorizo."
  },
  {
    alimento: "Filete de pescado",
    opciones: [
      { texto: "Capeado y frito" },
      { texto: "Empapelado al horno", correcta: true },
      { texto: "Al carbón con flama directa" }
    ],
    explicacion: "Empapelado se cuece en su propio jugo con hierbas y verduras, sin grasa añadida ni partes quemadas."
  }
];

function getTema10HTML() {
  const foto = (id) => `../Resources/temas/preparacion/${id}.jpg`;
  const conteo = (nivel) => METODOS_PREPARACION.filter((m) => m.nivel === nivel).length;
  const filtro = (valor, texto, total, activo) => `
    <button type="button" class="filtro" data-nivel="${valor}" aria-pressed="${activo}">
      ${valor === "todas" ? "" : `<span class="prep-punto prep-punto-${valor}" aria-hidden="true"></span>`}
      ${texto} <span class="filtro-total">${total}</span>
    </button>`;

  return `
    <div class="prep">
      <header class="tema-cabeza">
        <h1 class="topic-main-title">Formas de preparar tus alimentos</h1>
        <p class="topic-desc">Un mismo alimento puede ser muy saludable o no tanto según cómo lo cocines. Aquí van ordenadas de la más a la menos recomendable. Elige una para ver sus ventajas y desventajas.</p>
      </header>

      <div class="filtros prep-filtros" role="group" aria-label="Filtrar por recomendación">
        ${filtro("todas", "Todas", METODOS_PREPARACION.length, true)}
        ${filtro("recomendado", NIVELES_PREPARACION.recomendado.corto, conteo("recomendado"), false)}
        ${filtro("moderado", NIVELES_PREPARACION.moderado.corto, conteo("moderado"), false)}
        ${filtro("ocasional", NIVELES_PREPARACION.ocasional.corto, conteo("ocasional"), false)}
      </div>

      <div class="prep-cuerpo">
        <ol class="prep-lista" id="prep-lista" aria-label="Formas de preparación, de la más a la menos recomendable">
          ${METODOS_PREPARACION.map((m, i) => `
            <li data-nivel="${m.nivel}">
              <button type="button" class="prep-item" data-metodo="${m.id}" aria-pressed="false" aria-controls="prep-ficha">
                <span class="prep-num">${i + 1}</span>
                <span class="prep-item-texto">
                  <strong>${m.nombre}</strong>
                  <span>${m.resumen}</span>
                </span>
                <span class="prep-punto prep-punto-${m.nivel}" title="${NIVELES_PREPARACION[m.nivel].texto}"></span>
                <span class="sr-only">${NIVELES_PREPARACION[m.nivel].texto}</span>
              </button>
            </li>`).join("")}
        </ol>

        <section class="prep-ficha" id="prep-ficha" aria-live="polite" tabindex="-1">
          <figure class="prep-foto" id="prep-foto">
            <img src="${foto(METODOS_PREPARACION[0].id)}" alt="${METODOS_PREPARACION[0].alt}" width="800" height="600" decoding="async">
            <figcaption class="prep-fuego" id="prep-fuego" aria-hidden="true"></figcaption>
            <div class="prep-flechas">
              <button type="button" class="prep-flecha" data-paso="-1" aria-label="Forma anterior"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button>
              <button type="button" class="prep-flecha" data-paso="1" aria-label="Forma siguiente"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
            </div>
          </figure>
          <div class="prep-ficha-cuerpo" id="prep-ficha-cuerpo"></div>
        </section>
      </div>

      <section class="prep-reto" id="prep-reto" aria-labelledby="prep-reto-titulo">
        <div class="prep-reto-cabeza">
          <h2 id="prep-reto-titulo">Reto en la cocina</h2>
          <p>¿Cómo prepararías cada alimento? Elige la opción más saludable y suma puntos.</p>
        </div>
        <div class="prep-reto-juego" id="prep-reto-juego"></div>
      </section>

      <p class="guia-creditos">Fotografías: Wikimedia Commons. Al vapor, Joekyabby1 (CC BY-SA 4.0); hervido, Taoheedah (CC BY-SA 4.0); a la plancha, Gerda Arendt (CC0); al horno, Daderot (CC0); salteado, Alabama Extension (CC0); a la parrilla, Brian Chu (CC BY 2.5); freidora de aire, NeoBatfreak (CC0); frito, Famartin (CC BY-SA 4.0).</p>

      <p class="tema-mas">
        <a href="https://climss.imss.gob.mx/cursos/obesidad/m1/Gu%C3%ADas_Alimentarias2023_6Junio23.pdf" target="_blank" rel="noopener noreferrer" class="boton-mantel"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Leer las Guías Alimentarias 2023</a>
        <span>Recomiendan preparar tus alimentos al vapor, hervidos, asados, a la plancha o al horno en lugar de fritos, capeados o empanizados.</span>
      </p>
    </div>
  `;
}

function initPreparacion() {
  const lista = document.getElementById("prep-lista");
  const ficha = document.getElementById("prep-ficha");
  const figura = document.getElementById("prep-foto");
  const cuerpo = document.getElementById("prep-ficha-cuerpo");
  const fuego = document.getElementById("prep-fuego");
  if (!lista || !ficha || !cuerpo) return;

  const reducir = () => typeof sinMovimiento !== "undefined" && sinMovimiento.matches;
  const botones = Array.from(lista.querySelectorAll(".prep-item"));
  let actual = null;

  const visibles = () => botones.filter((b) => !b.closest("li").hidden);

  function medidor(med, valor) {
    // Qué tan "bueno" es el valor: verde, amarillo o rojo
    const bondad = med.masEsMejor ? valor : 4 - valor;
    const tono = bondad >= 3 ? "bueno" : bondad >= 2 ? "medio" : "malo";
    const segmentos = Array.from({ length: 4 }, (_, i) =>
      `<span class="prep-seg${i < valor ? " lleno" : ""}" style="--i:${i}"></span>`).join("");
    return `
      <div class="prep-medidor prep-tono-${tono}">
        <span class="prep-medidor-nombre">${med.nombre}</span>
        <span class="prep-segs" role="img" aria-label="${med.nombre}: ${med.escala[valor]}">${segmentos}</span>
        <span class="prep-medidor-valor">${med.escala[valor]}</span>
      </div>`;
  }

  function dibujarFuego(calor) {
    // La "hornilla": cuatro flamas, se encienden según el calor que usa el método
    fuego.innerHTML = Array.from({ length: 4 }, (_, i) =>
      `<i class="fa-solid fa-fire${i < calor ? " encendida" : ""}" style="--i:${i}"></i>`).join("") +
      `<span>${calor === 0 ? "Sin fuego directo" : "Calor " + MEDIDORES_PREPARACION[2].escala[calor].toLowerCase()}</span>`;
  }

  function cambiarFoto(metodo, origen) {
    const anterior = figura.querySelector("img");
    if (anterior && anterior.getAttribute("src").includes(`/${metodo.id}.jpg`)) return;
    const nueva = new Image(800, 600);
    nueva.src = `../Resources/temas/preparacion/${metodo.id}.jpg`;
    nueva.alt = metodo.alt;
    nueva.decoding = "async";

    if (reducir() || !anterior) {
      if (anterior) anterior.replaceWith(nueva); else figura.prepend(nueva);
      return;
    }
    // El recorte circular nace donde el usuario tocó (o desde el centro)
    const caja = figura.getBoundingClientRect();
    const x = origen ? Math.round(((origen.x - caja.left) / caja.width) * 100) : 50;
    const y = origen ? Math.round(((origen.y - caja.top) / caja.height) * 100) : 50;
    nueva.style.setProperty("--x", `${Math.min(100, Math.max(0, x))}%`);
    nueva.style.setProperty("--y", `${Math.min(100, Math.max(0, y))}%`);
    nueva.classList.add("prep-foto-nueva");
    figura.querySelectorAll("img.prep-foto-nueva").forEach((img) => img.classList.remove("prep-foto-nueva"));
    anterior.classList.add("prep-foto-vieja");
    anterior.after(nueva);
    const limpiar = () => {
      figura.querySelectorAll("img").forEach((img) => { if (img !== nueva) img.remove(); });
      nueva.classList.remove("prep-foto-nueva");
    };
    nueva.addEventListener("animationend", limpiar, { once: true });
    setTimeout(limpiar, 900); // por si la animación no corre
  }

  function seleccionar(id, { origen = null } = {}) {
    const metodo = METODOS_PREPARACION.find((m) => m.id === id);
    if (!metodo || metodo === actual) return;
    actual = metodo;
    const nivel = NIVELES_PREPARACION[metodo.nivel];

    botones.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.metodo === id)));
    ficha.dataset.nivel = metodo.nivel;
    cambiarFoto(metodo, origen);
    dibujarFuego(metodo.calor);

    cuerpo.innerHTML = `
      <div class="prep-titulo">
        <h2><i class="fa-solid ${metodo.icono}" aria-hidden="true"></i> ${metodo.nombre}</h2>
        <span class="semaforo semaforo-${nivel.semaforo}">${nivel.texto}</span>
      </div>
      <p class="prep-resumen">${metodo.resumen}</p>

      <div class="prep-medidores">
        ${MEDIDORES_PREPARACION.map((med) => medidor(med, metodo[med.clave])).join("")}
      </div>

      <div class="prep-pros-contras">
        <div class="prep-columna prep-pros">
          <h3><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Ventajas</h3>
          <ul>${metodo.ventajas.map((v) => `<li><i class="fa-solid fa-check" aria-hidden="true"></i><span>${v}</span></li>`).join("")}</ul>
        </div>
        <div class="prep-columna prep-contras">
          <h3><i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Desventajas</h3>
          <ul>${metodo.desventajas.map((d) => `<li><i class="fa-solid fa-xmark" aria-hidden="true"></i><span>${d}</span></li>`).join("")}</ul>
        </div>
      </div>

      <div class="prep-ideal">
        <h3>Ideal para</h3>
        <ul>${metodo.ideal.map((a) => `<li>${a}</li>`).join("")}</ul>
      </div>

      <div class="castor-dice prep-castor">
        <img src="../Resources/marca/castor-sabio.svg" alt="" width="260" height="300" loading="lazy">
        <p class="cambia"><strong>Consejo:</strong> ${metodo.consejo}</p>
      </div>
    `;

    if (typeof escalonar === "function") {
      escalonar(cuerpo.querySelectorAll(".prep-pros li, .prep-contras li, .prep-ideal li"));
    }
  }

  // Clic en el índice; en celular se baja a la ficha
  lista.addEventListener("click", (e) => {
    const boton = e.target.closest(".prep-item");
    if (!boton) return;
    seleccionar(boton.dataset.metodo);
    if (window.matchMedia("(max-width: 900px)").matches) {
      ficha.scrollIntoView({ behavior: reducir() ? "auto" : "smooth", block: "start" });
    }
  });

  // Flechas arriba/abajo para recorrer el índice con el teclado
  lista.addEventListener("keydown", (e) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const vis = visibles();
    const i = vis.indexOf(document.activeElement);
    if (i === -1) return;
    e.preventDefault();
    const destino = e.key === "Home" ? 0 : e.key === "End" ? vis.length - 1
      : (i + (e.key === "ArrowDown" ? 1 : -1) + vis.length) % vis.length;
    vis[destino].focus();
    seleccionar(vis[destino].dataset.metodo);
  });

  // Anterior / siguiente sobre la foto (y deslizar con el dedo)
  function avanzar(paso, origen) {
    const vis = visibles();
    if (!vis.length) return;
    const i = vis.findIndex((b) => b.dataset.metodo === actual?.id);
    const destino = vis[(i + paso + vis.length) % vis.length];
    seleccionar(destino.dataset.metodo, { origen });
  }
  figura.addEventListener("click", (e) => {
    const flecha = e.target.closest(".prep-flecha");
    if (flecha) avanzar(Number(flecha.dataset.paso), { x: e.clientX, y: e.clientY });
  });
  let toqueX = null;
  figura.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") toqueX = e.clientX; });
  figura.addEventListener("pointerup", (e) => {
    if (toqueX === null) return;
    const dx = e.clientX - toqueX;
    toqueX = null;
    if (Math.abs(dx) > 50) avanzar(dx < 0 ? 1 : -1, { x: e.clientX, y: e.clientY });
  });
  ficha.addEventListener("keydown", (e) => {
    if (e.target.closest(".prep-flecha") || e.target === ficha) {
      if (e.key === "ArrowRight") { e.preventDefault(); avanzar(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); avanzar(-1); }
    }
  });

  // Filtro por semáforo
  const filtros = document.querySelectorAll(".prep-filtros .filtro");
  filtros.forEach((f) => f.addEventListener("click", () => {
    const nivel = f.dataset.nivel;
    filtros.forEach((g) => g.setAttribute("aria-pressed", String(g === f)));
    const filas = Array.from(lista.children);
    filas.forEach((li) => { li.hidden = nivel !== "todas" && li.dataset.nivel !== nivel; });
    if (typeof escalonar === "function") escalonar(filas.filter((li) => !li.hidden));
    // Si el método abierto quedó oculto, se abre el primero visible
    const vis = visibles();
    if (vis.length && !vis.some((b) => b.dataset.metodo === actual?.id)) seleccionar(vis[0].dataset.metodo);
  }));

  // Precarga las fotos para que el cambio sea inmediato
  METODOS_PREPARACION.forEach((m) => { const img = new Image(); img.src = `../Resources/temas/preparacion/${m.id}.jpg`; });

  seleccionar(METODOS_PREPARACION[0].id);
  iniciarRetoPreparacion();
}

function iniciarRetoPreparacion() {
  const juego = document.getElementById("prep-reto-juego");
  if (!juego) return;
  const total = RETO_PREPARACION.length;
  let ronda = 0;
  let puntos = 0;

  function progreso() {
    return `
      <div class="prep-reto-progreso" aria-hidden="true">
        ${RETO_PREPARACION.map((_, i) => `<span class="${i < ronda ? "hecho" : i === ronda ? "actual" : ""}"></span>`).join("")}
      </div>`;
  }

  function pregunta() {
    const r = RETO_PREPARACION[ronda];
    juego.innerHTML = `
      ${progreso()}
      <p class="prep-reto-ronda">Alimento <strong>${ronda + 1}</strong> de ${total} · <span class="prep-reto-puntos">${puntos} ${puntos === 1 ? "punto" : "puntos"}</span></p>
      <h3 class="prep-reto-alimento">${r.alimento}</h3>
      <div class="prep-reto-opciones" role="group" aria-label="Opciones para ${r.alimento}">
        ${r.opciones.map((o, i) => `<button type="button" class="prep-opcion" data-i="${i}">${o.texto}</button>`).join("")}
      </div>
      <div class="prep-reto-respuesta" aria-live="polite"></div>
    `;
    juego.classList.remove("prep-reto-entra");
    void juego.offsetWidth;
    juego.classList.add("prep-reto-entra");
  }

  function responder(boton) {
    const r = RETO_PREPARACION[ronda];
    const elegida = r.opciones[Number(boton.dataset.i)];
    const opciones = juego.querySelectorAll(".prep-opcion");
    opciones.forEach((b, i) => {
      b.disabled = true;
      if (r.opciones[i].correcta) b.classList.add("correcta");
    });
    if (elegida.correcta) {
      puntos++;
    } else {
      boton.classList.add("incorrecta");
    }
    const ultima = ronda === total - 1;
    juego.querySelector(".prep-reto-puntos").textContent = `${puntos} ${puntos === 1 ? "punto" : "puntos"}`;
    const respuesta = juego.querySelector(".prep-reto-respuesta");
    respuesta.innerHTML = `
      <p class="prep-reto-veredicto ${elegida.correcta ? "bien" : "mal"}">
        <i class="fa-solid ${elegida.correcta ? "fa-circle-check" : "fa-circle-xmark"}" aria-hidden="true"></i>
        <span><strong>${elegida.correcta ? "¡Muy bien!" : "Casi."}</strong> ${r.explicacion}</span>
      </p>
      <button type="button" class="boton-mantel prep-reto-siguiente">${ultima ? "Ver mi resultado" : "Siguiente alimento"} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
    `;
    respuesta.querySelector(".prep-reto-siguiente").focus({ preventScroll: true });
  }

  function resultado() {
    ronda = total;
    const mensaje = puntos === total
      ? "¡Eres chef saludable! Sabes elegir la mejor forma de cocinar cada alimento."
      : puntos >= total - 2
        ? "¡Muy bien! Ya tienes buen ojo; repasa las formas de preparación que fallaste."
        : "Vas empezando. Revisa las ventajas y desventajas de arriba y vuelve a intentarlo.";
    juego.innerHTML = `
      ${progreso()}
      <div class="prep-reto-final">
        <p class="prep-reto-marcador"><span class="prep-reto-cifra" id="prep-reto-cifra">${puntos}</span><span>de ${total}</span></p>
        <div class="castor-dice prep-castor">
          <img src="../Resources/marca/castor.svg" alt="" width="260" height="300">
          <p class="cambia">${mensaje}</p>
        </div>
        <button type="button" class="boton-mantel prep-reto-otra"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Jugar otra vez</button>
      </div>
    `;
    if (typeof contarHasta === "function") contarHasta(document.getElementById("prep-reto-cifra"), puntos, { duracion: 600 });
    juego.querySelector(".prep-reto-otra").focus({ preventScroll: true });
  }

  juego.addEventListener("click", (e) => {
    const opcion = e.target.closest(".prep-opcion");
    if (opcion && !opcion.disabled) return responder(opcion);
    if (e.target.closest(".prep-reto-siguiente")) {
      ronda++;
      if (ronda < total) {
        pregunta();
        juego.querySelector(".prep-opcion").focus({ preventScroll: true });
      } else {
        resultado();
      }
      return;
    }
    if (e.target.closest(".prep-reto-otra")) {
      ronda = 0;
      puntos = 0;
      pregunta();
      juego.querySelector(".prep-opcion").focus({ preventScroll: true });
    }
  });

  pregunta();
}
