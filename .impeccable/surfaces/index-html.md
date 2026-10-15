---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Inicio (index.html)

Modo: Persuade. Audiencia: comunidad UTP y público general que llega a orientarse en salud. Acción principal: calcular su IMC ahí mismo; secundaria: entrar a un tema. Prueba: las guías oficiales (Plato del Bien Comer) hechas interactivas. Restricciones: sitio estático, Poppins, verde #008744, castor, sin cifras ni avales inventados; el resto de las páginas conserva su estilo actual.

## Direction contract

THESIS: El Inicio es el Plato del Bien Comer visto desde arriba; sus sectores enseñan y navegan. Rechaza el banner de foto con titular centrado y la fila de tarjetas iguales.

OWN-WORLD: Mantel verde #008744 a sangre como suelo; plato blanco con cinco sectores fotográficos a proporción real (50/22/15/8/5) ribeteados en tintas puras (#16a34a, #f2b705, #f2711c, #e03131, #b7791f); tinta #0f2a1c sobre blanco; Poppins 800 para titulares, 400/500 para texto; cifras tabulares; sin degradados ni pasteles.

STORY: Entiendo en un vistazo qué es WellDataLab, calculo mi IMC sin salir de la página, exploro el plato grupo por grupo con el castor como guía, y elijo un tema del índice numerado.

FIRST VIEWPORT: Encabezado delgado sobre el mantel con logos y menú. Izquierda (~45%): titular "Tu salud, tu mejor inversión." en blanco, frase corta, y la ficha blanca de IMC (peso, estatura, Calcular) con resultado en línea. Derecha: plato enorme (~70vh) cortado por el borde derecho; leyenda numerada 1–5 junto al plato; castor con globo de diálogo al pie del plato.

FORM: Plato del Bien Comer, candidato 6 de 7 en la lista propia; seed:d5d8003330a62044. Interacción firma: elegir un grupo (sector o leyenda, con teclado) lo levanta del plato, actualiza porcentaje, descripción y el globo del castor.

ADAPTACIONES (decididas al construir): encabezado blanco en lugar de sobre el mantel, porque los logos son JPEG con fondo blanco. La leyenda 1–5 vive en la lista que acompaña al plato fijo al hacer scroll, no en el primer viewport; ahí los números van sobre los sectores. Las tintas de ribete son #e8590c, #d62839 y #9a6a00 (en lugar de #f2711c, #e03131 y #b7791f) para que los numerales blancos alcancen 3:1. En celular, la foto del grupo activo aparece dentro de la lista, porque el plato no queda fijo.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
