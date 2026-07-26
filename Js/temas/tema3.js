/* ==========================================
   TEMA 3: LA JARRA DEL BUEN BEBER Y LA REALIDAD NACIONAL
   ========================================== */

function getTema3HTML() {
  return `
    <div class="jarra-section-layout">
      
      <!-- COLUMNA IZQUIERDA: SVG INTERACTIVO Y DATOS CRÍTICOS -->
      <div class="jarra-visual-col">
        <div class="jarra-svg-container">
          <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
            <!-- Asa y Contorno de la Jarra -->
            <path d="M 155,70 C 185,70 185,190 150,195" fill="none" stroke="#2e7d32" stroke-width="10" stroke-linecap="round"/>
            <path d="M 30,30 L 170,30 L 150,230 Q 150,240 130,240 L 70,240 Q 50,240 50,230 Z" fill="#ffffff" stroke="#2e7d32" stroke-width="8" stroke-linejoin="round"/>
            
            <!-- CAPAS RELLENABLES DE LA JARRA (NIVELES DE ABAJO HACIA ARRIBA) -->
            <!-- Nivel 1: Azul -->
            <path id="svg-level-1" class="jarra-level-layer active" d="M 52,185 L 148,185 L 150,230 Q 150,238 130,238 L 70,238 Q 50,238 50,230 Z" fill="#2563eb" data-level="1"/>
            <!-- Nivel 2: Morado -->
            <path id="svg-level-2" class="jarra-level-layer active" d="M 50,155 L 150,155 L 148,185 L 52,185 Z" fill="#9333ea" data-level="2"/>
            <!-- Nivel 3: Amarillo/Café -->
            <path id="svg-level-3" class="jarra-level-layer active" d="M 47,125 L 153,125 L 150,155 L 50,155 Z" fill="#eab308" data-level="3"/>
            <!-- Nivel 4: Naranja -->
            <path id="svg-level-4" class="jarra-level-layer active" d="M 43,95 L 157,95 L 153,125 L 47,125 Z" fill="#f97316" data-level="4"/>
            <!-- Nivel 5: Rojo -->
            <path id="svg-level-5" class="jarra-level-layer active" d="M 40,65 L 160,65 L 157,95 L 43,95 Z" fill="#ef4444" data-level="5"/>
            <!-- Nivel 6: Verde/Rosa -->
            <path id="svg-level-6" class="jarra-level-layer active" d="M 35,38 L 165,38 L 160,65 L 40,65 Z" fill="#16a34a" data-level="6"/>

            <!-- Texto descriptivo sobre la Jarra -->
            <text x="100" y="215" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Nivel 1</text>
            <text x="100" y="173" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Nivel 2</text>
            <text x="100" y="143" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Nivel 3</text>
            <text x="100" y="113" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Nivel 4</text>
            <text x="100" y="83" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Nivel 5</text>
            <text x="100" y="53" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Nivel 6</text>
          </svg>
        </div>

        <div class="critical-postit">
          <h4><i class="fa-solid fa-triangle-exclamation"></i> Cifras Críticas de Sobrepeso</h4>
          <p>En México, cerca de un tercio de la población infantil y más del 70% de la población adulta joven padece sobrepeso u obesidad, desencadenados mayormente por bebidas azucaradas.</p>
          <a href="https://www.gob.mx/profeco" target="_blank" rel="noopener noreferrer" class="profeco-link">
            Ver artículo completo de PROFECO <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>

      <!-- COLUMNA CENTRAL: TEXTO INFORMATIVO CAMBIANTE -->
      <div class="jarra-info-col">
        <h1 class="jarra-main-title">LA JARRA DEL BUEN BEBER Y LA REALIDAD NACIONAL</h1>
        
        <div class="jarra-dynamic-card" id="jarra-info-card">
          <p id="jarra-info-text">
            PROFECO destaca la importancia de mantenernos correctamente <strong>“hidratados con agua simple potable”</strong>. Históricamente, el consumo excesivo de bebidas azucaradas ha impulsado de manera alarmante las tasas de sobrepeso y obesidad en nuestro país.
          </p>
        </div>
      </div>

      <!-- COLUMNA DERECHA: LOS 6 NIVELES SELECCIONABLES -->
      <div class="jarra-levels-col">
        <h3>Los 6 Niveles de Hidratación Saludable</h3>
        
        <div class="levels-list">
          <button class="level-card-btn active" data-level="1">
            <div class="level-info-group">
              <div class="level-num-badge" style="background-color: #2563eb;">1</div>
              <span class="level-title">Agua Potable Simple</span>
            </div>
            <span class="level-vessels" style="color: #2563eb;">6 a 8 Vasos</span>
          </button>

          <button class="level-card-btn" data-level="2">
            <div class="level-info-group">
              <div class="level-num-badge" style="background-color: #9333ea;">2</div>
              <span class="level-title">Leche Semidescremada / Soya</span>
            </div>
            <span class="level-vessels" style="color: #64748b;">Máx. 2 Vasos</span>
          </button>

          <button class="level-card-btn" data-level="3">
            <div class="level-info-group">
              <div class="level-num-badge" style="background-color: #eab308;">3</div>
              <span class="level-title">Té y Café sin Azúcar</span>
            </div>
            <span class="level-vessels" style="color: #64748b;">Máx. 4 Tazas</span>
          </button>

          <button class="level-card-btn" data-level="4">
            <div class="level-info-group">
              <div class="level-num-badge" style="background-color: #f97316;">4</div>
              <span class="level-title">Bebidas No Calóricas c/Edulcorantes</span>
            </div>
            <span class="level-vessels" style="color: #64748b;">Máx. 2 Vasos</span>
          </button>

          <button class="level-card-btn" data-level="5">
            <div class="level-info-group">
              <div class="level-num-badge" style="background-color: #ef4444;">5</div>
              <span class="level-title">Jugos de Fruta, Leche Entera, Alcohol</span>
            </div>
            <span class="level-vessels" style="color: #64748b;">Máx. ½ Vaso</span>
          </button>

          <button class="level-card-btn" data-level="6">
            <div class="level-info-group">
              <div class="level-num-badge" style="background-color: #16a34a;">6</div>
              <span class="level-title">Refrescos y Aguas de Sabor</span>
            </div>
            <span class="level-vessels" style="color: #ef4444;">0 Vasos (Evitar)</span>
          </button>
        </div>
      </div>

    </div>
  `;
}

function initJarraInteractivity() {
  const levelData = {
    1: {
      text: "<strong>Nivel 1: Agua Potable Simple (6 a 8 vasos)</strong><br><br>Es la elección indispensable y vital para la hidratación diaria. No aporta calorías, regula la temperatura corporal y ayuda a eliminar desechos metabolizados por el organismo.",
      color: "#2563eb"
    },
    2: {
      text: "<strong>Nivel 2: Leche Semidescremada y Bebidas de Soya sin Azúcar (Máx. 2 vasos)</strong><br><br>Aportan calcio y proteínas de alta calidad. Se recomienda optar por versiones sin azúcares añadidos para evitar calorías vacías.",
      color: "#9333ea"
    },
    3: {
      text: "<strong>Nivel 3: Té y Café sin Azúcar (Máx. 4 tazas)</strong><br><br>Proveen antioxidantes y micronutrientes. Es importante no añadirles azúcar ni jarabes para no convertirlos en bebidas hipercalóricas.",
      color: "#eab308"
    },
    4: {
      text: "<strong>Nivel 4: Bebidas No Calóricas con Edulcorantes Artificiales (Máx. 2 vasos)</strong><br><br>No aportan calorías pero acostumbran al paladar al sabor muy dulce. Se sugiere un consumo esporádico e informado.",
      color: "#f97316"
    },
    5: {
      text: "<strong>Nivel 5: Jugos de Fruta, Leche Entera, Bebidas Alcohólicas o Deportivas (Máx. ½ vaso)</strong><br><br>Tienen un alto contenido calórico y de grasas/azúcares. Al licuar la fruta se pierde la fibra natural, elevando rápido la glucosa.",
      color: "#ef4444"
    },
    6: {
      text: "<strong>Nivel 6: Refrescos y Aguas de Sabor (0 Vasos - Evitar)</strong><br><br>No aportan nutrientes esenciales y contienen cantidades excesivas de azúcares simples. Su consumo recurrente está ligado directamente al sobrepeso y la diabetes.",
      color: "#16a34a"
    }
  };

  const buttons = document.querySelectorAll('.level-card-btn');
  const svgLayers = document.querySelectorAll('.jarra-level-layer');
  const infoCard = document.getElementById('jarra-info-card');
  const infoText = document.getElementById('jarra-info-text');

  function selectLevel(targetLevel) {
    const levelNum = parseInt(targetLevel);

    buttons.forEach(btn => {
      if (btn.getAttribute('data-level') === targetLevel) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    svgLayers.forEach(layer => {
      const layerNum = parseInt(layer.getAttribute('data-level'));
      if (layerNum <= levelNum) {
        layer.style.opacity = '1';
      } else {
        layer.style.opacity = '0.2';
      }
    });

    if (infoCard && infoText && levelData[levelNum]) {
      infoCard.classList.remove('highlight');
      infoText.style.opacity = '0';

      setTimeout(() => {
        infoText.innerHTML = levelData[levelNum].text;
        infoText.style.opacity = '1';
        infoCard.style.borderColor = levelData[levelNum].color;
        infoCard.classList.add('highlight');
      }, 150);
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectLevel(btn.getAttribute('data-level'));
    });
  });

  svgLayers.forEach(layer => {
    layer.addEventListener('click', () => {
      selectLevel(layer.getAttribute('data-level'));
    });
  });
}