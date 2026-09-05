import Footer from "@/components/Footer";
import Hero from "@/components/Inicio/Hero";
import Navbar from "@/components/Inicio/Navbar";
import OfferValue from "@/components/OfferValue";
import OrderBuilder from "@/components/OrderBuilder";
import ScrollVideoBackdrop from "@/components/ScrollVideoBackdrop";

export default function Home() {
  return (
    <main>
      <ScrollVideoBackdrop />
      <Navbar />
      <div className="relative z-10">
        <Hero />
        <OfferValue />
        <OrderBuilder />
        <Footer />
      </div>
    </main>
  );
}
