import Link from "next/link";
import { MessageCircle, Repeat2, Compass } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let avatarUrl: string | null = null;
  let username: string | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("avatar_url, username").eq("id", user.id).maybeSingle();
    avatarUrl = (data as any)?.avatar_url ?? null;
    username = (data as any)?.username ?? null;
  }

  const initial = username?.[0] ?? user?.email?.[0] ?? "?";

  return (
    <>
      {/* Desktop top bar */}
      <header className="sticky top-0 z-40 hidden md:block" style={{ background: "rgba(8,8,10,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/discover" className="flex items-center gap-2.5">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="#c9a84c" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="2" fill="#c9a84c"/>
              <line x1="16" y1="16" x2="16" y2="7" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="16" y1="16" x2="21" y2="18" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="16" y1="4" x2="16" y2="5.5" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="16" y1="26.5" x2="16" y2="28" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="4" y1="16" x2="5.5" y2="16" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="26.5" y1="16" x2="28" y2="16" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ color: "var(--foreground)", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
              Watch<span style={{ color: "var(--brand)" }}>Swap</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {[
              { href: "/discover", icon: <Compass size={16}/>, label: "Découvrir" },
              { href: "/matches",  icon: <Repeat2 size={16}/>,  label: "Échanges" },
              { href: "/messages", icon: <MessageCircle size={16}/>, label: "Messages" },
            ].map(({ href, icon, label }) => (
              <Link key={href} href={href}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition"
                style={{ color: "var(--muted)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                {icon}{label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/watches/new"
              className="rounded-full px-4 py-1.5 text-sm font-semibold transition"
              style={{ background: "var(--brand)", color: "#08080a" }}>
              + Ajouter
            </Link>
            <Link href="/profile">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--brand)" }} />
              ) : (
                <span style={{ display: "flex", width: 34, height: 34, borderRadius: "50%", background: "var(--surface-2)", border: "2px solid var(--brand)", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase" }}>
                  {initial}
                </span>
              )}
            </Link>
            <form action={signOut}>
              <button type="submit" className="text-xs transition" style={{ color: "var(--muted)" }}>Déco</button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile top bar (logo only) */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-3 md:hidden" style={{ background: "rgba(8,8,10,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <Link href="/discover" className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="#c9a84c" strokeWidth="1.5"/>
            <circle cx="16" cy="16" r="2" fill="#c9a84c"/>
            <line x1="16" y1="16" x2="16" y2="7" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="16" y1="16" x2="21" y2="18" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ color: "var(--foreground)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Watch<span style={{ color: "var(--brand)" }}>Swap</span>
          </span>
        </Link>
        <Link href="/profile">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--brand)" }} />
          ) : (
            <span style={{ display: "flex", width: 30, height: 30, borderRadius: "50%", background: "var(--surface-2)", border: "2px solid var(--brand)", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase" }}>
              {initial}
            </span>
          )}
        </Link>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around pb-safe md:hidden" style={{ background: "rgba(8,8,10,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", paddingTop: "10px", paddingBottom: "16px" }}>
        {[
          { href: "/discover", icon: <Compass size={22}/>, label: "Découvrir" },
          { href: "/matches",  icon: <Repeat2 size={22}/>,  label: "Échanges" },
          { href: "/messages", icon: <MessageCircle size={22}/>, label: "Messages" },
          { href: "/profile",  icon: avatarUrl
            ? <img src={avatarUrl} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }} />
            : <span style={{ display: "flex", width: 22, height: 22, borderRadius: "50%", background: "var(--surface-2)", border: "1.5px solid var(--brand)", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase" }}>{initial}</span>,
            label: "Profil" },
        ].map(({ href, icon, label }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-1" style={{ color: "var(--muted)", fontSize: 10, fontWeight: 500 }}>
            {icon}
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
