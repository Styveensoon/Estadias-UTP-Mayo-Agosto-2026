# Feedback del proyecto — WellDataLab (UTP)

Revisión hecha sin modificar nada del código. El proyecto tiene una base sólida (buena organización de carpetas, contenido bien documentado, uso de CSS Grid, JS modular por tema). Esto es una lista de mejoras, no una lista de errores graves: nada de esto bloquea la entrega, pero subirá mucho el nivel de pulido.

---

## 1. Bugs concretos que sí conviene arreglar

Estos no son opinión, son cosas que están rotas y se pueden verificar directamente:

- **Imagen rota en el inicio (`index.html`, línea 101):** el `<img>` del corazón apunta a `Resources/home/corazon.png`, pero ese archivo **no existe** en `Resources/home/` (ahí solo están `banner-comida.jpg`, `castor.png`, `castor-sabio.png`, `cereales.jpg`, `grasas.jpg`, `leguminosas.jpg`, `origen-animal.jpg`, `verduras.jpg`). Van a ver el ícono de "imagen rota" del navegador junto al post-it de la calculadora de IMC.
- **Imagen rota en la calculadora (`Views/calculadora.html`, línea 23):** el logo de la UTP apunta a `../Resources/logo-utp.png.jpeg` (con doble extensión), cuando el archivo real es `logo-utp.png`. Curiosamente, en las demás vistas (`quienes_somos.html`, `temas.html`, `tu_opinion.html`) ya corrigieron esto y hasta dejaron el comentario "Logo corregido sin la extensión doble .jpeg" — se les quedó pendiente arreglarlo en `calculadora.html`.
- **El menú hamburguesa probablemente no abre bien en móvil.** `Js/main.js` tiene **dos bloques `DOMContentLoaded` separados** (líneas 1–83 y 325–360) que hacen básicamente lo mismo: ambos agregan un listener de `click` al mismo botón `#nav-toggle` que hace `navMenu.classList.toggle("active")`. Como los dos se disparan en el mismo clic, el toggle se aplica dos veces y se cancela a sí mismo — el menú puede quedarse sin abrir (o abrirse y cerrarse en el mismo clic) dependiendo del navegador. Vale la pena que unifiquen esto en un solo bloque; ahora mismo parece que el archivo se pegó dos veces por error.
- **Enlace "Tu opinión" incompleto en `calculadora.html`:** en esa vista el link quedó como `href="#"` (línea 58), mientras que en todas las demás páginas ya apunta correctamente a `tu_opinion.html`. Es fácil pasarlo por alto porque no truena, solo no lleva a ningún lado.
  - Nota aparte: el **formulario** de `tu_opinion.html` (las 15 preguntas) por ahora solo hace `preventDefault()` y muestra el mensaje de "¡Gracias!" — no manda las respuestas a ningún lado todavía (ni backend, ni correo, ni hoja de cálculo). Esto ya se sabe que falta y no es urgente, solo lo confirmo para que quede documentado que es trabajo pendiente y no un bug.
- **El submenú "Temas" no dice lo mismo en todas las páginas.** El ítem con `data-topic="4"` se llama *"El Plato del Buen Comer"* en `index.html`, pero *"Herramientas de salud (IMSS)"* en `calculadora.html`, `quienes_somos.html`, `temas.html` y `tu_opinion.html`. Por el contenido real de `Js/temas/tema4.js`, el nombre correcto es el del Plato del Buen Comer — conviene igualar el texto en todas las vistas para que no parezca que el menú "miente" según la página en la que estés.

---

## 2. Sobre la calculadora de IMC (funcionalidad)

Buenas noticias: **la lógica del cálculo está bien.** Revisé `Js/calculadora.js` y la fórmula de IMC (peso / estatura²) y de Harris-Benedict para las kilocalorías están correctas, y el manejo de errores (validar peso/estatura antes de calcular) ya existe. No se rompe con valores normales.

Dos detalles menores que pueden pulir, no son urgentes:
- La barra de colores (bajo peso / normal / sobrepeso / obesidad) tiene los tramos fijos en el CSS (20%/30%/25%/25%), pero la flecha se posiciona con otra fórmula en JS. Para valores extremos de IMC (por ejemplo 45 o 12) la flecha puede quedar visualmente un poco desalineada del tramo de color que le corresponde, porque no comparten la misma escala numérica. No es grave, pero si quieren que quede perfecto, conviene que la posición de la flecha y los porcentajes del gradiente se calculen con la misma función.
- No hay validación de rangos "razonables" (alguien podría poner 999 kg o 1 cm de estatura y el cálculo lo acepta sin avisar). Es opcional, pero para un proyecto institucional de salud puede valer la pena poner límites sensatos.

---

## 3. La barra de logos + navbar: el espacio blanco feo (PRIORIDAD)

Este es el problema más visible del sitio y el más fácil de explicar con un dibujo.

Ahora mismo el encabezado son **dos barras separadas, apiladas una sobre otra**:

```
┌──────────────────────────────────────────────────────────┐
│  [Logo UTP]                              [Logo WellData] │  <- barra BLANCA (.top-header)
├──────────────────────────────────────────────────────────┤
│        Inicio   Quiénes somos   Temas ▾   ...             │  <- barra VERDE (.navbar)
└──────────────────────────────────────────────────────────┘
```

- La barra de arriba es blanca (`.top-header { background-color: #ffffff }`) y solo tiene los dos logos, uno pegado a cada extremo (`justify-content: space-between`).
- La barra de abajo es verde y tiene los links, pero centrados (`justify-content: center`), dejando **espacio vacío enorme a los lados** en pantallas anchas.
- Como son dos bloques distintos, uno blanco y uno verde, el corte entre ambos se ve como un "escalón" — de ahí la sensación de espacio blanco feo / cosa desarmada.

**Lo que se ve mejor (y es el patrón estándar de cualquier sitio institucional moderno):** una sola barra, un solo color de fondo, con el logo pegado a la izquierda y los links a la derecha (o centrados, pero en la MISMA barra que el logo):

```
┌──────────────────────────────────────────────────────────┐
│ [Logo UTP][Logo WellData]   Inicio  Quiénes somos  Temas ▾│  <- UNA sola barra (verde o blanca)
└──────────────────────────────────────────────────────────┘
```

### Cómo se resolvería (a grandes rasgos, sin meterme a picar código):
- Fusionar `.top-header` y `.navbar` en un solo contenedor (`.header-site`) con un único `background-color`.
- Ese contenedor usa `display: flex; justify-content: space-between;` con **dos hijos**:
  - Izquierda: los dos logos, uno junto al otro (`display:flex; gap: 1rem`).
  - Derecha (o centro): el `<ul class="nav-menu">` con los links.
- Ya no haría falta el `<div class="top-header">` como bloque independiente — todo vive dentro de una sola `<nav>`.
- En móvil (donde ya existe el botón de hamburguesa) esto no cambia casi nada: los logos se quedan chiquitos a la izquierda y el botón de menú a la derecha, en la misma fila.

Con este solo cambio (que es más reacomodo de HTML/CSS que código nuevo) el header deja de sentirse "de los 90" — es probablemente el cambio con mayor impacto visual de todo este feedback.

---

## 4. Sobre el diseño visual (la parte que mencionan que "se ve como de los 90")

Entiendo por qué da esa sensación — no es que esté mal hecho, es una combinación de decisiones muy noventeras que juntas se notan:

- **Tipografía del sistema operativo:** todo el sitio usa `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`. Es la pila de fuentes por defecto de Windows de hace 20 años. Con solo cambiar a una fuente de Google Fonts (Inter, Poppins, Manrope, Nunito Sans... cualquiera de esas ya se ve "2026") cambia radicalmente la percepción, sin tocar nada más del layout.
- **Verde institucional plano (`#008744`) en toda la navbar sin variación.** Un solo color sólido, sin gradiente ni sombra, en un bloque tan grande, es lo que más recuerda a sitios viejos. No hace falta exagerar, pero un leve gradiente, o una sombra sutil debajo de la navbar (`box-shadow`), le da profundidad y modernidad inmediata.
- **Mezcla de iconos Font Awesome + emojis nativos (📌, ⚖️, 💧, 🥑, 🛑...) como si fueran parte del sistema de iconos.** Los emojis se ven distinto en cada sistema operativo (Windows, Mac, Android muestran versiones diferentes del mismo emoji), lo cual rompe la consistencia visual. Sugerencia: usar Font Awesome (que ya está cargado) para TODOS los íconos, y reservar el emoji como máximo para el texto de los mensajes del castor (ahí sí da un toque simpático y no rompe el layout).
- **Post-its con `rotate()` y sombra dura** (la nota amarilla de "Calcula tu IMC aquí"): el efecto de nota de papel pegada con sombra fuerte y rotación de 3 grados es un recurso muy de "clipart de PowerPoint 2005". Si quieren mantener el tono amigable/mascota, se puede lograr con un diseño de tarjeta plano con un badge o ícono, en vez de simular una nota física.
- **Navbar centrada con separación fija (`gap: 2.5rem`) sin usar el espacio disponible:** en pantallas anchas los links quedan apretados en el centro dejando mucho espacio vacío a los lados. Common pattern moderno: logo/marca a la izquierda del propio navbar (o dejar los logos arriba como ya hacen) y los links distribuidos con `justify-content: space-between` o con un contenedor de ancho máximo tipo `max-width: 1200px; margin: 0 auto`.
- **Dependencia 100% de una CDN externa para los íconos** (Font Awesome vía `cdnjs.cloudflare.com`). Funciona, pero si en la presentación no hay internet o la CDN falla, todos los íconos de menú y flechitas desaparecen. Para un proyecto institucional que probablemente se presente en un salón, vale la pena tener un plan B (íconos SVG locales o descargar el paquete de Font Awesome al proyecto).

### Sugerencias concretas de "siguiente nivel" (opcionales, no urgentes)
- Agregar una transición/animación suave al abrir el dropdown de "Temas" (ahora aparece de golpe con `display: none/block`; con una transición de opacidad + `transform: translateY()` de 200ms se ve mucho más pulido).
- Sombra sutil (`box-shadow`) debajo del header fijo para separarlo visualmente del contenido al hacer scroll.
- Revisar el contraste del footer (texto gris `#777777` sobre fondo `#f4f4f4`) — es válido pero está en el límite de lo recomendado para accesibilidad (WCAG AA) en textos pequeños como el copyright.

---

## 5. En resumen

Lo que hay que arreglar sí o sí (5 minutos cada uno):
1. Quitar/corregir la imagen `corazon.png` en `index.html`.
2. Corregir `logo-utp.png.jpeg` → `logo-utp.png` en `calculadora.html`.
3. Eliminar el bloque de JS duplicado en `main.js` (probar que el menú hamburguesa abra bien después).
4. Arreglar el link "Tu opinión" en `calculadora.html`.
5. Igualar el nombre del tema 4 en todos los menús.

Lo que le daría un salto grande de percepción visual sin rehacer nada (una tarde de trabajo):
- **Fusionar la barra de logos con la navbar en una sola barra** (logos a la izquierda) — ver sección 3, es el cambio de mayor impacto.
- Cambiar la tipografía a una fuente moderna vía Google Fonts.
- Unificar el sistema de íconos (solo Font Awesome, emojis solo en textos del castor).
- Suavizar la navbar (sombra, o gradiente sutil) y repensar el post-it de la calculadora como tarjeta plana.

Pendiente ya conocido, no urgente:
- Conectar el formulario de `tu_opinion.html` a un destino real (backend, hoja de cálculo, correo, etc.) — hoy solo simula el envío en el navegador.

El contenido, la estructura de datos por tema y la lógica de la calculadora están bien resueltos — el "salto" que falta es sobre todo visual/tipográfico, no estructural. Buen trabajo en general.
