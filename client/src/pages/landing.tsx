import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Menu from "@/components/Menu";
import BookingSystem from "@/components/BookingSystem";
import Footer from "@/components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-calluna-cream">
      <Header />
      <Hero />
      <Gallery />
      <Menu />
      <BookingSystem />
      <Footer />
    </div>
  );
}
