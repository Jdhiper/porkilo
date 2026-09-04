"use client";

import Image from "next/image";
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
    <section id="oferta" className="relative z-20 -mt-16 px-4 pb-4 sm:px-6" aria-labelledby="countdown-title">
      <div className="glass-panel mx-auto max-w-6xl rounded-[2rem] p-5 sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--porkilo-orange)] shadow-[0_0_18px_var(--porkilo-orange)]" />
              <p className="eyebrow">Cierre de preventa</p>
            </div>
            <h2 id="countdown-title" className="mt-3 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
              Pide antes del {offer.cutoff.label}
            </h2>
            <p className="mt-2 text-sm text-[var(--porkilo-muted)]">
              Próximo despacho: <strong className="text-white">{offer.dispatch}</strong> · Solo {offer.stockKg} kilos por tanda.
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

        <div className="mt-5 border-t border-white/12 pt-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Bonificaciones</p>
              <h3 className="mt-2 text-xl font-bold sm:text-2xl">Esto ya viene con tu kilo. Sin costo extra.</h3>
            </div>
            <a href="#arma-tu-pedido" className="text-xs font-black uppercase tracking-[0.14em] text-[var(--porkilo-orange-light)]">
              Armar pedido <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {offer.bonuses.map((bonus, index) => (
              <article key={bonus.id} className="bonus-card">
                <div className="bonus-media">
                  {bonus.image ? (
                    <Image src={bonus.image} alt="" fill sizes="(max-width: 768px) 5rem, 8rem" className="object-cover" />
                  ) : (
                    <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h4>{bonus.title}</h4>
                  <p>{bonus.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
