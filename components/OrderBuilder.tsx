"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatMoney, offer } from "@/data/offer";

type AddonQuantities = Record<(typeof offer.addons)[number]["id"], number>;
type ToppingQuantities = Record<(typeof offer.toppings)[number]["id"], number>;
const emptyAddons = Object.fromEntries(offer.addons.map((addon) => [addon.id, 0])) as AddonQuantities;
const initialToppings = Object.fromEntries(
  offer.toppings.map((topping, index) => [topping.id, index < 2 ? 1 : 0]),
) as ToppingQuantities;

function formatKilos(value: number) {
  return value.toLocaleString("es-CO", { maximumFractionDigits: 1 });
}

function getProductSubtotal(kilos: number) {
  const wholeKilos = Math.floor(kilos);
  const includesHalfKilo = kilos % 1 !== 0;
  return wholeKilos * offer.product.price + (includesHalfKilo ? offer.product.halfKgPrice : 0);
}

function QuantityControl({ value, onChange, label, disableAdd = false }: { value: number; onChange: (value: number) => void; label: string; disableAdd?: boolean }) {
  return (
    <div className="quantity-control" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} aria-label={`Quitar ${label}`} disabled={value === 0}>−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label={`Agregar ${label}`} disabled={disableAdd}>+</button>
    </div>
  );
}

export default function OrderBuilder() {
  const [kilos, setKilos] = useState(1);
  const [toppingQuantities, setToppingQuantities] = useState<ToppingQuantities>(initialToppings);
  const [addonQuantities, setAddonQuantities] = useState<AddonQuantities>(emptyAddons);
  const toppingAllowance = Math.max(2, Math.round(kilos * 2));
  const selectedToppingPortions = Object.values(toppingQuantities).reduce((sum, quantity) => sum + quantity, 0);
  const toppingsComplete = selectedToppingPortions === toppingAllowance;
  const selectedToppings = offer.toppings.filter((topping) => toppingQuantities[topping.id] > 0);
  const selectedAddons = useMemo(() => offer.addons.filter((addon) => addonQuantities[addon.id] > 0), [addonQuantities]);
  const productSubtotal = getProductSubtotal(kilos);
  const discount = kilos >= offer.bulkDiscount.minimumKg ? Math.round(productSubtotal * offer.bulkDiscount.rate) : 0;
  const total = useMemo(
    () => productSubtotal - discount + selectedAddons.reduce((sum, addon) => sum + addon.price * addonQuantities[addon.id], 0),
    [addonQuantities, discount, productSubtotal, selectedAddons],
  );

  const changeKilos = (nextValue: number) => {
    const nextKilos = Math.max(0.5, Math.min(5, Math.round(nextValue * 2) / 2));
    const nextAllowance = Math.max(2, Math.round(nextKilos * 2));
    setKilos(nextKilos);
    setToppingQuantities((current) => {
      let remaining = nextAllowance;
      const next = Object.fromEntries(
        offer.toppings.map((topping) => {
          const quantity = Math.min(current[topping.id], remaining);
          remaining -= quantity;
          return [topping.id, quantity];
        }),
      ) as ToppingQuantities;

      const preferred = offer.toppings.filter((topping) => current[topping.id] > 0);
      const fillWith = preferred.length ? preferred : offer.toppings.slice(0, 2);
      let index = 0;
      while (remaining > 0) {
        const topping = fillWith[index % fillWith.length];
        next[topping.id] += 1;
        remaining -= 1;
        index += 1;
      }
      return next;
    });
  };

  const whatsappUrl = useMemo(() => {
    const addonLines = selectedAddons.length
      ? selectedAddons.map((addon) => `- ${addonQuantities[addon.id]} x ${addon.name}`).join("\n")
      : "- Sin adicionales";
    const toppingLines = selectedToppings
      .map((topping) => `- ${toppingQuantities[topping.id]} x ${topping.name}`)
      .join("\n");
    const message = [
      "Hola, Porkilo. Quiero reservar mi pedido:",
      "",
      `Pedido: ${formatKilos(kilos)} kg de ${offer.product.name}`,
      "Papas cocinadas incluidas",
      ...(discount ? [`Descuento por 3 kilos: -${formatMoney(discount)}`] : []),
      "",
      `Toppings incluidos (${selectedToppingPortions}/${toppingAllowance}):`,
      toppingLines,
      "",
      "Adicionales:",
      addonLines,
      "",
      `Total estimado: ${formatMoney(total)}`,
      `Despacho: ${offer.dispatch}`,
      "",
      "Por favor, confirmen disponibilidad y horario de entrega.",
    ].join("\n");
    const recipient = offer.whatsappNumber ? `/${offer.whatsappNumber}` : "";
    return `https://wa.me${recipient}?text=${encodeURIComponent(message)}`;
  }, [addonQuantities, discount, kilos, selectedAddons, selectedToppingPortions, selectedToppings, toppingAllowance, toppingQuantities, total]);

  const handleOrderClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (toppingsComplete) return;
    event.preventDefault();
    document.getElementById("toppings-incluidos")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="arma-tu-pedido" className="relative px-4 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Tu pedido, a tu manera</p>
          <h2 className="mt-2 text-[clamp(2.45rem,6vw,4.5rem)] font-black leading-[0.9] tracking-[-0.06em]">Arma tu Porkilo.</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/65 sm:text-base">Medio kilo o un kilo incluyen papas cocinadas y 2 toppings. Cada medio kilo adicional suma otra porción.</p>
        </div>

        <div className="bulk-offer mx-auto mt-5 flex max-w-3xl flex-col items-center justify-center gap-4 rounded-[1.6rem] px-5 py-4 text-center sm:flex-row">
          <div className="discount-brand-mark" aria-hidden="true">
            <Image src="/brand/porkilo-icon.png" alt="" fill sizes="6rem" className="object-contain" />
            <span>8%</span>
          </div>
          <div>
            <p className="eyebrow">3 kilos · Más mesa · Menos precio</p>
            <h3 className="mt-1 text-xl font-black sm:text-2xl">Lleva 3 kilos y recibe 8% OFF.</h3>
            <p className="mt-1 text-xs text-white/55">Lo aplicamos automáticamente. Tú solo invita a la gente.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-3">
            <div className="order-card text-center">
              <div className="grid gap-4 sm:grid-cols-[9.5rem_1fr_auto] sm:items-center">
                <div className="product-order-media">
                  <Image src={offer.product.image} alt="Presentación completa de Porkilo con panceta y acompañamientos" fill sizes="(max-width: 639px) 18rem, 9.5rem" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <span className="eyebrow">Paso 01</span>
                  <h3 className="mt-2 text-2xl font-bold">¿Cuánta panceta?</h3>
                  <p className="mt-1 text-sm text-white/60">Desde ½ kilo por {formatMoney(offer.product.halfKgPrice)}. Incluye papas cocinadas listas para servir.</p>
                </div>
                <div className="quantity-control quantity-control-large justify-self-center" aria-label="Cantidad de panceta">
                  <button type="button" onClick={() => changeKilos(kilos - 0.5)} disabled={kilos === 0.5} aria-label="Quitar medio kilo">−</button>
                  <span aria-live="polite">{formatKilos(kilos)}<small> kg</small></span>
                  <button type="button" onClick={() => changeKilos(kilos + 0.5)} disabled={kilos === 5} aria-label="Agregar medio kilo">+</button>
                </div>
              </div>

              <div id="toppings-incluidos" className="mt-5 border-t border-white/10 pt-5">
                <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:text-left">
                  <div>
                    <span className="eyebrow">Incluidos con tu pedido</span>
                    <h4 className="mt-1 text-xl font-black">Elige tus toppings</h4>
                    <p className="mt-1 text-sm text-white/55">Puedes combinar sabores o repetir tu favorito.</p>
                  </div>
                  <span className={`topping-counter ${toppingsComplete ? "is-complete" : ""}`}>{selectedToppingPortions} de {toppingAllowance} porciones</span>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {offer.toppings.map((topping) => (
                    <article key={topping.id} className="topping-card grid grid-cols-[4.25rem_1fr] items-center gap-3 rounded-[1.2rem] p-2.5 text-left">
                      <div className="topping-media">
                        <Image src={topping.image} alt="" fill sizes="4.25rem" className="catalog-image object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-sm font-bold leading-tight">{topping.name}</h5>
                        <p className="mt-1 text-xs leading-snug text-white/50">{topping.description}</p>
                        <div className="mt-2">
                          <QuantityControl
                            value={toppingQuantities[topping.id]}
                            label={topping.name}
                            disableAdd={selectedToppingPortions >= toppingAllowance}
                            onChange={(value) => setToppingQuantities((current) => {
                              const currentTotal = Object.values(current).reduce((sum, quantity) => sum + quantity, 0);
                              if (value > current[topping.id] && currentTotal >= toppingAllowance) return current;
                              return { ...current, [topping.id]: value };
                            })}
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={handleOrderClick} aria-disabled={!toppingsComplete} className={`whatsapp-button lg:hidden ${toppingsComplete ? "" : "is-disabled"}`}>
              {toppingsComplete ? `Pedir ${formatKilos(kilos)} kg por WhatsApp` : `Elige tus ${toppingAllowance} toppings`} <span aria-hidden="true">↗</span>
            </a>

            <div className="order-card text-center">
              <span className="eyebrow">Paso 02 · Opcional</span>
              <h3 className="mt-2 text-2xl font-bold">¿Quieres porciones extra?</h3>
              <div className="mt-4 space-y-2">
                {offer.addons.map((addon) => (
                  <div key={addon.id} className="addon-row grid gap-3 rounded-[1.25rem] p-2.5 text-left sm:grid-cols-[4.75rem_1fr_auto] sm:items-center">
                    <div className="addon-media">
                      {addon.image ? (
                        <Image src={addon.image} alt="" fill sizes="5rem" className="catalog-image object-contain" />
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
              <div className="flex justify-between gap-4"><span>{formatKilos(kilos)} kg de panceta</span><strong>{formatMoney(productSubtotal)}</strong></div>
              {discount > 0 && (
                <div className="flex justify-between gap-4 text-[var(--porkilo-orange-light)]">
                  <span>Descuento por 3 kilos · 8%</span><strong>− {formatMoney(discount)}</strong>
                </div>
              )}
              {selectedAddons.map((addon) => (
                <div key={addon.id} className="flex justify-between gap-4 text-[var(--porkilo-muted)]">
                  <span>{addonQuantities[addon.id]} × {addon.name}</span><span>{formatMoney(addon.price * addonQuantities[addon.id])}</span>
                </div>
              ))}
              <div className="flex justify-between gap-4 text-[var(--porkilo-orange-light)]"><span>Papas cocinadas</span><strong>Incluidas</strong></div>
              <div className="flex justify-between gap-4 text-[var(--porkilo-orange-light)]"><span>{selectedToppingPortions}/{toppingAllowance} toppings</span><strong>{toppingsComplete ? "Listos" : "Por completar"}</strong></div>
              {selectedToppings.map((topping) => (
                <div key={topping.id} className="flex justify-between gap-4 text-[var(--porkilo-muted)]">
                  <span>{toppingQuantities[topping.id]} × {topping.name}</span><span>Incluido</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-end justify-between gap-4">
              <span className="text-xs uppercase tracking-[0.16em] text-white/45">Total estimado</span>
              <strong className="text-3xl font-black tracking-[-0.04em]">{formatMoney(total)}</strong>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={handleOrderClick} aria-disabled={!toppingsComplete} className={`whatsapp-button mt-5 ${toppingsComplete ? "" : "is-disabled"}`}>{toppingsComplete ? "Pedir por WhatsApp" : "Completa tus toppings"} <span aria-hidden="true">↗</span></a>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-white/40">El pedido se confirma en WhatsApp según disponibilidad y zona de entrega.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
