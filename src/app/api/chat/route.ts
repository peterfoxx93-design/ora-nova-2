import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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

    const systemPrompt = `Eres Denti, el asistente virtual de Ora Nova Dental Clinic. 
Eres amable, profesional y conoces todos los servicios de la clínica:
- Ortodoncia Invisible (alineadores transparentes)
- Coronas de Zirconio (restauraciones estéticas)
- Carillas de Porcelana (transformación de sonrisa)
- Implantes de Titanio (reemplazo de dientes)
- Blanqueamiento Dental
- Consulta General

La clínica está ubicada en Av. Reforma 250, Col. Juárez, CDMX.
Teléfono: +52 (55) 1234-5678
Horario: Lun-Vie 9:00-19:00, Sáb 9:00-14:00

Responde siempre en español, sé breve y amable. Si te preguntan por costos, menciona que ofrecen una consulta gratuita donde se realiza un presupuesto personalizado. Invita a agendar una cita usando el formulario en la página.`;

    const contents = [];

    // Add history
    for (const msg of history) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }],
          },
          ...contents,
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
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
