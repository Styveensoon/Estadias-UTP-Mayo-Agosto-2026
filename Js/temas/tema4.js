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
            <!-- Sector 1: Verduras y frutas (50%) - Verde (#16a34a) -->
            <path class="plate-slice active" data-group="1" fill="#16a34a" d="M 0 0 L 0 -100 A 100 100 0 1 1 0 100 Z" />
            
            <!-- Sector 2: Cereales y tubérculos (22%) - Amarillo (#facc15) -->
            <path class="plate-slice" data-group="2" fill="#facc15" d="M 0 0 L 0 100 A 100 100 0 0 1 -97.81 20.79 Z" />
            
            <!-- Sector 3: Leguminosas (15%) - Naranja claro (#fbe192 / #f59e0b) -->
            <path class="plate-slice" data-group="3" fill="#f59e0b" d="M 0 0 L -97.81 20.79 A 100 100 0 0 1 -72.90 -68.45 Z" />
            
            <!-- Sector 4: Origen Animal (8%) - Rojo (#ef4444) -->
            <path class="plate-slice" data-group="4" fill="#ef4444" d="M 0 0 L -72.90 -68.45 A 100 100 0 0 1 -30.90 -95.11 Z" />
            
            <!-- Sector 5: Grasas/Aceites (5%) - Marrón/Ocre (#eab308 / #f59e0b) -->
            <path class="plate-slice" data-group="5" fill="#d97706" d="M 0 0 L -30.90 -95.11 A 100 100 0 0 1 0 -100 Z" />
            
            <!-- Centro del Plato -->
            <circle cx="0" cy="0" r="22" fill="#ffffff" />

            <!-- Etiquetas externas de porcentajes y nombres -->
            <!-- 50% Verduras y frutas -->
            <text x="65" y="0" class="svg-label"><tspan x="65" dy="-4">Verduras y frutas</tspan><tspan x="65" dy="16" class="svg-pct">50%</tspan></text>
            <!-- 22% Cereales -->
            <text x="-60" y="85" class="svg-label"><tspan x="-60" dy="-4">Cereales y tubérculos</tspan><tspan x="-60" dy="16" class="svg-pct">22%</tspan></text>
            <!-- 15% Leguminosas -->
            <text x="-105" y="-20" class="svg-label"><tspan x="-105" dy="-4">Leguminosas</tspan><tspan x="-105" dy="16" class="svg-pct">15%</tspan></text>
            <!-- 8% Origen animal -->
            <text x="-65" y="-88" class="svg-label"><tspan x="-65" dy="-4">Origen animal</tspan><tspan x="-65" dy="16" class="svg-pct">8%</tspan></text>
            <!-- 5% Grasas -->
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