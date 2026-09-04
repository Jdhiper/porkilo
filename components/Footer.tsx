import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 px-6 pb-6 pt-8 sm:pt-10">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(232,93,4,0.18),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">Sábados saben mejor</p><h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.05em] sm:text-6xl">Nos vemos alrededor de la mesa.</h2></div>
          <a href="#arma-tu-pedido" className="cta-primary">Reservar mi kilo <span aria-hidden="true">↑</span></a>
        </div>
        <div className="relative mx-auto my-5 h-28 max-w-3xl sm:h-40">
          <Image src="/brand/porkilo-logo-full.png" alt="Porkilo" fill sizes="(max-width: 768px) 90vw, 768px" className="object-contain" />
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Porkilo. Panceta por kilos.</span><span>Fuego · Carne · Precisión</span>
        </div>
      </div>
    </footer>
  );
}
