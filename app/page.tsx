import Countdown from "@/components/Countdown";
import Footer from "@/components/Footer";
import Hero from "@/components/Inicio/Hero";
import Navbar from "@/components/Inicio/Navbar";
import OrderBuilder from "@/components/OrderBuilder";
import ScrollVideoBackdrop from "@/components/ScrollVideoBackdrop";

export default function Home() {
  return (
    <main>
      <ScrollVideoBackdrop />
      <Navbar />
      <div className="relative z-10">
        <Hero />
        <Countdown />
        <OrderBuilder />
        <Footer />
      </div>
    </main>
  );
}
