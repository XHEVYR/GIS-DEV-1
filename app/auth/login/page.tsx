"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const result = await signIn("credentials", { username, password, redirect: false });
  if (result?.ok) router.push("/admin");
  else alert("Gagal Login!");
};

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-xl font-bold mb-4">Login Admin</h1>
        <input className="border p-2 w-full mb-2" placeholder="Username (admin)" onChange={e=>setUsername(e.target.value)} />
        <input className="border p-2 w-full mb-4" type="password" placeholder="Password (123)" onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white w-full p-2 rounded">Masuk</button>
      </form>
    </div>
  );
}