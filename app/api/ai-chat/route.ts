import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { messages } = await req.json();
    const prompt = messages[messages.length - 1]?.content || "Hello";

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing API key" }), { status: 500 });
    }

    const google = createGoogleGenerativeAI({ apiKey });
    const result = await generateText({ model: google("models/gemini-2.0-flash"), prompt });

    const reply = result.text || "Gemini didn't respond.";

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    await prisma.chat.create({
      data: {
        message: reply,
        userId: user.id,
      },
    });

    return new Response(JSON.stringify({ message: reply }), { status: 200 });
  } catch (err) {
    console.error("AI error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
