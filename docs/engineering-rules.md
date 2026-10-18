# Reglas de trabajo para este proyecto

Seguí estas reglas en todo el código, los docs y los tickets. No dependen de ninguna tecnología ni arquitectura en particular.

## 0. El stack y la arquitectura son parte de la solución
- No arranques con un stack ni una arquitectura por costumbre. Elegirlos es la primera decisión de diseño.
- Antes de escribir código, entendé el problema: usuarios, plataformas (web, mobile, desktop, CLI…), volumen, equipo, presupuesto, hosting, restricciones legales y cómo puede crecer.
- Proponé 2 o 3 opciones con sus pros y contras. Elegí una con un motivo concreto y dejala escrita en un registro de decisiones (ADR). Tiene que incluir la estructura de módulos y cómo se aíslan el dominio y las dependencias externas.
- Elegí lo más simple que resuelva la fase actual. No sumes servicios, capas ni infraestructura hasta que haya una razón medible.
- Si el proyecto ya tiene un stack y una arquitectura, respetalos. Cambiarlos requiere un ADR nuevo.
- Antes de usar la API de un framework o una librería, leé la documentación de la versión instalada. No confíes en lo que recordás.

## 1. Proceso
- **Sin ticket no hay cambio.** Todo cambio (código, docs, CI o infraestructura) tiene un ticket en el backlog del proyecto. Si no existe, se crea antes de empezar, con el siguiente ID libre, y se pasa a "en curso".
- **Primero diseño, después código.** Toda pantalla o feature con UI se diseña antes de implementarse, en la herramienta de diseño del proyecto.
- **Antes de una construcción grande, proponé el plan** y esperá la aprobación.
- **Pensar como ecosistema, construir como MVP.** Planificá dónde encaja cada feature a futuro, pero construí solo lo que la fase actual necesita. Se diseñan los puntos de conexión, no los módulos futuros.
- **Definition of Done:** el ticket se cierra solo cuando el cambio está mergeado, desplegado y verificado, y cumple todas las reglas de abajo.

## 2. Tests
- **TDD siempre:** rojo → verde → refactor. El test se commitea junto con el código que lo hace pasar.
- **Spikes:** las pruebas técnicas descartables van en ramas aparte que nunca se mergean. Lo aprendido se reimplementa con TDD.
- **Pirámide de tests:**
  - muchos tests unitarios;
  - tests de integración contra dependencias reales (base de datos, colas) en local o en contenedor, sin mockear lo que es nuestro;
  - pocos E2E sobre los flujos críticos.
- **Umbral de coverage en el CI:** si no hay uno definido, proponelo (por ejemplo, 95% de líneas y 90% de ramas). Lo que no cubren los unitarios lo cubre el E2E.
- **Si hay frontend, E2E con screenshots en al menos dos tamaños: mobile y desktop.** Se generan en un entorno fijo (fuentes fijas, animaciones apagadas) y se suben como artifact solo si el test falla.

## 3. Diseño e interfaz
- **Mobile first, pero el desktop no se ata al mobile.** Se diseña primero para mobile, y toda pantalla tiene además una composición desktop propia que aprovecha el ancho (columnas, paneles laterales, tablas). No vale la columna de mobile estirada ni centrada.
- **Responsive real:** definí breakpoints por necesidad del contenido, no por dispositivo. Un componente puede cambiar de forma entre tamaños (por ejemplo, una tabla que pasa a tarjetas).
- **Design tokens desde el día 1:** colores, espaciados, tipografía y radios. Nada de valores sueltos.
- **Accesibilidad WCAG 2.2 AA:**
  - contraste suficiente;
  - áreas táctiles de 44 px o más;
  - navegación completa por teclado y foco visible;
  - etiquetas accesibles.
- **Presupuesto de performance medido en el CI:** puntaje, tiempo de carga, estabilidad visual y peso. Asumí dispositivos modestos y redes malas. Si no hay presupuesto, proponelo.
- **Contenido pensado para quien llega por primera vez:** la página principal explica el producto. No muestra datos específicos fuera de contexto.

## 4. Idioma e internacionalización desde el día 1
- **El código, los identificadores y las claves de traducción van en inglés.** Elegí y documentá el idioma de los docs y del producto.
- **Ningún texto visible se escribe directo en el código:** se usan claves de traducción con soporte de plurales y género. Si se puede, se controla con un linter.
- **Unidades, moneda, fechas y números:**
  - se guardan en un formato canónico (unidades métricas; dinero como entero en unidades menores + código ISO 4217, nunca floats; fechas en UTC con ISO 8601);
  - se muestran según el locale y las preferencias del usuario.
- **El nombre del producto vive en un solo lugar** de configuración.
- **El contenido que aportan los usuarios se guarda tal cual,** en su idioma y redacción original. No se traduce sin preguntar.
- **Nunca inventes datos de dominio** (técnicos, legales, médicos, financieros…). Si falta un dato, pedilo o dejalo pendiente.

## 5. Código y arquitectura (cualquiera sea la elegida)
- **Sin comentarios de "qué hace":** se resuelve con nombres claros y funciones chicas. El porqué va en los ADRs, los commits y los PRs. Única excepción: una línea con un link cuando algo contraintuitivo es obligatorio.
- **El dominio no depende de frameworks,** de la base de datos ni de proveedores externos: se accede a ellos a través de interfaces propias.
- **Los módulos se comunican por contratos públicos** o eventos, nunca por los datos internos de otro módulo.
- **API primero:** los contratos se definen antes que la implementación y se versionan.
- **Tipado estricto,** si el lenguaje lo permite. Linter y formateador obligatorios en el CI.
- **El historial no se borra ni se pisa** en los datos que lo necesiten: cada corrección crea una versión nueva, con auditoría. Usá IDs estables.
- **Si el dominio tiene estándares de la industria, seguilos.** Cada desviación se documenta en un ADR.
- **Cada dependencia nueva se justifica:**
  - que esté mantenida y tenga una licencia compatible;
  - que su tamaño sea razonable;
  - que no se pueda resolver con poco código propio.
  Las centrales se deciden en un ADR.

## 6. Seguridad, privacidad y observabilidad
- **Cero secretos en el repo:** se usa un archivo de ejemplo con valores falsos, y los secretos reales van al gestor del entorno.
- **Mínimo privilegio** en servicios, tokens y roles.
- **Los datos sensibles son privados por defecto.** Exponerlos es siempre una acción explícita del usuario.
- **Acceso a datos compartidos con control a nivel de fila** o su equivalente.
- **Cumplí la ley de datos aplicable** y prepará la exportación y el borrado de datos.
- **Logs estructurados con un ID de correlación por request,** monitoreo de errores en cliente y servidor, y cero datos personales en los logs.

## 7. Git, PRs y CI
- **Ramas cortas desde la principal,** con el ID del ticket en el nombre.
- **Commits con Conventional Commits.**
- **PRs chicos** (menos de unas 400 líneas), uno por ticket. La descripción explica el porqué.
- **Se mergea solo por PR y con el CI en verde.** Nunca se saltean hooks ni checks.
- **El CI no guarda artifacts pesados cuando todo pasa.** Usá retención corta.
- **[Opcional, según el equipo] Sin revisión humana:** abrí el PR, esperá el CI y mergealo apenas esté en verde. Si falla, arreglalo antes. Después verificá producción y cerrá el ticket.

## 8. Memoria y documentación
- **Todo lo que otra persona necesite saber va al repo:** ADRs, reglas y docs.
- **Cambiar estas reglas requiere un ADR.**
- **Si el usuario te corrige o fija una preferencia,** proponé sumarla a estas reglas.
