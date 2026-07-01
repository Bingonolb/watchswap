import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { createClient, getUser } from "@/lib/supabase/server";
import { CONDITION_LABELS, type Watch } from "@/lib/types";
import { WatchStatusControls } from "@/components/WatchStatusControls";

export default async function MyWatchesPage() {
  const [user, supabase] = await Promise.all([getUser(), createClient()]);
  if (!user) redirect("/login");

  const { data: watches } = await supabase
    .from("watches").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });

  const list = (watches ?? []) as unknown as Watch[];

  return (
    <div style={{ minHeight: "100dvh", background: "#f4f4f4" }}>
      <Navbar />
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "36px 32px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111" }}>Mes montres</h1>
          <Link href="/watches/new" style={{ display: "flex", alignItems: "center", gap: 6, background: "#e8445a", color: "#fff", fontWeight: 700, borderRadius: 50, padding: "10px 20px", textDecoration: "none", fontSize: 13, boxShadow: "0 4px 12px rgba(232,68,90,0.3)" }}>
            <Plus size={14} /> Ajouter
          </Link>
        </div>

        {list.length === 0 ? (
          <Link href="/watches/new" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, borderRadius: 20, border: "1.5px dashed #ddd", padding: "48px 24px", textDecoration: "none", textAlign: "center", background: "#fff" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff0f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={24} color="#e8445a" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>Ajouter votre première montre</p>
            <p style={{ fontSize: 13, color: "#aaa" }}>Les autres collectionneurs pourront vous faire une proposition d&apos;échange.</p>
          </Link>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {list.map(w => (
              <div key={w.id} style={{ display: "flex", gap: 14, background: "#fff", borderRadius: 18, border: "1px solid #e8e8e8", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ width: 100, height: 100, flexShrink: 0, position: "relative" }}>
                  {w.photos?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={w.photos[0]} alt={w.brand} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#aaa" }}>Pas de photo</div>
                  )}
                  <div style={{ position: "absolute", top: 6, left: 6, background: w.status === "available" ? "rgba(76,222,143,0.95)" : w.status === "paused" ? "rgba(156,163,175,0.95)" : "rgba(232,68,90,0.95)", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                    {w.status === "available" ? "Dispo" : w.status === "paused" ? "Pause" : "Échangée"}
                  </div>
                </div>
                <div style={{ flex: 1, padding: "14px 0 14px 0", minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 2 }}>{w.brand} {w.model}</p>
                  <p style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>
                    {w.year ? `${w.year} · ` : ""}{CONDITION_LABELS[w.condition]}
                  </p>
                  <WatchStatusControls watchId={w.id} status={w.status} />
                </div>
                <div style={{ padding: "14px 16px 14px 0", display: "flex", alignItems: "flex-start" }}>
                  <Link href={`/watches/${w.id}/edit`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", background: "#f4f4f4", color: "#666", textDecoration: "none" }}>
                    <Pencil size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
