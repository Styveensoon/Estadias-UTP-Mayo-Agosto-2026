document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('topic-content');

  // Si no encuentra el contenedor en el HTML actual, detiene el script
  if (!container) return;

  // Obtener el tema guardado al dar clic en el menú o usar el Tema 1 por defecto
  const selectedTopic = localStorage.getItem('selectedTopic') || '1';

  // Función para cargar el tema correspondiente dinámicamente
  function renderTopic(topicId) {
    if (topicId === '1') {
      container.innerHTML = getTema1HTML();
    } else if (topicId === '2') {
      container.innerHTML = getTema2HTML();
    } else if (topicId === '3') {
      container.innerHTML = getTema3HTML();
      if (typeof initJarraInteractivity === 'function') {
        initJarraInteractivity(); // Activa la animación y los clicks de la jarra
      }
    } else if (topicId === '4') {
      container.innerHTML = getTema4HTML();
      initTema4(); // Activa la interactividad del plato y el castor
    } else if (topicId === '5') {
      container.innerHTML = getTema5HTML(); // Carga Sostenibilidad Alimentaria
    } else if (topicId === '6') {
      container.innerHTML = typeof getTema6HTML === 'function' ? getTema6HTML() : getTema6FallbackHTML();
    } else if (topicId === '7') {
      container.innerHTML = getTema7HTML(); // Videoteca / Recetas saludables
    } else if (topicId === '8') {
      container.innerHTML = getTema8FallbackHTML(); // Marco normativo y hábitos
    } else if (topicId === '9') {
      container.innerHTML = getTema9HTML(); // Comparador dinámico de alimentos
      if (typeof initComparadorAlimentos === 'function') {
        initComparadorAlimentos();
      }
    } else {
      container.innerHTML = `
        <div style="text-align:center; padding: 60px 20px;">
          <h2>Tema en construcción 🏗️</h2>
          <p style="color: #666; margin-top: 10px;">Estamos trabajando para traerte esta información muy pronto.</p>
        </div>`;
    }
  }

  // Renderizar el tema guardado al cargar la página
  renderTopic(selectedTopic);

  // Escuchar eventos de clic en las opciones del menú desplegable
  const dropdownLinks = document.querySelectorAll('#topics-dropdown a');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Evita re-navegar o recargar la página actual
      
      const topicId = link.getAttribute('data-topic');
      if (topicId) {
        localStorage.setItem('selectedTopic', topicId);
        renderTopic(topicId);

        // Opcional: Oculta el menú responsivo si está abierto en móvil
        const navMenu = document.getElementById('nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
        }
      }
    });
  });
});

/* ==========================================
   INTERACTIVIDAD DEL TEMA 4 (EL PLATO Y EL CASTOR)
   ========================================== */
function initTema4() {
  const plateSlices = document.querySelectorAll('.plate-slice');
  const plateBtns = document.querySelectorAll('.plato-btn');
  const groupCards = document.querySelectorAll('.group-card');
  const infoCard = document.getElementById('plato-info-card');
  const tagEl = document.getElementById('plato-tag');
  const titleEl = document.getElementById('plato-group-title');
  const propEl = document.getElementById('plato-proportion');
  const descEl = document.getElementById('plato-info-desc');
  const castorBubble = document.getElementById('plato-castor-bubble');

  // Información detallada de los 5 grupos ajustada a proporciones reales
  const platoData = {
    "1": {
      title: "Verduras y Frutas",
      proportion: "Muchas (50% de tu plato)",
      color: "#16a34a",
      desc: "Aportan fibra, agua, vitaminas (A, C, complejo B) y minerales. Deben formar la mitad de tu plato en cada comida principal.",
      castorMsg: "🥦 ¡Llena la mitad de tu plato con verduras y frutas! Aportan la vitamina y energía natural que tu cuerpo necesita al día."
    },
    "2": {
      title: "Cereales Integrales y Tubérculos",
      proportion: "Suficientes (22% de tu plato)",
      color: "#d97706",
      desc: "Principal fuente de energía. Prefiere granos enteros como tortilla de maíz, avena, arroz integral o papa con cáscara.",
      castorMsg: "🌾 Elige cereales integrales para tener energía constante durante todo el día sin picos de azúcar."
    },
    "3": {
      title: "Leguminosas",
      proportion: "Combina (15% de tu plato)",
      color: "#ea580c",
      desc: "Aportan proteína vegetal y fibra de gran calidad. Ejemplos: frijoles, lentejas, garbanzos y habas.",
      castorMsg: "🫘 ¡Las leguminosas son oro puro! Combínalas con cereales para obtener una proteína completa de gran calidad."
    },
    "4": {
      title: "Alimentos de Origen Animal",
      proportion: "Pocos / Moderado (8% de tu plato)",
      color: "#dc2626",
      desc: "Aportan proteínas de alto valor biológico, hierro y vitamina B12. Opta por pollo, pescado, huevo y lácteos bajos en grasa.",
      castorMsg: "🍗 Consume carnes magras y pescado en porciones pequeñas. ¡Cuidan tus músculos sin saturar tu organismo!"
    },
    "5": {
      title: "Aceites y Grasas Saludables",
      proportion: "Porciones muy reducidas (5% de tu plato)",
      color: "#78350f",
      desc: "Proporcionan ácidos grasos esenciales. Prefiere aguacate, aceite de oliva, nueces, cacahuates y semillas.",
      castorMsg: "🥑 Las grasas buenas como el aguacate o las semillas son esenciales para el cerebro, ¡pero consúmelas con moderación!"
    }
  };

  function updatePlatoGroup(groupId) {
    const data = platoData[groupId];
    if (!data) return;

    // 1. Destacar sector del SVG
    plateSlices.forEach(slice => {
      const g = slice.getAttribute('data-group');
      if (g === groupId) {
        slice.classList.add('active');
      } else {
        slice.classList.remove('active');
      }
    });

    // 2. Destacar botones superiores
    plateBtns.forEach(btn => {
      if (btn.getAttribute('data-group') === groupId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 3. Destacar la tarjeta inferior seleccionada
    groupCards.forEach(card => {
      if (card.getAttribute('data-group') === groupId) {
        card.style.outline = `3px solid ${data.color}`;
        card.style.transform = "translateY(-6px)";
      } else {
        card.style.outline = "none";
        card.style.transform = "none";
      }
    });

    // 4. Actualizar recuadro informativo
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

    // 5. Actualizar el diálogo del Castor
    if (castorBubble) {
      castorBubble.textContent = data.castorMsg;
    }
  }

  // Escuchadores de eventos
  plateSlices.forEach(slice => {
    slice.addEventListener('click', () => updatePlatoGroup(slice.getAttribute('data-group')));
  });

  plateBtns.forEach(btn => {
    btn.addEventListener('click', () => updatePlatoGroup(btn.getAttribute('data-group')));
  });

  groupCards.forEach(card => {
    card.addEventListener('click', () => updatePlatoGroup(card.getAttribute('data-group')));
  });
}

/* ==========================================
   PLANTILLA TEMA 1: ALIMENTACIÓN SALUDABLE (INCMNSZ)
   ========================================== */
function getTema1HTML() {
  return `
    <div class="topic-layout">
      <div class="topic-left">
        <h1 class="topic-main-title">Alimentación saludable según el INCMNSZ</h1>
        <p class="topic-desc">Una dieta correcta debe cumplir con ciertas características esenciales para garantizar el correcto funcionamiento del organismo y la prevención de enfermedades crónicas.</p>
        <p class="topic-quote">"Que tu alimento sea tu medicina y tu medicina sea tu alimento."</p>
      </div>
      <div class="topic-right-grid">
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num blue-badge">1</div>
            <i class="fa-solid fa-apple-whole card-icon"></i>
          </div>
          <h3>Completa</h3>
          <p>Debe incluir todos los nutrientes recomendados combinando los diferentes grupos de alimentos.</p>
        </div>
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num purple-badge">2</div>
            <i class="fa-solid fa-scale-balanced card-icon"></i>
          </div>
          <h3>Equilibrada</h3>
          <p>Los nutrientes guardan las proporciones apropiadas entre sí para un metabolismo sano.</p>
        </div>
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num green-badge">3</div>
            <i class="fa-solid fa-bolt card-icon"></i>
          </div>
          <h3>Suficiente</h3>
          <p>Cubre las necesidades de energía sin excesos ni deficiencias nutricionales.</p>
        </div>
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num cyan-badge">4</div>
            <i class="fa-solid fa-wheat-awn card-icon"></i>
          </div>
          <h3>Variada</h3>
          <p>Incluye diferentes alimentos de cada grupo en las distintas comidas del día.</p>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================
   PLANTILLA TEMA 2: GUÍAS ALIMENTARIAS (10 RECOMENDACIONES)
   ========================================== */
function getTema2HTML() {
  return `
    <div class="topic-header-full">
      <h1 class="topic-main-title-center">Guías Alimentarias para la Población Mexicana</h1>
      <p class="topic-desc-center">10 recomendaciones clave para adoptar un estilo de vida más saludable y promover la sostenibilidad alimentaria en tu día a día.</p>
    </div>

    <div class="grid-5-col">
      <div class="feature-card">
        <div class="card-header-flex">
          <div class="card-num light-green-badge">1</div>
          <i class="fa-solid fa-baby card-icon"></i>
        </div>
        <h3>Lactancia materna</h3>
        <p>Promueve la lactancia materna exclusiva durante los primeros 6 meses de vida.</p>
      </div>

      <div class="feature-card">
        <div class="card-header-flex">
          <div class="card-num light-green-badge">2</div>
          <i class="fa-solid fa-carrot card-icon"></i>
        </div>
        <h3>Verduras y frutas</h3>
        <p>Consume verduras y frutas frescas de temporada en cada una de tus comidas.</p>
      </div>

      <div class="feature-card">
        <div class="card-header-flex">
          <div class="card-num light-green-badge">3</div>
          <i class="fa-solid fa-seedling card-icon"></i>
        </div>
        <h3>Leguminosas</h3>
        <p>Aumenta el consumo de frijoles, lentejas, garbanzos y habas en tu dieta diaria.</p>
      </div>

      <div class="feature-card">
        <div class="card-header-flex">
          <div class="card-num light-green-badge">4</div>
          <i class="fa-solid fa-bowl-rice card-icon"></i>
        </div>
        <h3>Cereales integrales</h3>
        <p>Elige cereales de grano entero o integrales como tortillas, avena y arroz integral.</p>
      </div>

      <div class="feature-card">
        <div class="card-header-flex">
          <div class="card-num light-green-badge">5</div>
          <i class="fa-solid fa-drumstick-bite card-icon"></i>
        </div>
        <h3>Carne roja y procesados</h3>
        <p>Reduce el consumo de carnes rojas y evita embutidos o productos ultraprocesados.</p>
      </div>

      <div class="feature-card">
        <div class="card-header-flex">
          <div class="card-num light-green-badge">6</div>
          <i class="fa-solid fa-bottle-water card-icon"></i>
        </div>
        <h3>Bebidas azucaradas</h3>
        <p>Evita refrescos, jugos embotellados y aguas de sabor con azúcar añadida.</p>
      </div>

      <div class="feature-card">
        <div class="card-header-flex">
          <div class="card-num light-green-badge">7</div>
          <i class="fa-solid fa-wine-glass-empty card-icon"></i>
        </div>
        <h3>Alcohol</h3>
        <p>Evita o limita el consumo de bebidas alcohólicas por el bienestar de tu salud.</p>
      </div>

      <div class="feature-card">
        <div class="card-header-flex">
          <div class="card-num light-green-badge">8</div>
          <i class="fa-solid fa-person-running card-icon"></i>
        </div>
        <h3>Actividad física</h3>
        <p>Mantente activo realizando al menos 30 minutos de ejercicio diario.</p>
      </div>

      <div class="feature-card">
        <div class="card-header-flex">
          <div class="card-num light-green-badge">9</div>
          <i class="fa-solid fa-glass-water card-icon"></i>
        </div>
        <h3>Agua simple</h3>
        <p>Toma suficiente agua natural a lo largo del día para mantenerte hidratado.</p>
      </div>

      <div class="feature-card">
        <div class="card-header-flex">
          <div class="card-num light-green-badge">10</div>
          <i class="fa-solid fa-people-roof card-icon"></i>
        </div>
        <h3>Comer en familia</h3>
        <p>Disfruta de tus alimentos en compañía y sin distracciones como pantallas.</p>
      </div>
    </div>

    <div class="topic-footer-action">
      <a href="https://www.gob.mx/salud" target="_blank" rel="noopener noreferrer" class="video-btn">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> Consultar documento completo oficial
      </a>
    </div>
  `;
}

/* ==========================================
   PLANTILLA TEMA 3: LA JARRA DEL BUEN BEBER
   ========================================== */
function getTema3HTML() {
  return `
    <div class="jarra-wrapper">
      <div class="jarra-header-text">
        <h1 class="jarra-title">La Jarra del Buen Beber y la Realidad Nacional</h1>
        <p class="jarra-subtitle">Interactúa con la jarra o selecciona un nivel para descubrir las recomendaciones de hidratación.</p>
      </div>

      <div class="jarra-main-card">
        
        <!-- COLUMNA 1: CASTOR Y GLOBO DE DIÁLOGO -->
        <div class="mascot-col">
          <div class="speech-bubble" id="castor-bubble">
            ¡Hola! 👋 Soy el Castor Nutritivo. Haz clic en los niveles de la jarra para enseñarte a hidratarte como un experto.
          </div>
          <div class="castor-img-wrapper">
            <img src="../Resources/home/castor.png" alt="El Castor Nutritivo" class="castor-jarra-img">
          </div>
        </div>

        <!-- COLUMNA 2: JARRA INTERACTIVA -->
        <div class="jarra-visual-col">
          <svg viewBox="0 0 200 260" class="jarra-svg" xmlns="http://www.w3.org/2000/svg">
            <!-- Asa -->
            <path d="M 155,70 C 188,70 188,190 150,195" fill="none" stroke="#2e7d32" stroke-width="8" stroke-linecap="round"/>
            <!-- Contorno Vidrio -->
            <path d="M 30,30 L 170,30 L 150,230 Q 150,240 130,240 L 70,240 Q 50,240 50,230 Z" fill="none" stroke="#2e7d32" stroke-width="6" stroke-linejoin="round"/>
            
            <!-- CAPAS RELLENABLES -->
            <path id="svg-level-1" class="jarra-layer active" d="M 52,185 L 148,185 L 150,230 Q 150,238 130,238 L 70,238 Q 50,238 50,230 Z" fill="#2563eb" data-level="1"/>
            <path id="svg-level-2" class="jarra-layer" d="M 50,155 L 150,155 L 148,185 L 52,185 Z" fill="#9333ea" data-level="2"/>
            <path id="svg-level-3" class="jarra-layer" d="M 47,125 L 153,125 L 150,155 L 50,155 Z" fill="#eab308" data-level="3"/>
            <path id="svg-level-4" class="jarra-layer" d="M 43,95 L 157,95 L 153,125 L 47,125 Z" fill="#f97316" data-level="4"/>
            <path id="svg-level-5" class="jarra-layer" d="M 40,65 L 160,65 L 157,95 L 43,95 Z" fill="#ef4444" data-level="5"/>
            <path id="svg-level-6" class="jarra-layer" d="M 35,38 L 165,38 L 160,65 L 40,65 Z" fill="#16a34a" data-level="6"/>

            <!-- TEXTOS DE NIVELES -->
            <text x="100" y="212" class="jarra-text-lbl">Nivel 1</text>
            <text x="100" y="173" class="jarra-text-lbl">Nivel 2</text>
            <text x="100" y="143" class="jarra-text-lbl">Nivel 3</text>
            <text x="100" y="113" class="jarra-text-lbl">Nivel 4</text>
            <text x="100" y="83" class="jarra-text-lbl">Nivel 5</text>
            <text x="100" y="53" class="jarra-text-lbl">Nivel 6</text>
          </svg>
        </div>

        <!-- COLUMNA 3: INFORMACIÓN Y SELECTORES -->
        <div class="jarra-info-panel">
          
          <div class="info-card-display fade-in-card" id="jarra-info-card">
            <span class="level-badge-tag" id="jarra-tag" style="background-color: #2563eb;">Nivel 1</span>
            <h3 id="jarra-level-title">Agua Potable Simple</h3>
            <div class="recommended-quantity" id="jarra-qty">6 a 8 Vasos al día</div>
            <p id="jarra-info-desc">
              Es la única bebida indispensable para nuestro cuerpo. Satisface las necesidades de hidratación diaria sin aportar calorías, azúcares ni químicos.
            </p>
          </div>

          <!-- BOTONES SELECTORES -->
          <div class="jarra-btn-grid">
            <button class="jarra-btn active" data-level="1" style="--btn-color: #2563eb;">Nivel 1: Agua Simple</button>
            <button class="jarra-btn" data-level="2" style="--btn-color: #9333ea;">Nivel 2: Leche / Soya</button>
            <button class="jarra-btn" data-level="3" style="--btn-color: #eab308;">Nivel 3: Café / Té</button>
            <button class="jarra-btn" data-level="4" style="--btn-color: #f97316;">Nivel 4: Edulcorantes</button>
            <button class="jarra-btn" data-level="5" style="--btn-color: #ef4444;">Nivel 5: Jugos / Alcohol</button>
            <button class="jarra-btn" data-level="6" style="--btn-color: #16a34a;">Nivel 6: Refrescos</button>
          </div>

          <!-- ALERTA NACIONAL Y ENLACE A PROFECO -->
          <div class="alert-box-stat">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div>
              <strong>Dato Crítico Nacional:</strong> Cerca del 70% de los adultos en México padece sobrepeso u obesidad por consumo de bebidas azucaradas.<br>
              <a href="https://www.gob.mx/profeco/documentos/la-jarra-del-buen-beber-la-importancia-de-mantenerte-bien-hidratado?state=published" target="_blank" class="profeco-link">
                Consultar artículo completo de PROFECO <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

/* ==========================================
   PLANTILLA TEMA 4: EL PLATO DEL BUEN COMER (PROPORCIONES REALES)
   ========================================== */
function getTema4HTML() {
  return `
    <style>
      .plato-wrapper {
        width: 100% !important;
        max-width: 1400px !important;
        margin: 0 auto !important;
        padding: 20px 30px 50px 30px !important;
        box-sizing: border-box !important;
      }

      .plato-header-text {
        text-align: left;
        margin-bottom: 25px;
      }

      .plato-title {
        font-size: 2.2rem;
        color: #1e293b;
        font-weight: 800;
        margin-bottom: 6px;
      }

      .plato-subtitle {
        color: #64748b;
        font-size: 1.05rem;
      }

      /* SECCIÓN PRINCIPAL: INTERACTIVA (3 COLUMNAS) */
      .plato-main-card {
        background: #ffffff;
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        border: 1px solid #e2e8f0;
        display: grid;
        grid-template-columns: 260px 380px 1fr;
        gap: 30px;
        align-items: center;
        margin-bottom: 40px;
        width: 100%;
        box-sizing: border-box;
      }

      /* Mascot Col */
      .plato-mascot-col {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .plato-speech-bubble {
        background: #f1f5f9;
        border-radius: 16px;
        padding: 14px;
        font-size: 0.88rem;
        color: #334155;
        line-height: 1.4;
        position: relative;
        margin-bottom: 15px;
        text-align: center;
        border: 1px solid #e2e8f0;
      }

      .plato-speech-bubble::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        border-width: 10px 10px 0;
        border-style: solid;
        border-color: #f1f5f9 transparent;
      }

      .plato-castor-img {
        width: 140px;
        height: auto;
      }

      /* SVG Interactivo */
      .plato-visual-col {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      }

      .plato-svg {
        width: 100%;
        max-width: 360px;
        height: auto;
        filter: drop-shadow(0 4px 10px rgba(0,0,0,0.08));
      }

      .plate-slice {
        cursor: pointer;
        stroke: #ffffff;
        stroke-width: 2px;
        transition: transform 0.25s ease, opacity 0.25s ease, stroke-width 0.25s ease;
        transform-origin: center;
        opacity: 0.88;
      }

      .plate-slice:hover, .plate-slice.active {
        opacity: 1;
        stroke: #ffffff;
        stroke-width: 4px;
        transform: scale(1.03);
      }

      .svg-label {
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 700;
        font-size: 11px;
        fill: #334155;
        text-anchor: middle;
        pointer-events: none;
      }

      .svg-pct {
        font-weight: 800;
        font-size: 13px;
      }

      /* Info Col */
      .plato-info-panel {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .plato-btn-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
      }

      .plato-btn {
        padding: 10px 4px;
        border-radius: 8px;
        border: 2px solid transparent;
        background: #f8fafc;
        font-weight: 700;
        font-size: 0.78rem;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #475569;
        text-align: center;
      }

      .plato-btn.active {
        background: #ffffff;
        border-color: var(--btn-color);
        color: var(--btn-color);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }

      .plato-info-display {
        background: #f8fafc;
        padding: 20px;
        border-radius: 12px;
        border-left: 5px solid #16a34a;
        transition: border-color 0.3s ease;
      }

      .plato-tag {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 20px;
        color: white;
        font-size: 0.75rem;
        font-weight: 700;
        margin-bottom: 8px;
      }

      /* SECCIÓN PLUS: 5 TARJETAS INFERIORES */
      .plato-plus-section {
        margin-top: 40px;
        border-top: 2px dashed #e2e8f0;
        padding-top: 30px;
        width: 100%;
      }

      .plus-title {
        font-size: 1.4rem;
        color: #334155;
        font-weight: 700;
        margin-bottom: 25px;
      }

      .groups-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 20px;
        width: 100%;
      }

      .group-card {
        background: #ffffff;
        border-radius: 18px;
        padding: 50px 16px 20px 16px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        border: 1px solid #f1f5f9;
        margin-top: 35px;
        cursor: pointer;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }

      .group-card:hover, .group-card.active {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.1);
      }

      .group-thumb-wrapper {
        position: absolute;
        top: -40px;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid #ffffff;
        box-shadow: 0 6px 14px rgba(0,0,0,0.15);
      }

      .group-thumb-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .group-number { font-size: 1rem; font-weight: 800; margin-bottom: 4px; }
      .portion-badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; }
      .group-name { font-size: 0.88rem; font-weight: 600; color: #334155; line-height: 1.3; margin: 0; }

      .card-g1 { background: #f0fdf4; } .card-g1 .group-number { color: #16a34a; } .card-g1 .portion-badge { background: #dcfce7; color: #16a34a; }
      .card-g2 { background: #fefce8; } .card-g2 .group-number { color: #eab308; } .card-g2 .portion-badge { background: #fef08a; color: #a16207; }
      .card-g3 { background: #fff7ed; } .card-g3 .group-number { color: #f97316; } .card-g3 .portion-badge { background: #ffedd5; color: #c2410c; }
      .card-g4 { background: #fef2f2; } .card-g4 .group-number { color: #ef4444; } .card-g4 .portion-badge { background: #fee2e2; color: #b91c1c; }
      .card-g5 { background: #fef3c7; } .card-g5 .group-number { color: #d97706; } .card-g5 .portion-badge { background: #fde68a; color: #92400e; }

      @media (max-width: 1100px) {
        .plato-main-card { grid-template-columns: 1fr; text-align: center; }
        .plato-btn-grid { grid-template-columns: repeat(3, 1fr); }
        .groups-grid { grid-template-columns: repeat(2, 1fr); }
      }
    </style>

    <div class="plato-wrapper">
      
      <!-- ENCABEZADO -->
      <div class="plato-header-text">
        <h1 class="plato-title">El Plato del Buen Comer</h1>
        <p class="plato-subtitle">Guía visual e interactiva de las proporciones óptimas para una alimentación balanceada.</p>
      </div>

      <!-- BLOQUE PRINCIPAL: INTERACTIVO Y CASTOR -->
      <div class="plato-main-card">
        
        <!-- Columna 1: Castor -->
        <div class="plato-mascot-col">
          <div class="plato-speech-bubble" id="plato-castor-bubble">
            🥦 ¡La mitad exacta de tu plato debe ser Verduras y Frutas (50%)! Son fundamentales para una buena salud.
          </div>
          <img src="../Resources/home/castor.png" alt="El Castor Nutritivo" class="plato-castor-img">
        </div>

        <!-- Columna 2: Plato SVG Interactivo con Proporciones Reales -->
        <div class="plato-visual-col">
          <svg viewBox="-150 -130 300 260" class="plato-svg">
            <!-- Sector 1: Verduras y frutas (50%) -->
            <path class="plate-slice active" data-group="1" fill="#16a34a" d="M 0 0 L 0 -100 A 100 100 0 1 1 0 100 Z" />
            
            <!-- Sector 2: Cereales y tubérculos (22%) -->
            <path class="plate-slice" data-group="2" fill="#facc15" d="M 0 0 L 0 100 A 100 100 0 0 1 -97.81 20.79 Z" />
            
            <!-- Sector 3: Leguminosas (15%) -->
            <path class="plate-slice" data-group="3" fill="#f59e0b" d="M 0 0 L -97.81 20.79 A 100 100 0 0 1 -72.90 -68.45 Z" />
            
            <!-- Sector 4: Origen Animal (8%) -->
            <path class="plate-slice" data-group="4" fill="#ef4444" d="M 0 0 L -72.90 -68.45 A 100 100 0 0 1 -30.90 -95.11 Z" />
            
            <!-- Sector 5: Grasas/Aceites (5%) -->
            <path class="plate-slice" data-group="5" fill="#d97706" d="M 0 0 L -30.90 -95.11 A 100 100 0 0 1 0 -100 Z" />
            
            <!-- Centro del Plato -->
            <circle cx="0" cy="0" r="22" fill="#ffffff" />

            <!-- Etiquetas de porcentajes y nombres -->
            <text x="65" y="0" class="svg-label"><tspan x="65" dy="-4">Verduras y frutas</tspan><tspan x="65" dy="16" class="svg-pct">50%</tspan></text>
            <text x="-60" y="85" class="svg-label"><tspan x="-60" dy="-4">Cereales y tubérculos</tspan><tspan x="-60" dy="16" class="svg-pct">22%</tspan></text>
            <text x="-105" y="-20" class="svg-label"><tspan x="-105" dy="-4">Leguminosas</tspan><tspan x="-105" dy="16" class="svg-pct">15%</tspan></text>
            <text x="-65" y="-88" class="svg-label"><tspan x="-65" dy="-4">Origen animal</tspan><tspan x="-65" dy="16" class="svg-pct">8%</tspan></text>
            <text x="-12" y="-108" class="svg-label"><tspan x="-12" class="svg-pct">5%</tspan></text>
          </svg>
        </div>

        <!-- Columna 3: Información + Botones -->
        <div class="plato-info-panel">
          <div class="plato-btn-grid">
            <button class="plato-btn active" data-group="1" style="--btn-color: #16a34a;">Verduras</button>
            <button class="plato-btn" data-group="2" style="--btn-color: #eab308;">Cereales</button>
            <button class="plato-btn" data-group="3" style="--btn-color: #f97316;">Legumbres</button>
            <button class="plato-btn" data-group="4" style="--btn-color: #ef4444;">Animal</button>
            <button class="plato-btn" data-group="5" style="--btn-color: #d97706;">Grasas</button>
          </div>

          <div class="plato-info-display" id="plato-info-card">
            <span class="plato-tag" id="plato-tag" style="background-color: #16a34a;">Grupo 1</span>
            <h3 id="plato-group-title" style="margin: 5px 0; font-size: 1.1rem; color: #1e293b;">Verduras y Frutas</h3>
            <div id="plato-proportion" style="font-weight: 700; color: #16a34a; font-size: 0.9rem; margin-bottom: 8px;">50% del plato</div>
            <p id="plato-info-desc" style="font-size: 0.85rem; color: #64748b; margin: 0;">Aportan fibra, agua, vitaminas (A, C, complejo B) y minerales. Deben formar la mitad de tu plato en cada comida principal.</p>
          </div>
        </div>

      </div>

      <!-- SECCIÓN PLUS: DESGLOSE DE LOS 5 GRUPOS -->
      <div class="plato-plus-section">
        <h2 class="plus-title">Desglose por Grupos de Alimentación</h2>
        
        <div class="groups-grid">
          <div class="group-card card-g1 active" data-group="1">
            <div class="group-thumb-wrapper">
              <img src="../Resources/home/verduras.jpg" alt="Verduras y Frutas">
            </div>
            <span class="group-number">Grupo 1</span>
            <span class="portion-badge">50% del plato</span>
            <p class="group-name">Verduras y frutas</p>
          </div>

          <div class="group-card card-g2" data-group="2">
            <div class="group-thumb-wrapper">
              <img src="../Resources/home/cereales.jpg" alt="Cereales">
            </div>
            <span class="group-number">Grupo 2</span>
            <span class="portion-badge">22% del plato</span>
            <p class="group-name">Cereales, granos y tubérculos</p>
          </div>

          <div class="group-card card-g3" data-group="3">
            <div class="group-thumb-wrapper">
              <img src="../Resources/home/leguminosas.jpg" alt="Leguminosas">
            </div>
            <span class="group-number">Grupo 3</span>
            <span class="portion-badge">15% del plato</span>
            <p class="group-name">Leguminosas (frijoles, lentejas)</p>
          </div>

          <div class="group-card card-g4" data-group="4">
            <div class="group-thumb-wrapper">
              <img src="../Resources/home/origen-animal.jpg" alt="Origen Animal">
            </div>
            <span class="group-number">Grupo 4</span>
            <span class="portion-badge">8% del plato</span>
            <p class="group-name">Alimentos de origen animal</p>
          </div>

          <div class="group-card card-g5" data-group="5">
            <div class="group-thumb-wrapper">
              <img src="../Resources/home/grasas.jpg" alt="Grasas Saludables">
            </div>
            <span class="group-number">Grupo 5</span>
            <span class="portion-badge">5% del plato</span>
            <p class="group-name">Aceites y grasas saludables</p>
          </div>
        </div>
      </div>

    </div>
  `;
}

/* ==========================================

   PLANTILLA TEMA 5: SOSTENIBILIDAD ALIMENTARIA

   ========================================== */

function getTema5HTML() {

  return `

    <style>

      .sostenibilidad-wrapper {

        width: 100% !important;

        max-width: 1400px !important;

        margin: 0 auto !important;

        padding: 20px 30px 50px 30px !important;

        box-sizing: border-box !important;

      }



      .sostenibilidad-header {

        text-align: left;

        margin-bottom: 30px;

      }



      .sostenibilidad-title {

        font-size: 2.2rem;

        color: #1e293b;

        font-weight: 800;

        margin-bottom: 6px;

      }



      .sostenibilidad-subtitle {

        color: #64748b;

        font-size: 1.05rem;

      }



      /* TARJETA PRINCIPAL GRID (2 COLUMNAS) */

      .sostenibilidad-main-card {

        background: #ffffff;

        border-radius: 20px;

        padding: 35px;

        box-shadow: 0 10px 30px rgba(0,0,0,0.06);

        border: 1px solid #e2e8f0;

        display: grid;

        grid-template-columns: 1fr 1fr;

        gap: 40px;

        align-items: center;

        margin-bottom: 40px;

      }



      /* COLUMNA IZQUIERDA: PUNTOS CLAVE */

      .impacto-section-title {

        font-size: 1.4rem;

        color: #0f766e;

        font-weight: 800;

        margin-bottom: 20px;

        display: flex;

        align-items: center;

        gap: 10px;

      }



      .impacto-list {

        display: flex;

        flex-direction: column;

        gap: 18px;

      }



      .impacto-item {

        background: #f0fdf4;

        border-left: 5px solid #16a34a;

        border-radius: 12px;

        padding: 16px;

        transition: transform 0.2s ease, box-shadow 0.2s ease;

      }



      .impacto-item:hover {

        transform: translateX(4px);

        box-shadow: 0 4px 12px rgba(0,0,0,0.05);

      }



      .impacto-item-header {

        display: flex;

        align-items: center;

        gap: 10px;

        font-weight: 700;

        color: #166534;

        font-size: 1.05rem;

        margin-bottom: 6px;

      }



      .impacto-item-desc {

        font-size: 0.9rem;

        color: #334155;

        line-height: 1.5;

        margin: 0;

      }



      /* COLUMNA DERECHA: DOCUMENTAL + CASTOR */

      .media-section {

        display: flex;

        flex-direction: column;

        align-items: center;

        text-align: center;

        background: #f8fafc;

        border-radius: 16px;

        padding: 25px;

        border: 1px solid #f1f5f9;

      }



      .doc-title {

        font-size: 1.5rem;

        font-weight: 800;

        color: #1e293b;

        margin-bottom: 12px;

        text-transform: uppercase;

        letter-spacing: 0.5px;

      }



      .doc-desc {

        font-size: 0.92rem;

        color: #475569;

        line-height: 1.5;

        margin-bottom: 20px;

      }



      .yt-button {

        display: inline-flex;

        align-items: center;

        gap: 10px;

        background: #0d9488;

        color: #ffffff;

        padding: 12px 24px;

        border-radius: 10px;

        font-weight: 700;

        font-size: 0.95rem;

        text-decoration: none;

        transition: background 0.2s ease, transform 0.2s ease;

        box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);

        margin-bottom: 20px;

      }



      .yt-button:hover {

        background: #0f766e;

        transform: translateY(-2px);

      }



      .castor-saber-img {

        width: 100%;

        max-width: 320px;

        height: auto;

      }



      /* TARJETAS ACCIONES INDIVIDUALES (3 COLUMNAS ABAJO) */

      .sost-actions-grid {

        display: grid;

        grid-template-columns: repeat(3, 1fr);

        gap: 20px;

      }



      .sost-card {

        background: #ffffff;

        border-radius: 16px;

        padding: 20px;

        box-shadow: 0 4px 15px rgba(0,0,0,0.04);

        border: 1px solid #e2e8f0;

        text-align: center;

      }



      .sost-card-icon {

        font-size: 2rem;

        margin-bottom: 10px;

      }



      .sost-card-title {

        font-weight: 700;

        color: #1e293b;

        font-size: 1rem;

        margin-bottom: 8px;

      }



      .sost-card-desc {

        font-size: 0.85rem;

        color: #64748b;

        line-height: 1.4;

        margin: 0;

      }



      @media (max-width: 900px) {

        .sostenibilidad-main-card { grid-template-columns: 1fr; }

        .sost-actions-grid { grid-template-columns: 1fr; }

      }

    </style>



    <div class="sostenibilidad-wrapper">

     

      <!-- ENCABEZADO -->

      <div class="sostenibilidad-header">

        <h1 class="sostenibilidad-title">Sostenibilidad Alimentaria</h1>

        <p class="sostenibilidad-subtitle">El impacto ambiental de nuestras elecciones diarias y la importancia de una transición hacia el consumo vegetal.</p>

      </div>



      <!-- BLOQUE PRINCIPAL -->

      <div class="sostenibilidad-main-card">

       

        <!-- Columna Izquierda: ¿Por qué importa? -->

        <div>

          <div class="impacto-section-title">

            <span>🌱</span> ¿Por qué importa nuestro impacto?

          </div>

         

          <div class="impacto-list">

            <div class="impacto-item">

              <div class="impacto-item-header">

                <span>💧</span> Ahorro de Agua

              </div>

              <p class="impacto-item-desc">

                Producir tan solo una hamburguesa de carne de res requiere más de <strong>2,500 litros de agua limpia</strong>, equivalente al agua consumida en duchas durante casi dos meses.

              </p>

            </div>



            <div class="impacto-item" style="background: #fefce8; border-color: #eab308;">

              <div class="impacto-item-header" style="color: #a16207;">

                <span>🌳</span> Deforestación

              </div>

              <p class="impacto-item-desc">

                La expansión de la industria ganadera y los cultivos para forraje son responsables de hasta el <strong>91% de la destrucción de la selva del Amazonas</strong>.

              </p>

            </div>



            <div class="impacto-item" style="background: #fef2f2; border-color: #ef4444;">

              <div class="impacto-item-header" style="color: #b91c1c;">

                <span>🏭</span> Gases de Efecto Invernadero

              </div>

              <p class="impacto-item-desc">

                La ganadería emite más gases de efecto invernadero (metano y óxido nitroso) que <strong>todo el sector de transporte combinado</strong> (autos, aviones, barcos y trenes).

              </p>

            </div>

          </div>

        </div>



        <!-- Columna Derecha: El Secreto de la Sostenibilidad & Cowspiracy -->

        <div class="media-section">

          <h2 class="doc-title">El Secreto de la Sostenibilidad: Cowspiracy</h2>

         

          <p class="doc-desc">

            ¿Sabías que la industria ganadera es uno de los mayores contribuyentes al cambio climático? Conocer el impacto ambiental de nuestra dieta nos invita a reflexionar sobre la transición hacia un consumo más sostenible y vegetal.

          </p>



          <a href="https://www.youtube.com/watch?v=nV04zyfLyN4" target="_blank" class="yt-button">

            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">

              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>

            </svg>

            Ver en YouTube

          </a>



          <!-- Imagen Ilustrativa del Castor Sabio -->

          <img src="../Resources/home/castor-sabio.png" alt="Castor Sabías Que" class="castor-saber-img">

        </div>



      </div>



      <!-- ACCIONES RECOMENDADAS -->

      <div class="sost-actions-grid">

        <div class="sost-card">

          <div class="sost-card-icon">🥗</div>

          <div class="sost-card-title">Lunes Sin Carne</div>

          <p class="sost-card-desc">Reducir el consumo de carne solo un día a la semana disminuye tu huella hídrica y de carbono de forma significativa.</p>

        </div>



        <div class="sost-card">

          <div class="sost-card-icon">🍎</div>

          <div class="sost-card-title">Consumo Local y de Temporada</div>

          <p class="sost-card-desc">Elegir alimentos producidos en tu región reduce las emisiones del transporte de larga distancia.</p>

        </div>



        <div class="sost-card">

          <div class="sost-card-icon">♻️</div>

          <div class="sost-card-title">Evita el Desperdicio</div>

          <p class="sost-card-desc">Planifica tus compras para aprovechar al máximo los alimentos y reducir los residuos orgánicos en casa.</p>

        </div>

      </div>



    </div>

  `;

 



} 


/* ==========================================
   PLANTILLA TEMA 6: RECOMENDACIONES DE EJERCICIO
   ========================================== */
function getTema6FallbackHTML() {
  return `
    <div class="ejercicio-wrapper">
      <div class="ejercicio-header">
        <h1 class="ejercicio-title">Recomendaciones de Ejercicio y Movimiento</h1>
        <p class="ejercicio-subtitle">"La actividad física debe ser constante, variada y divertida. Olvídate de los desafíos extremos; la constancia y el movimiento diario son la clave."</p>
      </div>

      <div class="ejercicio-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px;">
        <article class="feature-card">
          <div class="card-header-flex">
            <div class="card-num blue-badge"><i class="fa-solid fa-bolt"></i></div>
          </div>
          <h3>Cardio Diario</h3>
          <p>Caminar a paso rápido, trotar, correr o bailar. Fortalecen tu corazón, mejoran tu capacidad pulmonar y ayudan a la quema de calorías diarias.</p>
          <ul style="margin-top: 10px; padding-left: 20px; color: #64748b; font-size: 0.88rem;">
            <li>Al menos 30 minutos al día.</li>
            <li>Intensidad moderada.</li>
          </ul>
        </article>

        <article class="feature-card">
          <div class="card-header-flex">
            <div class="card-num purple-badge"><i class="fa-solid fa-dumbbell"></i></div>
          </div>
          <h3>Fuerza Muscular</h3>
          <p>Sentadillas, flexiones de pecho, desplantes o cargar pequeños pesos. Conservar la masa muscular previene la osteoporosis y activa tu metabolismo.</p>
          <ul style="margin-top: 10px; padding-left: 20px; color: #64748b; font-size: 0.88rem;">
            <li>2 a 3 veces por semana.</li>
            <li>Enfócate en la técnica correcta.</li>
          </ul>
        </article>

        <article class="feature-card">
          <div class="card-header-flex">
            <div class="card-num green-badge"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
          </div>
          <h3>Flexibilidad & Estiramientos</h3>
          <p>Estiramientos suaves de cuello, hombros, espalda y piernas. Especialmente recomendado tras pasar muchas horas sentado.</p>
          <ul style="margin-top: 10px; padding-left: 20px; color: #64748b; font-size: 0.88rem;">
            <li>Ideal antes y después de tu día.</li>
            <li>Reduce dolores musculares y estrés.</li>
          </ul>
        </article>
      </div>
    </div>
  `;
}
/* ==========================================
   PLANTILLA TEMA 8: PLANIFICACIÓN Y HÁBITOS
   ========================================== */
function getTema8FallbackHTML() {
  return `
    <div class="ejercicio-wrapper" id="tema8-container">
      <div class="ejercicio-header">
        <h1 class="ejercicio-title">Marco Normativo y Hábitos Saludables</h1>
        <p class="ejercicio-subtitle">"Los resultados sostenibles no provienen de cambios drásticos de un día para otro, sino de pequeños hábitos repetidos con constancia a lo largo del tiempo."</p>
      </div>

      <div class="ejercicio-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 30px;">
        <article class="feature-card">
          <div class="card-header-flex">
            <div class="card-num blue-badge"><i class="fa-solid fa-calendar-check"></i></div>
          </div>
          <h3>Planificación de Menús</h3>
          <p>Organizar tus comidas de la semana te ayuda a hacer mejores compras, reducir desperdicios y evitar tomar decisiones apresuradas.</p>
          <ul style="margin-top: 10px; padding-left: 20px; color: #64748b; font-size: 0.88rem;">
            <li>Prepara una lista de compras.</li>
            <li>Define un día para preparar bases (batch cooking).</li>
          </ul>
        </article>

        <article class="feature-card">
          <div class="card-header-flex">
            <div class="card-num purple-badge"><i class="fa-solid fa-bottle-water"></i></div>
          </div>
          <h3>Hidratación y Descanso</h3>
          <p>El agua y un sueño reparador son los pilares invisibles de la salud digestiva y la regulación de la energía diaria.</p>
          <ul style="margin-top: 10px; padding-left: 20px; color: #64748b; font-size: 0.88rem;">
            <li>Procura tomar 2 litros de agua diarios.</li>
            <li>Prioriza dormir de 7 a 8 horas seguidas.</li>
          </ul>
        </article>

        <article class="feature-card">
          <div class="card-header-flex">
            <div class="card-num green-badge"><i class="fa-solid fa-heart-pulse"></i></div>
          </div>
          <h3>Constancia y Mentalidad</h3>
          <p>Busca el progreso y no la perfección. Un tropiezo en una comida no arruina tu camino; retoma el hábito en la siguiente oportunidad.</p>
          <ul style="margin-top: 10px; padding-left: 20px; color: #64748b; font-size: 0.88rem;">
            <li>Establece metas realistas y medibles.</li>
            <li>Celebra los pequeños logros diarios.</li>
          </ul>
        </article>
      </div>
    </div>
  `;
}

/* ==========================================
   PLANTILLA TEMA 7: RECETAS SALUDABLES
   ========================================== */
function getTema7HTML() {
  return `
    <div class="topic-layout">
      <div class="topic-left">
        <h1 class="topic-main-title">Recetas Fáciles y Saludables</h1>
        <p class="topic-desc">Recetas rápidas, económicas y nutritivas para complementar tu plan de alimentación diario sin complicaciones en la cocina.</p>
        <p class="topic-quote">Cocinar en casa es el primer paso para controlar lo que comes.</p>
      </div>
      <div class="topic-right-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num green-badge"><i class="fa-solid fa-mug-hot"></i></div>
          </div>
          <h3>Avena con Fruta</h3>
          <p><strong>Tiempo:</strong> 5 min - <strong>Porciones:</strong> 1</p>
          <p><strong>Ingredientes:</strong> 1/2 taza de avena, 1 taza de leche descremada o bebida vegetal, 1/2 plátano, canela al gusto.</p>
          <p><strong>Preparación:</strong> Calienta la leche, agrega la avena y cuece 3-4 min moviendo. Sirve con el plátano en rodajas y canela.</p>
        </div>
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num blue-badge"><i class="fa-solid fa-bowl-food"></i></div>
          </div>
          <h3>Ensalada de Pollo</h3>
          <p><strong>Tiempo:</strong> 15 min - <strong>Porciones:</strong> 2</p>
          <p><strong>Ingredientes:</strong> 1 pechuga de pollo asada y desmenuzada, lechuga, jitomate, pepino, 1 cda de aceite de oliva, limón.</p>
          <p><strong>Preparación:</strong> Mezcla las verduras picadas con el pollo, aliña con aceite y limón al gusto.</p>
        </div>
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num cyan-badge"><i class="fa-solid fa-glass-water"></i></div>
          </div>
          <h3>Agua Fresca Natural</h3>
          <p><strong>Tiempo:</strong> 5 min - <strong>Porciones:</strong> 4</p>
          <p><strong>Ingredientes:</strong> 1 taza de fruta de temporada (pepino, jamaica, limón o piña), 1 litro de agua, edulcorante al gusto (opcional).</p>
          <p><strong>Preparación:</strong> Licua la fruta con el agua, cuela si es necesario y sirve fría, sin azúcares añadidos.</p>
        </div>
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num purple-badge"><i class="fa-solid fa-carrot"></i></div>
          </div>
          <h3>Salteado de Verduras y Huevo</h3>
          <p><strong>Tiempo:</strong> 12 min - <strong>Porciones:</strong> 2</p>
          <p><strong>Ingredientes:</strong> Calabaza, zanahoria y ejotes en cubos, 2 huevos, 1 cdita de aceite, sal y pimienta.</p>
          <p><strong>Preparación:</strong> Saltea las verduras 6-8 min, agrega los huevos batidos y cocina revolviendo hasta cuajar.</p>
        </div>
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num red-badge"><i class="fa-solid fa-lemon"></i></div>
          </div>
          <h3>Pescado al Limón</h3>
          <p><strong>Tiempo:</strong> 18 min - <strong>Porciones:</strong> 2</p>
          <p><strong>Ingredientes:</strong> 2 filetes de pescado blanco, jugo de 1 limón, ajo picado, sal, pimienta, 1 cdita de aceite de oliva.</p>
          <p><strong>Preparación:</strong> Marina el pescado con limón y ajo 10 min, cocina a la plancha 4-5 min por lado.</p>
        </div>
      </div>
      <p style="margin-top:20px; color:#64748b; font-size:0.85rem; text-align:center;">
        <i class="fa-solid fa-video"></i> La sección de videos de recetas está en preparación; por ahora encuentras aquí las instrucciones completas por escrito.
      </p>
    </div>
  `;
}

/* ==========================================
   TEMA 9: COMPARADOR DINÁMICO DE ALIMENTOS
   ========================================== */
const BASE_ALIMENTOS = [
  { id: "manzana",      nombre: "Manzana (1 pza, 150g)",          kcal: 78,  azucar: 15,  sodio: 2,   fibra: 3.6 },
  { id: "platano",      nombre: "Plátano (1 pza, 120g)",          kcal: 105, azucar: 14,  sodio: 1,   fibra: 3.1 },
  { id: "refresco",     nombre: "Refresco de cola (355ml)",       kcal: 140, azucar: 39,  sodio: 45,  fibra: 0 },
  { id: "jugo_ind",     nombre: "Jugo industrializado (250ml)",   kcal: 120, azucar: 26,  sodio: 30,  fibra: 0.5 },
  { id: "papas_fritas", nombre: "Papas fritas (bolsa 45g)",       kcal: 250, azucar: 0.3, sodio: 380, fibra: 2 },
  { id: "yogur_nat",    nombre: "Yogur natural sin azúcar (200g)",kcal: 120, azucar: 9,   sodio: 90,  fibra: 0 },
  { id: "galletas",     nombre: "Galletas dulces (5 pzas, 40g)",  kcal: 190, azucar: 16,  sodio: 140, fibra: 0.8 },
  { id: "nueces",       nombre: "Nueces mixtas (30g)",            kcal: 190, azucar: 1,   sodio: 1,   fibra: 2.5 },
  { id: "pan_blanco",   nombre: "Pan blanco (2 rebanadas, 60g)",  kcal: 150, azucar: 3,   sodio: 280, fibra: 1.5 },
  { id: "avena_hoj",    nombre: "Avena en hojuelas (40g crudo)",  kcal: 150, azucar: 0.5, sodio: 2,   fibra: 4 }
];

function calificarIndicador(valor, umbralNaranja, umbralRojo) {
  if (valor >= umbralRojo) return { texto: "Alto", clase: "food-badge-rojo" };
  if (valor >= umbralNaranja) return { texto: "Moderado", clase: "food-badge-naranja" };
  return { texto: "Bajo", clase: "food-badge-verde" };
}

function renderTarjetaAlimento(alimento) {
  if (!alimento) {
    return '<p style="color:#94a3b8; text-align:center; padding: 20px;">Selecciona un alimento para comparar.</p>';
  }
  const azucarInfo = calificarIndicador(alimento.azucar, 5, 15);
  const sodioInfo = calificarIndicador(alimento.sodio, 120, 300);
  return `
    <div class="alert-box-stat" style="background:#f8fafc; border-color:#e2e8f0; color:#334155;">
      <h3 style="margin-bottom:8px;">${alimento.nombre}</h3>
      <p><strong>Energía:</strong> ${alimento.kcal} kcal</p>
      <p><strong>Azúcares:</strong> ${alimento.azucar} g <span class="${azucarInfo.clase}">${azucarInfo.texto}</span></p>
      <p><strong>Sodio:</strong> ${alimento.sodio} mg <span class="${sodioInfo.clase}">${sodioInfo.texto}</span></p>
      <p><strong>Fibra:</strong> ${alimento.fibra} g</p>
    </div>
  `;
}

function getTema9HTML() {
  const opciones = BASE_ALIMENTOS
    .map(a => `<option value="${a.id}">${a.nombre}</option>`)
    .join("");
  return `
    <div class="topic-layout">
      <div class="topic-left">
        <h1 class="topic-main-title">Comparador de Alimentos</h1>
        <p class="topic-desc">Elige dos alimentos y compara su aporte de energía, azúcares, sodio y fibra para tomar mejores decisiones nutricionales.</p>
        <p class="topic-quote">Comparar antes de elegir es el primer paso hacia una alimentación consciente.</p>
      </div>
      <div class="topic-right-grid" style="grid-template-columns: 1fr 1fr; align-items:start;">
        <div>
          <label for="comparador-a" style="font-weight:600; display:block; margin-bottom:6px;">Alimento A</label>
          <select id="comparador-a" style="width:100%; padding:10px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:16px;">
            <option value="">-- Selecciona --</option>
            ${opciones}
          </select>
          <div id="comparador-resultado-a"></div>
        </div>
        <div>
          <label for="comparador-b" style="font-weight:600; display:block; margin-bottom:6px;">Alimento B</label>
          <select id="comparador-b" style="width:100%; padding:10px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:16px;">
            <option value="">-- Selecciona --</option>
            ${opciones}
          </select>
          <div id="comparador-resultado-b"></div>
        </div>
      </div>
      <div id="comparador-veredicto" style="margin-top:20px; text-align:center; font-weight:600;"></div>
    </div>
  `;
}

function initComparadorAlimentos() {
  const selectA = document.getElementById("comparador-a");
  const selectB = document.getElementById("comparador-b");
  const resA = document.getElementById("comparador-resultado-a");
  const resB = document.getElementById("comparador-resultado-b");
  const veredicto = document.getElementById("comparador-veredicto");

  if (!selectA || !selectB) return;

  function actualizar() {
    const alimentoA = BASE_ALIMENTOS.find(a => a.id === selectA.value);
    const alimentoB = BASE_ALIMENTOS.find(a => a.id === selectB.value);

    if (resA) resA.innerHTML = renderTarjetaAlimento(alimentoA);
    if (resB) resB.innerHTML = renderTarjetaAlimento(alimentoB);

    if (veredicto) {
      if (alimentoA && alimentoB) {
        const puntajeA = alimentoA.azucar + alimentoA.sodio / 10 - alimentoA.fibra * 2;
        const puntajeB = alimentoB.azucar + alimentoB.sodio / 10 - alimentoB.fibra * 2;
        const masSano = puntajeA <= puntajeB ? alimentoA.nombre : alimentoB.nombre;
        veredicto.textContent = `La opción más saludable entre ambas es: ${masSano}`;
      } else {
        veredicto.textContent = "";
      }
    }
  }

  selectA.addEventListener("change", actualizar);
  selectB.addEventListener("change", actualizar);
  actualizar();
}

