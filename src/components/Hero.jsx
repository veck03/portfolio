import { motion, useReducedMotion } from "framer-motion";
import { PortraitImage } from "./PortraitLayer";
import { PROFILE, CURRENT_EDUCATION } from "../data/profileData";
import "../styles/Hero.css";

const EASE = [0.22, 1, 0.36, 1];

export default function Hero({ slotRef, staticPortrait, portrait, projectsHref }) {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const item = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
      };

  // "AI/ML Engineer & Software Developer" -> two lines
  const [roleA, roleB] = PROFILE.headline_long.split(" & ");
  const studying = CURRENT_EDUCATION.status === "in_progress";

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <motion.div
        className="hero__grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="hero__left">
          <motion.h1 id="hero-title" className="hero__title" variants={item}>
            Hi, I’m<br />{PROFILE.display_name}.
          </motion.h1>
          <motion.p className="hero__role" variants={item}>
            {roleB ? (
              <>{roleA}<br />&amp; {roleB}.</>
            ) : (
              <>{PROFILE.headline_long}.</>
            )}
          </motion.p>
          <motion.div className="hero__study" variants={item}>
            <p className="hero__eyebrow">{studying ? "Currently studying" : "Studied at"}</p>
            <p className="hero__org">{CURRENT_EDUCATION.institution}</p>
            <p className="hero__degree">{CURRENT_EDUCATION.degree}</p>
            <p className="hero__place">{CURRENT_EDUCATION.location}</p>
          </motion.div>
        </div>

        {/* Not animated: PortraitLayer measures this slot. */}
        <div className="hero__portrait-col">
          <div ref={slotRef} className="portrait-slot" role="img" aria-label={portrait.alt}>
            {staticPortrait && <PortraitImage src={portrait.src} />}
          </div>
        </div>

        <div className="hero__right">
          <motion.p className="hero__intro" variants={item}>
            I build <strong>intelligent applications</strong>, develop{" "}
            <strong>RAG pipelines</strong>, and explore <strong>machine learning</strong>{" "}
            to solve real-world problems.
          </motion.p>
          <motion.a className="btn" href={projectsHref} variants={item}>
            Explore Projects
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12L12 4M5.5 4H12v6.5" />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}