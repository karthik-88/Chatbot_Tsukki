// components/ChatUI.tsx
'use client';

import { useSession } from "next-auth/react";

export default function ChatUI() {
  const { data: session } = useSession();

  return <div>Chat interface for {session?.user?.email}</div>;
}
