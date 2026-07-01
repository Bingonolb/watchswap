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
      style={{
        position: "fixed", bottom: 88, right: 16, zIndex: 50,
        display: "flex", alignItems: "center", gap: 6,
        background: "rgba(26,26,32,0.95)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 50, padding: "8px 14px",
        fontSize: 11, fontWeight: 600, color: "#6b6b78",
        cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        transition: "all 0.15s",
      }}
    >
      <RotateCcw size={11} style={{ animation: pending ? "spin 1s linear infinite" : "none" }} />
      {pending ? "Reset…" : "Reset swipes"}
    </button>
  );
}
