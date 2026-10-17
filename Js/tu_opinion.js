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
      errorGeneral.textContent = "El envío todavía no está configurado. Avisa al equipo de Cheficas UTP.";
      return;
    }

    // 3. Correo legible: asunto con el resumen, datos clave primero y
    //    después cada respuesta con un título corto (data-corto en el HTML)
    const respuestaDe = (p) => {
      const elegidas = Array.from(p.querySelectorAll("input:checked")).map((x) => x.value);
      return elegidas.length ? elegidas.join(", ") : "Sin respuesta";
    };
    const porTitulo = (corto) => {
      const p = preguntas.find((x) => x.dataset.corto === corto);
      return p ? respuestaDe(p) : "Sin respuesta";
    };
    const satisfaccion = porTitulo("Satisfacción general");
    const recomendaria = porTitulo("¿Recomendaría el sitio?");
    const comentario = form.elements.comentario.value.trim();
    const fecha = new Date().toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" });
    const dispositivo = window.matchMedia("(max-width: 900px)").matches ? "Celular o tableta" : "Computadora";

    const datos = {
      _subject: `Opinión Cheficas UTP · ${satisfaccion} · Recomendaría: ${recomendaria}`,
      _template: "table",
      _captcha: "false",
      "★ Satisfacción general": satisfaccion,
      "★ ¿Recomendaría el sitio?": recomendaria,
      "★ Comentario": comentario || "Sin comentario",
      "Fecha": fecha,
      "Dispositivo": dispositivo
    };
    preguntas.forEach((p, i) => {
      if (!p.dataset.corto) return;
      datos[`${String(i + 1).padStart(2, "0")} · ${p.dataset.corto}`] = respuestaDe(p);
    });

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
