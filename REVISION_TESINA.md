# Revisión de la tesina vs. código real del proyecto

**Documento revisado:** `UTP015170_ANGEL YAHIR AGUILAR VAZQUEZ.docx` (archivo sin trackear en git, presente solo en el directorio de trabajo).
**Código comparado:** rama `frontend`, commit `2ea0603` — *"Estructura completa actualizada: navegación, estilos e imágenes"* (25-jul-2026), la versión más reciente entre todas las ramas del repositorio.

## 1. Resumen general

La tesina describe correctamente el **propósito, alcance y metodología** del proyecto WellDataLab (plataforma web de salud/nutrición: calculadora de IMC, "La Jarra del Buen Beber", "El Plato del Bien Comer", módulo "¿Sabías Qué?", "Tu Opinión", etc.). El contenido conceptual (Capítulos 1, 2 y las conclusiones) es coherente y no depende del código. Sin embargo, el **Capítulo 3 (Desarrollo Técnico)**, que sí describe archivos, clases y variables concretas, tiene varias discrepancias con el estado real del código.

## 2. Discrepancias encontradas

### 2.1 Estructura de archivos no coincide con el repositorio real

La tesina (línea ~1054-1070) describe este árbol:

```
├── css/Style_components.css
├── js/
│   ├── main.js
│   ├── imc.js
│   ├── jarra.js
│   └── plato.js
├── assets/img/
├── index.html
├── opinion.html
```

Estructura real en el repo:

```
├── Styles/Style_components.css
├── Js/
│   ├── main.js
│   ├── calculadora.js      (no "imc.js")
│   ├── sabias_que.js
│   ├── temas.js             (contiene la lógica de la Jarra Y el Plato juntas)
│   ├── tu_opinion.js        (huérfano, ver 2.4)
│   └── temas/tema1.js … tema8.js
├── Resources/                (no "assets/img/")
├── index.html
├── Views/calculadora.html, quienes_somos.html, sabias_que.html, temas.html, tu_opinion.html
```

- No existen `imc.js`, `jarra.js` ni `plato.js` como archivos independientes; toda esa lógica está unificada en `calculadora.js` (IMC/TMB) y `temas.js` (Jarra y Plato).
- No existe `opinion.html` en la raíz; el módulo vive en `Views/tu_opinion.html`.
- Las carpetas usan mayúscula inicial (`Styles/`, `Js/`, `Views/`, `Resources/`), no minúsculas como en el documento.

### 2.2 Color institucional: tres códigos distintos para "el mismo verde"

El documento es inconsistente **consigo mismo** y con el código:

| Sección de la tesina | Código citado | ¿Existe en el CSS real? |
|---|---|---|
| Resumen / Cap. 1 ("La Empresa/Institución") | `#008A45` | ❌ No aparece en ningún archivo |
| Cap. 3 (Sistema de Colores) | `#008744` | ✅ Sí, es el verde institucional más usado (12 apariciones) |
| Cap. 3 / `:root` | `--primary-color: #2e7d32` | ✅ Coincide exactamente con el CSS real |
| Cap. 4 (Resultados) | vuelve a citar `#008A45` como color primario del sistema de diseño | ❌ |

El color que la tesina presenta como "el" verde UTP (`#008A45`) no existe en el proyecto; los verdes reales son `#008744` y `#2e7d32`.

### 2.3 Clase `.puntero-flecha` no existe — el nombre real es `.arrow-indicator`

La tesina menciona `.puntero-flecha` como el marcador que se desplaza sobre la barra de resultados del IMC (aparece repetido en Resumen, Cap. 3 y Cap. 4). En el código real:

- La clase CSS es `.arrow-indicator` (`Styles/Style_components.css:416`).
- El elemento se referencia en JS por id: `document.getElementById('indicador-flecha')` (`Js/calculadora.js:55`).

`.puntero-flecha` no aparece en ningún archivo del repositorio.

### 2.4 Archivo huérfano: `Js/tu_opinion.js`

Existe el archivo `Js/tu_opinion.js` (5.2 KB) pero **no está enlazado en ningún HTML**. El formulario real de `Views/tu_opinion.html` usa un `<script>` inline al final del archivo que reimplementa el mismo comportamiento (`preventDefault`, toggle de `.hidden`, mostrar `.thankyou-message`). La tesina no menciona esta duplicidad/código muerto.

## 3. Lo que sí coincide correctamente

- Variables CSS en `:root` (`--primary-color: #2e7d32`, `--primary-hover: #1b5e20`, `--secondary-color: #0288d1`, `--bg-light: #f8fafc`, `--shadow`, `--transition: all 0.3s ease`) coinciden exactamente con `Styles/Style_components.css:1505-1515` (el documento omite `--radius: 12px`, que también existe).
- Las clases de componentes descritas sí existen en el código: `.jarra-layer`, `.jarra-wrapper`, `.pie-slice`, `.plato-wrapper`, `.postit-facts`, `.thankyou-message`, `.fact-card`, `.feature-card`, `.ejercicio-grid`, `.opinion-container`, `.nav-toggle`, `.topic-selector`, `.grid-5-col`, ilustraciones del castor.
- El cálculo de **Tasa Metabólica Basal (TMB)** que menciona la Conclusión Personal sí está implementado en `Js/calculadora.js`.
- Breakpoints responsive (1200/1024/900/768/640px) y la metodología de ramas por feature (Backend/Frontend/Test/Revisions/main) descritas son consistentes con el flujo de trabajo real observado en el repositorio.

## 4. Nota sobre el propio repositorio

De forma independiente al contenido de la tesina: el repositorio tiene ramas remotas `Frontend` y `frontend` (y `Backend`/`main`) que difieren solo en mayúsculas y apuntan a commits distintos. En Windows esto causa colisión de referencias locales — vale la pena limpiarlo antes de seguir integrando trabajo, ya que puede confundir sobre "cuál es la versión real".

## 5. Funcionalidad faltante y bugs encontrados (segunda pasada)

Tras la comparación inicial, se buscó específicamente objetivos/alcances de la tesina que **no tuvieran ninguna implementación** (no solo diferencias de nombre). Se encontraron y se corrigieron:

- **Bug de integración real en `Js/temas.js`**: el archivo tenía dos manejadores `DOMContentLoaded` duplicados y en conflicto. El router de clics del menú "Temas" solo reconocía los temas 1–6; los temas 7 ("Videos de recetas") y 8 ("Marco normativo") siempre caían en "Tema en construcción" al hacer clic, aunque el contenido de "Marco Normativo" ya estaba escrito (función `getTema8FallbackHTML`) pero nunca se invocaba desde el clic. Se unificó el router para que soporte los temas 7, 8 y 9, y se eliminó el listener duplicado.
- **"Videos de recetas" (tema 7) estaba vacío**: se implementó como "Recetas Fáciles y Saludables" con 5 recetas completas (ingredientes + preparación), ya que no se puede insertar video real de terceros sin una fuente verificada.
- **"Comparador dinámico de alimentos"**: mencionado como pieza central en Objetivos, Alcances e Hipótesis, pero completamente ausente del código. Se agregó como nuevo tema 9 en el menú "Temas" de las 6 páginas: selecciona dos alimentos de una lista de 10 y compara energía/azúcares/sodio/fibra con el mismo estilo de semáforo nutricional (verde/naranja/rojo) que ya usa el resto del sitio, y muestra un veredicto de cuál es más saludable.
- **Calculadora incompleta**: el objetivo específico pide IMC + requerimiento hídrico diario + estimación de masa muscular; solo estaba implementado el IMC (y TMB/kcal). Se agregaron ambos cálculos a `Js/calculadora.js` y `Views/calculadora.html` (agua: 35 ml/kg + ajuste por actividad; masa muscular: fórmula de Lee et al. 2000, aclarada como estimación aproximada, igual que el resto de la calculadora).
- **Bug menor no relacionado**: `Views/calculadora.html` cargaba el logo de la UTP con una extensión incorrecta (`logo-utp.png.jpeg`), rompiendo la imagen institucional. Corregido.

Todo se verificó end-to-end con un navegador headless (Playwright): se navegó a cada tema nuevo, se interactuó con el comparador y la calculadora, y se confirmó cero errores de consola.

**Lo que se dejó fuera** (no implementado, para no exceder el alcance): registro de usuarios/historial de peso, videoteca con video real embebido, gamificación y la API nutricional externa — la propia tesina los lista explícitamente en "Trabajos Futuros", por lo que no se tratan como faltantes sino como fuera de alcance de esta estadía.

## 6. Recomendación

Si la tesina va a entregarse tal cual, conviene corregir antes de la entrega final:
1. El árbol de archivos del Capítulo 3 (nombres reales: `Styles/`, `Js/calculadora.js`, `Js/temas.js`, `Views/`, `Resources/`).
2. Unificar el código de color institucional a uno solo (`#008744`, que es el que realmente predomina en el CSS) en vez de citar `#008A45`.
3. Reemplazar toda mención de `.puntero-flecha` por `.arrow-indicator`.
4. Opcional: mencionar o resolver el archivo huérfano `tu_opinion.js`.
