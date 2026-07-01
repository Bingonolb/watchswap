import Link from "next/link";
import { MessageCircle, Repeat2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

interface Row {
  id: string;
  created_at: string;
  watch_a: { id: string; owner_id: string; brand: string; model: string; photos: string[] };
  watch_b: { id: string; owner_id: string; brand: string; model: string; photos: string[] };
}

export default async function MatchesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("matches")
    .select("id, created_at, watch_a:watches!matches_watch_a_id_fkey(id,owner_id,brand,model,photos), watch_b:watches!matches_watch_b_id_fkey(id,owner_id,brand,model,photos)")
    .or(`user_a_id.eq.${user!.id},user_b_id.eq.${user!.id}`)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as Row[];

  return (
    <div style={{ minHeight: "100dvh", background: "#08080a" }}>
      <Navbar />
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px 100px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "#f5f3ee", marginBottom: 4 }}>
          Échanges
        </h1>
        <p style={{ fontSize: 13, color: "#6b6b78", marginBottom: 24 }}>
          {rows.length > 0 ? `${rows.length} échange${rows.length > 1 ? "s" : ""} en cours` : "Aucun échange pour le moment"}
        </p>

        {rows.length === 0 ? (
          <div style={{ borderRadius: 20, background: "#111116", border: "1px solid rgba(255,255,255,0.07)", padding: "48px 32px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Repeat2 size={28} color="#c9a84c" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#f5f3ee", marginBottom: 8 }}>Pas encore de match</p>
            <p style={{ fontSize: 13, color: "#6b6b78", marginBottom: 24 }}>Swipe sur des montres qui t&apos;intéressent pour commencer.</p>
            <Link href="/discover" style={{ display: "inline-block", background: "#c9a84c", color: "#08080a", fontWeight: 700, borderRadius: 50, padding: "12px 28px", textDecoration: "none", fontSize: 14 }}>
              Découvrir des montres
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rows.map((m) => {
              const mine = m.watch_a.owner_id === user!.id ? m.watch_a : m.watch_b;
              const theirs = m.watch_a.owner_id === user!.id ? m.watch_b : m.watch_a;
              const date = new Date(m.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

              return (
                <Link key={m.id} href={`/messages/${m.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "#111116", borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.07)",
                    padding: "14px 16px",
                    transition: "border-color 0.15s",
                  }}>
                    {/* Stacked watch photos */}
                    <div style={{ position: "relative", width: 68, height: 52, flexShrink: 0 }}>
                      <div style={{ position: "absolute", left: 0, top: 0, width: 48, height: 48, borderRadius: 14, overflow: "hidden", border: "2px solid #08080a" }}>
                        {theirs.photos?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={theirs.photos[0]} alt={theirs.brand} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "#1a1a20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#6b6b78" }}>{theirs.brand[0]}</div>
                        )}
                      </div>
                      <div style={{ position: "absolute", left: 20, bottom: 0, width: 48, height: 48, borderRadius: 14, overflow: "hidden", border: "2px solid #08080a", boxShadow: "0 0 0 2px rgba(201,168,76,0.3)" }}>
                        {mine.photos?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={mine.photos[0]} alt={mine.brand} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "#1a1a20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#6b6b78" }}>{mine.brand[0]}</div>
                        )}
                      </div>
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#f5f3ee", marginBottom: 3 }}>
                        {theirs.brand} {theirs.model}
                      </p>
                      <p style={{ fontSize: 12, color: "#6b6b78" }}>
                        contre ton {mine.brand} {mine.model}
                      </p>
                      <p style={{ fontSize: 11, color: "#6b6b78", marginTop: 3 }}>{date}</p>
                    </div>

                    {/* CTA */}
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(201,168,76,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <MessageCircle size={16} color="#c9a84c" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
