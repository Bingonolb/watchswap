import Link from "next/link";
import { Shield, Plus, Settings } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProfileForm } from "@/components/ProfileForm";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Watch as WatchType } from "@/lib/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: watches }, { count: matchesCount }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle(),
    supabase.from("watches").select("id,brand,model,photos,status").eq("owner_id", user!.id).order("created_at", { ascending: false }),
    supabase.from("matches").select("id", { count: "exact", head: true }).or(`user_a_id.eq.${user!.id},user_b_id.eq.${user!.id}`),
  ]);

  const p = profile as Profile | null;
  const watchList = (watches ?? []) as unknown as (WatchType & { photos: string[] })[];
  const memberYear = user?.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();
  const initial = (p?.username?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  return (
    <div style={{ minHeight: "100dvh", background: "#08080a" }}>
      <Navbar />

      <main style={{ maxWidth: 560, margin: "0 auto", padding: "0 0 100px" }}>
        {/* Hero */}
        <div style={{ position: "relative", height: 140, background: "linear-gradient(135deg, #1a1408 0%, #2a1f05 50%, #1a1408 100%)", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(201,168,76,0.15) 0%, transparent 60%)" }} />
          {/* Decorative circles */}
          <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", border: "1px solid rgba(201,168,76,0.1)" }} />
          <div style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, borderRadius: "50%", border: "1px solid rgba(201,168,76,0.05)" }} />
        </div>

        <div style={{ padding: "0 20px" }}>
          {/* Avatar overlapping hero */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: -52, marginBottom: 20 }}>
            <div style={{ position: "relative" }}>
              {p?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.avatar_url} alt="avatar" style={{ width: 96, height: 96, borderRadius: 20, objectFit: "cover", border: "3px solid #08080a", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }} />
              ) : (
                <div style={{ width: 96, height: 96, borderRadius: 20, background: "linear-gradient(135deg, #2a1f05, #1a1408)", border: "3px solid #08080a", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: "#c9a84c" }}>{initial}</span>
                </div>
              )}
              {p?.identity_verified && (
                <div style={{ position: "absolute", bottom: -6, right: -6, width: 26, height: 26, borderRadius: "50%", background: "#c9a84c", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #08080a" }}>
                  <Shield size={12} color="#08080a" fill="#08080a" />
                </div>
              )}
            </div>
            <Link href="/watches/new" style={{ display: "flex", alignItems: "center", gap: 6, background: "#c9a84c", color: "#08080a", fontWeight: 700, borderRadius: 50, padding: "10px 18px", textDecoration: "none", fontSize: 13, marginBottom: 4 }}>
              <Plus size={14} /> Ajouter
            </Link>
          </div>

          {/* Identity */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: "#f5f3ee", marginBottom: 2 }}>
              {p?.full_name || p?.username || "Mon profil"}
            </h1>
            {p?.username && <p style={{ fontSize: 13, color: "#c9a84c", fontWeight: 600, marginBottom: 4 }}>@{p.username}</p>}
            {(p?.city || p?.country) && (
              <p style={{ fontSize: 12, color: "#6b6b78" }}>📍 {[p.city, p.country].filter(Boolean).join(", ")}</p>
            )}
            {p?.bio && <p style={{ fontSize: 13, color: "rgba(245,243,238,0.6)", marginTop: 8, lineHeight: 1.6 }}>{p.bio}</p>}
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
            {[
              { value: watchList.length, label: "Montres" },
              { value: matchesCount ?? 0, label: "Échanges" },
              { value: memberYear, label: "Depuis" },
            ].map(({ value, label }) => (
              <div key={label} style={{ background: "#111116", borderRadius: 16, padding: "16px 12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#c9a84c", marginBottom: 2 }}>{value}</p>
                <p style={{ fontSize: 11, color: "#6b6b78", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Trust */}
          {!p?.identity_verified && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 16, padding: "14px 16px", marginBottom: 24 }}>
              <Shield size={20} color="#c9a84c" />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#f5f3ee", marginBottom: 2 }}>Vérifiez votre identité</p>
                <p style={{ fontSize: 12, color: "#6b6b78" }}>Les membres vérifiés échangent 3× plus.</p>
              </div>
              <span style={{ fontSize: 12, color: "#c9a84c", fontWeight: 600 }}>→</span>
            </div>
          )}

          {/* Collection */}
          {watchList.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f5f3ee" }}>Ma collection</h2>
                <Link href="/watches/mine" style={{ fontSize: 12, color: "#c9a84c", textDecoration: "none", fontWeight: 600 }}>Tout voir</Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {watchList.slice(0, 6).map(w => (
                  <div key={w.id} style={{ aspectRatio: "1", borderRadius: 14, overflow: "hidden", background: "#1a1a20", position: "relative" }}>
                    {w.photos?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={w.photos[0]} alt={w.brand} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#6b6b78" }}>{w.brand}</div>
                    )}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
                    <div style={{ position: "absolute", bottom: 6, left: 6, right: 6 }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{w.brand}</p>
                      <p style={{ fontSize: 8, color: "rgba(255,255,255,0.7)" }}>{w.model}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {watchList.length === 0 && (
            <Link href="/watches/new" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, borderRadius: 20, border: "1.5px dashed rgba(201,168,76,0.3)", padding: "32px 16px", marginBottom: 24, textDecoration: "none", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Plus size={22} color="#c9a84c" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#f5f3ee", marginBottom: 4 }}>Ajoutez votre première montre</p>
                <p style={{ fontSize: 12, color: "#6b6b78" }}>Sans montre, impossible de matcher.</p>
              </div>
            </Link>
          )}

          {/* Edit form */}
          <div style={{ background: "#111116", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Settings size={16} color="#6b6b78" />
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f5f3ee" }}>Modifier mon profil</h2>
            </div>
            <ProfileForm profile={p} email={user!.email ?? ""} />
          </div>
        </div>
      </main>
    </div>
  );
}
