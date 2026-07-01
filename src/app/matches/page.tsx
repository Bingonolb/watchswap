import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { MatchesClient } from "./MatchesClient";

export default async function MatchesPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <div style={{ minHeight: "100dvh", background: "#f4f4f4" }}>
      <Navbar />
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "36px 32px 60px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 24 }}>Mes échanges</h1>
        <MatchesClient userId={user.id} />
      </main>
    </div>
  );
}
