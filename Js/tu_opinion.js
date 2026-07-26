(function autoInitOpinion() {
  function renderSurveyQuestions() {
    const container = document.getElementById("survey-questions-container");
    
    // Si la página actual no tiene el contenedor, salimos sin error
    if (!container) return false;

    // Si ya fueron inyectadas las preguntas, evitamos duplicarlas
    if (container.children.length > 0) return true;

    const questionsData = [
      { id: 1, type: "radio", question: "¿Cómo calificaría la calidad y utilidad del contenido de nuestra página?", options: ["Excelente", "Buena", "Regular", "Mala"] },
      { id: 2, type: "radio", question: "¿Considera que la información es clara y fácil de leer?", options: ["Sí, muy clara", "Es aceptable", "No, hay demasiada información o es confusa"] },
      { id: 3, type: "checkbox", question: "¿Qué palabra describe mejor el diseño visual de nuestra página web?", options: ["Moderno", "Limpio y profesional", "Desordenado", "Anticuado"] },
      { id: 4, type: "radio", question: "¿Qué tan fácil le resultó navegar por las diferentes secciones del sitio?", options: ["Muy fácil", "Fácil", "Moderadamente difícil", "Muy difícil"] },
      { id: 5, type: "radio", question: "¿Qué opinas del diseño interactivo del Plato del Buen Comer y la Jarra del Buen Beber?", options: ["Muy interactivo y explicativo", "Útil e instructivo", "Poco atractivo", "No lo utilicé"] },
      { id: 6, type: "radio", question: "¿Te resultó útil la herramienta de Calculadora de IMC?", options: ["Sí, muy útil e intuitiva", "Útil", "Poco útil", "No la he probado"] },
      { id: 7, type: "checkbox", question: "¿Qué temas te gustaría ver más en futuras actualizaciones?", options: ["Recetas saludables", "Rutinas de ejercicio", "Salud mental y descanso", "Planes de alimentación"] },
      { id: 8, type: "radio", question: "¿Consideras que las imágenes y elementos gráficos aportan al aprendizaje?", options: ["Totalmente de acuerdo", "De acuerdo", "En desacuerdo", "Totalmente en desacuerdo"] },
      { id: 9, type: "radio", question: "¿Qué tan rápido cargó el contenido del sitio en tu dispositivo?", options: ["Muy rápido", "Aceptable", "Lento", "Muy lento"] },
      { id: 10, type: "radio", question: "¿Qué opinión tienes de la presencia de la mascota (El Castor Nutritivo)?", options: ["Aporta amigabilidad y dinamismo", "Es indiferente", "No me agrada"] },
      { id: 11, type: "radio", question: "¿Recomendarías esta plataforma a un amigo o compañero de estudios?", options: ["Definitivamente sí", "Probablemente sí", "Tal vez", "No"] },
      { id: 12, type: "radio", question: "¿Los colores y tipografías te parecieron adecuados para la lectura?", options: ["Excelente contraste y legibilidad", "Adecuado", "Cansa la vista"] },
      { id: 13, type: "radio", question: "¿Con qué frecuencia piensas que volverás a consultar este portal?", options: ["Diariamente", "Semanalmente", "Ocasionalmente", "Rara vez"] },
      { id: 14, type: "radio", question: "¿Cómo evalúas la precisión de las recomendaciones de salud presentadas?", options: ["Muy confiables", "Confiables", "Tengo dudas", "No me parecen confiables"] },
      { id: 15, type: "radio", question: "En general, ¿cuál es tu nivel de satisfacción con WellDataLab?", options: ["Muy satisfecho", "Satisfecho", "Neutral", "Insatisfecho"] }
    ];

    let htmlBuilder = "";

    questionsData.forEach((q, index) => {
      const fieldName = `question_${q.id}`;
      let optionsHTML = "";

      q.options.forEach((opt, optIndex) => {
        const optionId = `q${q.id}_opt${optIndex}`;
        optionsHTML += `
          <div class="option-item">
            <input type="${q.type}" id="${optionId}" name="${fieldName}${q.type === 'checkbox' ? '[]' : ''}" value="${opt}">
            <label for="${optionId}">${opt}</label>
          </div>
        `;
      });

      htmlBuilder += `
        <div class="question-block">
          <h3 class="question-title">${index + 1}. ${q.question}</h3>
          <div class="options-group">
            ${optionsHTML}
          </div>
        </div>
      `;
    });

    container.innerHTML = htmlBuilder;

    const form = document.getElementById("opinion-form");
    const thankYouBox = document.getElementById("opinion-thankyou");

    if (form && !form.dataset.bound) {
      form.dataset.bound = "true";
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        form.style.display = "none";
        if (thankYouBox) thankYouBox.classList.remove("hidden");
      });
    }

    return true;
  }

  // 1. Intento al cargar la función
  renderSurveyQuestions();

  // 2. Intento en eventos estándar del navegador
  document.addEventListener("DOMContentLoaded", renderSurveyQuestions);
  window.addEventListener("load", renderSurveyQuestions);

  // 3. Polling continuo: Revisa cada 300ms si la vista cambió a "Tu Opinión"
  const checkInterval = setInterval(() => {
    // Si logra inyectar las preguntas con éxito, detiene las revisiones
    if (renderSurveyQuestions()) {
      clearInterval(checkInterval);
    }
  }, 300);
})();