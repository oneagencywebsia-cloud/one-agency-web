---
title: Le construimos una app instalable con IA a una empresa de electricidad
seoTitle: App con IA para electricistas: caso real | O.N.E Agency
description: App instalable, agente de IA en Telegram, notificaciones push reales e IA que lee facturas y calcula ganancias, para una empresa de electricidad real.
lead: Instalaciones Eléctricas Carrillo es una empresa de electricidad de Santaella (Córdoba). Este es el sistema completo que le construimos, sin papeleo ni hojas sueltas.
cluster: sectores
sector: Construcción / Obra
client: Instalaciones Eléctricas Carrillo (Juan Carrillo Nieto), electricista en Santaella, Córdoba
clientName: Carrillo Electricidad
clientLocation: Santaella, Córdoba, España
clientLogo: /carrillo-logo.png
chips: ⚡ Electricidad, 📱 App instalable, 🔔 Push real, 🧾 IA lee facturas
date: 2026-09-29
---

## El punto de partida

Instalaciones Eléctricas Carrillo es una empresa de electricidad de Santaella, en Córdoba: instalaciones, averías, boletines y mantenimiento para particulares y empresas de la zona. Como en la mayoría de empresas de instalaciones, el trabajo real pasa fuera de la oficina: en la obra, en casa del cliente, subido a una escalera. El papeleo —quién trabajó, cuántas horas, qué material se usó, en qué cliente, si se ha cobrado— se apuntaba a mano o se intentaba recordar por la noche.

Ese es el problema que resuelve casi cualquier sistema de gestión para electricistas o instaladores: cómo capturar la información del día sin obligar a nadie a rellenar un formulario con las manos llenas de grasa, y cómo dar al dueño del negocio una foto real de lo que se ha facturado y cobrado sin tener que perseguirla.

## Lo que construimos

Un sistema completo hecho a medida sobre [n8n](/blog/n8n-que-es-y-como-usarlo-en-tu-empresa/): una **app web instalable** para todo el equipo, con su propio logo y sus propios colores, y una vía todavía más rápida para el día a día en obra: un **agente de IA en Telegram**. Los dos alimentan la misma hoja de cálculo, así que nunca hay dos versiones distintas de la realidad.

<figure style="margin:2em 0;padding:22px 24px 18px;background:#fff;border:1px solid #E2E8F0;border-radius:16px;box-shadow:0 18px 40px -30px rgba(15,23,42,.55)">
<svg viewBox="0 0 980 210" role="img" aria-labelledby="caso-carrillo-title caso-carrillo-desc" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">
<title id="caso-carrillo-title">Cómo un parte llega de Telegram al jefe de obra</title>
<desc id="caso-carrillo-desc">Un electricista escribe un parte por Telegram, un agente de IA lo interpreta y lo guarda estructurado en Google Sheets, y cada tarde un resumen automático llega al jefe de obra.</desc>
<rect width="100%" height="100%" fill="#F8FAFC"/>
<defs>
<marker id="cc-arrow" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
<polygon points="0 0, 9 3.5, 0 7" fill="#64748B"/>
</marker>
<marker id="cc-arrow-accent" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
<polygon points="0 0, 9 3.5, 0 7" fill="#F97316"/>
</marker>
</defs>
<line x1="186.0" y1="92.0" x2="210.0" y2="92.0" stroke="#F97316" stroke-width="1.6" marker-end="url(#cc-arrow-accent)"/>
<line x1="380.0" y1="92.0" x2="404.0" y2="92.0" stroke="#64748B" stroke-width="1.6" marker-end="url(#cc-arrow)"/>
<line x1="574.0" y1="92.0" x2="598.0" y2="92.0" stroke="#64748B" stroke-width="1.6" marker-end="url(#cc-arrow)"/>
<line x1="768.0" y1="92.0" x2="792.0" y2="92.0" stroke="#64748B" stroke-width="1.6" marker-end="url(#cc-arrow)"/>
<rect x="18.0" y="46" width="168" height="92" rx="14" fill="#F8FAFC"/>
<rect x="18.0" y="46" width="168" height="92" rx="14" fill="rgba(100,116,139,.08)" stroke="#64748B" stroke-width="1"/>
<text x="102.0" y="88.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="13.5" font-weight="800" fill="#0F172A">Parte por Telegram</text>
<text x="102.0" y="108.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10.5" fill="#64748B">o desde la app</text>
<rect x="212.0" y="46" width="168" height="92" rx="14" fill="#F8FAFC"/>
<rect x="212.0" y="46" width="168" height="92" rx="14" fill="rgba(249,115,22,.12)" stroke="#F97316" stroke-width="2"/>
<text x="296.0" y="88.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="13.5" font-weight="800" fill="#0F172A">Agente de IA</text>
<text x="296.0" y="108.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10.5" fill="#64748B">n8n + OpenAI</text>
<rect x="406.0" y="46" width="168" height="92" rx="14" fill="#F8FAFC"/>
<rect x="406.0" y="46" width="168" height="92" rx="14" fill="rgba(15,23,42,.04)" stroke="#64748B" stroke-width="1"/>
<text x="490.0" y="88.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="13.5" font-weight="800" fill="#0F172A">Google Sheets</text>
<text x="490.0" y="108.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10.5" fill="#64748B">+ copia en su Drive</text>
<rect x="600.0" y="46" width="168" height="92" rx="14" fill="#F8FAFC"/>
<rect x="600.0" y="46" width="168" height="92" rx="14" fill="#ffffff" stroke="#0F172A" stroke-width="1"/>
<text x="684.0" y="88.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="13.5" font-weight="800" fill="#0F172A">App + resumen</text>
<text x="684.0" y="108.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10.5" fill="#64748B">al instante</text>
<rect x="794.0" y="46" width="168" height="92" rx="14" fill="#F8FAFC"/>
<rect x="794.0" y="46" width="168" height="92" rx="14" fill="rgba(100,116,139,.08)" stroke="#64748B" stroke-width="1"/>
<text x="878.0" y="88.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="13.5" font-weight="800" fill="#0F172A">Jefe de obra</text>
<text x="878.0" y="108.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10.5" fill="#64748B">push al móvil</text>
<line x1="18.0" y1="158" x2="962.0" y2="158" stroke="#E2E8F0" stroke-width="1"/>
<circle cx="23.0" cy="172" r="4.5" fill="#F97316"/>
<text x="34.0" y="175.5" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10" fill="#64748B">Agente de IA (n8n + OpenAI)</text>
<circle cx="218.2" cy="172" r="4.5" fill="#64748B"/>
<text x="229.2" y="175.5" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10" fill="#64748B">Datos y personas</text>
</svg>
<figcaption style="margin-top:10px;font-size:.82rem;color:#64748B">El camino de un parte de trabajo, de principio a fin: de un mensaje suelto a un aviso que llega solo.</figcaption>
</figure>

### Un agente de IA que entiende cómo habla un electricista, no un formulario

Para el día a día en obra, el electricista no abre ninguna app: le escribe a un bot de Telegram tal cual hablaría por WhatsApp con un compañero. Por ejemplo (recreación ilustrativa, no una captura real):

<div class="chat-mock reveal-io">
<span class="cm-tag">Telegram — chat con el bot de partes</span>
<div class="cm-row in"><span class="cm-av in">JC</span><span class="cm-bub in">Joaquín debajo museo, angel y pino, de 9 a 11, 2 marcos</span></div>
<div class="cm-row out"><span class="cm-av out">IA</span><span class="cm-bub out">✅ Parte registrado<br>Cliente: Joaquín (debajo museo)<br>Trabajadores: Ángel, Pino<br>Horas: 2h (9:00–11:00)<br>Material: 2 marcos</span></div>
</div>

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

:::note
Todo corre sobre **n8n** como motor de automatización, con **Google Sheets** como base de datos (sencilla, sin coste de mantenimiento, y que el propio jefe puede abrir y mirar cuando quiera), un **agente de IA con memoria persistente** (Postgres) para el bot de Telegram, y una arquitectura modular: cada pieza (guardar un material, analizar una factura, avisar al jefe) es un flujo independiente y reutilizable, no un bloque de lógica repetido en cada sitio donde hace falta.
:::

No es una plantilla genérica: desde cómo interpreta el agente una frase mal puntuada hasta quién puede ver el dinero de cada cliente, cada pieza está hecha para cómo trabaja realmente este equipo, no al revés.

## Por qué este enfoque, y no una app de gestión genérica

Las aplicaciones de gestión para instaladores obligan a aprender una interfaz nueva y a pagar una licencia mensual por usuario. Aquí la empresa es dueña del código, de los datos y del diseño — con dos formas de usarlo (la app o el chat de siempre) para que cada persona elija la que de verdad va a usar todos los días.

## Preguntas frecuentes

### ¿Esto sirve solo para electricistas o para cualquier instalador?
Sirve para cualquier oficio de campo con el mismo problema: fontaneros, climatización, reformas, mantenimiento industrial. Lo que cambia es el vocabulario que aprende el agente de IA y los campos de cada parte, no la arquitectura del sistema.

### ¿Hace falta pagar por una app o una licencia?
No. La app es propia de la empresa (nada de suscripciones mensuales por usuario), y el resto corre sobre Google Sheets, Telegram y n8n — herramientas que cualquier pyme puede empezar a usar sin coste de licencias.

### ¿Cómo llegan las notificaciones sin depender de otra empresa?
Con el protocolo estándar de notificaciones push del propio navegador (el mismo que usa cualquier web grande), implementado sobre la infraestructura de n8n — sin pagar a un servicio externo de mensajería por cada aviso.

### ¿Cuánto se tarda en tener un sistema así?
Depende del alcance. Un agente de Telegram que registre un solo tipo de parte puede estar funcionando en pocas semanas; una app completa como esta, con roles, notificaciones y análisis de facturas, es un proyecto por fases. En el [diagnóstico gratuito](/#contacto) te decimos qué alcance tendría en tu caso.
