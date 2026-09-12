"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatMoney, offer } from "@/data/offer";
import { trackFunnelEvent } from "@/lib/funnel-analytics";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "10% top",
            scrub: true,
          },
        })
          .to(productRef.current, {
            autoAlpha: 0,
            filter: "blur(10px)",
            ease: "none",
          }, 0);
      });
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="inicio" className="hero-section relative z-10 min-h-[78svh] overflow-hidden px-5 pb-16 pt-24 sm:min-h-[82svh] sm:px-8 sm:pb-20 sm:pt-28">
      <div aria-hidden="true" className="hero-vignette" />

      <div className="relative mx-auto max-w-7xl">
        <div className="hero-copy relative z-20 mx-auto max-w-5xl text-center">
          <p className="eyebrow">Preventa semanal · Domingo en Pasto</p>
          <h1 className="hero-title mt-3 text-[clamp(3.25rem,8.5vw,5rem)] font-black leading-[0.8] tracking-[-0.075em]">
            ¡El Domingo!<br /><span>Ya quedo resuelto.</span>
          </h1>
        </div>

        <div ref={productRef} className="hero-product pointer-events-none fixed inset-0 z-10">
          <Image
            src="/media/panceta-principal.png"
            alt="Panceta Porkilo dorada y crocante"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-contain"
          />
        </div>

        <div className="relative z-20 mx-auto mt-[27svh] w-full max-w-xl sm:mt-[24svh] lg:mt-[20svh]">
          <a href="#arma-tu-pedido" className="hero-offer-card grid items-center gap-3 rounded-[1.6rem] p-4 sm:grid-cols-[1fr_auto] sm:p-5" onClick={() => {
            trackFunnelEvent("v2_cta_hero_click");
            trackFunnelEvent("cta_hero_click");
          }} aria-label="Armar pedido desde 49.000 pesos">
            <div className="flex min-w-0 flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--porkilo-orange-light)]">Dos tamaños para empezar</span>
              <div className="mt-2 grid w-full grid-cols-2 gap-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-2 py-2.5">
                  <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-white/50">1 libra · ½ kg</span>
                  <strong className="mt-1 block text-xl font-black tracking-[-0.05em] sm:text-2xl">{formatMoney(offer.product.halfKgPrice)}</strong>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-2 py-2.5">
                  <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-white/50">1 kilo · {offer.product.serves}</span>
                  <strong className="mt-1 block text-xl font-black tracking-[-0.05em] sm:text-2xl">{formatMoney(offer.product.price)}</strong>
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-white/75">Papas cocinadas, ají, maduro, arepitas + 2 toppings a elección</p>
              <span className="stock-pill">¡Solo quedan {offer.stockKg} kilos disponibles!</span>
            </div>
            <span className="cta-primary min-w-44">Pedir ahora <span aria-hidden="true">↓</span></span>
          </a>
        </div>
      </div>
    </section>
  );
}
