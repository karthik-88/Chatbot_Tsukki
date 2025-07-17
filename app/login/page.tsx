"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const router = useRouter();

async function handleLogin(e: React.FormEvent) {
e.preventDefault();
setError("");
const res = await signIn("credentials", {
  email,
  password,
  redirect: false,
});

if (res?.ok) {
  router.push("/chat");
} else {
  setError("Invalid email or password");
}
}

return (
<div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow">
<h2 className="text-xl font-bold mb-4">Login</h2>
<form onSubmit={handleLogin} className="space-y-4">
<input
type="email"
required
className="w-full p-2 border rounded"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
/>
<input
type="password"
required
className="w-full p-2 border rounded"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>
<button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" >
Login
</button>
{error && <p className="text-red-500 text-sm">{error}</p>}
</form>
  {/* Sign Up link */}
  <p className="text-center text-sm mt-4">
    Don’t have an account?{" "}
    <a href="/signup" className="text-blue-600 hover:underline">
      Sign Up
    </a>
  </p>
</div>
);
}