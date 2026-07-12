# Convenciones de Commits — SilkRoad

Este documento define el estándar para los mensajes de commit del proyecto, basado en **Conventional Commits**. El objetivo es mantener un historial claro, legible y fácil de auditar (útil también para la rúbrica académica del Producto 02).

## Estructura básica

```
<tipo>(<alcance opcional>): <descripción corta>

[cuerpo opcional]

[footer opcional]
```

**Ejemplos:**
```
feat(auth): agregar login con Google OAuth
fix(profile): corregir validación de email vacío
docs: actualizar README con instrucciones de instalación
```

## Tipos de commit

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad para el usuario |
| `fix` | Corrección de un bug |
| `docs` | Cambios solo en documentación (README, comentarios, este archivo) |
| `style` | Cambios de formato que no afectan la lógica (espacios, punto y coma, indentación) |
| `refactor` | Cambio de código que no corrige un bug ni agrega funcionalidad |
| `test` | Agregar o corregir tests |
| `chore` | Tareas de mantenimiento (dependencias, configuración, build) |
| `perf` | Cambios que mejoran el rendimiento |
| `ci` | Cambios en integración continua / workflows |
| `build` | Cambios que afectan el sistema de build o dependencias externas |
| `revert` | Revertir un commit anterior |

## Alcance (scope)

El alcance es opcional y va entre paréntesis, indica qué parte del proyecto se modificó. Para SilkRoad se recomienda usar:

- `auth` — autenticación/registro
- `profile` — perfiles de usuario
- `services` — publicación/gestión de servicios freelance
- `orders` — pedidos/contrataciones
- `chat` — mensajería entre usuarios
- `ui` — componentes visuales generales
- `api` — endpoints backend
- `db` — migraciones/modelos

**Ejemplo:** `feat(services): agregar filtro por categoría`

## Reglas para la descripción

- Usa **modo imperativo**: "agregar", "corregir", "eliminar" (no "agregado", "agregando")
- Sin mayúscula al inicio
- Sin punto final
- Máximo ~72 caracteres
- Debe explicar el **qué**, no el **cómo**

**Bien:** `fix(orders): corregir cálculo de total con descuento`
**Mal:** `fix: arreglé un bug que encontré en el carrito jeje`

## Breaking changes

Si el cambio rompe compatibilidad con versiones anteriores, agrega `!` después del tipo/alcance y explica en el footer:

```
feat(api)!: cambiar estructura de respuesta de /orders

BREAKING CHANGE: el campo `total` ahora es un objeto {amount, currency} en vez de number
```

## Commits múltiples / relacionados a un issue

Si el commit resuelve un issue de GitHub, agrégalo en el footer:

```
fix(auth): corregir expiración de token JWT

Closes #23
```

## Ejemplos completos por rama del equipo

```
feat(api): crear endpoint POST /services
test(services): agregar test de validación de precio mínimo
docs: documentar variables de entorno en .env.example
style(ui): aplicar formato con prettier a componentes Vue
refactor(auth): extraer lógica de validación a helper
chore: actualizar Laravel a 11.2
```

## Recomendaciones generales

1. Un commit = un cambio lógico. Evita mezclar `feat` + `fix` en el mismo commit.
2. Commitea seguido; no acumules cambios de varios días en un solo commit gigante.
3. Antes de hacer `push`, revisa `git log --oneline` para verificar que el historial se lea bien.
4. Si te equivocas en el último mensaje (y no has hecho push): `git commit --amend`
