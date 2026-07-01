import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { getUser, createClient } from "@/lib/supabase/server";
import { MessageCircle } from "lucide-react";

interface Row {
  id: string;
  created_at: string;
  watch_a: { owner_id: string; brand: string; model: string; photos: string[] };
  watch_b: { owner_id: string; brand: string; model: string; photos: string[] };
  user_a: { username: string; avatar_url: string | null };
  user_b: { username: string; avatar_url: string | null };
}

export default async function MessagesPage() {
  const [user, supabase] = await Promise.all([getUser(), createClient()]);
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("matches")
    .select("id, created_at, watch_a:watches!matches_watch_a_id_fkey(owner_id,brand,model,photos), watch_b:watches!matches_watch_b_id_fkey(owner_id,brand,model,photos), user_a:profiles!matches_user_a_id_fkey(username,avatar_url), user_b:profiles!matches_user_b_id_fkey(username,avatar_url)")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as Row[];

  return (
    <div style={{ minHeight: "100dvh", background: "#f4f4f4" }}>
      <Navbar />
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "36px 32px 60px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 24 }}>Messages</h1>

        {rows.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e8e8", padding: "60px 32px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fff0f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <MessageCircle size={28} color="#e8445a" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 8 }}>Aucune conversation</p>
            <p style={{ fontSize: 14, color: "#aaa", marginBottom: 24 }}>Matche avec quelqu&apos;un pour démarrer une discussion.</p>
            <Link href="/discover" style={{ display: "inline-block", background: "#e8445a", color: "#fff", fontWeight: 700, borderRadius: 10, padding: "12px 28px", textDecoration: "none", fontSize: 14 }}>
              Découvrir des montres
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rows.map((m) => {
              const iAmA = m.watch_a.owner_id === user.id;
              const theirWatch = iAmA ? m.watch_b : m.watch_a;
              const theirProfile = iAmA ? m.user_b : m.user_a;
              const date = new Date(m.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
              return (
                <Link key={m.id} href={`/messages/${m.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: "14px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "box-shadow 0.15s" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", background: "#f4f4f4", flexShrink: 0, border: "2px solid #e8e8e8" }}>
                      {theirWatch.photos?.[0]
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={theirWatch.photos[0]} alt={theirWatch.brand} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        : null}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 2 }}>{theirProfile?.username ?? "Collectionneur"}</p>
                      <p style={{ fontSize: 13, color: "#888" }}>{theirWatch.brand} {theirWatch.model}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <p style={{ fontSize: 12, color: "#bbb" }}>{date}</p>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#fff0f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <MessageCircle size={15} color="#e8445a" />
                      </div>
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
