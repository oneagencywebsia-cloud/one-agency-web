---
title: Chatbot de WhatsApp para empresas: guía completa
seoTitle: Chatbot para empresas con WhatsApp e IA: guía completa
description: Qué es un chatbot de WhatsApp con IA, qué puede y no puede hacer, cómo funciona por dentro, qué exige la ley y cómo implantarlo paso a paso en tu empresa.
lead: Cómo funciona un asistente de IA en WhatsApp, qué necesitas para ponerlo en marcha, qué exige la normativa y cómo evitar que dé mala imagen a tu marca.
cluster: chatbots-whatsapp
type: pillar
keyword: chatbot whatsapp empresas
date: 2026-09-21
modified: 2026-11-04
---

En España WhatsApp es el canal donde tus clientes ya están. Preguntan horarios, piden cita, consultan el estado de un pedido o solicitan presupuesto. El problema es que un mensaje sin respuesta durante horas suele ser un cliente perdido, y atender el móvil fuera de horario no es sostenible.

Un **chatbot de WhatsApp con inteligencia artificial** responde al instante, a cualquier hora, con información de tu negocio, y pasa la conversación a una persona cuando hace falta. Bien hecho, mejora la atención. Mal hecho, irrita a los clientes. Esta guía explica cómo hacerlo bien.

:::tip En 30 segundos
Para automatizar WhatsApp en serio necesitas la API oficial de WhatsApp Business (no basta la app normal), un sistema que gestione la conversación, una base de conocimiento con la información real de tu negocio y una regla clara de cuándo pasa a una persona. Con eso se pueden resolver solas muchas consultas repetitivas.
:::

## Qué es un chatbot de WhatsApp con IA

Hay dos generaciones de bots y conviene no confundirlas:

- **Bot de menú o de botones:** ofrece opciones cerradas ("Pulsa 1 para horarios, 2 para citas"). Es predecible pero rígido; si el cliente escribe algo fuera del guion, se pierde.
- **Asistente con IA conversacional:** entiende mensajes escritos con libertad, incluso con faltas o varias preguntas a la vez, y responde con lenguaje natural apoyándose en la información que le proporcionas.

La opción más robusta suele ser **híbrida**: flujos guiados para lo crítico (reservar una cita, tomar datos de un pedido) e IA para entender la intención y contestar dudas abiertas.

## Qué puede y qué no puede hacer

| Suele hacerlo bien | Conviene dejarlo en manos de una persona |
|---|---|
| Responder horarios, ubicación, servicios y condiciones | Reclamaciones y clientes molestos |
| Tomar datos para un presupuesto o una cita | Negociar precios o condiciones especiales |
| Confirmar y recordar citas | Casos con consecuencias legales o económicas altas |
| Informar del estado de un pedido si está conectado a tu sistema | Decisiones que requieren criterio profesional |
| Filtrar contactos y avisar al equipo de los interesantes | Cualquier cosa que el bot no sepa con certeza |

La regla de oro: **el bot nunca debe inventar**. Si no tiene la información, lo correcto es reconocerlo y derivar a una persona.

## Cómo funciona por dentro

Detrás de un chatbot de WhatsApp hay varias piezas:

1. **API de WhatsApp Business.** Es la vía oficial de Meta para conectar el número de tu empresa con sistemas externos. Se accede a través de la Cloud API de Meta o de un proveedor autorizado.
2. **Un orquestador.** Recibe cada mensaje, decide qué hacer y llama a las demás piezas. Nosotros lo montamos con [n8n](/blog/n8n-que-es-y-como-usarlo-en-tu-empresa/), pero hay otras opciones.
3. **El modelo de IA.** Interpreta el mensaje y redacta la respuesta.
4. **La base de conocimiento.** Documentos con lo que el bot puede afirmar: servicios, precios orientativos, políticas, preguntas frecuentes. La calidad del bot depende sobre todo de esto.
5. **Conexiones con tus sistemas.** Agenda, CRM, tienda online, hoja de pedidos. Sin ellas el bot solo informa; con ellas, actúa.
6. **Derivación a humano.** Un aviso al equipo (por ejemplo en Telegram o en tu bandeja de entrada) con el resumen de la conversación.

## WhatsApp Business App frente a la API

Mucha gente empieza con la aplicación gratuita de WhatsApp Business y llega a su límite cuando quiere automatizar de verdad.

| | App WhatsApp Business | API de WhatsApp Business |
|---|---|---|
| Uso | Un móvil, una persona | Varios usuarios y sistemas conectados |
| Automatización | Mensajes de bienvenida, ausencia y respuestas rápidas | Conversaciones automatizadas con IA e integraciones |
| Mensajes a iniciar tú | Manuales | Mediante plantillas aprobadas por Meta |
| Integración con CRM, agenda, tienda | No | Sí |
| Coste | Sin coste de uso | Coste por mensaje según categoría, más el del proveedor o la infraestructura |

Dos conceptos que conviene conocer: la **ventana de atención de 24 horas** (dentro de ese plazo desde el último mensaje del cliente puedes responder libremente) y las **plantillas de mensaje** (fuera de esa ventana, para iniciar una conversación hay que usar plantillas previamente aprobadas). Las tarifas de Meta cambian con el tiempo; consulta siempre las vigentes.

## Casos de uso habituales por tipo de negocio

- **Clínicas y servicios con cita:** reservar, cambiar y recordar citas. Lo vemos en [automatizar una clínica](/blog/automatizar-una-clinica-citas-y-recordatorios/).
- **Comercios y tiendas:** consultas de stock, pedidos y estado de envío. Ver [automatizar un comercio](/blog/automatizar-un-comercio-pedidos-stock-y-clientes/).
- **Empresas de servicios y obra:** recoger datos para presupuestos y agendar visitas. Ver [automatizar una empresa de construcción](/blog/automatizar-una-empresa-de-construccion-y-obra/).
- **Inmobiliarias:** filtrar interesados y programar visitas.
- **Academias:** información de cursos, matrícula y recordatorios.

## Cómo diseñar bien la conversación

Un chatbot no es solo tecnología; es diseño de atención al cliente.

- **Preséntate como asistente automático.** Es honesto y, además, se está imponiendo como obligación de transparencia.
- **Define el tono.** Cercano y claro, coherente con tu marca. Ni robótico ni excesivamente informal.
- **Limita lo que puede afirmar.** Solo responde con lo que está en tu base de conocimiento. Precios y plazos sensibles, mejor con rangos claros o derivando.
- **Pregunta de uno en uno.** Las cadenas de preguntas largas agotan al cliente.
- **Ofrece siempre una salida a una persona.** "Escribe 'persona' y te atiende alguien del equipo" reduce la frustración.
- **Ten un plan para lo inesperado.** Audios, imágenes, idiomas distintos, mensajes fuera de tema.

## Aspectos legales que no debes ignorar

Esto no es asesoramiento jurídico, pero estos puntos aparecen siempre:

- **Protección de datos (RGPD).** El cliente debe saber quién trata sus datos, para qué y con qué base legal. Si el bot recoge datos personales, hay que informarle.
- **Comunicaciones comerciales.** Enviar publicidad por WhatsApp requiere consentimiento previo. Responder a quien te escribe es distinto de escribir tú primero.
- **Transparencia sobre la IA.** La normativa europea de inteligencia artificial establece obligaciones de transparencia cuando una persona interactúa con un sistema de IA. El calendario de aplicación es escalonado y se está ajustando, así que conviene revisar la situación vigente.
- **Políticas de WhatsApp.** Meta puede limitar o bloquear números que hagan spam o incumplan sus políticas.

Hablamos más de esto en [ChatGPT y agentes de IA para empresas](/blog/chatgpt-y-agentes-de-ia-para-empresas/).

## Chatbot para empresas: tipos y cuál elegir

Un **chatbot para empresas** es un programa que atiende conversaciones con clientes de forma automática por WhatsApp, web u otros canales. Según cómo esté construido, cambia lo que puede hacer y lo que cuesta mantenerlo:

| Tipo | Cómo responde | Mejor para | Límite principal |
|---|---|---|---|
| Bot de menú | Opciones cerradas con botones | Procesos muy simples y repetitivos | Se pierde si el cliente escribe fuera del guion |
| Asistente con IA | Lenguaje natural basado en la información de tu negocio | Dudas abiertas y atención general | Hay que limitar lo que puede afirmar y revisar conversaciones |
| Híbrido | Flujos guiados para lo crítico e IA para entender la intención | La mayoría de pymes y empresas de oficios | Requiere diseñar bien el traspaso a una persona |

Para una pyme, lo habitual es empezar por un caso de uso acotado (citas, solicitudes de presupuesto o preguntas frecuentes) y ampliar después con datos reales. Si estás en Andalucía, mira cómo lo planteamos en [chatbots de WhatsApp con IA en Córdoba](/servicios/chatbots-whatsapp-cordoba/) o consulta el [servicio de chatbots y WhatsApp](/servicios/chatbots-whatsapp/).

## Cuánto cuesta

El coste se compone de varias partes: la implantación (diseño, base de conocimiento, integraciones), el coste recurrente de mensajes de WhatsApp y de uso del modelo de IA, y el mantenimiento. Tienes el desglose en [cuánto cuesta un chatbot de WhatsApp para empresas](/blog/cuanto-cuesta-un-chatbot-de-whatsapp-para-empresas/) y una visión más amplia en [cuánto cuesta automatizar una empresa](/blog/cuanto-cuesta-automatizar-una-empresa/).

## Cómo implantarlo paso a paso

1. **Elige un caso de uso concreto:** por ejemplo, resolver las diez preguntas más frecuentes y gestionar citas.
2. **Reúne el contenido:** las preguntas reales que recibes y las respuestas correctas.
3. **Configura la API y el número.** Suele requerir verificar el negocio con Meta y un número dedicado.
4. **Diseña los flujos y la derivación** a una persona.
5. **Conecta tus sistemas** (agenda, CRM) si el bot debe actuar y no solo informar.
6. **Pilota con supervisión.** Revisa las conversaciones las primeras semanas y corrige respuestas.
7. **Mide y ajusta.**

## Qué medir

- Porcentaje de conversaciones resueltas sin intervención humana.
- Tiempo medio de primera respuesta.
- Citas, pedidos o presupuestos generados desde el chat.
- Satisfacción de los clientes y motivos de derivación.
- Horas del equipo liberadas. Puedes estimar el retorno con la [calculadora de ahorro](/recursos/calculadora-ahorro-automatizacion/).

## Preguntas frecuentes

### ¿Qué es un chatbot para empresas?

Es un asistente automático que responde a tus clientes por WhatsApp, web u otros canales, a cualquier hora y con la información de tu negocio. Resuelve las consultas repetitivas y pasa la conversación a una persona cuando hace falta criterio o trato personal.

### ¿Qué chatbot es mejor para una pyme?

Suele funcionar mejor uno híbrido: flujos guiados para acciones críticas como reservar una cita o tomar los datos de un presupuesto, e IA para entender mensajes libres. Lo importante es empezar con un caso de uso acotado y medir antes de ampliar.

### ¿Puedo usar mi número de WhatsApp actual?

Depende del proveedor y de la configuración. Tradicionalmente, un número conectado a la API deja de poder usarse en la app normal, aunque existen fórmulas de convivencia entre ambas. Conviene decidirlo antes de empezar para no perder el histórico.

### ¿El chatbot entiende audios e imágenes?

Los audios se pueden transcribir y las imágenes analizar, pero cada capacidad añade complejidad y coste. Se decide según el caso de uso.

### ¿Qué pasa si el bot no sabe la respuesta?

Un buen diseño lo contempla: reconoce que no tiene esa información, ofrece derivar a una persona y avisa al equipo con el resumen de la conversación.

### ¿Me pueden bloquear el número?

Si se respetan las políticas de WhatsApp (consentimiento, plantillas aprobadas, no enviar spam), el riesgo es bajo. El problema aparece con envíos masivos sin permiso.

### ¿Puede atender en varios idiomas?

Sí. Los modelos actuales manejan bien varios idiomas, pero conviene revisar la calidad en cada uno con tu vocabulario específico.
