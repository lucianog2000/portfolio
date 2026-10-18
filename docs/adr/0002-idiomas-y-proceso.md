# ADR 0002: idiomas, backlog y flujo de trabajo

- **Estado:** Aceptado
- **Fecha:** 2026-10-17
- **Contexto:** PF-1, [reglas de trabajo](../engineering-rules.md) (secciones 1, 4, 7 y 8)

## Decisión

### Idiomas

| Qué                                                          | Idioma  | Por qué                                                              |
| ------------------------------------------------------------ | ------- | -------------------------------------------------------------------- |
| Código, identificadores, claves de traducción, commits y PRs | Inglés  | Regla 4                                                              |
| Producto (el sitio)                                          | Inglés  | El público objetivo incluye empresas de afuera y trabajo remoto      |
| Docs internos (reglas, ADRs)                                 | Español | Es el idioma de trabajo del autor y de sus otros repos               |
| README                                                       | Inglés  | Es la cara pública del repo para quien llega desde el sitio o GitHub |

### Backlog

- **Notion**, base de datos **Portfolio** (mismo formato que el tablero de Motorpass).
- IDs `PF-n`, en orden. El título de cada ticket empieza con `[PF-n]`.
- Estados: `TO DO` → `IN PROGRESS` → `READY FOR TESTING` → `IN TESTING` → `DONE`.

### Diseño

- **Claude Design** es la herramienta de diseño del proyecto (regla 1: primero diseño, después código).

### Ramas, PRs y merge

- Ramas cortas desde `main`, con el ID en minúsculas al principio: `pf-1-adopt-engineering-rules`.
- Commits con Conventional Commits.
- Un PR por ticket, de menos de ~400 líneas, con el porqué en la descripción.
- **Se activa la regla opcional de merge sin revisión humana:** se abre el PR, se espera el CI y se mergea apenas está en verde. Después se verifica producción y se cierra el ticket.
- Mientras no exista CI (lo agrega PF-2), el check mínimo antes de mergear es `npm run build` en local y el deploy de preview de Vercel en "Ready".

## Consecuencias

- Este ADR y el 0001 son los primeros cambios que siguen el flujo. Los commits anteriores (`af113bf`..`5310153`) no siguen Conventional Commits y no se reescriben: el historial no se pisa.
- Cambiar cualquiera de estas decisiones requiere un ADR nuevo.
