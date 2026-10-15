const datosCuriosos = [
  // CUERPO HUMANO Y DIGESTIÓN (1-10)
  { categoria: "cuerpo", titulo: "El ácido estomacal es ultra potente", descripcion: "El ácido clorhídrico de tu estómago tiene un pH entre 1 y 2, lo suficientemente fuerte como para disolver algunos metales." },
  { categoria: "cuerpo", titulo: "El intestino es tu segundo cerebro", descripcion: "Cerca del 90% de la serotonina (la hormona del bienestar) se produce en el tracto gastrointestinal." },
  { categoria: "cuerpo", titulo: "Metabolismo nocturno", descripcion: "Tu cuerpo quema calorías incluso cuando duermes para mantener latiendo tu corazón y tus pulmones funcionando." },
  { categoria: "cuerpo", titulo: "El picante es un engaño mental", descripcion: "La capsicina de los chiles engaña a los receptores del dolor en la lengua haciéndole creer al cerebro que la boca quema." },
  { categoria: "cuerpo", titulo: "El gran laboratorio del hígado", descripcion: "El hígado realiza más de 500 funciones vitales diarias, incluyendo el procesamiento de todos los nutrientes que ingieres." },
  { categoria: "cuerpo", titulo: "Papilas gustativas renovables", descripcion: "Las células de tus papilas gustativas se regeneran por completo aproximadamente cada 10 a 14 días." },
  { categoria: "cuerpo", titulo: "Longitud del sistema digestivo", descripcion: "Si extendieras todo tu tubo digestivo desde la boca hasta el final, mediría entre 7 y 9 metros de largo." },
  { categoria: "cuerpo", titulo: "El poder de masticar bien", descripcion: "Masticar cada bocado entre 20 y 30 veces facilita la digestión y ayuda al cerebro a registrar la saciedad a tiempo." },
  { categoria: "cuerpo", titulo: "Saliva diaria", descripcion: "Producimos en promedio entre 1 y 1.5 litros de saliva al día, esencial para descomponer los alimentos." },
  { categoria: "cuerpo", titulo: "Gas de respaldo", descripcion: "La microbiota intestinal produce gases de forma natural al fermentar la fibra alimentaria que no podemos digerir solos." },

  // NUTRICIÓN Y ALIMENTOS (11-20)
  { categoria: "nutricion", titulo: "El mito de la espinaca y Popeye", descripcion: "Las espinacas son muy saludables, pero su nivel de hierro se calculó mal por un punto decimal en el siglo XIX." },
  { categoria: "nutricion", titulo: "Los colores de los vegetales importan", descripcion: "El color indica sus nutrientes: el rojo indica licopeno (corazón) y el verde clorofila (desintoxicante)." },
  { categoria: "nutricion", titulo: "El aguacate es una fruta", descripcion: "Botánicamente, el aguacate es una baya de una sola semilla llena de grasas monoinsaturadas saludables." },
  { categoria: "nutricion", titulo: "Las manzanas ayudan a despertar", descripcion: "Por su fibra y fructosa natural, comer una manzana en la mañana aporta energía constante sin picos de azúcar." },
  { categoria: "nutricion", titulo: "La miel nunca se echa a perder", descripcion: "Arqueólogos han encontrado frascos de miel en tumbas egipcias de más de 3,000 años que aún eran comestibles." },
  { categoria: "nutricion", titulo: "El tomate cocido es mejor", descripcion: "Cocinar los tomates aumenta la disponibilidad del licopeno, un potente antioxidante beneficioso para el corazón." },
  { categoria: "nutricion", titulo: "Las almendras y el calcio", descripcion: "Las almendras son uno de los frutos secos con mayor aporte de calcio y fibra para fortalecer los huesos." },
  { categoria: "nutricion", titulo: "El chocolate negro fortalece la mente", descripcion: "El cacao con más de 70% de pureza contiene flavonoides que mejoran el flujo sanguíneo hacia el cerebro." },
  { categoria: "nutricion", titulo: "La chía y el omega-3", descripcion: "Una sola cucharada de semillas de chía contiene más omega-3 vegetal que una porción equivalente de muchos pescados." },
  { categoria: "nutricion", titulo: "Zanahorias y visión nocturna", descripcion: "Tienen betacaroteno que se transforma en vitamina A, clave para la salud ocular y prevenir el deterioro macular." },

  // EJERCICIO Y DEPORTE (21-30)
  { categoria: "ejercicio", titulo: "Tu corazón baila con la música", descripcion: "Durante el ejercicio, tu ritmo cardíaco puede sincronizarse con el tempo y los pulsos de la música que escuchas." },
  { categoria: "ejercicio", titulo: "Caminar reduce el estrés al instante", descripcion: "Una caminata a paso ligero de solo 15 minutos ayuda a reducir notablemente los niveles de cortisol (estrés)." },
  { categoria: "ejercicio", titulo: "Efecto EPOC (Quema posterior)", descripcion: "Tras un entrenamiento de fuerza intenso, el cuerpo sigue quemando calorías adicionales durante varias horas." },
  { categoria: "ejercicio", titulo: "El músculo ocupa menos espacio", descripcion: "Un kilo de músculo es mucho más denso y compacto que un kilo de grasa, estilizando la figura corporal." },
  { categoria: "ejercicio", titulo: "Sentadillas para el cerebro", descripcion: "Ejercitar las piernas estimula la liberación de BDNF, una proteína que favorece la memoria y la salud neuronal." },
  { categoria: "ejercicio", titulo: "Combate la fatiga con movimiento", descripcion: "Pararte y estirarte cada hora activa la circulación sanguínea aumentando el oxígeno al cerebro." },
  { categoria: "ejercicio", titulo: "El poder del entrenamiento de fuerza", descripcion: "Levantar peso moderado a partir de los 25 años previene la pérdida progresiva de masa ósea y muscular." },
  { categoria: "ejercicio", titulo: "Endorfinas naturales", descripcion: "Correr o hacer cardio libera endorfinas que generan una sensación natural de euforia y bienestar emocional." },
  { categoria: "ejercicio", titulo: "La postura afecta el humor", descripcion: "Mantener la espalda recta activa mensajes al cerebro de mayor confianza y reduce el cansancio percibido." },
  { categoria: "ejercicio", titulo: "10,000 pasos diarios", descripcion: "Dar entre 7,000 y 10,000 pasos al día reduce drásticamente el riesgo cardiovascular y fortalece articulaciones." },

  // HIDRATACIÓN (31-40)
  { categoria: "hidratacion", titulo: "Tu cerebro es 75% agua", descripcion: "Una deshidratación leve de tan solo el 2% reduce tu capacidad de concentración, memoria corta y alerta." },
  { categoria: "hidratacion", titulo: "Confusión entre sed y hambre", descripcion: "El hipotálamo regula la sed y el hambre por igual; a menudo sentimos deseo de comer cuando solo necesitamos agua." },
  { categoria: "hidratacion", titulo: "La Jarra del Buen Beber", descripcion: "Promueve consumir de 6 a 8 vasos de agua simple potable al día y evitar bebidas azucaradas o procesadas." },
  { categoria: "hidratacion", titulo: "Agua fría vs. al tiempo", descripcion: "El agua al tiempo se absorbe ligeramente más rápido en el estómago, ideal durante jornadas de entrenamiento." },
  { categoria: "hidratacion", titulo: "El agua mejora la piel", descripcion: "Estar bien hidratado mantiene la elasticidad cutánea y ayuda a transportar nutrientes a las células epiteliales." },
  { categoria: "hidratacion", titulo: "Saboriza de forma natural", descripcion: "Agregar rodajas de limón, pepino o menta al agua simple motiva un mayor consumo sin agregar azúcares." },
  { categoria: "hidratacion", titulo: "Atención a la hidratación en frío", descripcion: "En clima frío la sensación de sed disminuye hasta un 40%, pero el cuerpo sigue perdiendo agua al respirar." },
  { categoria: "hidratacion", titulo: "Los riñones filtran tu sangre", descripcion: "Tus riñones procesan unos 190 litros de sangre al día para eliminar toxinas gracias al aporte de agua." },
  { categoria: "hidratacion", titulo: "Cuidado con los refrescos", descripcion: "Una sola lata de refresco contiene hasta 10 cucharaditas de azúcar, superando el límite diario recomendado." },
  { categoria: "hidratacion", titulo: "Electrolitos en frutas", descripcion: "Comer sandía o melón aporta agua acompañada de potasio y magnesio para una rehidratación natural." },

  // HÁBITOS Y ESTILO DE VIDA (41-50)
  { categoria: "habitos", titulo: "Luz azul y sueño", descripcion: "Usar el celular o pantallas antes de dormir bloquea la hormona melatonina, alterando el descanso profundo." },
  { categoria: "habitos", titulo: "El poder de las siestas cortas", descripcion: "Una siesta de 15 a 20 minutos recarga tu energía y mejora el rendimiento sin interferir con el sueño nocturno." },
  { categoria: "habitos", titulo: "Regla del plato balanceado", descripcion: "Llena la mitad de tu plato con verduras, un cuarto con proteína magra y el otro cuarto con carbohidratos complejos." },
  { categoria: "habitos", titulo: "Comer sin distracciones", descripcion: "Apagar la televisión al comer evita el consumo desmedido de alimentos al ser consciente de las porciones." },
  { categoria: "habitos", titulo: "El descanso repara tus músculos", descripcion: "Las fibras musculares no crecen durante el entrenamiento, sino en las horas de sueño reparador." },
  { categoria: "habitos", titulo: "Planificar tus comidas ahorra tiempo", descripcion: "Preparar tus opciones de comida con anticipación reduce las elecciones impulsivas de comida rápida ultraprocesada." },
  { categoria: "habitos", titulo: "La gratitud reduce el estrés", descripcion: "Anotar 3 cosas positivas al día disminuye los estados de ansiedad y favorece la salud cardiovascular." },
  { categoria: "habitos", titulo: "Lee las etiquetas nutrimentales", descripcion: "Revisar los primeros ingredientes te ayuda a identificar azúcares o grasas trans ocultas en productos procesados." },
  { categoria: "habitos", titulo: "Construir un hábito toma tiempo", descripcion: "Adoptar una nueva rutina saludable toma en promedio entre 21 y 66 días de práctica constante." },
  { categoria: "habitos", titulo: "Pequeños cambios, grandes resultados", descripcion: "Reducir solo una cucharadita de azúcar al día acumula un beneficio gigante en la prevención metabólica a largo plazo." }
];

/* ==========================================
   PÁGINA ¿SABÍAS QUÉ?: filtro por categoría, dato destacado y lista
   (el Inicio solo usa el arreglo datosCuriosos)
   ========================================== */
const categoriasDatos = {
  todos: "Todos",
  cuerpo: "Cuerpo humano y digestión",
  nutricion: "Nutrición y alimentos",
  ejercicio: "Ejercicio y deporte",
  hidratacion: "Hidratación",
  habitos: "Hábitos y estilo de vida"
};

document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("datos-lista");
  const filtros = document.getElementById("datos-filtros");
  const contador = document.getElementById("datos-contador");
  if (!lista || !filtros) return;

  // Botones de filtro con su cantidad de datos
  Object.entries(categoriasDatos).forEach(([clave, nombre]) => {
    const total = clave === "todos" ? datosCuriosos.length : datosCuriosos.filter((d) => d.categoria === clave).length;
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "filtro";
    boton.dataset.categoria = clave;
    boton.setAttribute("aria-pressed", String(clave === "todos"));
    boton.innerHTML = `${nombre} <span class="filtro-total">${total}</span>`;
    filtros.appendChild(boton);
  });

  function mostrar(categoria) {
    const visibles = datosCuriosos
      .map((dato, i) => ({ ...dato, numero: i + 1 }))
      .filter((d) => categoria === "todos" || d.categoria === categoria);

    lista.innerHTML = visibles.map((d) => `
      <li class="dato-item" data-categoria="${d.categoria}">
        <span class="dato-num">${d.numero}</span>
        <div>
          <h3>${d.titulo}</h3>
          <p>${d.descripcion}</p>
          <p class="dato-cat">${categoriasDatos[d.categoria]}</p>
        </div>
      </li>`).join("");

    if (typeof escalonar === "function") escalonar(lista.children);

    if (contador) {
      contador.textContent = categoria === "todos"
        ? `${visibles.length} datos curiosos`
        : `${visibles.length} datos de ${categoriasDatos[categoria].toLowerCase()}`;
    }
    filtros.querySelectorAll(".filtro").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.categoria === categoria)));
  }

  filtros.addEventListener("click", (e) => {
    const boton = e.target.closest(".filtro");
    if (boton) mostrar(boton.dataset.categoria);
  });

  mostrar("todos");

  // Dato destacado en la nota adhesiva
  const notaTitulo = document.getElementById("nota-titulo");
  const notaDesc = document.getElementById("nota-desc");
  const notaCat = document.getElementById("nota-cat");
  const notaOtro = document.getElementById("nota-otro");
  const nota = document.getElementById("nota-dato");
  let actual = -1;

  function destacar() {
    let siguiente = actual;
    while (siguiente === actual) siguiente = Math.floor(Math.random() * datosCuriosos.length);
    actual = siguiente;
    const d = datosCuriosos[actual];
    if (notaCat) notaCat.textContent = `Dato ${actual + 1} · ${categoriasDatos[d.categoria]}`;
    if (notaTitulo) notaTitulo.textContent = d.titulo;
    if (notaDesc) notaDesc.textContent = d.descripcion;
    if (nota) {
      nota.classList.remove("cambia");
      void nota.offsetWidth;
      nota.classList.add("cambia");
    }
  }

  if (notaTitulo && notaOtro) {
    destacar();
    notaOtro.addEventListener("click", destacar);
  }
});
