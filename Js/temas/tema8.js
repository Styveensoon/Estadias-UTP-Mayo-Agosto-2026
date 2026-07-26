/* Js/temas/tema8.js */
export function getTema8FallbackHTML() {
  return `
    <div class="ejercicio-wrapper" id="tema8-container">
      <div class="ejercicio-header">
        <h1 class="ejercicio-title">Marco Normativo y Hábitos Saludables</h1>
        <p class="ejercicio-subtitle">"Los resultados sostenibles no provienen de cambios drásticos de un día para otro, sino de pequeños hábitos repetidos con constancia a lo largo del tiempo."</p>
      </div>

      <div class="ejercicio-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px;">
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