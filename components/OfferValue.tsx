"use client";

import { offer } from "@/data/offer";
import { trackFunnelEvent } from "@/lib/funnel-analytics";

export default function OfferValue() {
  return (
    <section id="oferta" className="offer-value-section relative z-20 -mt-12 scroll-mt-24 px-4 pb-2 sm:px-6" aria-labelledby="included-title">
      <div className="glass-panel mx-auto max-w-6xl rounded-[1.35rem] p-3 sm:p-4">
        <div className="offer-value-heading text-center sm:text-left">
          <div>
            <p className="eyebrow">Tu Porkilo llega completo</p>
            <h2 id="included-title" className="mt-1 text-lg font-black tracking-[-0.04em] sm:text-xl">$49.000 incluyen todo esto</h2>
          </div>
          <strong className="delivery-free-badge">Domicilio gratis</strong>
        </div>

        <div className="included-inline-list mt-2" aria-label="Todo lo incluido con tu Porkilo">
          {offer.bonuses.map((bonus) => (
            <span key={bonus.id}>{bonus.title}</span>
          ))}
        </div>

        <a href="#arma-tu-pedido" className="offer-inline-cta mt-2" onClick={() => {
          trackFunnelEvent("v2_cta_included_click");
          trackFunnelEvent("cta_included_click");
        }}>Elegir mi Porkilo <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
