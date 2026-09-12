"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Countdown from "@/components/Countdown";
import { formatMoney, offer } from "@/data/offer";
import { trackFunnelEvent, trackFunnelEventOnce } from "@/lib/funnel-analytics";
import { trackMetaEvent } from "@/lib/meta";

type AddonQuantities = Record<(typeof offer.addons)[number]["id"], number>;
type BeverageQuantities = Record<(typeof offer.beverages)[number]["id"], number>;
type ToppingQuantities = Record<(typeof offer.toppings)[number]["id"], number>;
const emptyAddons = Object.fromEntries(offer.addons.map((addon) => [addon.id, 0])) as AddonQuantities;
const emptyBeverages = Object.fromEntries(offer.beverages.map((beverage) => [beverage.id, 0])) as BeverageQuantities;
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
  const [kilos, setKilos] = useState(0.5);
  const [toppingQuantities, setToppingQuantities] = useState<ToppingQuantities>(initialToppings);
  const [addonQuantities, setAddonQuantities] = useState<AddonQuantities>(emptyAddons);
  const [beverageQuantities, setBeverageQuantities] = useState<BeverageQuantities>(emptyBeverages);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [beveragesOpen, setBeveragesOpen] = useState(false);
  const toppingAllowance = Math.max(2, Math.round(kilos * 2));
  const selectedToppingPortions = Object.values(toppingQuantities).reduce((sum, quantity) => sum + quantity, 0);
  const toppingsComplete = selectedToppingPortions === toppingAllowance;
  const selectedToppings = offer.toppings.filter((topping) => toppingQuantities[topping.id] > 0);
  const selectedAddons = useMemo(() => offer.addons.filter((addon) => addonQuantities[addon.id] > 0), [addonQuantities]);
  const selectedBeverages = useMemo(() => offer.beverages.filter((beverage) => beverageQuantities[beverage.id] > 0), [beverageQuantities]);
  const selectedAddonUnits = Object.values(addonQuantities).reduce((sum, quantity) => sum + quantity, 0);
  const selectedBeverageUnits = Object.values(beverageQuantities).reduce((sum, quantity) => sum + quantity, 0);
  const productSubtotal = getProductSubtotal(kilos);
  const discount = kilos >= offer.bulkDiscount.minimumKg ? Math.round(productSubtotal * offer.bulkDiscount.rate) : 0;
  const total = useMemo(
    () => productSubtotal
      - discount
      + selectedAddons.reduce((sum, addon) => sum + addon.price * addonQuantities[addon.id], 0)
      + selectedBeverages.reduce((sum, beverage) => sum + beverage.price * beverageQuantities[beverage.id], 0),
    [addonQuantities, beverageQuantities, discount, productSubtotal, selectedAddons, selectedBeverages],
  );

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-funnel-event]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const eventName = (entry.target as HTMLElement).dataset.funnelEvent;
        if (eventName) {
          trackFunnelEventOnce(eventName);
          if (eventName === "v2_01_builder_view") {
            trackFunnelEventOnce("01_builder_view");
            trackMetaEvent("ViewContent", {
              currency: "COP",
              value: offer.product.halfKgPrice,
              content_name: offer.product.name,
              content_type: "product",
            });
          } else if (eventName === "v2_03_summary_view") {
            trackFunnelEventOnce("05_summary_view");
          }
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const changeKilos = (nextValue: number) => {
    const nextKilos = Math.max(0.5, Math.min(5, Math.round(nextValue * 2) / 2));
    if (nextKilos !== kilos) trackFunnelEvent("quantity_change", { kilos: nextKilos });
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

      return next;
    });
  };

  const toggleTopping = (toppingId: (typeof offer.toppings)[number]["id"]) => {
    if (toppingQuantities[toppingId] > 0) {
      setToppingQuantities((current) => ({ ...current, [toppingId]: 0 }));
      return;
    }
    if (selectedToppingPortions >= toppingAllowance) return;
    trackFunnelEvent("topping_selected", { item: toppingId });
    setToppingQuantities((current) => ({ ...current, [toppingId]: 1 }));
  };

  const toggleBeverage = (beverageId: (typeof offer.beverages)[number]["id"]) => {
    const nextQuantity = beverageQuantities[beverageId] > 0 ? 0 : 1;
    if (nextQuantity > 0) trackFunnelEvent("beverage_added", { item: beverageId, quantity: 1 });
    setBeverageQuantities((current) => ({ ...current, [beverageId]: nextQuantity }));
  };

  const whatsappUrl = useMemo(() => {
    const addonLines = selectedAddons.length
      ? selectedAddons.map((addon) => `- ${addonQuantities[addon.id]} x ${addon.name}`).join("\n")
      : "- Sin adicionales";
    const toppingLines = selectedToppings
      .map((topping) => `- ${toppingQuantities[topping.id]} x ${topping.name}`)
      .join("\n");
    const beverageLines = selectedBeverages.length
      ? selectedBeverages.map((beverage) => `- ${beverageQuantities[beverage.id]} x ${beverage.name}`).join("\n")
      : "- Sin bebidas";
    const message = [
      "Hola, Porkilo. Quiero reservar mi pedido:",
      "",
      `Pedido: ${formatKilos(kilos)} kg de ${offer.product.name}`,
      "Incluye papas cocinadas, ají, plátano maduro y arepitas blancas",
      ...(discount ? [`Descuento por 3 kilos: -${formatMoney(discount)}`] : []),
      "",
      `Toppings incluidos (${selectedToppingPortions}/${toppingAllowance}):`,
      toppingLines,
      "",
      "Adicionales:",
      addonLines,
      "",
      "Bebidas:",
      beverageLines,
      "",
      `Total estimado: ${formatMoney(total)}`,
      "Domicilio: Gratis",
      `Despacho: ${offer.dispatch}`,
      "",
      "Por favor, confirmen disponibilidad y horario de entrega.",
    ].join("\n");
    const recipient = offer.whatsappNumber ? `/${offer.whatsappNumber}` : "";
    return `https://wa.me${recipient}?text=${encodeURIComponent(message)}`;
  }, [addonQuantities, beverageQuantities, discount, kilos, selectedAddons, selectedBeverages, selectedToppingPortions, selectedToppings, toppingAllowance, toppingQuantities, total]);

  const handleOrderClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!toppingsComplete) {
      event.preventDefault();
      trackFunnelEvent("order_blocked_toppings");
      document.getElementById("toppings-incluidos")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    trackFunnelEvent("v2_04_whatsapp_click", { kilos, total });
    trackFunnelEvent("06_whatsapp_click", { kilos, total });
    trackMetaEvent("InitiateCheckout", {
      currency: "COP",
      value: total,
      content_name: offer.product.name,
      content_type: "product",
      num_items: kilos,
    });
  };

  const handleContinueClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (toppingsComplete) {
      trackFunnelEvent("v2_02_review_order", { kilos, total });
      trackFunnelEvent("review_order_click", { kilos, total });
      return;
    }
    event.preventDefault();
    trackFunnelEvent("order_blocked_toppings");
    document.getElementById("toppings-incluidos")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="arma-tu-pedido" data-funnel-event="v2_01_builder_view" className="relative scroll-mt-20 px-4 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Elige y pide</p>
          <h2 className="mt-1 text-[clamp(2.25rem,6vw,4rem)] font-black leading-[0.9] tracking-[-0.06em]">Arma tu Porkilo.</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/65">½ kilo y 1 kilo ya llegan completos. Solo elige tamaño y toppings.</p>
        </div>

        <div className="mx-auto mt-4 max-w-4xl space-y-3">
            <div className="order-card text-center">
              <div className="product-intro grid gap-4 sm:grid-cols-[9.5rem_1fr] sm:items-center">
                <div className="product-order-media">
                  <Image src={offer.product.image} alt="Presentación completa de Porkilo con panceta y acompañamientos" fill sizes="(max-width: 639px) 18rem, 9.5rem" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <span className="eyebrow">Primero</span>
                  <h3 className="mt-2 text-2xl font-bold">¿Cuánta panceta?</h3>
                  <p className="mt-1 text-sm text-white/60">Desde {formatMoney(offer.product.halfKgPrice)}, completa y lista para servir.</p>
                </div>
              </div>

              <div className="product-size-grid mt-5" aria-label="Elige la cantidad de panceta">
                <button type="button" className={`product-size-button ${kilos === 0.5 ? "is-selected" : ""}`} aria-pressed={kilos === 0.5} onClick={() => changeKilos(0.5)}>
                  <span>1 libra</span><strong>½ kilo</strong><small>{formatMoney(offer.product.halfKgPrice)}</small>
                </button>
                <button type="button" className={`product-size-button ${kilos === 1 ? "is-selected" : ""}`} aria-pressed={kilos === 1} onClick={() => changeKilos(1)}>
                  <span>Para compartir</span><strong>1 kilo</strong><small>{formatMoney(offer.product.price)}</small>
                </button>
                <button type="button" className={`product-size-button ${kilos > 1 ? "is-selected" : ""}`} aria-pressed={kilos > 1} onClick={() => changeKilos(kilos > 1 ? kilos : 1.5)}>
                  <span>Mesa grande</span><strong>Más de 1 kilo</strong><small>3 kg tienen 8% OFF</small>
                </button>
              </div>

              {kilos > 1 && (
                <div className="more-kilos-panel mt-3">
                  <div className="text-left">
                    <span className="eyebrow">Cantidad para tu mesa</span>
                    <p className="mt-1 text-sm text-white/60">Suma o resta por medios kilos hasta completar tu pedido.</p>
                  </div>
                  <div className="quantity-control quantity-control-large" aria-label="Cantidad de panceta mayor a un kilo">
                    <button type="button" onClick={() => changeKilos(Math.max(1.5, kilos - 0.5))} disabled={kilos === 1.5} aria-label="Quitar medio kilo">−</button>
                    <span aria-live="polite">{formatKilos(kilos)}<small> kg</small></span>
                    <button type="button" onClick={() => changeKilos(kilos + 0.5)} disabled={kilos === 5} aria-label="Agregar medio kilo">+</button>
                  </div>
                </div>
              )}

              <div id="toppings-incluidos" className="mt-4 border-t border-white/10 pt-4">
                <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:text-left">
                  <div>
                    <span className="eyebrow">Incluidos con tu pedido</span>
                    <h4 className="mt-1 text-xl font-black">Elige tus toppings</h4>
                    <p className="mt-1 text-sm text-white/55">Dejamos dos favoritos listos. Tócalos si quieres cambiarlos.</p>
                  </div>
                  <span className={`topping-counter ${toppingsComplete ? "is-complete" : ""}`}>{selectedToppingPortions} de {toppingAllowance} porciones</span>
                </div>

                <div className="topping-grid mt-4 grid gap-2 sm:grid-cols-2">
                  {offer.toppings.map((topping) => (
                    <article key={topping.id} className={`topping-card rounded-[1.2rem] p-2.5 text-left ${toppingQuantities[topping.id] > 0 ? "is-selected" : ""}`}>
                      <button
                        type="button"
                        className="choice-button grid w-full grid-cols-[4.25rem_1fr_auto] items-center gap-3 text-left"
                        aria-pressed={toppingQuantities[topping.id] > 0}
                        disabled={toppingQuantities[topping.id] === 0 && selectedToppingPortions >= toppingAllowance}
                        onClick={() => toggleTopping(topping.id)}
                      >
                      <div className="topping-media">
                        <Image src={topping.image} alt="" fill sizes="4.25rem" className="catalog-image object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-sm font-bold leading-tight">{topping.name}</h5>
                        <p className="choice-description mt-1 text-xs leading-snug text-white/50">{topping.description}</p>
                      </div>
                      <span className="choice-state">{toppingQuantities[topping.id] > 0 ? "Elegido" : "Elegir"}</span>
                      </button>
                      {toppingQuantities[topping.id] > 0 && (selectedToppingPortions < toppingAllowance || toppingQuantities[topping.id] > 1) && (
                        <div className="choice-quantity-row mt-2">
                          <span>Porciones de este topping</span>
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
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <a href="#resumen-pedido" onClick={handleContinueClick} aria-disabled={!toppingsComplete} className={`whatsapp-button lg:hidden ${toppingsComplete ? "" : "is-disabled"}`}>
              {toppingsComplete ? "Revisar pedido antes de enviar" : `Elige tus ${toppingAllowance} toppings`} <span aria-hidden="true">↓</span>
            </a>

            <section className="order-card optional-section" aria-labelledby="extras-title">
              <button
                type="button"
                className="optional-disclosure-trigger"
                aria-expanded={extrasOpen}
                aria-controls="extras-content"
                onClick={() => {
                  const nextOpen = !extrasOpen;
                  setExtrasOpen(nextOpen);
                  if (nextOpen) {
                    trackFunnelEvent("v2_extras_opened");
                    trackFunnelEvent("extras_opened");
                  }
                }}
              >
                <span className="optional-disclosure-copy">
                  <span className="eyebrow">Opcional</span>
                  <strong id="extras-title">¿Quieres agregar extras?</strong>
                  <small>{selectedAddonUnits ? `${selectedAddonUnits} seleccionados` : "Solo si te provocan · desde $5.000"}</small>
                </span>
                <span className="optional-disclosure-action">{extrasOpen ? "Cerrar" : "Ver extras"} <span aria-hidden="true">{extrasOpen ? "−" : "+"}</span></span>
              </button>

              {extrasOpen && (
                <div id="extras-content" className="optional-content mt-4 space-y-2">
                  {offer.addons.map((addon) => (
                    <div key={addon.id} className="addon-row grid gap-3 rounded-[1.25rem] p-2.5 text-left sm:grid-cols-[4.75rem_1fr_auto] sm:items-center">
                      <div className="addon-media">
                        {addon.image ? <Image src={addon.image} alt="" fill sizes="5rem" className="catalog-image object-contain" /> : <span aria-hidden="true">+</span>}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h4 className="font-bold">{addon.name}</h4>
                          <span className="text-sm font-semibold text-[var(--porkilo-orange-light)]">+ {formatMoney(addon.price)}</span>
                        </div>
                        <p className="optional-description mt-1 text-sm text-white/58">{addon.description}</p>
                      </div>
                      <QuantityControl
                        value={addonQuantities[addon.id]}
                        label={addon.name}
                        onChange={(value) => {
                          const nextQuantity = Math.min(9, value);
                          if (nextQuantity > addonQuantities[addon.id]) trackFunnelEvent("extra_added", { item: addon.id, quantity: nextQuantity });
                          setAddonQuantities((current) => ({ ...current, [addon.id]: nextQuantity }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="order-card optional-section" aria-labelledby="beverages-title">
              <button
                type="button"
                className="optional-disclosure-trigger"
                aria-expanded={beveragesOpen}
                aria-controls="beverages-content"
                onClick={() => {
                  const nextOpen = !beveragesOpen;
                  setBeveragesOpen(nextOpen);
                  if (nextOpen) {
                    trackFunnelEvent("v2_beverages_opened");
                    trackFunnelEvent("beverages_opened");
                  }
                }}
              >
                <span className="optional-disclosure-copy">
                  <span className="eyebrow">Opcional</span>
                  <strong id="beverages-title">¿Agregamos Coca-Cola?</strong>
                  <small>{selectedBeverageUnits ? `${selectedBeverageUnits} seleccionadas` : "1,5 L o 3 L"}</small>
                </span>
                <span className="optional-disclosure-action">{beveragesOpen ? "Cerrar" : "Ver bebidas"} <span aria-hidden="true">{beveragesOpen ? "−" : "+"}</span></span>
              </button>

              {beveragesOpen && (
                <div id="beverages-content" className="optional-content mt-4 space-y-2">
                  {offer.beverages.map((beverage) => (
                    <div key={beverage.id} className={`beverage-choice rounded-[1.25rem] p-2.5 text-left ${beverageQuantities[beverage.id] > 0 ? "is-selected" : ""}`}>
                      <button type="button" className="choice-button grid w-full grid-cols-[4.75rem_1fr_auto] items-center gap-3 text-left" aria-pressed={beverageQuantities[beverage.id] > 0} onClick={() => toggleBeverage(beverage.id)}>
                        <div className="addon-media">
                          {beverage.image ? <Image src={beverage.image} alt="" fill sizes="5rem" className="catalog-image object-contain" /> : <span aria-hidden="true">+</span>}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <h4 className="font-bold">{beverage.name}</h4>
                            <span className="text-sm font-semibold text-[var(--porkilo-orange-light)]">+ {formatMoney(beverage.price)}</span>
                          </div>
                          <p className="optional-description mt-1 text-sm text-white/58">{beverage.description}</p>
                        </div>
                        <span className="choice-state">{beverageQuantities[beverage.id] > 0 ? "Agregada" : "Agregar"}</span>
                      </button>
                      {beverageQuantities[beverage.id] > 0 && (
                        <div className="choice-quantity-row mt-2">
                          <span>¿Quieres más de una?</span>
                          <QuantityControl
                            value={beverageQuantities[beverage.id]}
                            label={beverage.name}
                            onChange={(value) => {
                              const nextQuantity = Math.min(9, value);
                              if (nextQuantity > beverageQuantities[beverage.id]) trackFunnelEvent("beverage_added", { item: beverage.id, quantity: nextQuantity });
                              setBeverageQuantities((current) => ({ ...current, [beverage.id]: nextQuantity }));
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

          <aside id="resumen-pedido" data-funnel-event="v2_03_summary_view" className="summary-card scroll-mt-24" aria-labelledby="summary-title">
            <div className="flex items-start justify-between gap-4">
              <div><span className="eyebrow">Listo para enviar</span><h3 id="summary-title" className="mt-1 text-2xl font-black">Tu pedido está listo</h3></div>
              <span className="rounded-full bg-[var(--porkilo-orange)]/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--porkilo-orange-light)]">{offer.dispatch}</span>
            </div>

            <div className="summary-breakdown mt-4 space-y-2.5 border-y border-white/10 py-4 text-sm">
              <div className="summary-line summary-line-main"><span>{formatKilos(kilos)} kg de panceta Porkilo</span><strong>{formatMoney(productSubtotal)}</strong></div>
              {discount > 0 && (
                <div className="summary-line text-[var(--porkilo-orange-light)]"><span>Descuento por 3 kilos · 8%</span><strong>− {formatMoney(discount)}</strong></div>
              )}
              <div className="summary-included-title">También recibes incluido:</div>
              <div className="summary-line"><span>Papas cocinadas</span><strong>Incluidas</strong></div>
              <div className="summary-line"><span>Ají en su recipiente</span><strong>Incluido</strong></div>
              <div className="summary-line"><span>Plátano maduro</span><strong>Incluido</strong></div>
              <div className="summary-line"><span>Arepitas blancas</span><strong>Incluidas</strong></div>
              {selectedToppings.map((topping) => (
                <div key={topping.id} className="summary-line">
                  <span>{toppingQuantities[topping.id]} × {topping.name}</span><strong>Incluido</strong>
                </div>
              ))}
              {selectedAddons.length > 0 && <div className="summary-included-title">Extras:</div>}
              {selectedAddons.map((addon) => (
                <div key={addon.id} className="summary-line">
                  <span>{addonQuantities[addon.id]} × {addon.name}</span><strong>{formatMoney(addon.price * addonQuantities[addon.id])}</strong>
                </div>
              ))}
              {selectedBeverages.length > 0 && <div className="summary-included-title">Bebidas:</div>}
              {selectedBeverages.map((beverage) => (
                <div key={beverage.id} className="summary-line">
                  <span>{beverageQuantities[beverage.id]} × {beverage.name}</span><strong>{formatMoney(beverage.price * beverageQuantities[beverage.id])}</strong>
                </div>
              ))}
              <div className="summary-line summary-delivery"><span>Domicilio</span><strong>Gratis</strong></div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">Total a pagar</span>
              <strong className="text-3xl font-black tracking-[-0.05em]">{formatMoney(total)}</strong>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={handleOrderClick} aria-disabled={!toppingsComplete} className={`whatsapp-button mt-4 ${toppingsComplete ? "" : "is-disabled"}`}>{toppingsComplete ? "Enviar pedido por WhatsApp" : "Completa tus toppings"} <span aria-hidden="true">↗</span></a>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-white/48">Confirmas disponibilidad y horario directamente por WhatsApp.</p>
          </aside>

          <Countdown />
        </div>
      </div>
    </section>
  );
}
