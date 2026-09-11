import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import About from "./components/About";
import Capabilities from "./components/Capabilities";
import Currently from "./components/Currently";
import Contact from "./components/Contact";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Projects />
        <About />
        <Capabilities />
        <Contact />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>Vansh Tomar</span>

          <span>
            Mathematics & Computing · AI / ML / Software
          </span>

          <span>
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </>
  );
}

export default App;