"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
const router = useRouter();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function handleSignup(e: React.FormEvent) {
e.preventDefault();
setLoading(true);
setError("");
const res = await fetch("/api/signup", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});

if (res.ok) {
  router.push("/login");
} else {
  const data = await res.json();
  setError(data.error || "Signup failed");
}

setLoading(false);
}

return (
<div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow">
<h2 className="text-xl font-bold mb-4">Sign Up</h2>
<form onSubmit={handleSignup} className="space-y-4">
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
<button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading} >
{loading ? "Signing up..." : "Sign Up"}
</button>
{error && <p className="text-red-500 text-sm">{error}</p>}
</form>
</div>
);
}