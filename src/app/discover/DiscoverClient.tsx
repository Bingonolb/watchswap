"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { SwipeDeck } from "@/components/SwipeDeck";
import { MatchesSidebarClient } from "@/components/MatchesSidebarClient";
import { DevResetButton } from "@/components/DevResetButton";
import type { Watch } from "@/lib/types";
import Link from "next/link";

export function DiscoverClient({ userId }: { userId: string }) {
  const supabase = createClient();

  const { data: feed = [], isLoading: feedLoading } = useQuery({
    queryKey: ["discover", userId],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_discover_feed", {
        viewer: userId,
        batch_size: 15,
        before_cursor: new Date().toISOString(),
        brand_filter: null,
        condition_filter: null,
      });
      return (data ?? []) as Watch[];
    },
  });

  const { data: watchCount = 0 } = useQuery({
    queryKey: ["my-watch-count", userId],
    queryFn: async () => {
      const { count } = await supabase.from("watches").select("id", { count: "exact", head: true }).eq("owner_id", userId);
      return count ?? 0;
    },
  });

  return (
    <div style={{ minHeight: "100dvh", background: "#f4f4f4" }}>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 32px 60px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {watchCount === 0 && !feedLoading && (
            <div style={{ marginBottom: 16, width: "100%", maxWidth: 420, borderRadius: 12, padding: "12px 16px", background: "#fff8e1", border: "1px solid #ffe082", fontSize: 13, color: "#795548" }}>
              Ajoute au moins une montre pour matcher.{" "}
              <Link href="/watches/new" style={{ fontWeight: 700, color: "#e8445a", textDecoration: "none" }}>Ajouter →</Link>
            </div>
          )}

          {feedLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              <div style={{ width: "100%", maxWidth: 420, height: 580, borderRadius: 20, background: "#e8e8e8", animation: "pulse 1.2s ease-in-out infinite" }} />
              <div style={{ display: "flex", gap: 20, marginTop: 28 }}>
                {[52, 64, 64, 52].map((s, i) => <div key={i} style={{ width: s, height: s, borderRadius: "50%", background: "#e8e8e8", animation: "pulse 1.2s ease-in-out infinite" }} />)}
              </div>
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
            </div>
          ) : (
            <SwipeDeck initialWatches={feed} />
          )}
        </div>

        <aside style={{ position: "sticky", top: 80 }}>
          <MatchesSidebarClient userId={userId} />
        </aside>
      </main>
      <DevResetButton />
    </div>
  );
}
