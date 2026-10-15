/* ==========================================
   TU OPINIÓN: progreso, validación y envío por correo (FormSubmit)
   ========================================== */

// Correo del equipo que recibe las respuestas. FormSubmit envía un correo de
// activación la primera vez que llega un envío; hay que confirmarlo una sola vez.
const CORREO_OPINIONES = "2311082133@alumno.utpuebla.edu.mx";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("opinion-form");
  if (!form) return;

  const preguntas = Array.from(form.querySelectorAll(".pregunta"));
  const obligatorias = preguntas.filter((p) => !p.dataset.opcional);
  const relleno = document.getElementById("progreso-relleno");
  const textoProgreso = document.getElementById("progreso-texto");
  const errorGeneral = document.getElementById("encuesta-error");
  const enviar = document.getElementById("opinion-enviar");
  const gracias = document.getElementById("opinion-gracias");

  const respondida = (p) => p.querySelector("input:checked") !== null;

  function actualizarProgreso() {
    const hechas = obligatorias.filter(respondida).length;
    relleno.style.width = `${(hechas / obligatorias.length) * 100}%`;
    textoProgreso.textContent = hechas === obligatorias.length
      ? "¡Listo! Ya puedes enviar tus respuestas"
      : `${hechas} de ${obligatorias.length} preguntas obligatorias`;
  }

  form.addEventListener("change", (e) => {
    const p = e.target.closest(".pregunta");
    if (p && respondida(p)) {
      p.classList.remove("con-error");
      p.querySelector(".pregunta-error").textContent = "";
    }
    actualizarProgreso();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorGeneral.textContent = "";

    // 1. Validación: todas las preguntas de opción única deben tener respuesta
    const faltantes = obligatorias.filter((p) => !respondida(p));
    faltantes.forEach((p) => {
      p.classList.add("con-error");
      p.querySelector(".pregunta-error").textContent = "Elige una opción para continuar.";
    });
    if (faltantes.length) {
      errorGeneral.textContent = faltantes.length === 1
        ? "Falta responder 1 pregunta."
        : `Faltan ${faltantes.length} preguntas por responder.`;
      faltantes[0].scrollIntoView({ behavior: "smooth", block: "center" });
      faltantes[0].querySelector("input").focus({ preventScroll: true });
      return;
    }

    // 2. Campo trampa: si un bot lo llenó, se ignora el envío
    if (form.elements._honey.value) return;

    if (!CORREO_OPINIONES) {
      errorGeneral.textContent = "El envío todavía no está configurado. Avisa al equipo de WellDataLab.";
      return;
    }

    // 3. Respuestas con el texto de cada pregunta, para leerlas fácil en el correo
    const datos = {
      _subject: "Nueva opinión sobre WellDataLab",
      _template: "table",
      _captcha: "false"
    };
    preguntas.forEach((p, i) => {
      const titulo = p.dataset.pregunta;
      if (!titulo) return;
      const elegidas = Array.from(p.querySelectorAll("input:checked")).map((x) => x.value);
      datos[`${i + 1}. ${titulo}`] = elegidas.length ? elegidas.join(", ") : "Sin respuesta";
    });
    datos["Comentario"] = form.elements.comentario.value.trim() || "Sin comentario";

    enviar.disabled = true;
    enviar.innerHTML = 'Enviando… <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';

    try {
      const respuesta = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CORREO_OPINIONES)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(datos)
      });
      const resultado = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok || String(resultado.success) !== "true") {
        throw new Error(resultado.message || "Respuesta inesperada del servidor");
      }
      form.hidden = true;
      document.querySelector(".progreso").hidden = true;
      gracias.hidden = false;
      gracias.focus();
      gracias.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      errorGeneral.textContent = "No pudimos enviar tus respuestas. Revisa tu conexión e inténtalo de nuevo.";
      enviar.disabled = false;
      enviar.innerHTML = 'Enviar respuestas <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>';
    }
  });

  actualizarProgreso();
});
