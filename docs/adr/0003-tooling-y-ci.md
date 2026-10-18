# ADR 0003: tooling de calidad y CI

- **Estado:** Aceptado
- **Fecha:** 2026-10-17
- **Contexto:** PF-2, [reglas de trabajo](../engineering-rules.md) (secciones 5 y 7), ADR 0001, ADR 0002

## Decisión

| Qué                  | Elección                                                                                                                                   | Por qué                                                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Linter               | **ESLint 10** (flat config) + `@eslint/js` + `typescript-eslint` (preset `strict`) + `eslint-plugin-astro` (preset `recommended`)          | Es el estándar para TS y el único con soporte real de `.astro`                                                                                                             |
| Formato              | **Prettier 3** + `prettier-plugin-astro`, `printWidth: 120`, comillas dobles                                                               | El estilo que ya tenía el código: el diff de adopción queda chico                                                                                                          |
| Tipos                | **`astro check`** (`@astrojs/check`)                                                                                                       | Chequea `.astro` y `.ts` juntos; `tsc` solo no entiende `.astro`                                                                                                           |
| TypeScript           | **6.0.x fijado**                                                                                                                           | `typescript-eslint` 8.71 soporta `<6.1` y `@astrojs/check` 0.9 soporta `^5 \|\| ^6`. Se sube a 7 cuando ambos lo soporten (ADR nuevo no hace falta: es un bump de versión) |
| CI                   | **GitHub Actions** (`.github/workflows/ci.yml`): `npm ci`, lint, formato, tipos y build en cada PR y en `main`                             | Gratis para repos públicos y al lado del código                                                                                                                            |
| Conventional Commits | Chequeo del **título del PR** con una expresión regular en el workflow                                                                     | Con squash merge, el título del PR es el commit que queda en `main`. Una regex evita sumar una dependencia (commitlint) para algo de una línea                             |
| Protección de `main` | Solo por PR, con el check `ci` en verde y la rama al día; aplica también a admins; sin aprobaciones requeridas                             | ADR 0002: merge sin revisión humana con CI verde                                                                                                                           |
| Artifacts            | El CI de este ticket no sube artifacts. Los que vengan (capturas E2E, Lighthouse) usan `retention-days: 3` y se suben solo si el job falla | Regla 7                                                                                                                                                                    |

Todas son dependencias de desarrollo con licencia MIT o Apache-2.0, mantenidas (releases en los últimos 3 meses) y no llegan al bundle del sitio.

## Opciones descartadas

- **Biome** (lint + formato en una sola herramienta, más rápido): todavía no soporta bien los archivos `.astro`.
- **commitlint + husky**: más piezas para validar lo mismo que valida una regex sobre el título del PR.

## Consecuencias

- `npm run lint`, `npm run format:check` y `npm run check` tienen que pasar en local antes de abrir un PR.
- `src/data/github.json` es un archivo generado: queda fuera de Prettier y ESLint.
