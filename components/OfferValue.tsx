import Image from "next/image";
import { offer } from "@/data/offer";

export default function OfferValue() {
  return (
    <section id="oferta" className="relative z-20 -mt-16 scroll-mt-24 px-4 pb-4 sm:px-6" aria-labelledby="included-title">
      <div className="glass-panel mx-auto max-w-6xl rounded-[2rem] p-5 sm:p-7">
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow">Tu Porkilo llega completo</p>
          <h2 id="included-title" className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">Los $49.000 ya incluyen todo esto.</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/60">Papas, ají, maduro, arepitas y tus toppings, sin sumarlos al precio.</p>
          <strong className="delivery-free-badge">Domicilio gratis</strong>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {offer.bonuses.map((bonus) => (
            <article key={bonus.id} className="bonus-card">
              <div className="bonus-media">
                {bonus.image ? (
                  <Image src={bonus.image} alt="" fill sizes="(max-width: 768px) 5rem, 8rem" className="catalog-image object-contain" />
                ) : (
                  <span aria-hidden="true">✓</span>
                )}
              </div>
              <div className="min-w-0">
                <span className="bonus-included">Incluido</span>
                <h3>{bonus.title}</h3>
                <p>{bonus.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
