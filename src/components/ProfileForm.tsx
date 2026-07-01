"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import type { Profile } from "@/lib/types";

const inputStyle = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "#f5f3ee",
  padding: "11px 14px",
  fontSize: 13,
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#6b6b78",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  marginBottom: 6,
};

export function ProfileForm({ profile, email }: { profile: Profile | null; email: string }) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Nom complet</label>
          <input name="full_name" defaultValue={profile?.full_name ?? ""} placeholder="Alexandre Martin" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Ville</label>
          <input name="city" defaultValue={profile?.city ?? ""} placeholder="Paris" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Pays</label>
          <input name="country" defaultValue={profile?.country ?? ""} placeholder="France" style={inputStyle} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Bio</label>
          <textarea name="bio" rows={3} defaultValue={profile?.bio ?? ""} placeholder="Collectionneur depuis 10 ans, spécialisé Rolex et AP..." style={{ ...inputStyle, resize: "none" }} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Photo de profil</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden", background: "#1a1a20", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 16, fontWeight: 700, color: "#c9a84c" }}>{profile?.username?.[0]?.toUpperCase() ?? "?"}</span>
              )}
            </div>
            <input name="avatar" type="file" accept="image/*" style={{ flex: 1, fontSize: 12, color: "#6b6b78" }} />
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#6b6b78", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
        Email : <span style={{ color: "#f5f3ee", fontWeight: 500 }}>{email}</span>
      </div>

      {state?.error && (
        <p style={{ fontSize: 13, color: "#ef4444", background: "rgba(239,68,68,0.1)", borderRadius: 10, padding: "10px 14px" }}>{state.error}</p>
      )}
      {state?.success && (
        <p style={{ fontSize: 13, color: "#22c55e", background: "rgba(34,197,94,0.1)", borderRadius: 10, padding: "10px 14px" }}>Profil mis à jour ✓</p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{ width: "100%", borderRadius: 50, background: "#c9a84c", color: "#08080a", fontWeight: 700, fontSize: 14, padding: "13px", border: "none", cursor: "pointer", transition: "opacity 0.15s", opacity: pending ? 0.6 : 1 }}
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
