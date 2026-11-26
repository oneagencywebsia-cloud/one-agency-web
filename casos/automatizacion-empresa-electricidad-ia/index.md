# App con IA para electricistas: caso real | O.N.E Agency

> App instalable, agente de IA en Telegram, notificaciones push reales e IA que lee facturas y calcula ganancias, para una empresa de electricidad real.

Fuente: https://one-agency.es/casos/automatizacion-empresa-electricidad-ia/

---

## El punto de partida

Instalaciones Eléctricas Carrillo es una empresa de electricidad de Santaella, en Córdoba: instalaciones, averías, boletines y mantenimiento para particulares y empresas de la zona. Como en la mayoría de empresas de instalaciones, el trabajo real pasa fuera de la oficina: en la obra, en casa del cliente, subido a una escalera. El papeleo —quién trabajó, cuántas horas, qué material se usó, en qué cliente, si se ha cobrado— se apuntaba a mano o se intentaba recordar por la noche.

Ese es el problema que resuelve casi cualquier sistema de gestión para electricistas o instaladores: cómo capturar la información del día sin obligar a nadie a rellenar un formulario con las manos llenas de grasa, y cómo dar al dueño del negocio una foto real de lo que se ha facturado y cobrado sin tener que perseguirla.

## Lo que construimos

Un sistema completo hecho a medida sobre [n8n](https://one-agency.es/blog/n8n-que-es-y-como-usarlo-en-tu-empresa/): una **app web instalable** para todo el equipo, con su propio logo y sus propios colores, y una vía todavía más rápida para el día a día en obra: un **agente de IA en Telegram**. Los dos alimentan la misma hoja de cálculo, así que nunca hay dos versiones distintas de la realidad.

El camino de un parte de trabajo, de principio a fin: de un mensaje suelto a un aviso que llega solo.

### Un agente de IA que entiende cómo habla un electricista, no un formulario

Para el día a día en obra, el electricista no abre ninguna app: le escribe a un bot de Telegram tal cual hablaría por WhatsApp con un compañero. Por ejemplo (recreación ilustrativa, no una captura real):

Telegram — chat con el bot de partes

JCJoaquín debajo museo, angel y pino, de 9 a 11, 2 marcos

IAParte registrado
Cliente: Joaquín (debajo museo)
Trabajadores: Ángel, Pino
Horas: 2h (9:00–11:00)
Material: 2 marcos

El agente interpreta ese mensaje entero solo: identifica que "Joaquín debajo museo" es el cliente (así es como lo tienen registrado, con el lugar incluido en el nombre), que Ángel y Pino son los dos trabajadores, que "de 9 a 11" son 2 horas, y que se han usado 2 marcos como material. Si falta un dato realmente imprescindible, pregunta; si no, no interrumpe, solo confirma.

### Una app instalable con la marca real de la empresa

Además del bot, hay una **app web instalable** (funciona sin conexión, con icono propio en el móvil como cualquier app de la tienda) para quien prefiere ver sus partes, clientes y materiales en pantalla en vez de escribirlos. Usa el logo real de la empresa y sus colores de marca — azul eléctrico y amarillo bombilla — con animaciones pensadas para un electricista: la bombilla se enciende al guardar un parte, los interruptores sueltan una chispa al pulsarlos.

Cada persona entra con su propio acceso, y lo que ve depende de quién es:

- **El jefe** ve todo: facturación, qué clientes deben dinero, y recibe un **resumen automático cada tarde** con todos los partes del día — sin pedirlo.
- **Los electricistas** registran y editan sus partes, y consultan el catálogo de precios de material, pero no ven cuánto se factura a cada cliente.
- **El alumno en prácticas** entra con un acceso propio, más limitado, que el jefe puede quitar cuando termine sus prácticas.

### IA que lee una factura y calcula la ganancia real

El jefe puede sacarle una foto a un presupuesto o factura del cliente, y un modelo de IA (GPT-4o Vision) lo lee y extrae fecha, materiales, mano de obra y total — comparando el precio cobrado contra el precio de lista de cada material para calcular cuánto se ha ganado de verdad, mes a mes. Antes esa cuenta, si se hacía, era a mano.

### Notificaciones que llegan de verdad al móvil

Cuando se registra un parte nuevo, el jefe recibe una notificación push al instante — no una casilla dentro de la app que hay que abrir para enterarse, sino el aviso normal de su móvil, verificado llegando en real a su iPhone. Es el mismo protocolo que usa cualquier app grande (Gmail, WhatsApp), implementado sobre su propia infraestructura sin depender de servicios de terceros de pago.

### Todo respaldado en su propio Google Drive, organizado

Cada cliente, cada parte, cada presupuesto se guarda en la cuenta de Google del propio dueño del negocio, no en un servidor de O.N.E Agency — la empresa es dueña de sus datos desde el primer día. Todo vive ordenado en carpetas (Clientes, Clientes archivados, Presupuestos) que se mantienen solas: si se archiva un cliente, su ficha se mueve de carpeta sola.

Todo corre sobre **n8n** como motor de automatización, con **Google Sheets** como base de datos (sencilla, sin coste de mantenimiento, y que el propio jefe puede abrir y mirar cuando quiera), un **agente de IA con memoria persistente** (Postgres) para el bot de Telegram, y una arquitectura modular: cada pieza (guardar un material, analizar una factura, avisar al jefe) es un flujo independiente y reutilizable, no un bloque de lógica repetido en cada sitio donde hace falta.

No es una plantilla genérica: desde cómo interpreta el agente una frase mal puntuada hasta quién puede ver el dinero de cada cliente, cada pieza está hecha para cómo trabaja realmente este equipo, no al revés.

## Por qué este enfoque, y no una app de gestión genérica

Las aplicaciones de gestión para instaladores obligan a aprender una interfaz nueva y a pagar una licencia mensual por usuario. Aquí la empresa es dueña del código, de los datos y del diseño — con dos formas de usarlo (la app o el chat de siempre) para que cada persona elija la que de verdad va a usar todos los días.

## Preguntas frecuentes

¿Esto sirve solo para electricistas o para cualquier instalador?

Sirve para cualquier oficio de campo con el mismo problema: fontaneros, climatización, reformas, mantenimiento industrial. Lo que cambia es el vocabulario que aprende el agente de IA y los campos de cada parte, no la arquitectura del sistema.

¿Hace falta pagar por una app o una licencia?

No. La app es propia de la empresa (nada de suscripciones mensuales por usuario), y el resto corre sobre Google Sheets, Telegram y n8n — herramientas que cualquier pyme puede empezar a usar sin coste de licencias.

¿Cómo llegan las notificaciones sin depender de otra empresa?

Con el protocolo estándar de notificaciones push del propio navegador (el mismo que usa cualquier web grande), implementado sobre la infraestructura de n8n — sin pagar a un servicio externo de mensajería por cada aviso.

¿Cuánto se tarda en tener un sistema así?

Depende del alcance. Un agente de Telegram que registre un solo tipo de parte puede estar funcionando en pocas semanas; una app completa como esta, con roles, notificaciones y análisis de facturas, es un proyecto por fases. En el diagnóstico gratuito te decimos qué alcance tendría en tu caso.

## Sigue leyendo

- [Cómo automatizar presupuestos y partes de obra](https://one-agency.es/blog/automatizar-presupuestos-y-partes-de-obra/)
- [Automatizar una empresa de construcción y obra](https://one-agency.es/blog/automatizar-una-empresa-de-construccion-y-obra/)
- [Soluciones digitales para instaladores](https://one-agency.es/soluciones-para-instaladores/)
- [Servicio de automatización con IA](https://one-agency.es/servicios/automatizacion-con-ia/)
