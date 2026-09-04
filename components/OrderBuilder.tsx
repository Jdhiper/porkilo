"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatMoney, offer } from "@/data/offer";

type AddonQuantities = Record<(typeof offer.addons)[number]["id"], number>;
const emptyAddons = Object.fromEntries(offer.addons.map((addon) => [addon.id, 0])) as AddonQuantities;

function QuantityControl({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) {
  return (
    <div className="quantity-control" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} aria-label={`Quitar ${label}`} disabled={value === 0}>−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label={`Agregar ${label}`}>+</button>
    </div>
  );
}

export default function OrderBuilder() {
  const [kilos, setKilos] = useState(1);
  const [addonQuantities, setAddonQuantities] = useState<AddonQuantities>(emptyAddons);
  const selectedAddons = useMemo(() => offer.addons.filter((addon) => addonQuantities[addon.id] > 0), [addonQuantities]);
  const total = useMemo(
    () => kilos * offer.product.price + selectedAddons.reduce((sum, addon) => sum + addon.price * addonQuantities[addon.id], 0),
    [addonQuantities, kilos, selectedAddons],
  );

  const whatsappUrl = useMemo(() => {
    const addonLines = selectedAddons.length
      ? selectedAddons.map((addon) => `• ${addonQuantities[addon.id]} × ${addon.name}`).join("\n")
      : "• Sin adicionales";
    const message = [
      "Hola, Porkilo 👋 Quiero reservar mi pedido:",
      "",
      `🥓 ${kilos} × ${offer.product.unit} de ${offer.product.name}`,
      "",
      "Adicionales:",
      addonLines,
      "",
      `Total estimado: ${formatMoney(total)}`,
      `Despacho: ${offer.dispatch}`,
      "",
      "¿Me confirman disponibilidad y horario de entrega?",
    ].join("\n");
    const recipient = offer.whatsappNumber ? `/${offer.whatsappNumber}` : "";
    return `https://wa.me${recipient}?text=${encodeURIComponent(message)}`;
  }, [addonQuantities, kilos, selectedAddons, total]);

  return (
    <section id="arma-tu-pedido" className="relative px-4 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Tu pedido, a tu manera</p>
          <h2 className="mt-2 text-[clamp(2.45rem,6vw,4.5rem)] font-black leading-[0.9] tracking-[-0.06em]">Arma tu Porkilo.</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/65 sm:text-base">Elige la cantidad, suma lo que se te antoje y llega a WhatsApp con todo listo.</p>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-3">
            <div className="order-card grid gap-4 sm:grid-cols-[6.5rem_1fr_auto] sm:items-center">
              <div className="product-order-media">
                <Image src={offer.product.image} alt="" fill sizes="7rem" className="object-contain" />
              </div>
              <div className="min-w-0">
                <span className="eyebrow">Paso 01</span>
                <h3 className="mt-2 text-2xl font-bold">¿Cuántos kilos?</h3>
                <p className="mt-1 text-sm text-white/60">Cada kilo rinde para {offer.product.serves}.</p>
              </div>
              <div className="quantity-control quantity-control-large" aria-label="Cantidad de kilos">
                <button type="button" onClick={() => setKilos(Math.max(1, kilos - 1))} disabled={kilos === 1} aria-label="Quitar un kilo">−</button>
                <span aria-live="polite">{kilos}<small> kg</small></span>
                <button type="button" onClick={() => setKilos(Math.min(5, kilos + 1))} disabled={kilos === 5} aria-label="Agregar un kilo">+</button>
              </div>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="whatsapp-button lg:hidden">
              Pedir {kilos} {kilos === 1 ? "kilo" : "kilos"} por WhatsApp <span aria-hidden="true">↗</span>
            </a>

            <div className="order-card">
              <span className="eyebrow">Paso 02 · Opcional</span>
              <h3 className="mt-2 text-2xl font-bold">Suma tus acompañantes</h3>
              <div className="mt-4 space-y-2">
                {offer.addons.map((addon) => (
                  <div key={addon.id} className="addon-row grid gap-3 rounded-[1.25rem] p-2.5 sm:grid-cols-[4.75rem_1fr_auto] sm:items-center">
                    <div className="addon-media">
                      {addon.image ? (
                        <Image src={addon.image} alt="" fill sizes="5rem" className="object-cover" />
                      ) : (
                        <span aria-hidden="true">+</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h4 className="font-bold">{addon.name}</h4>
                        <span className="text-sm font-semibold text-[var(--porkilo-orange-light)]">+ {formatMoney(addon.price)}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/58">{addon.description}</p>
                    </div>
                    <QuantityControl
                      value={addonQuantities[addon.id]}
                      label={addon.name}
                      onChange={(value) => setAddonQuantities((current) => ({ ...current, [addon.id]: Math.min(9, value) }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="summary-card lg:sticky lg:top-28" aria-labelledby="summary-title">
            <div className="flex items-start justify-between gap-4">
              <div><span className="eyebrow">Paso 03</span><h3 id="summary-title" className="mt-2 text-2xl font-bold">Tu reserva</h3></div>
              <span className="rounded-full bg-[var(--porkilo-orange)]/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--porkilo-orange-light)]">{offer.dispatch}</span>
            </div>

            <div className="mt-5 space-y-3 border-y border-white/10 py-4 text-sm">
              <div className="flex justify-between gap-4"><span>{kilos} × {offer.product.unit} de panceta</span><strong>{formatMoney(kilos * offer.product.price)}</strong></div>
              {selectedAddons.map((addon) => (
                <div key={addon.id} className="flex justify-between gap-4 text-[var(--porkilo-muted)]">
                  <span>{addonQuantities[addon.id]} × {addon.name}</span><span>{formatMoney(addon.price * addonQuantities[addon.id])}</span>
                </div>
              ))}
              <div className="flex justify-between gap-4 text-[var(--porkilo-orange-light)]"><span>Bonificaciones</span><strong>Incluidas</strong></div>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4">
              <span className="text-xs uppercase tracking-[0.16em] text-white/45">Total estimado</span>
              <strong className="text-3xl font-black tracking-[-0.04em]">{formatMoney(total)}</strong>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="whatsapp-button mt-5">Pedir por WhatsApp <span aria-hidden="true">↗</span></a>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-white/40">El pedido se confirma en WhatsApp según disponibilidad y zona de entrega.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
