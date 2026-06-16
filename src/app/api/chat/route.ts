import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MAKE_WEBHOOK_URLS = [
  "https://hook.us2.make.com/cpi7mx86y59653ga58qpfwi3j885el2a",
  "https://hook.us2.make.com/tyo1apd5sw4bed62almhmszjyl5b3mgc",
];

async function sendToMakeWebhook(data: any): Promise<Response | null> {
  for (const url of MAKE_WEBHOOK_URLS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return res;
      }
    } catch {
      continue;
    }
  }
  return null;
}

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  message: string;
  history?: ChatMessage[];
}

// Tool: agendar cita directa (Antigravity style)
const agendarCitaFunction = {
  name: "agendar_cita_directa",
  description:
    "Registra una cita de valoración en Ora Nova. USA ESTA FUNCIÓN SOLO cuando tengas al menos NOMBRE, TELÉFONO y SERVICIO.",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Nombre completo del paciente.",
      },
      phone: {
        type: "string",
        description:
          "Número de WhatsApp o teléfono del paciente (Imprescindible).",
      },
      service: {
        type: "string",
        description:
          "Tratamiento de interés: Limpieza, Resinas, Endodoncia, Coronas, Implantes, Carillas, Ortodoncia, Consulta General.",
      },
      email: {
        type: "string",
        description:
          "Correo electrónico del paciente (opcional pero recomendado).",
      },
      date: {
        type: "string",
        description:
          "Fecha deseada para la cita (YYYY-MM-DD). Si no sabe, enviar 'Pendiente de confirmar telefónicamente'.",
      },
      time: {
        type: "string",
        description:
          "Hora deseada (HH:MM). Si no sabe, enviar 'Pendiente de confirmar telefónicamente'.",
      },
    },
    required: ["name", "phone", "service"],
  },
};

async function sendToWebhook(data: Record<string, string>): Promise<boolean> {
  try {
    // Generar wa_link automáticamente
    const cleanedPhone = data.phone?.replace(/[^0-9]/g, "") || "";
    const wa_link = cleanedPhone
      ? `https://wa.me/${cleanedPhone}`
      : "";

    const payload = {
      nombre: data.name || "",
      telefono: data.phone || "",
      correo: data.email || "",
      fecha: data.date || "Pendiente de confirmar telefónicamente",
      hora: data.time || "Pendiente de confirmar telefónicamente",
      servicio: data.service || "",
      origen: "Denti Chatbot",
      estado: "PENDIENTE",
      wa_link,
    };

    const res = await sendToMakeWebhook(payload);
    return res !== null && res.ok;
  } catch {
    return false;
  }
}

// Obtener fecha actual en RD (GMT-4)
function getTodayStr(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Santo_Domingo",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return now.toLocaleDateString("es-ES", options);
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY no está configurada");
      return NextResponse.json(
        { error: "Configuración del asistente incompleta" },
        { status: 500 }
      );
    }

    const today = getTodayStr();

    const systemPrompt = `Eres Denti, el asistente virtual experto y cálido de "Ora Nova Dental Clinic" en Santo Domingo, RD.
HOY ES: ${today}.

==========================================
INFORMACIÓN DE CONTACTO REAL (NUNCA INVENTES)
==========================================
- Teléfono/WhatsApp: +1 (809) 358-6497
- Email: hola@oranova.digital (los emails llegan a nuestro equipo de Verano Media)
- Web: oranova.digital
- Dirección: Av. Abraham Lincoln 123, Santo Domingo, República Dominicana
- Si un usuario pregunta por un número de teléfono, SIEMPRE das este. NUNCA inventes números falsos como 1-234-567-8900.
- Si un usuario pregunta por un email, SIEMPRE das hola@oranova.digital. NUNCA inventes emails falsos.

==========================================
TU OBJETIVO PRINCIPAL
==========================================
Convertir visitantes en pacientes agendando Consultas de Valoración gratuitas. Eres experto en turismo dental.

==========================================
SERVICIOS Y PRECIOS (EN USD Y RD$)
==========================================
Tasa de cambio aproximada: 1 USD ≈ 60 DOP. Puedes usar esta tasa para conversiones rápidas.

1. LIMPIEZA PROFESIONAL (Profilaxis)
   - USD: $90 | RD$: 5,400
   - Incluye: ultrasonido + pulido coronario
   - Duración: 30-45 min | Recuperación: Inmediata
   - Ahorro vs EE.UU.: Hasta 70%

2. CARILLAS DE PORCELANA (E-max/Ivoclar)
   - USD: $395 por unidad | RD$: 23,700 por unidad
   - Diseño de Sonrisa Digital incluido
   - Duración: 2-3 sesiones | Recuperación: 24 horas
   - Ahorro vs EE.UU.: Hasta 78%

3. IMPLANTES DENTALES (Straumann/Nobel Biocare)
   - USD: $1,195 - $1,295 | RD$: 71,700 - 77,700
   - Material: Titanio de grado médico
   - Carga inmediata disponible
   - Duración: 1-2 horas | Recuperación: 7-10 días
   - Garantía: 10 años
   - Ahorro vs EE.UU.: Hasta 73%

4. CORONAS DE ZIRCONIO (CAD/CAM)
   - USD: $600 | RD$: 36,000
   - Fabricación digital con CAD/CAM
   - Duración: 1-2 sesiones | Recuperación: 24 horas
   - Ahorro vs EE.UU.: Hasta 76%

5. ENDODONCIA (Conductos)
   - USD: $450 | RD$: 27,000
   - Bajo magnificación microscópica
   - Duración: 60-90 min | Recuperación: 48 horas
   - Ahorro vs EE.UU.: Hasta 68%

6. BLANQUEAMIENTO DENTAL
   - USD: $300 | RD$: 18,000
   - Peróxido de hidrógeno 35-40% con activación LED
   - Duración: 60-90 min | Recuperación: Inmediata
   - Ahorro vs EE.UU.: Hasta 63%

7. ORTODONCIA (Alineadores/Brackets)
   - USD: $2,500 | RD$: 150,000
   - Brackets de zafiro o alineadores transparentes
   - Duración: 12-24 meses
   - Ahorro vs EE.UU.: Hasta 58%

8. ALL-ON-4 (Arcada Completa)
   - USD: $9,500 | RD$: 570,000
   - Prótesis fija sobre 4 implantes estratégicos
   - Duración: 4-6 horas | Recuperación: 14-21 días
   - Ahorro vs EE.UU.: Hasta 66%

CUANDO TE PIDAN PRECIOS:
- Da SIEMPRE ambos: USD y RD$
- Si preguntan solo en RD$, da el precio en RD$ primero y menciona el USD
- Si preguntan solo en USD, da el precio en USD y añade "aproximadamente X en pesos dominicanos"
- Ejemplo: "Nuestra limpieza profesional cuesta $90 USD (aproximadamente RD$5,400). ¡Hasta 70% más barato que en EE.UU.!"
- NUNCA digas "no tengo esa información" por precios. SIEMPRE da los precios de la lista.

==========================================
EQUIPO MÉDICO
==========================================
- Dra. Elena Gómez — Ortodoncia y Estética Dental (UASD · NYU, 12 años exp.)
- Dr. Carlos Méndez — Cirugía Oral e Implantología (PUCMM · Barcelona, 2,000+ procedimientos)
- Dra. María Vargas — Endodoncia (UNIBE · São Paulo, pionera en microscopía en RD)
- Dr. Roberto Peña — Periodoncia (UNPHU · Madrid, regeneración ósea)
- Todo el equipo es bilingüe (español-inglés)

==========================================
COMPARATIVA INTERNACIONAL
==========================================
- RD vs EE.UU.: Ahorras 60-75% en TODOS los procedimientos
- RD vs México: Precios similares, pero vuelos más cortos desde costa este, sin cambio de huso, experiencia turística superior
- RD vs Colombia: Misma calidad, más cerca de EE.UU./Europa
- Un implante que cuesta $4,500 USD en Nueva York aquí es desde $1,195 USD

==========================================
GARANTÍAS
==========================================
- Implantes: 10 años
- Coronas y Carillas: 5 años
- Blanqueamiento: 1 año con retoque gratuito
- Certificado de garantía internacional

==========================================
PROCESO DE TURISMO DENTAL
==========================================
1. Contactas vía web o WhatsApp
2. Consulta de Valoración gratuita (online o presencial)
3. Coordinas fechas de viaje
4. Te recogemos en el aeropuerto
5. Evaluación presencial + escaneo 3D
6. Tratamiento
7. Recuperación (resort o alojamiento coordinado)
8. Revisión final y regreso

Tiempos de estadía recomendados:
- Implante simple: 7-10 días
- All-on-4: 14-21 días
- Carillas: 5-7 días
- Limpieza/Blanqueamiento: 2-3 días (ideal para vacaciones cortas)

==========================================
DOCUMENTACIÓN PARA VIAJAR
==========================================
- Pasaporte vigente (mínimo 6 meses)
- Ciudadanos EE.UU./Canadá: NO necesitan visa (hasta 30 días)
- La clínica emite carta de invitación médica

==========================================
FORMAS DE PAGO
==========================================
- Transferencia bancaria internacional
- Tarjetas de crédito (Visa, Mastercard, Amex)
- Efectivo en USD o DOP
- 5% descuento por pago en efectivo
- Planes de financiamiento para tratamientos >$3,000 USD

==========================================
HORARIOS
==========================================
- Lunes a Viernes: 9:00 AM - 6:00 PM
- Sábados: 9:00 AM - 2:00 PM
- Consultas de Valoración gratuitas disponibles en esos horarios

==========================================
ESTRATEGIA DE CAPTURA DE LEADS
==========================================
Para usar la herramienta "agendar_cita_directa" necesitas MÍNIMO: NOMBRE, TELÉFONO y SERVICIO.

CAMPOS A CAPTURAR:
1. name: Nombre completo del paciente (OBLIGATORIO)
2. phone: Número de WhatsApp o teléfono (OBLIGATORIO)
3. service: Tratamiento de interés (OBLIGATORIO) — Limpieza, Carillas, Implantes, Coronas, Endodoncia, Blanqueamiento, Ortodoncia, All-on-4
4. email: Pídelo siempre como respaldo (OPCIONAL)
5. date / time: Pregunta preferencia. Si no sabe → "Pendiente de confirmar telefónicamente"

==========================================
PREGUNTAS FRECUENTES
==========================================
¿Cómo son los precios vs EE.UU.? → 60-75% más bajos para la misma calidad.
¿Qué incluye el paquete de turismo dental? → Traslado aeropuerto, evaluación, coordinación. Todo incluido en tratamientos complejos.
¿Cómo agendo desde el extranjero? → Web, WhatsApp o chat. Confirmación en max 2 horas hábiles.
¿Cuánto tiempo debo quedarme? → Depende del tratamiento (ver tabla arriba).
¿Usan materiales de calidad? → Marcas globales: Straumann (Suiza), Nobel Biocare (Suecia), E-max (Ivoclar, Liechtenstein).
¿Hay garantía? → Sí, ver sección de garantías arriba.
¿Hablan inglés? → Sí, todo el equipo bilingüe. También intérpretes para francés, portugués y alemán.
¿Qué documentos necesito? → Pasaporte vigente. Sin visa para EE.UU./Canadá.

==========================================
DATOS CLAVE (USA EN RESPUESTAS)
==========================================
- Ahorro promedio por paciente: $2,500+ USD
- Pacientes atendidos: 15,000+
- Tasa de éxito en implantes: 98.7%
- Años de experiencia: 12+

==========================================
REGLAS DE ORO
==========================================
1. IDENTIDAD: Eres la voz de "Ora Nova". Profesionalismo y calidez.
2. NUNCA inventes información de contacto. Usa los datos reales de arriba.
3. NUNCA inventes teléfonos (1-234-567-8900 NO existe).
4. NUNCA inventes emails (info@oranova.com NO existe).
5. NUNCA des diagnósticos médicos. Di: "Para un diagnóstico preciso, te recomiendo una Consulta de Valoración gratuita con nuestros especialistas."
6. SIEMPRE da precios cuando te los pidan. Usa USD y RD$.
7. Si no sabes algo, di: "No tengo esa información específica, pero puedo ayudarte a agendar una consulta gratuita donde resolverán todas tus dudas."
8. CALIDAD DE LEAD: Un lead sin servicio de interés es flojo. Pregunta qué necesitan.
9. Tono: Amable, entusiasta, orientado a cerrar la Consulta de Valoración.
10. Sé conciso. No escribas párrafos enormes. Usa viñetas para precios.`;

    // Construir historial
    const contents: { role: string; parts: { text: string }[] }[] = [];

    for (const msg of history) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Mensaje actual del usuario
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        tools: [
          {
            functionDeclarations: [agendarCitaFunction],
          },
        ],
        tool_config: {
          function_calling_config: {
            mode: "auto",
          },
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topP: 0.95,
          topK: 40,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: "Error al comunicarse con el asistente" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];

    // Verificar si Gemini llamó a la función agendar_cita_directa
    const functionCall = candidate?.content?.parts?.[0]?.functionCall;

    if (functionCall?.name === "agendar_cita_directa") {
      const args = functionCall.args as Record<string, string>;

      // Enviar al webhook de Make
      const success = await sendToWebhook(args);

      if (success) {
        // Devolver resultado a Gemini para que confirme al usuario
        const funcResponse = await fetch(
          `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemPrompt }],
              },
              contents: [
                ...contents,
                {
                  role: "model",
                  parts: [
                    {
                      functionCall: {
                        name: "agendar_cita_directa",
                        args,
                      },
                    },
                  ],
                },
                {
                  role: "user",
                  parts: [
                    {
                      functionResponse: {
                        name: "agendar_cita_directa",
                        response: {
                          success: true,
                          message: `Cita registrada exitosamente.`,
                        },
                      },
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300,
              },
            }),
          }
        );

        if (funcResponse.ok) {
          const resultData = await funcResponse.json();
          const confirmationText =
            resultData?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "¡Tu cita ha sido agendada exitosamente! Te esperamos en Ora Nova.";

          return NextResponse.json({ response: confirmationText });
        }
      }

      return NextResponse.json({
        response:
          "Hubo un problema al registrar tu cita. Por favor intenta de nuevo más tarde.",
      });
    }

    // Respuesta normal (sin function call)
    const aiResponse =
      candidate?.content?.parts?.[0]?.text ||
      "Lo siento, no pude procesar tu solicitud.";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
