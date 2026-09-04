"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatMoney, offer } from "@/data/offer";

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
        <div className="relative z-20 max-w-xl">
          <p className="eyebrow">Preventa semanal · Despacho el {offer.dispatch}</p>
          <h1 className="mt-3 text-[clamp(2.75rem,6vw,5.5rem)] font-black leading-[0.88] tracking-[-0.065em]">
            La panceta que<br /><span className="text-[var(--porkilo-orange)]">se roba la mesa.</span>
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

        <div className="relative z-20 mt-[32svh] ml-auto w-full max-w-xl sm:mt-[28svh] lg:mt-[24svh]">
          <div className="hero-offer-card grid items-center gap-4 rounded-[1.6rem] p-4 sm:grid-cols-[1fr_auto] sm:p-5">
            <div className="flex items-center justify-between gap-5 sm:block">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">1 kilo · {offer.product.serves}</span>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <strong className="text-3xl font-black tracking-[-0.05em] sm:text-4xl">{formatMoney(offer.product.price)}</strong>
                  <span className="text-xs text-white/45 line-through">{formatMoney(offer.product.referencePrice)}</span>
                </div>
              </div>
              <span className="stock-pill">Solo {offer.stockKg} disponibles</span>
            </div>
            <a className="cta-primary min-w-44" href="#arma-tu-pedido">Pedir ahora <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
