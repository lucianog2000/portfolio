# ADR 0001: stack y arquitectura del portfolio

- **Estado:** Aceptado (retroactivo: documenta lo construido el 2026-10-17 antes de adoptar las reglas)
- **Fecha:** 2026-10-17
- **Contexto:** PF-1, [reglas de trabajo](../engineering-rules.md) (sección 0)

## El problema

- **Qué es:** sitio personal que junta experiencia (LinkedIn), proyectos (GitHub) y un resumen del trabajo en Personal.
- **Usuarios:** reclutadores y devs que llegan desde LinkedIn, GitHub o un link directo, muchas veces desde el celular.
- **Plataforma:** solo web. Sin login, sin datos de usuarios y sin backend propio.
- **Volumen:** bajo y en picos (cuando se comparte el link).
- **Equipo y presupuesto:** una persona, costo cero (plan gratuito de Vercel).
- **Restricciones:** el código de Personal es privado: solo se publica información general (ver `src/data/profile.ts`).
- **Cómo puede crecer:** más proyectos, otro idioma, quizás un blog. Nada que necesite servidor.

## Opciones evaluadas

| Opción                                 | A favor                                                                                                                                       | En contra                                                                                          |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Astro (salida estática) + Tailwind** | HTML estático y casi cero JS por defecto (ideal para redes malas). Componentes `.astro` sin runtime. Datos en build. View transitions nativas | Otro framework más para mantener actualizado                                                       |
| Next.js                                | Mismo stack que CarsWatch. Sirve si algún día hay partes dinámicas                                                                            | Manda runtime de React aunque el sitio sea estático. Sobra para la fase actual                     |
| HTML/CSS/JS sin framework              | Cero dependencias                                                                                                                             | Sin componentes ni datos en build: el contenido repetido (proyectos, radares) se duplicaría a mano |

## Decisión

**Astro 7 con salida estática, Tailwind CSS 4 y hosting en Vercel.** Es lo más simple que resuelve esta fase: no hay nada dinámico, y Astro entrega HTML sin JS salvo los dos scripts chicos que hacen falta (navegación activa y radar).

| Capa           | Elección                                                                                                                   | Por qué                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Framework      | Astro 7.4, `output: static`                                                                                                | HTML estático, JS solo donde hace falta                                                           |
| Lenguaje       | TypeScript estricto (`astro/tsconfigs/strict`)                                                                             | Regla 5                                                                                           |
| Estilos        | Tailwind CSS 4 con tokens en `@theme` (`src/styles/global.css`)                                                            | Tokens desde el día 1 (regla 3); los valores sueltos pendientes se resuelven en PF-6              |
| Tipografías    | `@fontsource/commit-mono` y `@fontsource-variable/unbounded` (OFL-1.1), servidas desde el propio sitio                     | Sin CDNs externos (privacidad y performance)                                                      |
| Datos externos | `scripts/fetch-github.mjs` corre antes del build y guarda una foto en `src/data/github.json`                               | El build nunca depende de que la API de GitHub responda: sin token, usa la última foto commiteada |
| Hosting        | Vercel, conectado a GitHub: cada merge a `main` se publica en https://luciano-garcia.vercel.app y cada PR tiene su preview | Gratis, sin configuración para Astro                                                              |

## Estructura de módulos

```
scripts/            adaptadores a servicios externos (GitHub), corren en build
src/data/           el "dominio": contenido curado en TypeScript plano, sin dependencias de Astro
  profile.ts        persona, experiencia, hackathons, educación
  projects.ts       proyectos curados + merge con la foto de GitHub
  skills.ts         radares y escala de evidencia
  github.json       foto generada por scripts/fetch-github.mjs
src/components/     presentación reutilizable (.astro)
src/layouts/        estructura de página, navegación y footer
src/pages/          rutas: /, /about, /work
src/styles/         tokens y estilos base
```

- **Aislamiento:** `src/data` no importa nada de Astro ni de Tailwind; los componentes leen de ahí y nunca al revés. GitHub solo se toca desde `scripts/`, y el resto del sitio ve un JSON con forma propia.
- **Contratos:** la forma de `github.json` la define `fetch-github.mjs` (normalización propia, no la respuesta cruda de la API).

## Diferido

- **i18n:** el sitio está en un solo idioma; las claves de traducción llegan en PF-8.
- **Observabilidad:** se decide en PF-9.
- **Dominio propio:** cuando haga falta; hoy alcanza con el subdominio de Vercel.

## Consecuencias

- Astro 7 es reciente: antes de usar una API hay que leer la documentación de la versión instalada (`AGENTS.md`).
- Con `ClientRouter` (view transitions), los scripts de página corren una sola vez: el estado que depende de la ruta se actualiza en `astro:page-load` o con eventos delegados en `document`.
- El servidor de desarrollo de Tailwind 4 a veces no regenera clases nuevas: si un estilo no aparece, reiniciar `astro dev` antes de buscar otro error.
