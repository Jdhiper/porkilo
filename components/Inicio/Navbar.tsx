import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/15 bg-black/20 px-3 py-2 shadow-[0_10px_45px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:px-4">
        <a href="#inicio" className="flex items-center gap-2" aria-label="Porkilo - Inicio">
          <Image src="/brand/porkilo-icon.png" alt="" width={38} height={38} className="h-9 w-9 object-contain" priority />
          <Image src="/brand/porkilo-wordmark.png" alt="Porkilo" width={1482} height={602} className="h-8 w-auto object-contain sm:h-9" priority />
        </a>
        <a href="#arma-tu-pedido" className="rounded-full bg-[var(--porkilo-orange)] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-[var(--porkilo-orange-light)] sm:px-5 sm:text-xs">
          Armar pedido
        </a>
      </nav>
    </header>
  );
}
