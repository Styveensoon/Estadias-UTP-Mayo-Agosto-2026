/* ==========================================
   TEMA 6: RECOMENDACIONES DE EJERCICIO
   ========================================== */
function getTema6HTML() {
  return `
    <div class="ejercicio-wrapper">
      <div class="ejercicio-header">
        <h1 class="ejercicio-title">Recomendaciones de Ejercicio y Movimiento</h1>
        <p class="ejercicio-subtitle">"La actividad física debe ser constante, variada y divertida. Olvídate de los desafíos extremos; la constancia y el movimiento diario son la clave."</p>
      </div>

      <div class="ejercicio-grid">
        <article class="ejercicio-card">
          <div class="ejercicio-icon-box icon-cardio"><i class="fa-solid fa-bolt"></i></div>
          <h2 class="ejercicio-card-title">Cardio Diario</h2>
          <p class="ejercicio-card-desc">Caminar a paso rápido, trotar, correr o bailar. Fortalecen tu corazón, mejoran tu capacidad pulmonar y ayudan a la quema de calorías diarias.</p>
          <ul class="ejercicio-checklist">
            <li><i class="fa-solid fa-check"></i> Al menos 30 minutos al día.</li>
            <li><i class="fa-solid fa-check"></i> Intensidad moderada.</li>
          </ul>
        </article>

        <article class="ejercicio-card">
          <div class="ejercicio-icon-box icon-fuerza"><i class="fa-solid fa-dumbbell"></i></div>
          <h2 class="ejercicio-card-title">Fuerza Muscular</h2>
          <p class="ejercicio-card-desc">Sentadillas, flexiones de pecho, desplantes o cargar pequeños pesos. Conservar la masa muscular previene la osteoporosis y activa tu metabolismo.</p>
          <ul class="ejercicio-checklist">
            <li><i class="fa-solid fa-check"></i> 2 a 3 veces por semana.</li>
            <li><i class="fa-solid fa-check"></i> Enfócate en la técnica correcta.</li>
          </ul>
        </article>

        <article class="ejercicio-card">
          <div class="ejercicio-icon-box icon-flex"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
          <h2 class="ejercicio-card-title">Flexibilidad & Estiramientos</h2>
          <p class="ejercicio-card-desc">Estiramientos suaves de cuello, hombros, espalda y piernas. Especialmente recomendado tras pasar muchas horas sentado.</p>
          <ul class="ejercicio-checklist">
            <li><i class="fa-solid fa-check"></i> Ideal antes y después de tu día.</li>
            <li><i class="fa-solid fa-check"></i> Reduce dolores musculares y estrés.</li>
          </ul>
        </article>
      </div>
    </div>
  `;
}