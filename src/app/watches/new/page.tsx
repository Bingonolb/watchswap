import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { NewWatchForm } from "@/components/NewWatchForm";
import { getUser } from "@/lib/supabase/server";

export default async function NewWatchPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <div style={{ minHeight: "100dvh", background: "#f4f4f4" }}>
      <Navbar />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "36px 32px 60px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 6 }}>Ajouter une montre</h1>
        <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>
          Remplis les infos et ajoute jusqu&apos;à 5 photos pour proposer ta montre à l&apos;échange.
        </p>
        <NewWatchForm />
      </main>
    </div>
  );
}
