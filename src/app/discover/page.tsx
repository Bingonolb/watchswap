import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { SwipeDeck } from "@/components/SwipeDeck";
import { DevResetButton } from "@/components/DevResetButton";
import { createClient } from "@/lib/supabase/server";
import type { Watch } from "@/lib/types";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; condition?: string }>;
}) {
  const { brand, condition } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { count: myWatchesCount } = await supabase
    .from("watches")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user!.id);

  const { data: feed } = await supabase.rpc("get_discover_feed", {
    viewer: user!.id,
    batch_size: 15,
    before_cursor: new Date().toISOString(),
    brand_filter: brand || null,
    condition_filter: condition || null,
  });

  return (
    <div style={{ minHeight: "100dvh", background: "#08080a" }}>
      <Navbar />
      <main style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 100px" }}>
        {!myWatchesCount && (
          <div style={{ marginBottom: 16, borderRadius: 14, padding: "12px 16px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", fontSize: 13, color: "#c9a84c" }}>
            Ajoute une montre pour matcher.{" "}
            <Link href="/watches/new" style={{ fontWeight: 700, textDecoration: "underline" }}>
              Ajouter →
            </Link>
          </div>
        )}
        <SwipeDeck initialWatches={(feed ?? []) as Watch[]} filters={{ brand, condition }} />
      </main>
      <DevResetButton />
    </div>
  );
}
