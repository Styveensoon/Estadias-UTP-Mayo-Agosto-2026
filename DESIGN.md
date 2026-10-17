---
name: Cheficas UTP
description: Educación nutricional y autocuidado de la UTP, servida sobre un mantel verde y un Plato del Bien Comer interactivo.
colors:
  mantel: "#008744"
  mantel-hondo: "#006b35"
  amarillo: "#f2b705"
  rojo: "#d62839"
  ribete-verduras: "#16a34a"
  ribete-leguminosas: "#e8590c"
  ribete-grasas: "#9a6a00"
  tinta-verde: "#15803d"
  tinta-naranja: "#c2410c"
  tinta-azul: "#0369a1"
  tinta-ocre: "#8a5a00"
  error-texto: "#b3162a"
  tinta: "#0f2a1c"
  tinta-suave: "#3f5648"
  tinta-placeholder: "#52665a"
  tinta-clara: "#dfe9e2"
  tinta-pie: "#b9c9be"
  plato: "#ffffff"
  pozo: "#eef3ee"
  filete: "#dfe8e1"
  filete-ficha: "#e3ebe5"
  filete-pozo: "#d4e0d7"
  borde-hover: "#cfdcd2"
  castor-pelo: "#9a5b2e"
  castor-sombra: "#6e3f1f"
  castor-hocico: "#e2b07a"
  mandil: "#f8f3ea"
typography:
  display:
    fontFamily: "Poppins, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 5.2vw, 5rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  display-portada:
    fontFamily: "Poppins, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 4.8vw, 4.4rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Poppins, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.2vw, 2.8rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline-tema:
    fontFamily: "Poppins, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title-lg:
    fontFamily: "Poppins, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.2vw, 1.8rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Poppins, Segoe UI, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 600
    lineHeight: 1.3
  lead:
    fontFamily: "Poppins, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.02rem, 1.3vw, 1.18rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Poppins, Segoe UI, system-ui, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: "Poppins, Segoe UI, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Poppins, Segoe UI, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 500
    lineHeight: 1.3
  numeral:
    fontFamily: "Poppins, Segoe UI, system-ui, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\""
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  pill: "999px"
spacing:
  gap-sm: "0.75rem"
  gap-md: "1rem"
  gap-lg: "1.5rem"
  gutter: "clamp(16px, 5vw, 5rem)"
  section-y: "clamp(3.5rem, 9vh, 6rem)"
  portada-y: "clamp(3rem, 9vh, 5.5rem)"
  header-alto: "76px"
  control: "52px"
  control-chip: "44px"
components:
  button-primary:
    backgroundColor: "{colors.mantel}"
    textColor: "{colors.plato}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 1.5rem"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.mantel-hondo}"
    textColor: "{colors.plato}"
  button-blanco:
    backgroundColor: "{colors.plato}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "0 1.6rem"
    height: "52px"
  input-campo:
    backgroundColor: "{colors.pozo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "0 2.6rem 0 0.9rem"
    height: "52px"
  input-campo-focus:
    backgroundColor: "{colors.plato}"
    textColor: "{colors.tinta}"
  chip-filtro:
    backgroundColor: "{colors.pozo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "44px"
  chip-filtro-activo:
    backgroundColor: "{colors.mantel}"
    textColor: "{colors.plato}"
  chip-categoria:
    backgroundColor: "{colors.tinta-verde}"
    textColor: "{colors.plato}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.75rem"
  ficha:
    backgroundColor: "{colors.plato}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.xl}"
    padding: "clamp(1.25rem, 2.4vw, 1.75rem)"
  portada:
    backgroundColor: "{colors.mantel}"
    textColor: "{colors.plato}"
    padding: "clamp(3rem, 9vh, 5.5rem) clamp(16px, 5vw, 5rem) clamp(2.5rem, 7vh, 4.5rem)"
  seccion-pozo:
    backgroundColor: "{colors.pozo}"
    textColor: "{colors.tinta}"
    padding: "clamp(3.5rem, 9vh, 6rem) clamp(16px, 5vw, 5rem)"
  nav-link:
    textColor: "{colors.tinta}"
    padding: "0.5rem 0"
  nav-link-hover:
    textColor: "{colors.mantel}"
  numero-grupo:
    backgroundColor: "{colors.plato}"
    textColor: "{colors.tinta}"
    size: "2.75rem"
  globo-castor:
    backgroundColor: "{colors.plato}"
    textColor: "{colors.tinta}"
    padding: "0.85rem 1rem"
  pie:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.tinta-clara}"
    padding: "clamp(2.5rem, 6vh, 3.5rem) clamp(16px, 5vw, 5rem) 1.5rem"
---

# Design System: Cheficas UTP

## Overview

**Creative North Star: "El Mantel y el Plato"**

Cheficas UTP se ve como una mesa servida vista desde arriba. El verde de identidad (#008744) es el mantel: un campo plano que llega hasta los bordes y sirve de suelo a la portada de cada página y a las secciones importantes. Encima va el plato blanco, que es donde vive todo lo que se lee o se usa (fichas, formularios, globos de diálogo, el video destacado). Los cinco grupos del Plato del Bien Comer aportan las tintas fuertes del sistema, y siempre como ribete, número o indicador, nunca como relleno de fondo.

La densidad es generosa y editorial: titulares grandes en Poppins 800 con tracking cerrado, texto en Poppins 400/500 y cifras tabulares. Las listas son índices separados por filetes finos (temas, herramientas, recursos, datos curiosos, preguntas de la encuesta), no filas de tarjetas iguales. El castor, Cheficas UTP, es el guía de la casa: aparece junto a la información con un globo de diálogo blanco y habla en segunda persona. El mismo plato fotográfico del Inicio se reutiliza en el tema 4.

Todas las páginas comparten el mismo mundo. Las variables y los componentes comunes viven en `Styles/sitio.css`, declarados sobre `body.sitio`; cada página añade su hoja propia (`inicio.css`, `quienes_somos.css`, `temas.css`, `sabias_que.css`, `calculadora.css`, `videos.css`, `recursos.css`, `tu_opinion.css`). `Styles/Style_components.css` solo sobrevive como base heredada de los componentes de tema que dibuja `Js/temas.js`, y `temas.css` los reajusta al sistema; no es referencia visual.

**Key Characteristics:**
- Mantel verde plano a sangre como suelo (portada de cada página, secciones de cierre); blanco como superficie de trabajo.
- Tintas de los grupos alimenticios y de semáforo como acento funcional (ribetes, números, escalas, categorías).
- Poppins autoalojada (400, 500, 600, 800); 800 para titulares y numerales.
- Índices con filetes de 1px en lugar de cuadrículas de tarjetas.
- Sombras teñidas de verde profundo; nada de negro neutro.
- Marca e ilustración planas en SVG propio: plato, logotipo y castor.
- Movimiento corto de salida suave; respeta `prefers-reduced-motion`.
- Sin degradados ni pasteles.

## Colors

Un verde institucional dominante, una tinta verde casi negra, las tintas puras del Plato del Bien Comer y un juego de tintas oscuras de semáforo; los neutros son blancos con un ligero matiz verde.

### Primary
- **Verde Mantel** (`--mantel`): el color de identidad. Es el fondo a sangre de la portada de cada página, del primer bloque del Inicio, de la calculadora y de las secciones `seccion-mantel`; el relleno de los botones primarios, del filtro activo, de la opción elegida en la encuesta y del tema activo en el índice lateral; el subrayado activo del menú, los numerales de índice, la barra de progreso, el borde de los campos con foco, el `caret-color` y la barra de desplazamiento. El texto blanco sobre él alcanza 4.62:1 (AA).
- **Verde Hondo** (`--mantel-hondo`): hover de los botones verdes, enlaces con flecha sobre fondo claro, numerales del índice de temas, títulos de principios en ¿Quiénes somos?, fuente de cada recurso, canal de cada video y texto de los ítems activos del menú desplegable.

### Secondary
- **Amarillo Cereal** (`--amarillo`): sector de cereales. Además es el anillo de foco sobre mantel y tinta, el color de selección de texto, el subrayado hover del pie, el tramo "bajo peso" de la escala de IMC y el semáforo "moderado". Lleva texto `--tinta`, nunca blanco.
- **Rojo Origen Animal** (`--rojo`): sector de origen animal, tramo y categoría "obesidad", borde de campo inválido y etiqueta PDF de los recursos.

### Tertiary
Tintas con significado. Las de ribete son los colores del plato; las oscuras son sus versiones para texto o para píldoras con texto blanco pequeño.
- **Verde Verduras** (`ribete-verduras`): sector 1 del plato y tramo "peso normal" de la escala.
- **Naranja Leguminosa** (`ribete-leguminosas`): sector 3 y tramo "sobrepeso". Se ajustó desde #f2711c para que el numeral blanco llegue a 3:1.
- **Ocre Grasas** (`ribete-grasas`): sector 5. Se ajustó desde #b7791f por la misma razón.
- **Verde Semáforo** (`tinta-verde`): categoría "peso normal" en píldora y tabla, semáforo "bajo" y categoría Nutrición en ¿Sabías qué?.
- **Naranja Semáforo** (`tinta-naranja`): categoría "sobrepeso", categoría Ejercicio y el alimento B del comparador.
- **Azul Hidratación** (`tinta-azul`) y **Ocre Hábitos** (`tinta-ocre`): solo como tintas de categoría en ¿Sabías qué?.
- **Rojo Error** (`error-texto`): texto de error de formulario (6.85:1 sobre blanco), semáforo "alto", aviso del tema 3 y categoría Cuerpo.

Las tintas de ribete se escriben en hex en el CSS y en los `data-color` del plato; las de categoría y comparador son variables locales (`--cat-*` en `.pagina-sabias`, `--comp-a`/`--comp-b` en `.comparador`).

### Neutral
- **Tinta** (`--tinta`): todo el texto sobre blanco, fondo del pie, del enlace "Saltar al contenido" y del marco de video, y anillo de foco sobre superficies blancas.
- **Tinta Suave** (`--tinta-suave`): texto secundario, leads de sección, prosa, etiquetas de campo, unidades, notas y descripciones (7.97:1 sobre blanco).
- **Tinta Placeholder** (`tinta-placeholder`): texto de ejemplo en campos y área de texto.
- **Tinta Clara** (`tinta-clara`): párrafos del pie sobre `--tinta`; **Tinta Pie** (`tinta-pie`): línea de derechos.
- **Plato** (`--plato`): superficie de lectura y trabajo (encabezado, fichas, globo del castor, secciones `seccion`, menú desplegable).
- **Pozo** (`--pozo`): el fondo hundido. Campos, filtros y opciones en reposo, hover de filas e ítems de menú, secciones `seccion-pozo`, bloques de fórmulas, veredicto y agradecimiento.
- **Filete** (`filete`): línea de 1px de los índices sobre blanco. **Filete Ficha** (`filete-ficha`) separa partes dentro de fichas, preguntas y barras fijas; **Filete Pozo** (`filete-pozo`) es el filete sobre `--pozo`. Sobre el mantel, el filete es blanco al 28–30%; en el pie, al 14%.
- **Borde Hover** (`borde-hover`): borde de 2px que aparece en hover sobre campos, filtros, opciones y segmentos; también el contorno interior de la etiqueta "Web" de recursos.

### Ilustración
El logotipo y el castor son SVG propios en `Resources/marca/`, de estilo plano sin trazos ni degradados. El castor usa **Pelo** (`castor-pelo`), **Sombra** (`castor-sombra`), **Hocico** (`castor-hocico`), un **Mandil** crema (`mandil`) y una pañoleta en `--mantel` / `--mantel-hondo`. El logotipo es la marca del plato (círculo `--mantel`, plato blanco y tres sectores verduras/cereal/leguminosas) seguida de "Cheficas" en `--tinta` y "UTP" en `--mantel`, Poppins 800 trazada; la versión clara para el pie va sobre `--tinta`.

### Named Rules
**La Regla del Mantel.** El verde `--mantel` se usa como campo plano a sangre o como relleno de un control, nunca en degradado ni en versión pastel. Las secciones alternan mantel, plato y pozo, y el pie cierra en tinta.

**La Regla de la Tinta de Grupo.** Las tintas del plato y del semáforo son información (qué grupo, qué rango, qué categoría) y se usan como ribete, numeral, tramo de escala, punto o píldora. Para texto blanco pequeño se usan las versiones oscuras (`tinta-verde`, `tinta-naranja`, `error-texto`); `ribete-verduras` y `ribete-leguminosas` con texto blanco solo cumplen en numerales grandes y gráficos (3:1).

**La Regla del Foco Amarillo.** Sobre mantel o tinta, el foco visible es amarillo; sobre blanco o pozo es tinta. Siempre 3px con 3px de separación.

## Typography

**Display Font:** Poppins (con Segoe UI, system-ui, sans-serif), autoalojada en `Resources/fonts` con `font-display: swap`; el peso 800 se precarga.
**Body Font:** Poppins (misma familia).

**Character:** una sola familia geométrica y amable que trabaja por contraste de peso: 800 apretado para titulares y numerales, 400/500 abiertos para leer. Todas las cifras son tabulares (`font-variant-numeric: tabular-nums` en `.sitio`).

### Hierarchy
- **Display** (800, clamp(2.6rem, 5.2vw, 5rem), 1.02, -0.03em): titular del Inicio sobre el mantel, máximo ~11ch.
- **Display Portada** (800, clamp(2.4rem, 4.8vw, 4.4rem), 1.04, -0.03em): `h1` de la portada de cada página y de la calculadora, máximo 16ch.
- **Headline** (800, clamp(1.9rem, 3.2vw, 2.8rem), 1.1, -0.02em): encabezado de cada sección (`titulo-seccion`). Los principios de ¿Quiénes somos? usan la misma voz un poco más chica en `--mantel-hondo`.
- **Headline Tema** (800, clamp(2rem, 3.4vw, 3rem), 1.08, -0.02em): `h1` de cada tema de salud.
- **Title Lg** (800, clamp(1.4rem, 2.2vw, 1.8rem), 1.2, -0.01em): título de la nota del dato del día y del video destacado.
- **Title** (600, 1.05–1.1rem, 1.3): título de fila en los índices, de dato, de video y de recurso.
- **Lead** (400, clamp(1.02rem, 1.3vw, 1.18rem), 1.6): frase bajo el titular de portada, máximo 52ch. El lead de sección va a 1.02rem/1.65 en `--tinta-suave`.
- **Body** (400, 1.02rem, 1.65–1.7): prosa (`.prosa`) y descripciones de tema, máximo 68ch.
- **Body Sm** (400, 0.92–0.94rem, 1.5): descripciones de fila, texto del pie, estados vacíos.
- **Label** (500, 0.85rem): etiquetas de campo, leyendas de segmento, progreso; los enlaces del menú usan 500 a 0.92rem y las categorías 600 a 0.8rem.
- **Numeral** (800, 1.4–1.6rem, 1, -0.02em, tabular): número de fila en índices, de pregunta y de dato. Las lecturas de la calculadora suben a 2.2rem y el IMC a 3rem.

### Named Rules
**La Regla del Número.** Todo lo que es secuencia o cantidad (grupos 1–5, temas, preguntas, datos, %, IMC, calorías) se escribe en numeral Poppins 800. El número sustituye al ícono.

**La Regla del Equilibrio.** `h1` y `h2` llevan `text-wrap: balance` y los párrafos `text-wrap: pretty`.

## Layout

- **Página tipo:** encabezado fijo, portada de mantel (`portada`, dos columnas 1.1fr / 0.9fr con el texto abajo y el arte a la derecha, o `portada-sola` a una columna), secciones que alternan plato y pozo, y pie en tinta. La portada puede llevar castor, foto, nota del día, video destacado o un índice de anclas.
- **Retícula asimétrica de dos columnas**, nunca mitades exactas: Inicio 0.95fr / 1.05fr, ¿Quiénes somos? 0.8fr / 1.2fr, recursos 0.75fr / 1.25fr con la cabeza de grupo fija, videos 0.8fr / 1.2fr en portada. El separador entre columnas es clamp(1.5rem, 4–5vw, 4–5rem).
- **Temas:** índice lateral fijo de 250px y área de tema; en ≤900px el índice se vuelve una fila deslizable de píldoras bajo el encabezado.
- **Listas largas:** ¿Sabías qué? reparte los datos en columnas CSS (`columns: 3 300px`); videos usa `repeat(auto-fill, minmax(280px, 1fr))`; la encuesta es una sola columna de 46rem centrada con barra de progreso fija.
- **Medianil horizontal** `gutter` en todas las secciones; en celular baja a 16px.
- **Ritmo vertical** con `section-y`; la portada usa `portada-y` arriba y clamp(2.5rem, 7vh, 4.5rem) abajo. La cabeza de sección mide hasta 62ch y deja clamp(2rem, 5vh, 3rem) antes del contenido.
- **Encabezado fijo** de 76px (64px en ≤900px). `scroll-padding-top` compensa su altura.
- **Elementos pegajosos:** el plato del Inicio y del tema 4, la cabeza del índice de temas, el índice lateral, la cabeza de cada grupo de recursos y la barra de progreso de la encuesta. Se sueltan en ≤900px salvo el progreso y el índice de temas.
- **Desborde intencional:** el plato del Inicio se corta por el borde derecho y las bandas de mantel recortan con `overflow: clip`.
- **Puntos de quiebre:** 1100px, 900px (todo a una columna y menú desplegable), 640px (video destacado y plato del tema a una columna) y 520px (campos apilados).
- Las áreas de toque miden al menos 44px y los controles de formulario 52px.

## Elevation & Depth

Es un sistema híbrido. El mantel y las secciones son planos, y la profundidad se reserva a los objetos que "están sobre la mesa": el plato, las fichas, la foto del campus, el globo y los botones. Las sombras son ambientales, amplias y siempre teñidas de verde profundo (rgba(0, 38, 19, …) o rgba(15, 42, 28, …)). Los botones verdes usan sombra teñida de su propio verde (rgba(0, 107, 53, …)). Las barras fijas de progreso y del índice de temas en celular son blanco al 94–95% con desenfoque de 8px y un filete inferior.

### Shadow Vocabulary
- **Plato** (`filter: drop-shadow(0 28px 34px rgba(0, 38, 19, 0.4))`; en el tema 4, sobre blanco, `0 20px 26px … 0.22`): solo para el plato.
- **Ficha** (`--sombra-ficha`: `0 18px 40px rgba(0, 38, 19, 0.28)`): superficies blancas sobre el mantel (ficha de IMC, formulario y resultados de la calculadora, nota del día, video destacado).
- **Foto** (`0 24px 44px rgba(0, 38, 19, 0.35)`): foto enmarcada de la portada de ¿Quiénes somos?.
- **Menú** (`0 18px 40px rgba(15, 42, 28, 0.18), 0 2px 6px rgba(15, 42, 28, 0.08)`): menú desplegable.
- **Botón** (`0 6px 14px rgba(0, 107, 53, 0.28)`, en hover `0 10px 20px rgba(0, 107, 53, 0.32)`): botón primario.
- **Botón Blanco** (`0 8px 18px rgba(0, 38, 19, 0.28)`, en hover `0 12px 24px …0.32`): botones blancos sobre el mantel.
- **Globo** (`0 10px 24px rgba(0, 38, 19, 0.2–0.28)`; 0.12 sobre blanco): globo del castor.
- **Encabezado** (`0 1px 0 rgba(15, 42, 28, 0.08), 0 6px 18px rgba(15, 42, 28, 0.06)`): línea y halo bajo el encabezado blanco.

### Named Rules
**La Regla de la Sombra Verde.** Ninguna sombra es negra o gris neutra: toda sombra lleva el matiz del mantel.

**La Regla del Levante.** El estado activo o hover se expresa levantando el objeto (translateY(-1px a -2px), sombra mayor, sector del plato desplazado hacia afuera), y al presionar baja (translateY(1px)). Las filas de índice no se levantan: toman fondo `--pozo` y su flecha avanza.

## Shapes

El círculo es la forma madre: el plato, la marca del logotipo, los numerales de grupo en círculo, los puntos de nivel y el botón de reproducir. Todo lo demás son rectángulos con una escala corta de esquinas: 8px (`sm`) para ítems de menú, etiquetas de tipo, duración de video y barras; 12px (`md`) para botones, campos, segmentos e ítems del índice lateral; 16px (`lg`) para el globo, el menú desplegable, el marco de video, el área de texto y los bloques de pozo dentro de un tema; 20px (`xl`) para fichas, fotos enmarcadas, fórmulas y agradecimiento; y `pill` (999px) para filtros, opciones, categorías y semáforos. El globo del castor tiene la esquina inferior izquierda casi recta (16px 16px 16px 4px) para que apunte al castor. Los tramos de la escala de IMC y el subrayado del menú llevan 3px y el anillo de foco 4px; son detalles de trazo, no superficies.

Los filetes divisorios son de 1px; el único trazo más grueso es el borde de 2px de los controles (transparente en reposo) y la línea de 2px en tinta bajo la cabecera de la tabla de IMC. Las fotos enmarcadas sobre el mantel llevan marco blanco de 8px (4px en las fotos de grupo en celular).

## Components

### Buttons
Tienen un carácter táctil y firme.
- **Shape:** esquinas suaves (12px); alto de 52px.
- **Primary (`boton-mantel`):** relleno `--mantel`, texto blanco en Poppins 600, padding horizontal de 1.5rem y sombra Botón. Deshabilitado baja a 70% de opacidad sin levante.
- **Hover / Focus:** el fondo pasa a `--mantel-hondo` y el botón sube 1px con una sombra mayor. Al presionar baja 1px. El foco es el anillo de 3px de la Regla del Foco Amarillo.
- **Blanco (`boton-blanco`, sobre mantel):** relleno blanco, texto `--tinta`, padding de 1.6rem y sombra Botón Blanco; en hover sube 2px.
- **Tinta (dentro de una ficha blanca sobre mantel):** relleno `--tinta`, texto blanco, 46px de alto; se usa para "Otro dato".
- **Enlace con flecha (`enlace-flecha`):** texto 600 en `--mantel-hondo` con una flecha que avanza 3px en hover. Sobre el mantel, `enlace-claro` en blanco.

### Chips
- **Filtro (`filtro`):** píldora de 44px en `--pozo`, texto `--tinta` 500 a 0.92rem, borde de 2px transparente que pasa a `borde-hover` en hover. Activo (`aria-pressed="true"`): relleno `--mantel` y texto blanco. Lleva el conteo al lado en 0.8rem/600 al 80%.
- **Opción de encuesta:** la misma píldora en 46px; marcada pasa a `--mantel` con texto blanco y, si es casilla, una palomita delante.
- **Categoría de IMC (`ficha-categoria`):** píldora de 0.9rem/600 y padding 0.35rem 0.75rem con la tinta del rango (bajo: `--amarillo` con texto tinta; normal: `tinta-verde`; sobrepeso: `tinta-naranja`; obesidad: `--rojo`).
- **Semáforo:** píldora de 0.75rem/600 (bajo `tinta-verde`, moderado `--amarillo` con tinta, alto `error-texto`).

### Cards / Containers
- **Ficha:** blanca sobre el mantel, 20px de radio, sombra Ficha, sin borde, padding clamp(1.25rem, 2.4vw, 1.75rem) a clamp(1.25rem, 2.6vw, 2rem). Las partes internas se separan con `filete-ficha`.
- **Bloque de pozo:** `--pozo` sin sombra ni borde, 16–20px de radio, para fórmulas, veredicto, llamado a la videoteca, aviso y agradecimiento.
- **Secciones:** `seccion` (blanco), `seccion-pozo` y `seccion-mantel` (texto blanco, foco amarillo), cada una con `titulo-seccion` y `lead-seccion` opcional.

### Inputs / Fields
- **Style:** fondo `--pozo`, borde de 2px transparente, 12px de radio y 52px de alto. El valor va en 1.15rem/600 y la unidad (kg, cm, años) se superpone a la derecha en `--tinta-suave`. Los `select` y el área de texto (16px de radio) siguen la misma piel.
- **Hover:** el borde pasa a `borde-hover`.
- **Focus:** el fondo pasa a blanco y el borde a `--mantel`.
- **Segmentos (sexo, actividad):** baldosas de 12px en `--pozo`; la elegida pasa a blanco con borde `--mantel` doble (2px más 1px interior).
- **Error:** borde `--rojo` y fondo blanco; el mensaje va debajo en `error-texto` 0.88–0.92rem/500 con `role="alert"`.

### Navigation
- **Encabezado:** blanco y fijo, con los logos UTP (52px de alto) y Cheficas UTP (40px) a la izquierda; 42px y 30px en celular.
- **Enlaces:** `--tinta` 500 a 0.92rem. En hover pasan a `--mantel` y aparece un subrayado de 3px que crece desde la izquierda (0.35s). El enlace activo va en 600 con el subrayado fijo.
- **Desplegable de temas:** panel blanco de 16px de radio con la sombra Menú; los ítems tienen 8px de radio y en hover cambian a fondo `--pozo` con texto `--mantel-hondo`.
- **Celular (≤900px):** botón de menú de 44px y lista a pantalla con filetes. El desplegable se integra en línea sin sombra y el enlace activo va en `--mantel`.
- **Buscador (`Js/buscador.js`):** botón de 44px en `--pozo` (con la palabra "Buscar" por encima de 1360px; solo la lupa debajo, a la izquierda del botón de menú) que abre un `<dialog>` modal con velo en `--tinta` al 55%. La hoja es blanca, de 720px y 20px de radio (pantalla completa en ≤640px), con un campo de 56px en piel de campo y resultados agrupados (temas, secciones, alimentos del SMAE, datos curiosos, videos y recursos) en índice con filetes: círculo de 40px con el numeral del tema en `--mantel` o un ícono en `--pozo`, título 600 con la coincidencia marcada en `--amarillo`, contexto en `--mantel-hondo` y flecha que avanza. La fila activa toma `--pozo`. Sin búsqueda o sin resultados habla el castor sabio y aparecen sugerencias en píldora. Al abrir un resultado, la página destino se desplaza al apartado y lo marca con un contorno `--amarillo` de 3px que se desvanece. El índice se genera con `node scripts/generar-indice-buscador.js`.
- **Pie:** fondo `--tinta`, logotipo claro de 32px, texto `tinta-clara`, enlaces blancos con subrayado blanco al 40% que pasa a amarillo en hover, foco amarillo.

### Índice con filetes (firma)
La forma de toda lista navegable o de lectura. Filas separadas por un filete superior de 1px (`filete` sobre blanco, `filete-pozo` sobre pozo, blanco al 28–30% sobre el mantel) y cerradas con uno inferior. Cada fila lleva, según el caso, un numeral 800 o una etiqueta de tipo a la izquierda, un título 600 con descripción en `--tinta-suave` y una flecha final en `--mantel`. En hover la fila toma fondo `--pozo` (o verde al 6%) y la flecha avanza 4px. Lo usan el índice de temas del Inicio, la lista de grupos, las herramientas y principios de ¿Quiénes somos?, los recursos, los datos curiosos, las preguntas de la encuesta, las lecturas de la calculadora, el comparador y las tarjetas heredadas de los temas 1, 6, 7 y 8.

### Plato interactivo (firma)
Un SVG con borde blanco y fondo `--pozo`, dividido en sectores fotográficos de proporción real (50/22/15/8/5), cada uno con un ribete en la tinta de su grupo, numeral 800 y líneas blancas entre sectores. Al elegir un grupo (en el sector, en la lista o con el teclado), su sector se separa del centro con sombra propia, los demás bajan a 50% de opacidad y el globo del castor cambia de texto con una entrada suave. Se usa en el Inicio sobre el mantel y en el tema 4 sobre blanco.

### Castor con globo
El castor (`castor.svg` saludando, `castor-sabio.svg` con lentes y libro) va junto a un globo blanco de texto `--tinta` a 0.92rem/1.5, radio 16px 16px 16px 4px y sombra Globo. Al cambiar el texto entra con translateY(6px), escala 0.98 y blur(2px), en 0.5s con `--ease-salida`. Aparece en la portada de Tu opinión y ¿Sabías qué?, en el cierre de ¿Quiénes somos?, en el Inicio y en los temas.

### Escala de IMC
Cuatro tramos de 3px de radio en `--amarillo`, `ribete-verduras`, `ribete-leguminosas` y `--rojo`, con un marcador en `--tinta` que se desliza en 0.8s hasta el valor. Acompaña a la píldora de categoría.

## Do's and Don'ts

### Do:
- **Do** abrir cada página con una portada de `--mantel` a sangre y usar blanco (`--plato`) para todo lo que se lee o se llena.
- **Do** tomar variables y componentes de `Styles/sitio.css` (`body.sitio`) y dejar en la hoja de cada página solo lo que es propio de ella.
- **Do** escribir secuencias y cantidades en numeral Poppins 800 con cifras tabulares.
- **Do** separar listas con filetes de 1px y numerarlas en lugar de usar cuadrículas de tarjetas iguales.
- **Do** teñir todas las sombras con verde profundo (rgba(0, 38, 19, …)).
- **Do** usar foco de 3px con separación de 3px: amarillo sobre mantel o tinta y `--tinta` sobre blanco.
- **Do** limitar los radios a 8, 12, 16 y 20px más la píldora de 999px.
- **Do** animar con `--ease-salida` (cubic-bezier(0.16, 1, 0.3, 1)) entre 0.2s y 0.8s, y anular las duraciones con `prefers-reduced-motion`.
- **Do** dar a los controles de formulario y botones al menos 52px (44px mínimo en chips y controles de icono).
- **Do** usar las versiones oscuras de las tintas (`tinta-verde`, `tinta-naranja`, `error-texto`) cuando lleven texto blanco pequeño o sean texto sobre blanco.
- **Do** usar los SVG de `Resources/marca/` para logotipo, ícono y castor.

### Don't:
- **Don't** usar degradados ni rellenos pastel del verde o de las tintas.
- **Don't** usar sombras negras o grises neutras.
- **Don't** armar cuadrículas de tarjetas iguales con un ícono en baldosa.
- **Don't** poner etiquetas o antetítulos encima de los titulares; la categoría o el canal van después del título.
- **Don't** usar bordes laterales de color de más de 1px para marcar tarjetas o avisos.
- **Don't** girar notas o tarjetas para simular papel pegado.
- **Don't** usar emoji como íconos.
- **Don't** poner texto blanco pequeño sobre `ribete-verduras` (3.30:1) o `ribete-leguminosas` (3.58:1).
- **Don't** introducir una segunda familia tipográfica ni cargar Poppins desde un CDN; ya está autoalojada en `Resources/fonts`.
- **Don't** tomar `Styles/Style_components.css` ni los colores #09BA00 / #660900 de la tesina como referencia visual.
