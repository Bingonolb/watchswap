"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Shield, Plus, Settings, Camera } from "lucide-react";
import { ProfileForm } from "@/components/ProfileForm";
import Link from "next/link";
import type { Profile, Watch as WatchType } from "@/lib/types";

export function ProfileClient({ userId, email }: { userId: string; email: string }) {
  const supabase = createClient();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      return data as Profile | null;
    },
  });

  const { data: watches = [] } = useQuery({
    queryKey: ["my-watches", userId],
    queryFn: async () => {
      const { data } = await supabase.from("watches").select("id,brand,model,photos,status").eq("owner_id", userId).order("created_at", { ascending: false });
      return (data ?? []) as unknown as (WatchType & { photos: string[] })[];
    },
  });

  const { data: matchesCount = 0 } = useQuery({
    queryKey: ["matches-count", userId],
    queryFn: async () => {
      const { count } = await supabase.from("matches").select("id", { count: "exact", head: true }).or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);
      return count ?? 0;
    },
  });

  const memberYear = new Date().getFullYear();
  const initial = (profile?.username?.[0] ?? email[0] ?? "?").toUpperCase();

  if (profileLoading) return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 28 }}>
      {[320, 180].map((h, i) => <div key={i} style={{ height: h, borderRadius: 20, background: "#e8e8e8", animation: "pulse 1.2s ease-in-out infinite" }} />)}
      <div style={{ height: 480, borderRadius: 20, background: "#e8e8e8", animation: "pulse 1.2s ease-in-out infinite" }} />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 28, alignItems: "start" }}>
      <div>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e8e8", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ height: 100, background: "linear-gradient(135deg, #e8445a 0%, #ff7a8a 100%)" }} />
          <div style={{ padding: "0 20px", marginTop: -44, marginBottom: 16 }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" style={{ width: 80, height: 80, borderRadius: 16, objectFit: "cover", border: "3px solid #fff", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", display: "block" }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: 16, background: "linear-gradient(135deg, #e8445a, #ff7a8a)", border: "3px solid #fff", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{initial}</span>
                </div>
              )}
              <div style={{ position: "absolute", bottom: -4, right: -4, width: 24, height: 24, borderRadius: "50%", background: "#e8445a", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Camera size={11} color="#fff" />
              </div>
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: "#111", marginTop: 12, marginBottom: 2 }}>
              {profile?.full_name || profile?.username || "Mon profil"}
            </h1>
            {profile?.username && <p style={{ fontSize: 13, color: "#e8445a", fontWeight: 600, marginBottom: 4 }}>@{profile.username}</p>}
            {(profile?.city || profile?.country) && <p style={{ fontSize: 12, color: "#888" }}>📍 {[profile.city, profile.country].filter(Boolean).join(", ")}</p>}
            {profile?.bio && <p style={{ fontSize: 13, color: "#555", marginTop: 8, lineHeight: 1.6 }}>{profile.bio}</p>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid #f0f0f0" }}>
            {[{ value: watches.length, label: "Montres" }, { value: matchesCount, label: "Échanges" }, { value: memberYear, label: "Depuis" }].map(({ value, label }, i) => (
              <div key={label} style={{ padding: "14px 0", textAlign: "center", borderRight: i < 2 ? "1px solid #f0f0f0" : "none" }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#e8445a" }}>{value}</p>
                <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
              </div>
            ))}
          </div>

          {!profile?.identity_verified ? (
            <div style={{ margin: "12px 16px 16px", padding: "12px 14px", background: "#fff8f8", border: "1px solid #ffd0d0", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <Shield size={18} color="#e8445a" />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#333" }}>Vérifiez votre identité</p>
                <p style={{ fontSize: 11, color: "#888" }}>Échangez 3× plus facilement.</p>
              </div>
            </div>
          ) : (
            <div style={{ margin: "12px 16px 16px", padding: "12px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <Shield size={18} color="#22c55e" fill="#22c55e" />
              <p style={{ fontSize: 12, fontWeight: 600, color: "#166534" }}>Identité vérifiée</p>
            </div>
          )}
        </div>

        {watches.length > 0 && (
          <div style={{ marginTop: 20, background: "#fff", borderRadius: 20, border: "1px solid #e8e8e8", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>Ma collection</p>
              <Link href="/watches/mine" style={{ fontSize: 12, color: "#e8445a", textDecoration: "none", fontWeight: 600 }}>Tout voir</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {watches.slice(0, 6).map(w => (
                <div key={w.id} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", background: "#f4f4f4", position: "relative" }}>
                  {w.photos?.[0]
                    ? <img src={w.photos[0]} alt={w.brand} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#aaa" }}>{w.brand}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {watches.length === 0 && (
          <Link href="/watches/new" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 20, borderRadius: 16, border: "1.5px dashed #ddd", padding: "24px 16px", textDecoration: "none", textAlign: "center", background: "#fff" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff0f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={20} color="#e8445a" />
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>Ajouter votre première montre</p>
          </Link>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e8e8", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <Settings size={16} color="#aaa" />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>Modifier mon profil</h2>
        </div>
        <ProfileForm profile={profile ?? null} email={email} />
      </div>
    </div>
  );
}
