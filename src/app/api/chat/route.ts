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

// Función que Denti puede llamar para registrar citas
const registerAppointmentFunction = {
  name: "registrar_cita",
  description:
    "Registra una cita en Ora Nova con los datos del paciente. Llama esta función SOLO cuando tengas TODOS los datos requeridos.",
  parameters: {
    type: "object",
    properties: {
      nombre: {
        type: "string",
        description: "Nombre completo del paciente",
      },
      telefono: {
        type: "string",
        description: "Teléfono de contacto (WhatsApp)",
      },
      correo: {
        type: "string",
        description: "Correo electrónico del paciente",
      },
      fecha: {
        type: "string",
        description: "Fecha deseada para la cita (YYYY-MM-DD)",
      },
      hora: {
        type: "string",
        description: "Hora deseada para la cita (HH:MM)",
      },
      servicio: {
        type: "string",
        description:
          "Servicio de interés (Limpieza, Carillas, Implantes, Ortodoncia, Coronas, Resinas, Endodoncia, Consulta General)",
      },
    },
    required: ["nombre", "telefono", "correo", "fecha", "hora", "servicio"],
  },
};

async function sendToWebhook(data: {
  nombre: string;
  telefono: string;
  correo: string;
  fecha: string;
  hora: string;
  servicio: string;
}): Promise<boolean> {
  try {
    const res = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
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

    const systemPrompt = `Eres Denti, el asistente virtual de Ora Nova, una clínica dental de vanguardia.

ERES EMPÁTICO, PROFESIONAL Y AMIGABLE.
TU OBJETIVO PRINCIPAL es recolectar los datos del paciente y REGISTRAR LA CITA directamente usando la función "registrar_cita". NO le digas al paciente que use un botón o formulario — TÚ mismo gestionas la cita.

BASE DE CONOCIMIENTOS:
1. Servicios y Tratamientos:
   - Limpieza Dental: Profilaxis con ultrasonido y pulido coronario.
   - Resinas Compuestas: Restauración con material nanohíbrido.
   - Endodoncia: Tratamiento de conductos bajo magnificación microscópica.
   - Coronas: Recubrimiento total de zirconio o cerámica pura.
   - Implantes Dentales: Dispositivos de titanio o zirconio.
   - Carillas de Porcelana: Diseño de sonrisa con porcelana o resina.
   - Ortodoncia: Brackets o alineadores invisibles (3D).

2. Precios y Presupuestos:
   - NO DES PRECIOS EXACTOS por chat. Invita a una "Consulta de Valoración".

3. Horarios:
   - Lunes a Viernes: 9:00 AM - 6:00 PM.
   - Sábados: 9:00 AM - 2:00 PM.

REGLAS DE INTERACCIÓN:
- Sé conciso y usa viñetas cuando corresponda.
- NUNCA des diagnósticos médicos.
- Mantén un tono positivo y tranquilizador.
- Cuando alguien quiera agendar, pídele los datos UNO POR UNO de forma natural.
- Cuando tengas TODOS los datos (nombre, teléfono, correo, fecha, hora, servicio), USA la función "registrar_cita" para crear la cita automáticamente.
- Después de registrar la cita, confirma al paciente que su cita ha sido agendada.`;

    // Construir historial
    const contents: { role: string; parts: { text: string }[] }[] = [];

    for (const msg of history) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Mensaje actual
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
            functionDeclarations: [registerAppointmentFunction],
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
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
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

    // Verificar si Gemini llamó a la función registrar_cita
    const functionCall =
      candidate?.content?.parts?.[0]?.functionCall;

    if (functionCall?.name === "registrar_cita") {
      const args = functionCall.args as {
        nombre: string;
        telefono: string;
        correo: string;
        fecha: string;
        hora: string;
        servicio: string;
      };

      // Enviar al webhook de Make
      const success = await sendToWebhook(args);

      if (success) {
        // Devolver resultado a Gemini para que confirme al usuario
        const functionResponse = await fetch(
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
                        name: "registrar_cita",
                        args: args,
                      },
                    },
                  ],
                },
                {
                  role: "user",
                  parts: [
                    {
                      functionResponse: {
                        name: "registrar_cita",
                        response: {
                          success: true,
                          message: `Cita registrada exitosamente para ${args.nombre} el ${args.fecha} a las ${args.hora} para ${args.servicio}.`,
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

        if (functionResponse.ok) {
          const resultData = await functionResponse.json();
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
