import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import ChatClient from "./ChatClient";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return <div className="p-4 text-center">Please log in to access the chat.</div>;
  }

  const messagesFromDb = await prisma.chat.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "asc" },
  });

  const messages = messagesFromDb.map((msg) => ({
    id: msg.id,
    message: msg.message,
    createdAt: msg.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome, {session.user.email}</h1>
        <form action="/api/auth/signout" method="post">
          <button className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </form>
      </div>
      <ChatClient messages={messages} />
    </div>
  );
}
