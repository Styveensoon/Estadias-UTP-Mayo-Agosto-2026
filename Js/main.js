document.addEventListener("DOMContentLoaded", () => {
  // 1. CONTROL DEL MENÚ RESPONSIVO (HAMBURGUESA)
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");

      const icon = navToggle.querySelector("i");
      if (icon) {
        if (navMenu.classList.contains("active")) {
          icon.className = "fa-solid fa-xmark";
        } else {
          icon.className = "fa-solid fa-bars";
        }
      }
    });
  }

  // 2. DELEGACIÓN GLOBAL PARA SELECCIÓN DE TEMAS EN EL MENÚ
  document.addEventListener("click", (e) => {
    // Intercepta si el clic ocurrió dentro de una opción del dropdown
    const link = e.target.closest("#topics-dropdown a, .dropdown-menu a, .dropdown-content a");
    if (!link) return;

    const topicId = link.getAttribute("data-topic");
    if (!topicId) return;

    // Guardar la opción seleccionada
    localStorage.setItem("selectedTopic", topicId);

    const topicContainer = document.getElementById("topic-content");

    // CASO A: Ya estamos dentro de la página temas.html
    if (topicContainer) {
      e.preventDefault(); // Detiene la navegación nativa para evitar recargas

      // Dispara la función de renderizado de temas.js
      if (typeof window.renderTopic === "function") {
        window.renderTopic(topicId);
      } else if (typeof renderTopic === "function") {
        renderTopic(topicId);
      }

      // Reinicia componentes interactivos
      initDynamicComponents();
    } 
    // CASO B: Estamos en index.html o cualquier otra subvista
    else {
      e.preventDefault();
      const currentPath = window.location.pathname;
      const isInsideViews = currentPath.includes("/Views/") || 
                            currentPath.endsWith("quienes_somos.html") || 
                            currentPath.endsWith("sabias_que.html") || 
                            currentPath.endsWith("calculadora.html") ||
                            currentPath.endsWith("tu_opinion.html");

      // Redirige correctamente según la ubicación relativa actual
      window.location.href = isInsideViews ? "temas.html" : "Views/temas.html";
    }

    // Cerrar el menú desplegable en móviles
    if (navMenu && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      if (navToggle) {
        const icon = navToggle.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      }
    }
  });

  // 3. INICIALIZAR COMPONENTES DINÁMICOS Y DETECTAR CAMBIOS EN EL DOM
  initDynamicComponents();

  const topicContainer = document.getElementById("topic-content");
  if (topicContainer) {
    const observer = new MutationObserver(() => {
      initDynamicComponents();
    });
    observer.observe(topicContainer, { childList: true, subtree: true });
  }
});

/**
 * Detecta qué tema está en pantalla e inicializa su interactividad correspondiente
 */
function initDynamicComponents() {
  if (document.getElementById("jarra-info-card") || document.querySelector(".jarra-layer")) {
    initJarraInteractivity();
  }
  if (document.getElementById("plato-info-card") || document.querySelector(".plate-slice")) {
    initTema4();
  }
  if (document.querySelector(".ejercicio-wrapper") || document.getElementById("tema8-container")) {
    initTema8();
  }
}

/* ==========================================
   INTERACTIVIDAD DE LA JARRA + DIÁLOGOS DEL CASTOR (TEMA 3)
   ========================================== */
function initJarraInteractivity() {
  const jarraLayers = document.querySelectorAll('.jarra-layer');
  const jarraBtns = document.querySelectorAll('.jarra-btn');
  const infoCard = document.getElementById('jarra-info-card');
  const tagEl = document.getElementById('jarra-tag');
  const titleEl = document.getElementById('jarra-level-title');
  const qtyEl = document.getElementById('jarra-qty');
  const descEl = document.getElementById('jarra-info-desc');
  const castorBubble = document.getElementById('castor-bubble');

  const jarraData = {
    "1": {
      title: "Agua Potable Simple",
      qty: "6 a 8 Vasos al día",
      color: "#2563eb",
      desc: "Es la bebida más saludable y la única indispensable para la hidratación del cuerpo. No aporta calorías ni azúcares.",
      castorMsg: "💧 ¡El Nivel 1 es el número uno! Tienes que tomar de 6 a 8 vasos diarios para mantener tus dientes y cuerpo al 100%."
    },
    "2": {
      title: "Leche Semidescremada y Bebidas de Soya",
      qty: "Máximo 2 Vasos al día",
      color: "#9333ea",
      desc: "Aportan calcio, vitamina D y proteína de buena calidad. Se aconseja elegir opciones sin azúcar añadida.",
      castorMsg: "🥛 ¡Para huesos fuertes! La leche semidescremada o soya nos da mucha energía, ¡pero máximo 2 vasos al día!"
    },
    "3": {
      title: "Café y Té sin Azúcar",
      qty: "Máximo 4 Tazas al día",
      color: "#eab308",
      desc: "Aportan antioxidantes naturales. Se deben tomar sin azúcares ni endulzantes añadidos para conservar sus beneficios.",
      castorMsg: "☕ ¡Cuidado con el azúcar! El café o té sin endulzar son fantásticos, pero no te pases de 4 tazas diarias."
    },
    "4": {
      title: "Bebidas No Calóricas con Edulcorantes",
      qty: "Máximo 2 Vasos al día",
      color: "#f97316",
      desc: "Refrescos de dieta o bebidas con sustitutos de azúcar. Aunque no aportan calorías, pueden malacostumbrar al paladar al sabor dulce.",
      castorMsg: "⚠️ ¡Atento con los edulcorantes! No tienen calorías, pero pueden engañar a tu cerebro. ¡Consúmelos con moderación!"
    },
    "5": {
      title: "Jugos de Fruta, Leche Entera y Alcohol",
      qty: "Máximo ½ Vaso al día",
      color: "#ef4444",
      desc: "Contienen una concentración alta de grasas o azúcares naturales. Su consumo debe ser muy restringido.",
      castorMsg: "🍊 ¡Ojo aquí! Un jugo natural tiene muchísima azúcar de la fruta junta. Con medio vaso al día es suficiente."
    },
    "6": {
      title: "Refrescos y Aguas de Sabor",
      qty: "0 Vasos (Evitar)",
      color: "#16a34a",
      desc: "No proporcionan nutrimentos y contienen elevadas cantidades de azúcar procesada. Su consumo se relaciona con la diabetes y la obesidad.",
      castorMsg: "🛑 ¡Zona peligrosa! Los refrescos y embotellados no nos ayudan. Es mejor evitarlos para cuidar tu corazón y salud."
    }
  };

  function updateLevel(selectedLevel) {
    const data = jarraData[selectedLevel];
    if (!data) return;

    jarraLayers.forEach(layer => {
      const lvl = layer.getAttribute('data-level');
      if (parseInt(lvl) <= parseInt(selectedLevel)) {
        layer.classList.add('active');
      } else {
        layer.classList.remove('active');
      }
    });

    jarraBtns.forEach(btn => {
      if (btn.getAttribute('data-level') === selectedLevel) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (infoCard) {
      infoCard.classList.remove('fade-in-card');
      void infoCard.offsetWidth;
      infoCard.classList.add('fade-in-card');
      infoCard.style.borderLeftColor = data.color;
    }

    if (tagEl) {
      tagEl.textContent = `Nivel ${selectedLevel}`;
      tagEl.style.backgroundColor = data.color;
    }
    if (titleEl) titleEl.textContent = data.title;
    if (qtyEl) qtyEl.textContent = data.qty;
    if (descEl) descEl.textContent = data.desc;
    if (castorBubble) castorBubble.textContent = data.castorMsg;
  }

  jarraLayers.forEach(layer => {
    layer.addEventListener('click', () => {
      const lvl = layer.getAttribute('data-level');
      updateLevel(lvl);
    });
  });

  jarraBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lvl = btn.getAttribute('data-level');
      updateLevel(lvl);
    });
  });
}

/* ==========================================
   INTERACTIVIDAD DEL PLATO DEL BUEN COMER (TEMA 4)
   ========================================== */
function initTema4() {
  const groupCards = document.querySelectorAll('.group-card');
  const plateSlices = document.querySelectorAll('.plate-slice');
  const plateBtns = document.querySelectorAll('.plato-btn');
  const infoCard = document.getElementById('plato-info-card');
  const tagEl = document.getElementById('plato-tag');
  const titleEl = document.getElementById('plato-group-title');
  const propEl = document.getElementById('plato-proportion');
  const descEl = document.getElementById('plato-info-desc');
  const castorBubble = document.getElementById('plato-castor-bubble');

  const platoData = {
    "1": {
      title: "Verduras y Frutas",
      proportion: "50% de tu plato",
      color: "#16a34a",
      desc: "Aportan fibra, agua, vitaminas (A, C, complejo B) y minerales. Deben formar la mitad exacta de cada comida principal.",
      castorMsg: "🥦 ¡Llena la mitad de tu plato (50%) con verduras y frutas! Aportan la vitamina y agua que tu cuerpo necesita al día."
    },
    "2": {
      title: "Cereales, Granos y Tubérculos",
      proportion: "22% de tu plato",
      color: "#eab308",
      desc: "Principal fuente de energía. Elige opciones integrales como tortilla de maíz, avena, arroz integral o papa con cáscara.",
      castorMsg: "🌾 Los cereales y tubérculos ocupan cerca de una cuarta parte del plato (22%) para darte energía constante."
    },
    "3": {
      title: "Leguminosas",
      proportion: "15% de tu plato",
      color: "#f97316",
      desc: "Aportan proteína vegetal y fibra de excelente calidad. Ejemplos: frijoles, lentejas, garbanzos y habas.",
      castorMsg: "🫘 Las leguminosas (15%) combinadas con cereales son una gran fuente proteica de origen vegetal."
    },
    "4": {
      title: "Alimentos de Origen Animal",
      proportion: "8% de tu plato",
      color: "#ef4444",
      desc: "Aportan proteínas de alto valor biológico, hierro y vitamina B12. Prefiere carnes magras, pescado, huevo o lácteos descremados.",
      castorMsg: "🍗 ¡Solo una porción modesta (8%)! Es suficiente para cubrir tus necesidades de proteína animal e hierro."
    },
    "5": {
      title: "Aceites y Grasas Saludables",
      proportion: "5% de tu plato",
      color: "#d97706",
      desc: "Proporcionan ácidos grasos esenciales. Prefiere aguacate, aceite de oliva, nueces, almendras y semillas en pequeñas cantidades.",
      castorMsg: "🥑 Usa grasas saludables con moderación (5%) para cuidar tu corazón y salud metabólica."
    }
  };

  function updatePlatoGroup(groupId) {
    const data = platoData[groupId];
    if (!data) return;

    groupCards.forEach(card => {
      card.classList.toggle('active', card.getAttribute('data-group') === groupId);
    });

    plateSlices.forEach(slice => {
      slice.classList.toggle('active', slice.getAttribute('data-group') === groupId);
    });

    plateBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-group') === groupId);
    });

    if (infoCard) infoCard.style.borderLeftColor = data.color;
    if (tagEl) {
      tagEl.textContent = `Grupo ${groupId}`;
      tagEl.style.backgroundColor = data.color;
    }
    if (titleEl) titleEl.textContent = data.title;
    if (propEl) {
      propEl.textContent = data.proportion;
      propEl.style.color = data.color;
    }
    if (descEl) descEl.textContent = data.desc;
    if (castorBubble) castorBubble.textContent = data.castorMsg;
  }

  groupCards.forEach(card => {
    card.addEventListener('click', () => updatePlatoGroup(card.getAttribute('data-group')));
  });

  plateSlices.forEach(slice => {
    slice.addEventListener('click', () => updatePlatoGroup(slice.getAttribute('data-group')));
  });

  plateBtns.forEach(btn => {
    btn.addEventListener('click', () => updatePlatoGroup(btn.getAttribute('data-group')));
  });
}

/* ==========================================
   INTERACTIVIDAD DE PLANIFICACIÓN Y HÁBITOS (TEMA 8)
   ========================================== */
function initTema8() {
  const cards = document.querySelectorAll('.feature-card');
  const castorBubble = document.getElementById('tema8-castor-bubble');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      if (castorBubble) {
        const title = card.querySelector('h3')?.textContent || '';
        castorBubble.textContent = `¡Excelente elección! Crear consistencia en "${title}" es fundamental para mantener una vida saludable a largo plazo.`;
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  // 1. Menú hamburguesa (móviles)
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const icon = navToggle.querySelector("i");
      if (icon) {
        icon.className = navMenu.classList.contains("active")
          ? "fa-solid fa-xmark"
          : "fa-solid fa-bars";
      }
    });
  }

  // 2. Selección de temas del submenú
  const topicLinks = document.querySelectorAll("#topics-dropdown a[data-topic]");
  topicLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const topicId = link.getAttribute("data-topic");
      if (topicId) {
        localStorage.setItem("selectedTopic", topicId);
      }
      // Solo frena la navegación si YA estamos dentro de temas.html
      const topicContainer = document.getElementById("topic-content");
      if (topicContainer) {
        e.preventDefault();
        if (typeof window.renderTopic === "function") {
          window.renderTopic(topicId);
        }
      }
    });
  });
});