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