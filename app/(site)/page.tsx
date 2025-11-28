import Menu from "@/components/navbar";
import Footer from "@/components/footer";
import Hero from "@/components/General/hero";
import Security from "@/components/General/seguridad";
import Amenities from "@/components/General/amenities";
import Community from "@/components/General/comunity";
export default function Home() {
  return (
    <main>
      <Menu />
      <Hero />
      <Security />
      <Amenities />
      <Community />
      <Footer />
    </main>
  );
}
