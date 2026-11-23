import { useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About, { AboutCopy } from "./components/About";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AskAiButton from "./components/AskAiButton";
import AskAiPanel from "./components/AskAiPanel";
import PortraitLayer from "./components/PortraitLayer";
import useTheme from "./hooks/useTheme";
import usePortraitTransition from "./hooks/usePortraitTransition";
import { PORTRAIT, PROJECTS_ANCHOR } from "./config";
import "./styles/global.css";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const transitionEnabled = usePortraitTransition();
  const [chatOpen, setChatOpen] = useState(false);

  const wrapperRef = useRef(null);
  const coverSlotRef = useRef(null);
  const heroSlotRef = useRef(null);
  const coverStageRef = useRef(null);

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main className="intro" ref={wrapperRef}>
        <About
          slotRef={coverSlotRef}
          stageRef={coverStageRef}
          staticPortrait={!transitionEnabled}
          portrait={PORTRAIT}
        />
        <Hero
          slotRef={heroSlotRef}
          staticPortrait={!transitionEnabled}
          portrait={PORTRAIT}
          projectsHref={PROJECTS_ANCHOR}
        />
        <AboutCopy />
        {transitionEnabled && (
          <PortraitLayer
            wrapperRef={wrapperRef}
            coverSlotRef={coverSlotRef}
            heroSlotRef={heroSlotRef}
            stageRef={coverStageRef}
            src={PORTRAIT.src}
          />
        )}
      </main>

      <TechStack />
      <Projects />
      <Contact />
      <Footer />

      <AskAiButton open={chatOpen} onOpen={() => setChatOpen(true)} />
      <AskAiPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}