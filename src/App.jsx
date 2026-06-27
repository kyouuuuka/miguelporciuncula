import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import ButterflyBand from "./components/ButterflyBand.jsx";
import Experience from "./components/Experience.jsx";
import Toolkit from "./components/Toolkit.jsx";
import Projects from "./components/Projects.jsx";
import Credentials from "./components/Credentials.jsx";
import Contact from "./components/Contact.jsx";
import BackToTop from "./components/BackToTop.jsx";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <ButterflyBand />
        <Experience />
        <Toolkit />
        <Projects />
        <Credentials />
        <Contact />
      </main>
      <BackToTop />
    </>
  );
}
