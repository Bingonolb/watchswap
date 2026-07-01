import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { ArrowRight, Repeat2, Shield, Zap } from "lucide-react";

export default async function Home() {
  const user = await getUser();
  if (user) redirect("/discover");

  return (
    <main style={{ minHeight: "100dvh", background: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: "1px solid #f0f0f0" }}>
        <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", color: "#111" }}>
          Watch<span style={{ color: "#e8445a" }}>Swap</span>
        </span>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login" style={{ padding: "10px 22px", borderRadius: 50, border: "1.5px solid #e8e8e8", fontWeight: 600, fontSize: 14, color: "#333", textDecoration: "none" }}>
            Se connecter
          </Link>
          <Link href="/signup" style={{ padding: "10px 22px", borderRadius: 50, background: "#e8445a", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 12px rgba(232,68,90,0.3)" }}>
            Créer un compte
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 48px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff0f2", border: "1px solid #ffd0d0", borderRadius: 50, padding: "6px 16px", marginBottom: 32, fontSize: 13, fontWeight: 600, color: "#e8445a" }}>
          <Zap size={13} fill="#e8445a" /> 100% sans commission
        </div>

        <h1 style={{ fontSize: 64, fontWeight: 900, color: "#111", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24, maxWidth: 720 }}>
          Échange ta montre<br />
          <span style={{ color: "#e8445a" }}>avec des passionnés.</span>
        </h1>

        <p style={{ fontSize: 20, color: "#666", maxWidth: 500, lineHeight: 1.6, marginBottom: 48 }}>
          Swipe des montres, matche avec des collectionneurs, échange directement — sans intermédiaire, sans commission.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/signup" style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 14, background: "#e8445a", color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 8px 24px rgba(232,68,90,0.35)" }}>
            Commencer gratuitement <ArrowRight size={18} />
          </Link>
          <Link href="/login" style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 14, border: "1.5px solid #e8e8e8", color: "#333", fontWeight: 600, fontSize: 16, textDecoration: "none" }}>
            J&apos;ai déjà un compte
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: "#f9f9f9", padding: "60px 48px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, maxWidth: 960, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {[
          { icon: <Repeat2 size={24} color="#e8445a" />, title: "Swipe & Matche", desc: "Explore des centaines de montres. Like celles qui t'intéressent, passe les autres." },
          { icon: <Shield size={24} color="#e8445a" />, title: "Identité vérifiée", desc: "Chaque échange est sécurisé. Les membres vérifiés échangent 3× plus facilement." },
          { icon: <Zap size={24} color="#e8445a" />, title: "Sans commission", desc: "Contrairement aux plateformes de vente, WatchSwap ne prend aucune commission." },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e8e8", padding: "28px 24px" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fff0f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              {icon}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 8 }}>{title}</h3>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </section>

      {/* CTA bottom */}
      <section style={{ padding: "60px 48px", textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: "#111", marginBottom: 16, letterSpacing: "-0.03em" }}>
          Prêt à échanger ?
        </h2>
        <p style={{ fontSize: 16, color: "#888", marginBottom: 32 }}>Rejoins des centaines de collectionneurs déjà sur WatchSwap.</p>
        <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 40px", borderRadius: 14, background: "#e8445a", color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 8px 24px rgba(232,68,90,0.35)" }}>
          Créer mon compte <ArrowRight size={18} />
        </Link>
      </section>

      <footer style={{ borderTop: "1px solid #f0f0f0", padding: "20px 48px", textAlign: "center", fontSize: 13, color: "#bbb" }}>
        © 2026 WatchSwap · Tous droits réservés
      </footer>
    </main>
  );
}
