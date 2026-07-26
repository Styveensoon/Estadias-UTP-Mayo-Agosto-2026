document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('imc-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // 1. Obtención de valores
      const peso = parseFloat(document.getElementById('peso').value);
      const estatura = parseFloat(document.getElementById('estatura').value);
      const edad = parseInt(document.getElementById('edad').value);
      const genero = document.getElementById('genero').value;
      const actividad = parseFloat(document.getElementById('actividad').value);

      if (!peso || !estatura || !edad || peso <= 0 || estatura <= 0) {
        alert('Por favor, ingresa datos válidos.');
        return;
      }

      // 2. Cálculo de IMC
      const estMetros = estatura / 100;
      const imcNum = peso / (estMetros * estMetros);
      const imcVal = imcNum.toFixed(1);

      // 3. Determinación de categoría y posición dinámica de la flecha en la barra
      let categoria = '';
      let porcentajeFlecha = 37.5;

      if (imcNum < 18.5) {
        categoria = 'Bajo Peso';
        // Mapea valores de IMC < 18.5 en el rango 0% a 25% de la barra
        porcentajeFlecha = Math.max(5, Math.min(22, (imcNum / 18.5) * 25));
      } else if (imcNum >= 18.5 && imcNum <= 24.9) {
        categoria = 'Normal';
        // Mapea valores en el rango 25% a 50% de la barra
        porcentajeFlecha = 25 + ((imcNum - 18.5) / (24.9 - 18.5)) * 25;
      } else if (imcNum >= 25.0 && imcNum <= 29.9) {
        categoria = 'Sobrepeso';
        // Mapea valores en el rango 50% a 75% de la barra
        porcentajeFlecha = 50 + ((imcNum - 25.0) / (29.9 - 25.0)) * 25;
      } else {
        categoria = 'Obesidad';
        // Mapea valores en el rango 75% a 95% de la barra
        porcentajeFlecha = 75 + Math.min(20, ((imcNum - 30.0) / 10.0) * 20);
      }

      // 4. Cálculo de Tasa Metabólica Basal (TMB) / Kcal
      let tmb = (genero === 'Hombre')
        ? 66.5 + (13.75 * peso) + (5.003 * estatura) - (6.775 * edad)
        : 655.1 + (9.563 * peso) + (1.85 * estatura) - (4.676 * edad);

      const kcal = Math.round(tmb * actividad);

      // 5. Mover la flecha indicadora
      const indicador = document.getElementById('indicador-flecha');
      if (indicador) {
        indicador.style.left = `${porcentajeFlecha}%`;
      }

      // 6. Actualizar y mostrar el cuadro de resultados si existen las etiquetas
      const resImc = document.getElementById('res-imc');
      const resCat = document.getElementById('res-cat');
      const resKcal = document.getElementById('res-kcal');

      if (resImc) resImc.textContent = imcVal;
      if (resCat) resCat.textContent = categoria;
      if (resKcal) resKcal.textContent = `${kcal} kcal/día`;

      const boxRes = document.getElementById('box-resultados');
      if (boxRes) boxRes.classList.remove('hidden');
    });
  }
});