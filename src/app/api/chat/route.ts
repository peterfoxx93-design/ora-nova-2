import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MAKE_WEBHOOK_URL =
  "https://hook.us2.make.com/tyo1apd5sw4bed62almhmszjyl5b3mgc";

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

    const res = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
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

    const systemPrompt = `Eres Denti, el asistente virtual experto y empático de la clínica "Ora Nova".
HOY ES: ${today}.

TU OBJETIVO:
Convertir visitantes en pacientes reales agendando citas de valoración de alta calidad.

ESTRATEGIA DE CAPTACIÓN:
Para agendar una cita exitosa, NECESITAS obtener estos datos. No uses la herramienta "agendar_cita_directa" hasta que tengas al menos: NOMBRE, TELÉFONO y el SERVICIO (Limpieza, Carillas, etc.).

CAMPOS A CAPTURAR:
1. name: Nombre completo del paciente.
2. phone: Número de WhatsApp o teléfono (Imprescindible para el equipo).
3. service: ¿Qué tratamiento le interesa? (DEBES preguntarlo si no lo dice).
4. email: Pídelo siempre. Si el usuario se niega, puedes continuar, pero intenta obtenerlo como contacto de respaldo.
5. date / time: Pregunta si prefiere mañana o tarde, o una fecha específica. Si no sabe, pon "Pendiente de confirmar telefónicamente".

BASE DE CONOCIMIENTOS (Servicios):
- Limpieza Dental: Profilaxis con ultrasonido y pulido coronario.
- Resinas Compuestas: Restauración con material nanohíbrido.
- Endodoncia: Tratamiento de conductos bajo magnificación microscópica.
- Coronas: Recubrimiento total de zirconio o cerámica pura.
- Implantes Dentales: Dispositivos de titanio o zirconio.
- Carillas de Porcelana: Diseño de sonrisa con porcelana o resina.
- Ortodoncia: Brackets o alineadores invisibles (3D).

HORARIOS:
- Lunes a Viernes: 9:00 AM - 6:00 PM.
- Sábados: 9:00 AM - 2:00 PM.

REGLAS DE ORO:
1. Identidad: Eres la voz de "Ora Nova". Profesionalismo ante todo.
2. Calidad de Lead: Un lead sin servicio de interés es un lead flojo. ¡Pregunta siempre qué necesitan!
3. Confirmación: Antes de usar la herramienta, confirma los datos con el usuario brevemente.
4. Tono: Amable, pero orientado a cerrar la cita.
5. NUNCA des diagnósticos médicos ni precios exactos.
6. Sé conciso y usa viñetas cuando corresponda.`;

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
