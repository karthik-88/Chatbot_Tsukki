import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { message } = await req.json();

  if (!message || message.trim() === "") {
    return new Response("Message required", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const newMessage = await prisma.chat.create({
    data: {
      message,
      userId: user.id,
    },
  });

  return new Response(JSON.stringify(newMessage), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
