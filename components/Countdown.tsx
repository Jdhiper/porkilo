"use client";

import { useEffect, useMemo, useState } from "react";
import { offer } from "@/data/offer";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getNextCutoff() {
  const now = new Date();
  const target = new Date(now);
  const daysUntil = (offer.cutoff.weekday - now.getDay() + 7) % 7;
  target.setDate(now.getDate() + daysUntil);
  target.setHours(offer.cutoff.hour, 0, 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 7);
  return target;
}

function getTimeLeft(target: Date): TimeLeft {
  const difference = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

const units: Array<[keyof TimeLeft, string]> = [
  ["days", "días"],
  ["hours", "horas"],
  ["minutes", "min"],
  ["seconds", "seg"],
];

export default function Countdown() {
  const target = useMemo(() => getNextCutoff(), []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft(target));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  return (
    <section id="cierre-pedidos" className="relative z-20 scroll-mt-24" aria-labelledby="countdown-title">
      <div className="glass-panel mx-auto max-w-4xl rounded-[2rem] p-5 sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--porkilo-orange)] shadow-[0_0_18px_var(--porkilo-orange)]" />
              <p className="eyebrow">Cierre de preventa</p>
            </div>
            <h2 id="countdown-title" className="mt-3 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
              Pide antes del {offer.cutoff.label}
            </h2>
            <p className="mt-2 text-sm text-[var(--porkilo-muted)]">
              Próximo despacho: <strong className="text-white">{offer.dispatch}</strong>
              <strong className="countdown-stock">¡Solo quedan {offer.stockKg} kilos!</strong>
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2" aria-live="polite" aria-atomic="true">
            {units.map(([key, label]) => (
              <div key={key} className="flip-card">
                <strong>{timeLeft ? String(timeLeft[key]).padStart(2, "0") : "—"}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
