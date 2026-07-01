"use client";

import { useTransition } from "react";
import { resetAllSwipes } from "@/lib/actions/swipes";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";

export function DevResetButton() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleReset() {
    startTransition(async () => {
      await resetAllSwipes();
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleReset}
      disabled={pending}
      title="Reset tous les swipes (mode test)"
      className="fixed bottom-24 right-5 z-50 flex items-center gap-2 rounded-full bg-neutral-800/90 px-4 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur transition hover:bg-neutral-700 disabled:opacity-60 md:bottom-6"
    >
      <RotateCcw size={13} className={pending ? "animate-spin" : ""} />
      {pending ? "Reset…" : "Reset swipes"}
    </button>
  );
}
