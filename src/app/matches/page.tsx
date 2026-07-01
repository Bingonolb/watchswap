import Link from "next/link";
import { MessageCircle, Repeat2, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

interface Row {
  id: string;
  created_at: string;
  watch_a: { id: string; owner_id: string; brand: string; model: string; photos: string[]; year?: number };
  watch_b: { id: string; owner_id: string; brand: string; model: string; photos: string[]; year?: number };
}

export default async function MatchesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("matches")
    .select("id, created_at, watch_a:watches!matches_watch_a_id_fkey(id,owner_id,brand,model,photos,year), watch_b:watches!matches_watch_b_id_fkey(id,owner_id,brand,model,photos,year)")
    .or(`user_a_id.eq.${user!.id},user_b_id.eq.${user!.id}`)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as Row[];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8 pb-20">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Mes échanges</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {rows.length > 0
              ? `${rows.length} échange${rows.length > 1 ? "s" : ""} en cours`
              : "Aucun échange pour le moment"}
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
              <Repeat2 size={28} className="text-brand" />
            </div>
            <div>
              <p className="font-semibold text-neutral-800">Pas encore de match</p>
              <p className="mt-1 text-sm text-neutral-500">Swipe sur des montres qui t&apos;intéressent pour commencer.</p>
            </div>
            <Link href="/discover"
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark">
              Découvrir des montres
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((m) => {
              const mine = m.watch_a.owner_id === user!.id ? m.watch_a : m.watch_b;
              const theirs = m.watch_a.owner_id === user!.id ? m.watch_b : m.watch_a;
              const matchDate = new Date(m.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

              return (
                <Link
                  key={m.id}
                  href={`/messages/${m.id}`}
                  className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  {/* Watch photos stack */}
                  <div className="relative h-16 w-24 shrink-0">
                    {/* Their watch — back */}
                    <div className="absolute left-0 top-0 h-14 w-14 overflow-hidden rounded-xl border-2 border-white shadow-sm">
                      {theirs.photos?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={theirs.photos[0]} alt={theirs.brand} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-[9px] text-neutral-400">{theirs.brand[0]}</div>
                      )}
                    </div>
                    {/* My watch — front */}
                    <div className="absolute bottom-0 right-0 h-14 w-14 overflow-hidden rounded-xl border-2 border-white shadow-md ring-2 ring-brand/20">
                      {mine.photos?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={mine.photos[0]} alt={mine.brand} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-[9px] text-neutral-400">{mine.brand[0]}</div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-neutral-900">
                      {theirs.brand} {theirs.model}
                    </p>
                    <p className="text-sm text-neutral-500">
                      contre {mine.brand} {mine.model}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
                      <Clock size={11} /> {matchDate}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="shrink-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand transition group-hover:bg-brand group-hover:text-white">
                      <MessageCircle size={16} />
                    </span>
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
