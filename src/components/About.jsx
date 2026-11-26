import { motion, useReducedMotion } from "framer-motion";
import { PortraitImage } from "./PortraitLayer";
import { backgroundColumns } from "../data/aboutBackground";
import "../styles/About.css";

const EASE = [0.22, 1, 0.36, 1];

const makeReveal = (reduce) => (delay = 0) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 48 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.9, delay, ease: EASE },
      };

function Bracket({ side }) {
  const left = side === "left";
  const shape = left ? (
    <polyline points="56,8 10,48 56,88" />
  ) : (
    <>
      <line x1="24" y1="90" x2="52" y2="8" />
      <polyline points="90,8 136,48 90,88" />
    </>
  );
  return (
    <svg
      className={`bracket bracket--${side}`}
      viewBox={left ? "0 0 66 96" : "0 0 145 96"}
      fill="none"
      strokeWidth="16"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="var(--shadow-glyph)" transform="translate(8 8)">{shape}</g>
      <g stroke="currentColor">{shape}</g>
    </svg>
  );
}

/* The opening frame: oversized type + portrait + code texture. */
export default function About({ slotRef, stageRef, staticPortrait, portrait }) {
  const reveal = makeReveal(useReducedMotion());

  return (
    <section id="home" className="about" aria-labelledby="about-title">
      <div className="about__stage" ref={stageRef}>
        <div className="about__code" aria-hidden="true">
          {backgroundColumns.map((col, i) => (
            <pre key={i} className="about__code-col">{col}</pre>
          ))}
        </div>

        <h2 id="about-title" className="about__headline">
          <motion.span className="about__line" {...reveal(0)}>
            <span className="about__word">
              <Bracket side="left" />
              AI / ML
            </span>
          </motion.span>
          <motion.span className="about__line" {...reveal(0.12)}>
            <span className="about__word">
              ENGINEER
              <Bracket side="right" />
            </span>
          </motion.span>
        </h2>

        {/* Not animated: PortraitLayer measures this slot. */}
        <div ref={slotRef} className="portrait-slot about__portrait-slot" aria-hidden="true">
          {staticPortrait && <PortraitImage src={portrait.src} />}
        </div>

        <div className="about__meta">
          <p className="about__year">©{new Date().getFullYear()}</p>
          <p className="about__tag">{"{{ /AI & FULL-STACK DEVELOPEMENT }}"}</p>
        </div>
      </div>
    </section>
  );
}

/* The paragraph that follows the Hero. */
export function AboutCopy() {
  const reveal = makeReveal(useReducedMotion());


}