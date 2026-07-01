"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import type { MatchResult } from "@/lib/actions/swipes";

export function MatchModal({ match, onClose }: { match: MatchResult | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {match && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.75)", padding: "0 24px" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 380, borderRadius: 28, background: "#fff", padding: "40px 32px", textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
              <Sparkles size={20} color="#e8445a" />
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "#111", letterSpacing: "-0.03em" }}>C&apos;est un Match !</h2>
              <Sparkles size={20} color="#e8445a" />
            </div>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 32 }}>Vous aimez tous les deux ces montres.</p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
              <div style={{ width: 110, height: 110, marginRight: -16, overflow: "hidden", borderRadius: "50%", border: "4px solid #fff", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", background: "#f4f4f4" }}>
                {match.watch_a.photos?.[0]
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={match.watch_a.photos[0]} alt="watch a" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : null}
              </div>
              <div style={{ zIndex: 10, width: 44, height: 44, borderRadius: "50%", background: "#e8445a", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(232,68,90,0.5)", flexShrink: 0 }}>
                <Heart size={20} fill="white" color="white" />
              </div>
              <div style={{ width: 110, height: 110, marginLeft: -16, overflow: "hidden", borderRadius: "50%", border: "4px solid #fff", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", background: "#f4f4f4" }}>
                {match.watch_b.photos?.[0]
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={match.watch_b.photos[0]} alt="watch b" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : null}
              </div>
            </div>

            <Link
              href={`/messages/${match.id}`}
              style={{ display: "block", background: "#e8445a", color: "#fff", fontWeight: 700, borderRadius: 14, padding: "14px 0", textDecoration: "none", fontSize: 15, marginBottom: 10, boxShadow: "0 4px 16px rgba(232,68,90,0.3)" }}
            >
              Envoyer un message
            </Link>
            <button
              onClick={onClose}
              style={{ width: "100%", background: "none", border: "1.5px solid #e8e8e8", borderRadius: 14, padding: "13px 0", fontWeight: 600, fontSize: 14, color: "#666", cursor: "pointer" }}
            >
              Continuer à swiper
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
