import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import ChatClient from "./ChatClient";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return <div className="p-4 text-center">Please log in to access the chat.</div>;
  }

  // 🧹 Clear all old messages when user logs in
  await prisma.chat.deleteMany({
    where: { user: { email: session.user.email } },
  });

  // 🟢 Start with empty chat
  const messages: { id: number; message: string; createdAt: string }[] = [];

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome, {session.user.email}</h1>
        <form action="/api/auth/signout" method="post">
          <button className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </form>
      </div>

      <ChatClient messages={messages} userEmail={session.user.email} />
    </div>
  );
}
