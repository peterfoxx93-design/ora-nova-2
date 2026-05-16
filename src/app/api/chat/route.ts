import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  message: string;
  history?: ChatMessage[];
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
Tu objetivo es responder dudas de los pacientes y guiarlos a agendar una cita usando el botón "Agendar Cita" de la pantalla.

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
   - NO DES PRECIOS EXACTOS por chat.
   - Invita siempre a una "Consulta de Valoración" presencial.

3. Horarios:
   - Lunes a Viernes: 9:00 AM - 6:00 PM.
   - Sábados: 9:00 AM - 2:00 PM.

REGLAS DE INTERACCIÓN:
- Sé conciso y usa viñetas cuando corresponda.
- NUNCA des diagnósticos médicos.
- Mantén un tono positivo y tranquilizador.
- Siempre termina invitando a hacer clic en "Agendar Cita".`;

    // Construir historial correctamente para Gemini
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
        // ✅ System instruction va en campo separado, NO como mensaje de usuario
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.95,
          topK: 40,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
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

    const aiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
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
