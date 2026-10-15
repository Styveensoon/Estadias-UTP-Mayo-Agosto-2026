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
    // Intercepta cualquier enlace a un tema (menú desplegable, índices y botones)
    const link = e.target.closest("a[data-topic]");
    if (!link) return;

    const topicId = link.getAttribute("data-topic");
    if (!topicId) return;

    // Guardar la opción seleccionada
    localStorage.setItem("selectedTopic", topicId);

    const topicContainer = document.getElementById("topic-content");

    // CASO A: Ya estamos dentro de la página temas.html
    if (topicContainer) {
      e.preventDefault(); // Detiene la navegación nativa para evitar recargas

      // temas.js dibuja el tema e inicializa su interactividad una sola vez
      if (typeof window.renderTopic === "function") {
        window.renderTopic(topicId);
      }
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
});

/**
 * Detecta qué tema está en pantalla e inicializa su interactividad.
 * La llama temas.js una vez por cada tema que dibuja.
 */
function initDynamicComponents() {
  if (document.getElementById("jarra-info-card") || document.querySelector(".jarra-layer")) {
    initJarraInteractivity();
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
      title: "Agua potable simple",
      qty: "6 a 8 vasos al día",
      color: "#2563eb",
      desc: "Es la bebida más saludable y la única indispensable para la hidratación del cuerpo. No aporta calorías ni azúcares.",
      castorMsg: "¡El Nivel 1 es el número uno! Tienes que tomar de 6 a 8 vasos diarios para mantener tus dientes y cuerpo al 100%."
    },
    "2": {
      title: "Leche semidescremada y bebidas de soya",
      qty: "Máximo 2 vasos al día",
      color: "#9333ea",
      desc: "Aportan calcio, vitamina D y proteína de buena calidad. Se aconseja elegir opciones sin azúcar añadida.",
      castorMsg: "¡Para huesos fuertes! La leche semidescremada o soya nos da mucha energía, ¡pero máximo 2 vasos al día!"
    },
    "3": {
      title: "Café y té sin azúcar",
      qty: "Máximo 4 tazas al día",
      color: "#eab308",
      desc: "Aportan antioxidantes naturales. Se deben tomar sin azúcares ni endulzantes añadidos para conservar sus beneficios.",
      castorMsg: "¡Cuidado con el azúcar! El café o té sin endulzar son fantásticos, pero no te pases de 4 tazas diarias."
    },
    "4": {
      title: "Bebidas no calóricas con edulcorantes",
      qty: "Máximo 2 vasos al día",
      color: "#f97316",
      desc: "Refrescos de dieta o bebidas con sustitutos de azúcar. Aunque no aportan calorías, pueden malacostumbrar al paladar al sabor dulce.",
      castorMsg: "¡Atento con los edulcorantes! No tienen calorías, pero pueden engañar a tu cerebro. ¡Consúmelos con moderación!"
    },
    "5": {
      title: "Jugos de fruta, leche entera y alcohol",
      qty: "Máximo ½ vaso al día",
      color: "#ef4444",
      desc: "Contienen una concentración alta de grasas o azúcares naturales. Su consumo debe ser muy restringido.",
      castorMsg: "¡Ojo aquí! Un jugo natural tiene muchísima azúcar de la fruta junta. Con medio vaso al día es suficiente."
    },
    "6": {
      title: "Refrescos y aguas de sabor",
      qty: "0 vasos (evitar)",
      color: "#16a34a",
      desc: "No proporcionan nutrimentos y contienen elevadas cantidades de azúcar procesada. Su consumo se relaciona con la diabetes y la obesidad.",
      castorMsg: "¡Zona peligrosa! Los refrescos y embotellados no nos ayudan. Es mejor evitarlos para cuidar tu corazón y salud."
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
