"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useAnimation, type PanInfo } from "framer-motion";
import { Heart, RotateCcw, X, Zap } from "lucide-react";
import { WatchCard } from "@/components/WatchCard";
import { MatchModal } from "@/components/MatchModal";
import { recordSwipe, undoLastSwipe, fetchMoreWatches, type MatchResult } from "@/lib/actions/swipes";
import type { Watch } from "@/lib/types";

const SWIPE_THRESHOLD = 100;

export function SwipeDeck({ initialWatches, filters }: { initialWatches: Watch[]; filters?: { brand?: string; condition?: string } }) {
  const [deck, setDeck] = useState<Watch[]>(initialWatches);
  const [history, setHistory] = useState<Watch[]>([]);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [swipeHint, setSwipeHint] = useState<"like" | "pass" | null>(null);
  const loadingRef = useRef(false);
  const exhaustedRef = useRef(false);
  const controls = useAnimation();

  const topWatch = deck[0];
  const nextWatch = deck[1];

  const loadMore = useCallback(async (remainingDeck: Watch[]) => {
    if (remainingDeck.length > 3 || exhaustedRef.current || loadingRef.current) return;
    loadingRef.current = true;
    const cursor = remainingDeck.at(-1)?.created_at ?? new Date().toISOString();
    const res = await fetchMoreWatches(cursor, filters);
    if (res.watches.length === 0) exhaustedRef.current = true;
    setDeck(d => [...d, ...res.watches.filter(w => !d.some(x => x.id === w.id))]);
    loadingRef.current = false;
  }, [filters]);

  const swipe = useCallback(async (direction: "like" | "pass" | "superlike") => {
    if (!topWatch) return;
    const swiped = topWatch;
    setDeck(d => {
      const rest = d.slice(1);
      loadMore(rest);
      return rest;
    });
    setHistory(h => [swiped, ...h].slice(0, 10));
    setSwipeHint(null);
    const res = await recordSwipe(swiped.id, direction);
    if (res.match) setMatch(res.match);
  }, [topWatch, loadMore]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setSwipeHint(null);
    if (info.offset.x > SWIPE_THRESHOLD) {
      controls.start({ x: 600, opacity: 0, rotate: 18, transition: { duration: 0.28 } }).then(() => {
        controls.set({ x: 0, opacity: 1, rotate: 0 });
        swipe("like");
      });
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      controls.start({ x: -600, opacity: 0, rotate: -18, transition: { duration: 0.28 } }).then(() => {
        controls.set({ x: 0, opacity: 1, rotate: 0 });
        swipe("pass");
      });
    } else {
      controls.start({ x: 0, rotate: 0, transition: { type: "spring", stiffness: 350, damping: 30 } });
    }
  };

  const handleButton = (direction: "like" | "pass" | "superlike") => {
    const exitX = direction === "pass" ? -600 : 600;
    controls
      .start({ x: exitX, opacity: 0, rotate: direction === "pass" ? -18 : 18, transition: { duration: 0.28 } })
      .then(() => {
        controls.set({ x: 0, opacity: 1, rotate: 0 });
        swipe(direction);
      });
  };

  const handleRewind = async () => {
    const [last, ...rest] = history;
    if (!last) return;
    setHistory(rest);
    setDeck(d => [last, ...d]);
    await undoLastSwipe(last.id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      {/* Card area */}
      <div style={{ position: "relative", width: "100%", maxWidth: 400, height: 560 }}>
        {deck.length === 0 ? (
          <div style={{
            height: "100%", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", borderRadius: 24,
            background: "#111116", color: "#6b6b78", textAlign: "center", padding: 32,
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#f5f3ee", marginBottom: 8 }}>C&apos;est tout pour l&apos;instant</p>
            <p style={{ fontSize: 14 }}>Reviens plus tard, de nouvelles montres arrivent régulièrement.</p>
          </div>
        ) : (
          <>
            {/* Next card (static, behind) */}
            {nextWatch && (
              <div style={{
                position: "absolute", inset: 0,
                transform: "scale(0.94) translateY(12px)",
                borderRadius: 24, overflow: "hidden",
                pointerEvents: "none", opacity: 0.7,
              }}>
                <WatchCard watch={nextWatch} />
              </div>
            )}

            {/* Top card (draggable) */}
            <motion.div
              key={topWatch.id}
              style={{ position: "absolute", inset: 0, zIndex: 10 }}
              animate={controls}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDrag={(_, info) => {
                if (info.offset.x > 40) setSwipeHint("like");
                else if (info.offset.x < -40) setSwipeHint("pass");
                else setSwipeHint(null);
              }}
              onDragEnd={handleDragEnd}
            >
              {/* Swipe hint overlays */}
              {swipeHint === "like" && (
                <div style={{ position: "absolute", inset: 0, zIndex: 20, borderRadius: 24, border: "3px solid #22c55e", display: "flex", alignItems: "flex-start", justifyContent: "flex-start", padding: 20, pointerEvents: "none" }}>
                  <span style={{ background: "#22c55e", color: "#fff", fontWeight: 800, fontSize: 22, padding: "4px 14px", borderRadius: 8, transform: "rotate(-12deg)", border: "3px solid #fff" }}>LIKE</span>
                </div>
              )}
              {swipeHint === "pass" && (
                <div style={{ position: "absolute", inset: 0, zIndex: 20, borderRadius: 24, border: "3px solid #ef4444", display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 20, pointerEvents: "none" }}>
                  <span style={{ background: "#ef4444", color: "#fff", fontWeight: 800, fontSize: 22, padding: "4px 14px", borderRadius: 8, transform: "rotate(12deg)", border: "3px solid #fff" }}>PASS</span>
                </div>
              )}
              <WatchCard watch={topWatch} onSwipe={dir => handleButton(dir)} />
            </motion.div>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
        <button onClick={handleRewind} disabled={history.length === 0}
          style={{ width: 48, height: 48, borderRadius: "50%", background: "#1a1a20", border: "1px solid rgba(255,255,255,0.1)", color: "#c9a84c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", opacity: history.length === 0 ? 0.3 : 1 }}>
          <RotateCcw size={18} />
        </button>
        <button onClick={() => handleButton("pass")} disabled={!topWatch}
          style={{ width: 64, height: 64, borderRadius: "50%", background: "#1a1a20", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", opacity: !topWatch ? 0.3 : 1 }}>
          <X size={26} strokeWidth={2.5} />
        </button>
        <button onClick={() => handleButton("like")} disabled={!topWatch}
          style={{ width: 64, height: 64, borderRadius: "50%", background: "#1a1a20", border: "1px solid rgba(201,168,76,0.4)", color: "#c9a84c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", opacity: !topWatch ? 0.3 : 1 }}>
          <Heart size={26} fill="currentColor" />
        </button>
        <button onClick={() => handleButton("superlike")} disabled={!topWatch}
          style={{ width: 48, height: 48, borderRadius: "50%", background: "#1a1a20", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", opacity: !topWatch ? 0.3 : 1 }}>
          <Zap size={18} fill="currentColor" />
        </button>
      </div>

      <MatchModal match={match} onClose={() => setMatch(null)} />
    </div>
  );
}
