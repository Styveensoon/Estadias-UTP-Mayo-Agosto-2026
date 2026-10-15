/* ==========================================
   PÁGINA DE TEMAS: enrutador
   Cada tema tiene su dirección (temas.html#tema-4), se recuerda el último visto
   y el índice lateral marca el tema actual.
   ========================================== */
const TITULOS_TEMAS = {
  "1": "Alimentación saludable",
  "2": "Guías alimentarias",
  "3": "La Jarra del Buen Beber",
  "4": "El Plato del Bien Comer",
  "5": "Sostenibilidad alimentaria",
  "6": "Recomendaciones de ejercicio",
  "7": "Recetas fáciles y saludables",
  "8": "Marco normativo y hábitos",
  "9": "Comparador de alimentos"
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('topic-content');
  if (!container) return;

  const indice = document.getElementById('temas-indice');
  const area = document.getElementById('tema-area');

  function temaDeLaDireccion() {
    const coincidencia = window.location.hash.match(/^#tema-(\d)$/);
    return coincidencia && TITULOS_TEMAS[coincidencia[1]] ? coincidencia[1] : null;
  }

  function temaGuardado() {
    try {
      const guardado = localStorage.getItem('selectedTopic');
      return TITULOS_TEMAS[guardado] ? guardado : null;
    } catch (err) {
      return null;
    }
  }

  function dibujar(topicId) {
    switch (topicId) {
      case '1': container.innerHTML = getTema1HTML(); break;
      case '2': container.innerHTML = getTema2HTML(); break;
      case '3': container.innerHTML = getTema3HTML(); break;
      case '4': container.innerHTML = getTema4HTML(); break;
      case '5': container.innerHTML = getTema5HTML(); break;
      case '6': container.innerHTML = getTema6FallbackHTML(); break;
      case '7': container.innerHTML = getTema7HTML(); break;
      case '8': container.innerHTML = getTema8FallbackHTML(); break;
      case '9': container.innerHTML = getTema9HTML(); break;
    }

    // Interactividad del tema recién dibujado (una sola vez por tema)
    if (typeof initDynamicComponents === 'function') initDynamicComponents();
    if (topicId === '4' && typeof initPlato === 'function') initPlato({ porScroll: false });
    if (topicId === '9' && typeof initComparadorAlimentos === 'function') initComparadorAlimentos();
  }

  function mostrar(topicId, { historial = false, enfocar = false } = {}) {
    if (!TITULOS_TEMAS[topicId]) topicId = '1';

    // Cambio de tema animado (View Transitions); la primera carga entra sin transición
    const animar = historial && !(typeof sinMovimiento !== 'undefined' && sinMovimiento.matches);
    if (animar && document.startViewTransition) {
      document.startViewTransition(() => dibujar(topicId));
    } else {
      dibujar(topicId);
      if (animar) {
        container.classList.remove('tema-entra');
        void container.offsetWidth;
        container.classList.add('tema-entra');
      }
    }

    try { localStorage.setItem('selectedTopic', topicId); } catch (err) { /* sin almacenamiento */ }
    document.title = `${TITULOS_TEMAS[topicId]} - Temas - WellDataLab`;

    const direccion = `#tema-${topicId}`;
    if (historial && window.location.hash !== direccion) {
      history.pushState({ tema: topicId }, '', direccion);
    } else if (!historial) {
      history.replaceState({ tema: topicId }, '', direccion);
    }

    if (indice) {
      indice.querySelectorAll('a[data-topic]').forEach((a) => {
        if (a.dataset.topic === topicId) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    }

    if (enfocar && area) {
      area.scrollIntoView({ behavior: 'smooth', block: 'start' });
      area.focus({ preventScroll: true });
    }
  }

  // main.js llama a esta función al hacer clic en cualquier enlace con data-topic
  window.renderTopic = (topicId) => mostrar(topicId, { historial: true, enfocar: true });

  // Atrás / adelante del navegador
  window.addEventListener('popstate', () => {
    const tema = temaDeLaDireccion();
    if (tema) mostrar(tema);
  });

  mostrar(temaDeLaDireccion() || temaGuardado() || '1');
});

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
      <h1 class="topic-main-title-center">Guías alimentarias para la población mexicana</h1>
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
        <h1 class="jarra-title">La Jarra del Buen Beber y la realidad nacional</h1>
        <p class="jarra-subtitle">Interactúa con la jarra o selecciona un nivel para descubrir las recomendaciones de hidratación.</p>
      </div>

      <div class="jarra-main-card">
        
        <!-- COLUMNA 1: CASTOR Y GLOBO DE DIÁLOGO -->
        <div class="mascot-col">
          <div class="speech-bubble" id="castor-bubble">
            ¡Hola! Soy el Castor Nutritivo. Haz clic en los niveles de la jarra para enseñarte a hidratarte como un experto.
          </div>
          <div class="castor-img-wrapper">
            <img src="../Resources/marca/castor.svg" alt="El Castor Nutritivo" class="castor-jarra-img">
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
            <h3 id="jarra-level-title">Agua potable simple</h3>
            <div class="recommended-quantity" id="jarra-qty">6 a 8 vasos al día</div>
            <p id="jarra-info-desc">
              Es la única bebida indispensable para nuestro cuerpo. Satisface las necesidades de hidratación diaria sin aportar calorías, azúcares ni químicos.
            </p>
          </div>

          <!-- BOTONES SELECTORES -->
          <div class="jarra-btn-grid">
            <button class="jarra-btn active" data-level="1" style="--btn-color: #2563eb;">Nivel 1: Agua simple</button>
            <button class="jarra-btn" data-level="2" style="--btn-color: #9333ea;">Nivel 2: Leche o soya</button>
            <button class="jarra-btn" data-level="3" style="--btn-color: #eab308;">Nivel 3: Café o té</button>
            <button class="jarra-btn" data-level="4" style="--btn-color: #f97316;">Nivel 4: Edulcorantes</button>
            <button class="jarra-btn" data-level="5" style="--btn-color: #ef4444;">Nivel 5: Jugos o alcohol</button>
            <button class="jarra-btn" data-level="6" style="--btn-color: #16a34a;">Nivel 6: Refrescos</button>
          </div>

          <!-- ALERTA NACIONAL Y ENLACE A PROFECO -->
          <div class="alert-box-stat">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div>
              <strong>Dato nacional:</strong> Más de 7 de cada 10 adultos en México viven con sobrepeso u obesidad, y las bebidas azucaradas son uno de los factores que más contribuyen.
              <a href="https://www.gob.mx/profeco/documentos/la-jarra-del-buen-beber-la-importancia-de-mantenerte-bien-hidratado?state=published" target="_blank" class="profeco-link">
                Consulta el artículo completo de Profeco <i class="fa-solid fa-arrow-up-right-from-square"></i>
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
  // El mismo plato del Inicio: Js/inicio.js lo dibuja a partir de esta lista
  const foto = (n) => `../Resources/home/plato/${n}.jpg`;
  return `
    <div class="plato-tema">
      <header class="tema-cabeza">
        <h1 class="topic-main-title">El Plato del Bien Comer</h1>
        <p class="topic-desc">La guía oficial de la NOM-043 para armar cada comida: cinco grupos de alimentos en la proporción que tu cuerpo necesita. Elige un grupo en el plato o en la lista.</p>
      </header>

      <div class="plato-tema-cuerpo">
        <div class="plato-tema-visual">
          <figure class="plato" aria-hidden="true">
            <svg class="plato-svg" id="plato-svg" viewBox="-24 -24 648 648" role="presentation"></svg>
          </figure>
          <div class="castor-dice">
            <img src="../Resources/marca/castor.svg" alt="" width="260" height="300">
            <p id="castor-globo" aria-live="polite">Elige un grupo del plato y te digo cuánto espacio debe ocupar.</p>
          </div>
        </div>

        <ol class="grupos" id="grupos">
          <li class="grupo" data-grupo="1" data-pct="50" data-color="#16a34a" data-foto="${foto("verduras")}"
              data-castor="Llena la mitad de tu plato con verduras y frutas: te dan las vitaminas y el agua que tu cuerpo necesita cada día.">
            <button type="button" class="grupo-boton" aria-pressed="false">
              <span class="grupo-num">1</span>
              <span class="grupo-nombre">Verduras y frutas</span>
              <span class="grupo-pct">50 %</span>
            </button>
            <p>Aportan fibra, agua, vitaminas (A, C y complejo B) y minerales. Deben formar la mitad de cada comida principal.</p>
          </li>
          <li class="grupo" data-grupo="2" data-pct="22" data-color="#f2b705" data-tinta="#0f2a1c" data-foto="${foto("cereales")}"
              data-castor="Elige cereales integrales para tener energía constante durante todo el día, sin picos de azúcar.">
            <button type="button" class="grupo-boton" aria-pressed="false">
              <span class="grupo-num">2</span>
              <span class="grupo-nombre">Cereales y tubérculos</span>
              <span class="grupo-pct">22 %</span>
            </button>
            <p>Son la principal fuente de energía. Elige opciones integrales como tortilla de maíz, avena, arroz integral o papa con cáscara.</p>
          </li>
          <li class="grupo" data-grupo="3" data-pct="15" data-color="#e8590c" data-foto="${foto("leguminosas")}"
              data-castor="Combina leguminosas con cereales y obtienes una proteína completa de gran calidad.">
            <button type="button" class="grupo-boton" aria-pressed="false">
              <span class="grupo-num">3</span>
              <span class="grupo-nombre">Leguminosas</span>
              <span class="grupo-pct">15 %</span>
            </button>
            <p>Aportan proteína vegetal y fibra de excelente calidad: frijoles, lentejas, garbanzos y habas.</p>
          </li>
          <li class="grupo" data-grupo="4" data-pct="8" data-color="#d62839" data-foto="${foto("origen-animal")}"
              data-castor="Consume carnes magras y pescado en porciones pequeñas: cuidan tus músculos sin saturar tu organismo.">
            <button type="button" class="grupo-boton" aria-pressed="false">
              <span class="grupo-num">4</span>
              <span class="grupo-nombre">Alimentos de origen animal</span>
              <span class="grupo-pct">8 %</span>
            </button>
            <p>Aportan proteínas de alto valor biológico, hierro y vitamina B12. Prefiere carnes magras, pescado, huevo o lácteos descremados.</p>
          </li>
          <li class="grupo" data-grupo="5" data-pct="5" data-color="#9a6a00" data-foto="${foto("grasas")}"
              data-castor="Las grasas buenas, como el aguacate o las semillas, son esenciales para tu cerebro; consúmelas con moderación.">
            <button type="button" class="grupo-boton" aria-pressed="false">
              <span class="grupo-num">5</span>
              <span class="grupo-nombre">Aceites y grasas saludables</span>
              <span class="grupo-pct">5 %</span>
            </button>
            <p>Proporcionan ácidos grasos esenciales. Prefiere aguacate, aceite de oliva, nueces, almendras y semillas en pequeñas cantidades.</p>
          </li>
        </ol>
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

        border: 1px solid #bfe3cb;

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

        <h1 class="sostenibilidad-title">Sostenibilidad alimentaria</h1>

        <p class="sostenibilidad-subtitle">El impacto ambiental de nuestras elecciones diarias y la importancia de una transición hacia el consumo vegetal.</p>

      </div>



      <!-- BLOQUE PRINCIPAL -->

      <div class="sostenibilidad-main-card">

       

        <!-- Columna Izquierda: ¿Por qué importa? -->

        <div>

          <div class="impacto-section-title">

            <span><i class="fa-solid fa-seedling" aria-hidden="true"></i></span> ¿Por qué importa nuestro impacto?

          </div>

         

          <div class="impacto-list">

            <div class="impacto-item">

              <div class="impacto-item-header">

                <span><i class="fa-solid fa-droplet" aria-hidden="true"></i></span> Ahorro de agua

              </div>

              <p class="impacto-item-desc">

                Producir tan solo una hamburguesa de carne de res requiere más de <strong>2,500 litros de agua limpia</strong>, equivalente al agua consumida en duchas durante casi dos meses.

              </p>

            </div>



            <div class="impacto-item" style="background: #fefce8; border-color: #eab308;">

              <div class="impacto-item-header" style="color: #a16207;">

                <span><i class="fa-solid fa-tree" aria-hidden="true"></i></span> Deforestación

              </div>

              <p class="impacto-item-desc">

                La ganadería es el <strong>principal motor de la deforestación en la Amazonía</strong>: la mayor parte de la selva talada termina convertida en pastizales para ganado.

              </p>

            </div>



            <div class="impacto-item" style="background: #fef2f2; border-color: #ef4444;">

              <div class="impacto-item-header" style="color: #b91c1c;">

                <span><i class="fa-solid fa-industry" aria-hidden="true"></i></span> Gases de efecto invernadero

              </div>

              <p class="impacto-item-desc">

                La ganadería genera cerca del <strong>14.5% de las emisiones de gases de efecto invernadero</strong> causadas por los seres humanos, sobre todo metano y óxido nitroso (FAO).

              </p>

            </div>

          </div>

        </div>



        <!-- Columna Derecha: El Secreto de la Sostenibilidad & Cowspiracy -->

        <div class="media-section">

          <h2 class="doc-title">El secreto de la sostenibilidad: Cowspiracy</h2>

         

          <p class="doc-desc">

            ¿Sabías que la industria ganadera es uno de los mayores contribuyentes al cambio climático? Conocer el impacto ambiental de nuestra dieta nos invita a reflexionar sobre la transición hacia un consumo más sostenible y vegetal.

          </p>



          <a href="https://www.youtube.com/watch?v=nV04zyfLyN4" target="_blank" rel="noopener noreferrer" class="yt-button">

            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">

              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>

            </svg>

            Ver en YouTube

          </a>



          <!-- Imagen Ilustrativa del Castor Sabio -->

          <img src="../Resources/marca/castor-sabio.svg" alt="Castor Sabías Que" class="castor-saber-img">

        </div>



      </div>



      <!-- ACCIONES RECOMENDADAS -->

      <div class="sost-actions-grid">

        <div class="sost-card">

          <div class="sost-card-icon"><i class="fa-solid fa-bowl-food" aria-hidden="true"></i></div>

          <div class="sost-card-title">Lunes sin carne</div>

          <p class="sost-card-desc">Reducir el consumo de carne solo un día a la semana disminuye tu huella hídrica y de carbono de forma significativa.</p>

        </div>



        <div class="sost-card">

          <div class="sost-card-icon"><i class="fa-solid fa-apple-whole" aria-hidden="true"></i></div>

          <div class="sost-card-title">Consumo local y de temporada</div>

          <p class="sost-card-desc">Elegir alimentos producidos en tu región reduce las emisiones del transporte de larga distancia.</p>

        </div>



        <div class="sost-card">

          <div class="sost-card-icon"><i class="fa-solid fa-recycle" aria-hidden="true"></i></div>

          <div class="sost-card-title">Evita el desperdicio</div>

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
        <h1 class="ejercicio-title">Recomendaciones de ejercicio y movimiento</h1>
        <p class="ejercicio-subtitle">"La actividad física debe ser constante, variada y divertida. Olvídate de los desafíos extremos; la constancia y el movimiento diario son la clave."</p>
      </div>

      <div class="ejercicio-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px;">
        <article class="feature-card">
          <div class="card-header-flex">
            <div class="card-num blue-badge"><i class="fa-solid fa-bolt"></i></div>
          </div>
          <h3>Cardio diario</h3>
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
          <h3>Fuerza muscular</h3>
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
          <h3>Flexibilidad y estiramientos</h3>
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
        <h1 class="ejercicio-title">Marco normativo y hábitos saludables</h1>
        <p class="ejercicio-subtitle">"Los resultados sostenibles no provienen de cambios drásticos de un día para otro, sino de pequeños hábitos repetidos con constancia a lo largo del tiempo."</p>
      </div>

      <div class="ejercicio-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 30px;">
        <article class="feature-card">
          <div class="card-header-flex">
            <div class="card-num blue-badge"><i class="fa-solid fa-calendar-check"></i></div>
          </div>
          <h3>Planificación de menús</h3>
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
          <h3>Hidratación y descanso</h3>
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
          <h3>Constancia y mentalidad</h3>
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
        <h1 class="topic-main-title">Recetas fáciles y saludables</h1>
        <p class="topic-desc">Recetas rápidas, económicas y nutritivas para complementar tu plan de alimentación diario sin complicaciones en la cocina.</p>
        <p class="topic-quote">Cocinar en casa es el primer paso para controlar lo que comes.</p>
      </div>
      <div class="topic-right-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num green-badge"><i class="fa-solid fa-mug-hot"></i></div>
          </div>
          <h3>Avena con fruta</h3>
          <p><strong>Tiempo:</strong> 5 min - <strong>Porciones:</strong> 1</p>
          <p><strong>Ingredientes:</strong> 1/2 taza de avena, 1 taza de leche descremada o bebida vegetal, 1/2 plátano, canela al gusto.</p>
          <p><strong>Preparación:</strong> Calienta la leche, agrega la avena y cuece 3-4 min moviendo. Sirve con el plátano en rodajas y canela.</p>
        </div>
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num blue-badge"><i class="fa-solid fa-bowl-food"></i></div>
          </div>
          <h3>Ensalada de pollo</h3>
          <p><strong>Tiempo:</strong> 15 min - <strong>Porciones:</strong> 2</p>
          <p><strong>Ingredientes:</strong> 1 pechuga de pollo asada y desmenuzada, lechuga, jitomate, pepino, 1 cda de aceite de oliva, limón.</p>
          <p><strong>Preparación:</strong> Mezcla las verduras picadas con el pollo, aliña con aceite y limón al gusto.</p>
        </div>
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num cyan-badge"><i class="fa-solid fa-glass-water"></i></div>
          </div>
          <h3>Agua fresca natural</h3>
          <p><strong>Tiempo:</strong> 5 min - <strong>Porciones:</strong> 4</p>
          <p><strong>Ingredientes:</strong> 1 taza de fruta de temporada (pepino, jamaica, limón o piña), 1 litro de agua, edulcorante al gusto (opcional).</p>
          <p><strong>Preparación:</strong> Licua la fruta con el agua, cuela si es necesario y sirve fría, sin azúcares añadidos.</p>
        </div>
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num purple-badge"><i class="fa-solid fa-carrot"></i></div>
          </div>
          <h3>Salteado de verduras y huevo</h3>
          <p><strong>Tiempo:</strong> 12 min - <strong>Porciones:</strong> 2</p>
          <p><strong>Ingredientes:</strong> Calabaza, zanahoria y ejotes en cubos, 2 huevos, 1 cdita de aceite, sal y pimienta.</p>
          <p><strong>Preparación:</strong> Saltea las verduras 6-8 min, agrega los huevos batidos y cocina revolviendo hasta cuajar.</p>
        </div>
        <div class="feature-card">
          <div class="card-header-flex">
            <div class="card-num red-badge"><i class="fa-solid fa-lemon"></i></div>
          </div>
          <h3>Pescado al limón</h3>
          <p><strong>Tiempo:</strong> 18 min - <strong>Porciones:</strong> 2</p>
          <p><strong>Ingredientes:</strong> 2 filetes de pescado blanco, jugo de 1 limón, ajo picado, sal, pimienta, 1 cdita de aceite de oliva.</p>
          <p><strong>Preparación:</strong> Marina el pescado con limón y ajo 10 min, cocina a la plancha 4-5 min por lado.</p>
        </div>
      </div>
      <p class="tema-mas">
        <a href="videos.html?tema=recetas" class="boton-mantel"><i class="fa-solid fa-circle-play" aria-hidden="true"></i> Ver recetas en video</a>
        <span>Recetas de Platillo Sabio de Profeco y consejos del IMSS en la videoteca.</span>
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

// Semáforo para azúcares (g) y sodio (mg) por porción
function calificarIndicador(valor, umbralNaranja, umbralRojo) {
  if (valor >= umbralRojo) return { texto: "Alto", nivel: "alto" };
  if (valor >= umbralNaranja) return { texto: "Moderado", nivel: "moderado" };
  return { texto: "Bajo", nivel: "bajo" };
}

const INDICADORES_COMPARADOR = [
  { clave: "kcal", nombre: "Energía", unidad: "kcal" },
  { clave: "azucar", nombre: "Azúcares", unidad: "g", semaforo: [5, 15] },
  { clave: "sodio", nombre: "Sodio", unidad: "mg", semaforo: [120, 300] },
  { clave: "fibra", nombre: "Fibra", unidad: "g", masEsMejor: true }
];

function getTema9HTML() {
  const opciones = (seleccionado) => BASE_ALIMENTOS
    .map(a => `<option value="${a.id}"${a.id === seleccionado ? " selected" : ""}>${a.nombre}</option>`)
    .join("");
  return `
    <div class="comparador">
      <header class="tema-cabeza">
        <h1 class="topic-main-title">Comparador de alimentos</h1>
        <p class="topic-desc">Elige dos alimentos y compara su energía, azúcares, sodio y fibra por porción. Comparar antes de elegir es el primer paso hacia una alimentación consciente.</p>
      </header>

      <div class="comparador-selects">
        <div class="campo">
          <label for="comparador-a"><span class="comp-punto comp-a"></span> Alimento A</label>
          <select id="comparador-a" class="campo-select">${opciones("manzana")}</select>
        </div>
        <span class="comparador-vs" aria-hidden="true">vs</span>
        <div class="campo">
          <label for="comparador-b"><span class="comp-punto comp-b"></span> Alimento B</label>
          <select id="comparador-b" class="campo-select">${opciones("refresco")}</select>
        </div>
      </div>

      <div class="comparador-tabla" id="comparador-tabla" aria-live="polite"></div>
      <p class="comparador-veredicto" id="comparador-veredicto" aria-live="polite"></p>
      <p class="comparador-nota">Valores aproximados por la porción indicada. El semáforo de azúcares y sodio sigue el mismo criterio que el resto del sitio: verde bajo, naranja moderado, rojo alto.</p>
    </div>
  `;
}

function initComparadorAlimentos() {
  const selectA = document.getElementById("comparador-a");
  const selectB = document.getElementById("comparador-b");
  const tabla = document.getElementById("comparador-tabla");
  const veredicto = document.getElementById("comparador-veredicto");
  if (!selectA || !selectB || !tabla) return;

  function fila(indicador, a, b) {
    const va = a[indicador.clave];
    const vb = b[indicador.clave];
    const maximo = Math.max(va, vb) || 1;
    const barra = (lado, valor) => {
      const sem = indicador.semaforo ? calificarIndicador(valor, ...indicador.semaforo) : null;
      return `
        <div class="comp-barra comp-${lado}">
          <span class="comp-relleno" style="width:${Math.max(2, (valor / maximo) * 100)}%"></span>
          <span class="comp-valor">${valor.toLocaleString("es-MX")} ${indicador.unidad}${sem ? ` <span class="semaforo semaforo-${sem.nivel}">${sem.texto}</span>` : ""}</span>
        </div>`;
    };
    return `
      <div class="comp-fila">
        <p class="comp-nombre">${indicador.nombre}${indicador.masEsMejor ? ' <span class="comp-ayuda">más es mejor</span>' : ""}</p>
        ${barra("a", va)}
        ${barra("b", vb)}
      </div>`;
  }

  function actualizar() {
    const a = BASE_ALIMENTOS.find(x => x.id === selectA.value);
    const b = BASE_ALIMENTOS.find(x => x.id === selectB.value);
    if (!a || !b) return;

    tabla.innerHTML = INDICADORES_COMPARADOR.map(ind => fila(ind, a, b)).join("");

    if (a.id === b.id) {
      veredicto.textContent = "Elige dos alimentos distintos para compararlos.";
      return;
    }
    // Menos azúcar y sodio, más fibra
    const puntaje = (x) => x.azucar + x.sodio / 10 - x.fibra * 2;
    const [mejor, otro] = puntaje(a) <= puntaje(b) ? [a, b] : [b, a];
    const razones = [];
    if (mejor.azucar < otro.azucar) razones.push("menos azúcar");
    if (mejor.sodio < otro.sodio) razones.push("menos sodio");
    if (mejor.fibra > otro.fibra) razones.push("más fibra");
    veredicto.innerHTML = `<strong>Mejor opción: ${mejor.nombre}.</strong> ${razones.length ? "Tiene " + razones.join(", ").replace(/, ([^,]*)$/, " y $1") + "." : "Su balance de azúcar, sodio y fibra es mejor."}`;
  }

  selectA.addEventListener("change", actualizar);
  selectB.addEventListener("change", actualizar);
  actualizar();
}
