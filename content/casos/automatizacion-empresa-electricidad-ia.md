---
title: Automatizamos los partes de trabajo de un electricista con un agente de IA en Telegram
seoTitle: Automatización con IA para electricistas: caso real | O.N.E Agency
description: Cómo construimos un sistema con n8n y un agente de IA en Telegram para que un electricista registre partes, materiales y presupuestos sin papeleo.
lead: Instalaciones Carrillo es una empresa de electricidad de Santaella (Córdoba). Así es el sistema que le construimos para que dejar de rellenar partes a mano.
cluster: sectores
sector: Construcción / Obra
client: Instalaciones Carrillo (Juan Carrillo Nieto), electricista en Santaella, Córdoba
clientLocation: Santaella, Córdoba, España
date: 2026-09-29
---

## El punto de partida

Instalaciones Carrillo es una empresa de electricidad de Santaella, en Córdoba: instalaciones, averías, boletines y mantenimiento para particulares y empresas de la zona. Como en la mayoría de empresas de instalaciones, el trabajo real pasa fuera de la oficina: en la obra, en casa del cliente, subido a una escalera. El papeleo —quién trabajó, cuántas horas, qué material se usó, en qué cliente— se apunta a mano o se intenta recordar por la noche.

Ese es el problema que resuelve casi cualquier sistema de gestión para electricistas o instaladores: cómo capturar la información del día sin obligar a nadie a rellenar un formulario con las manos llenas de grasa o con prisa por llegar al siguiente aviso.

## Lo que construimos

Un sistema hecho a medida sobre [n8n](/blog/n8n-que-es-y-como-usarlo-en-tu-empresa/), con una web privada para el equipo y, sobre todo, una vía todavía más rápida: Telegram.

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
<text x="102.0" y="108.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10.5" fill="#64748B">mensaje de voz o texto</text>
<rect x="212.0" y="46" width="168" height="92" rx="14" fill="#F8FAFC"/>
<rect x="212.0" y="46" width="168" height="92" rx="14" fill="rgba(249,115,22,.12)" stroke="#F97316" stroke-width="2"/>
<text x="296.0" y="88.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="13.5" font-weight="800" fill="#0F172A">Agente de IA</text>
<text x="296.0" y="108.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10.5" fill="#64748B">n8n + OpenAI</text>
<rect x="406.0" y="46" width="168" height="92" rx="14" fill="#F8FAFC"/>
<rect x="406.0" y="46" width="168" height="92" rx="14" fill="rgba(15,23,42,.04)" stroke="#64748B" stroke-width="1"/>
<text x="490.0" y="88.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="13.5" font-weight="800" fill="#0F172A">Google Sheets</text>
<text x="490.0" y="108.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10.5" fill="#64748B">cliente · horas · material</text>
<rect x="600.0" y="46" width="168" height="92" rx="14" fill="#F8FAFC"/>
<rect x="600.0" y="46" width="168" height="92" rx="14" fill="#ffffff" stroke="#0F172A" stroke-width="1"/>
<text x="684.0" y="88.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="13.5" font-weight="800" fill="#0F172A">Resumen diario</text>
<text x="684.0" y="108.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10.5" fill="#64748B">automático, cada tarde</text>
<rect x="794.0" y="46" width="168" height="92" rx="14" fill="#F8FAFC"/>
<rect x="794.0" y="46" width="168" height="92" rx="14" fill="rgba(100,116,139,.08)" stroke="#64748B" stroke-width="1"/>
<text x="878.0" y="88.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="13.5" font-weight="800" fill="#0F172A">Jefe de obra</text>
<text x="878.0" y="108.0" text-anchor="middle" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10.5" fill="#64748B">sin pedirlo</text>
<line x1="18.0" y1="158" x2="962.0" y2="158" stroke="#E2E8F0" stroke-width="1"/>
<circle cx="23.0" cy="172" r="4.5" fill="#F97316"/>
<text x="34.0" y="175.5" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10" fill="#64748B">Agente de IA (n8n + OpenAI)</text>
<circle cx="218.2" cy="172" r="4.5" fill="#64748B"/>
<text x="229.2" y="175.5" font-family="'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="10" fill="#64748B">Datos y personas</text>
</svg>
<figcaption style="margin-top:10px;font-size:.82rem;color:#64748B">El camino de un parte de trabajo, de principio a fin: de un mensaje suelto a un resumen que llega solo.</figcaption>
</figure>

### Un agente de IA que entiende cómo habla un electricista, no un formulario

Esta es la pieza central del sistema. El electricista no rellena ningún formulario: le escribe a un bot de Telegram tal cual hablaría por WhatsApp con un compañero. Por ejemplo:

> "Joaquín debajo museo, angel y pino, de 9 a 11, 2 marcos"

El agente de IA interpreta ese mensaje entero solo: identifica que "Joaquín debajo museo" es el cliente (así es como lo tienen registrado, con el lugar incluido en el nombre), que Ángel y Pino son los dos trabajadores, que el horario "de 9 a 11" son 2 horas, y que se han usado 2 marcos como material. Con eso registra el parte del día directamente en la hoja de cálculo de la empresa, sin que nadie tenga que abrir una app ni escribir una sola palabra de más.

Si falta un dato realmente imprescindible, el agente pregunta. Si no, no interrumpe: solo confirma que ha quedado registrado.

### El resto del sistema

- **Presupuestos analizados con IA**: los presupuestos que llegan por la web se analizan automáticamente antes de que el equipo los revise.
- **Control de materiales**: los materiales usados en cada parte se validan y quedan trazados por obra y por cliente.
- **Gestión de clientes**: alta, archivado y baja de clientes desde el propio sistema, sin tocar la hoja de cálculo a mano.
- **Acceso del equipo**: cada trabajador entra con su propio usuario para registrar sus partes desde la web.
- **Resumen diario automático**: cada día, un informe con todos los partes del día llega solo a quien dirige la empresa — sin tener que pedirlo ni montarlo.
- **Avisos push**: notificaciones instantáneas cuando pasa algo que requiere atención.

### Cómo está construido por dentro

:::note
Todo el sistema corre sobre **n8n** como motor de automatización, con **Google Sheets** como base de datos (sencilla, sin coste de mantenimiento y que el propio equipo puede abrir y entender), un **agente de IA con memoria persistente** (Postgres) para el bot de Telegram, y una arquitectura modular: cada automatización complicada (como guardar o consultar materiales) es un flujo independiente reutilizable, no un bloque de lógica repetido en cada sitio donde hace falta.
:::

No es una plantilla genérica: cada pieza —desde cómo interpreta el agente una frase mal puntuada hasta cómo se calculan las horas de un rango horario— está hecha para cómo trabaja realmente este equipo, no al revés.

## Por qué este enfoque, y no una app de gestión genérica

Las aplicaciones de gestión para instaladores obligan a aprender una interfaz nueva y a rellenar campos. Aquí la interfaz ya la conocía todo el equipo: es la misma app de mensajería que usan para todo lo demás. Eso es lo que marca la diferencia entre un sistema que el equipo usa todos los días y uno que se abandona a la semana.

## Preguntas frecuentes

### ¿Esto sirve solo para electricistas o para cualquier instalador?
Sirve para cualquier oficio de campo con el mismo problema: fontaneros, climatización, reformas, mantenimiento industrial. Lo que cambia es el vocabulario que aprende el agente de IA (los materiales, la jerga, cómo identifican a sus clientes), no la arquitectura del sistema.

### ¿Hace falta cambiar de herramientas para tener algo así?
No. Este sistema usa Google Sheets, Telegram y n8n: herramientas que cualquier pyme puede empezar a usar sin coste de licencias ni una web nueva. Se puede construir sobre lo que ya usa el negocio.

### ¿Cuánto se tarda en tener un sistema así?
Depende del alcance. Un agente de Telegram que registre un solo tipo de parte puede estar funcionando en pocas semanas; un sistema completo como este, con web, materiales, presupuestos y gestión de clientes, es un proyecto por fases. En el [diagnóstico gratuito](/#contacto) te decimos qué alcance tendría en tu caso.
