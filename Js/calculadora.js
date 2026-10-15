/* ==========================================
   CALCULADORA DE SALUD
   IMC, gasto energético (Harris-Benedict), agua y masa muscular (Lee et al., 2000)
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('imc-form');
  if (!form) return;

  const peso = document.getElementById('peso');
  const estatura = document.getElementById('estatura');
  const edad = document.getElementById('edad');
  const error = document.getElementById('calc-error');
  const vacio = document.getElementById('calc-vacio');
  const lecturas = document.getElementById('calc-lecturas');

  // Si viene del Inicio con peso y estatura, se prellenan
  const params = new URLSearchParams(window.location.search);
  if (params.get('peso')) peso.value = params.get('peso');
  if (params.get('estatura')) estatura.value = params.get('estatura');

  const reglas = [
    { input: peso, min: 20, max: 300, mensaje: 'Escribe tu peso en kilogramos, entre 20 y 300.' },
    { input: estatura, min: 100, max: 230, mensaje: 'Escribe tu estatura en centímetros, entre 100 y 230.' },
    { input: edad, min: 15, max: 100, mensaje: 'Escribe tu edad en años, entre 15 y 100.' }
  ];

  reglas.forEach(({ input }) => {
    input.addEventListener('input', () => {
      input.removeAttribute('aria-invalid');
      error.textContent = '';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Validación en línea
    for (const { input, min, max, mensaje } of reglas) {
      const valor = parseFloat(input.value);
      if (!valor || valor < min || valor > max) {
        input.setAttribute('aria-invalid', 'true');
        error.textContent = mensaje;
        input.focus();
        return;
      }
    }

    const kg = parseFloat(peso.value);
    const cm = parseFloat(estatura.value);
    const anios = parseInt(edad.value, 10);
    const genero = form.querySelector('input[name="genero"]:checked').value;
    const actividad = parseFloat(form.querySelector('input[name="actividad"]:checked').value);

    // 2. IMC (se clasifica con el valor redondeado que se muestra)
    const m = cm / 100;
    const imc = Math.round((kg / (m * m)) * 10) / 10;

    let nivel, categoria, posicion;
    if (imc < 18.5) {
      nivel = 'bajo'; categoria = 'Bajo peso';
      posicion = Math.max(3, (imc / 18.5) * 25);
    } else if (imc < 25) {
      nivel = 'normal'; categoria = 'Peso normal';
      posicion = 25 + ((imc - 18.5) / 6.5) * 25;
    } else if (imc < 30) {
      nivel = 'sobre'; categoria = 'Sobrepeso';
      posicion = 50 + ((imc - 25) / 5) * 25;
    } else {
      nivel = 'obes'; categoria = 'Obesidad';
      posicion = Math.min(97, 75 + ((imc - 30) / 10) * 25);
    }

    // 3. Tasa metabólica basal (Harris-Benedict) y gasto diario
    const tmb = genero === 'Hombre'
      ? 66.5 + (13.75 * kg) + (5.003 * cm) - (6.775 * anios)
      : 655.1 + (9.563 * kg) + (1.85 * cm) - (4.676 * anios);
    const kcal = Math.round(tmb * actividad);

    // 4. Agua: 35 ml/kg + ajuste por actividad física
    let extraAguaMl = 0;
    if (actividad >= 1.725) extraAguaMl = 750;
    else if (actividad >= 1.55) extraAguaMl = 550;
    else if (actividad >= 1.375) extraAguaMl = 350;
    const aguaLitros = ((kg * 35) + extraAguaMl) / 1000;
    const vasos = Math.round((aguaLitros * 1000) / 250);

    // 5. Masa muscular esquelética (Lee et al., 2000)
    const sexoFactor = genero === 'Hombre' ? 1 : 0;
    const masaMuscular = (0.244 * kg) + (7.80 * m) + (6.6 * sexoFactor) - (0.098 * anios) - 3.3;

    // 6. Mostrar resultados
    const contar = (id, valor, decimales) => {
      const el = document.getElementById(id);
      if (typeof contarHasta === 'function') contarHasta(el, valor, { decimales });
      else el.textContent = valor.toLocaleString('es-MX', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
    };
    contar('res-imc', imc, 1);
    const cat = document.getElementById('res-cat');
    cat.textContent = categoria;
    cat.dataset.nivel = nivel;
    contar('res-kcal', kcal, 0);
    contar('res-agua', aguaLitros, 1);
    document.getElementById('res-vasos').textContent = `Unos ${vasos} vasos de 250 ml al día.`;
    contar('res-masa-muscular', masaMuscular, 1);

    vacio.hidden = true;
    const primeraVez = lecturas.hidden;
    lecturas.hidden = false;
    if (primeraVez && typeof escalonar === 'function') escalonar(lecturas.children);
    const marca = document.getElementById('indicador-flecha');
    requestAnimationFrame(() => { marca.style.left = `${posicion}%`; });

    // En celular, llevar la vista a los resultados
    if (window.matchMedia('(max-width: 900px)').matches) {
      document.getElementById('calc-resultados').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
