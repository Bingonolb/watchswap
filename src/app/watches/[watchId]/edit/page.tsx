import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { getUser, createClient } from "@/lib/supabase/server";
import { EditWatchForm } from "@/components/EditWatchForm";
import type { Watch } from "@/lib/types";

export default async function EditWatchPage({ params }: { params: Promise<{ watchId: string }> }) {
  const { watchId } = await params;
  const [user, supabase] = await Promise.all([getUser(), createClient()]);
  if (!user) redirect("/login");

  const { data: watch } = await supabase.from("watches").select("*").eq("id", watchId).eq("owner_id", user.id).maybeSingle();
  if (!watch) notFound();

  return (
    <div style={{ minHeight: "100dvh", background: "#f4f4f4" }}>
      <Navbar />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "36px 32px 60px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 6 }}>Modifier la montre</h1>
        <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>{watch.brand} {watch.model}</p>
        <EditWatchForm watch={watch as unknown as Watch} />
      </main>
    </div>
  );
}
