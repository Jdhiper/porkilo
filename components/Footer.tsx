export default function Footer() {
  return (
    <footer className="solid-footer relative overflow-hidden px-6 pb-6 pt-10 sm:pt-14">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,93,4,0.2),transparent_42%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-5 border-b border-white/10 pb-7 text-center">
          <div><p className="eyebrow">El domingo ya tiene plan</p><h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black tracking-[-0.05em] sm:text-6xl">El centro de la mesa tiene nombre.</h2></div>
          <a href="#arma-tu-pedido" className="cta-primary">Reservar mi kilo <span aria-hidden="true">↑</span></a>
        </div>
      </div>
      <div className="footer-wordmark relative" aria-label="Porkilo">PORKILO</div>
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-6 text-center text-xs text-white/35 sm:flex-row sm:gap-6">
          <span>© {new Date().getFullYear()} Porkilo. Panceta por kilos.</span><span>Fuego · Carne · Precisión</span>
        </div>
      </div>
    </footer>
  );
}
