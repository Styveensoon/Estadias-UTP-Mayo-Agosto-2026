# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primero la comunidad de la Universidad Tecnológica de Puebla (estudiantes, docentes y personal), expuesta a alta exigencia académica, sedentarismo y comida rápida; también cualquier persona del público general que busque orientación de salud confiable. Llegan desde el celular o la computadora para entender cómo está su cuerpo (IMC) y qué cambiar en su alimentación, hidratación y actividad física.

## Product Purpose
Cheficas UTP es una plataforma web gratuita de educación nutricional y autocuidado. Reúne herramientas de autoevaluación (calculadora de IMC, TMB, requerimiento hídrico y masa muscular estimada) con contenido educativo respaldado en fuentes oficiales mexicanas, para facilitar la adopción de hábitos saludables y prevenir enfermedades derivadas del sobrepeso y el sedentarismo. El éxito es que el usuario se autoevalúe, entienda una guía oficial y regrese.

## Positioning
Proyecto académico de la UTP que convierte guías oficiales de salud mexicanas (Plato del Bien Comer, Jarra del Buen Beber, INCMNSZ, IMSS, NOM) en herramientas interactivas gratuitas, frente a la desinformación de redes sociales.

## Operating Context
Sitio estático (HTML, CSS y JavaScript sin framework) en `index.html` y `Views/`. Secciones: Inicio, ¿Quiénes somos?, Temas (10 temas: alimentación saludable, guías alimentarias, Jarra del Buen Beber, Plato del Bien Comer, sostenibilidad, ejercicio, recetas, marco normativo, comparador de alimentos, formas de preparar los alimentos), ¿Sabías qué?, Calculadora, Directorio de alimentos (2,323 alimentos del SMAE en nueve categorías con buscador), Calculadora de alimentos (recetas en PDF, foto o texto calculadas con las tablas del SMAE, 4a. ed., para estudiantes de gastronomía; base en Js/smae-datos.js), Videos (videoteca de canales oficiales verificados), Recursos (guías y sitios oficiales verificados) y Tu opinión (encuesta que se envía por correo con FormSubmit). Proyecto de estadías mayo–agosto 2026, documentado en la tesina `UTP015170_ANGEL YAHIR AGUILAR VAZQUEZ.docx`.

## Capabilities and Constraints
- Sin backend: no hay registro de usuarios, historial ni API nutricional (la tesina los deja como trabajos futuros).
- Los cálculos son estimaciones orientativas, no diagnóstico médico.
- Debe funcionar en navegadores modernos de escritorio y móvil.

## Brand Commitments
- Nombre: Cheficas UTP, en colaboración con la Universidad Tecnológica de Puebla. Logo de la UTP en `Resources/logo-utp.png`; logo de Cheficas UTP (marca de plato + nombre en Poppins 800) en `Resources/marca/` como SVG, con versión clara para fondos oscuros e ícono. Antes se llamaba WellDataLab; la mascota comparte el nombre del proyecto.
- Color de identidad confirmado por el usuario: verde `#008744` (con `#2e7d32` como verde de variables CSS). No se adopta el `#09BA00`/`#660900` mencionado en partes de la tesina.
- Tipografía declarada en la tesina: Poppins.
- Mascota: Cheficas UTP, el castor con pañoleta verde y mandil (antes «El Castor Nutritivo»), ilustración vectorial plana en `Resources/marca/castor.svg` (saludando) y `Resources/marca/castor-sabio.svg` (con lentes y libro).
- Nombre oficial de la guía: «Plato del Bien Comer» (NOM-043); la bebida es la «Jarra del Buen Beber».
- Voz: cercana, motivadora y en español de México, tuteando al usuario.

## Evidence on Hand
Fotografías de alimentos en `Resources/home/` (banner, verduras, cereales, leguminosas, origen animal, grasas) y banner institucional en `Resources/quienes_somos/`. No existen testimonios, cifras de uso ni avales médicos externos; no se deben inventar.

## Product Principles
1. Información oficial antes que opinión: cada recomendación remite a una fuente reconocida.
2. Autoevaluación en un paso: la calculadora debe estar a un clic desde cualquier punto de entrada.
3. Motivar sin culpar: el tono anima a cambiar hábitos, nunca avergüenza por el peso.
4. Gratuito y accesible desde cualquier dispositivo.

## Accessibility & Inclusion
La tesina se compromete a evaluar accesibilidad (a11y) y rendimiento con Lighthouse; el contraste y la navegación con teclado deben cumplir WCAG AA.
