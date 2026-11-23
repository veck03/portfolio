import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PROJECTS, PROJECTS_SECTION } from "../data/projects";
import "../styles/Projects.css";

const EASE = [0.22, 1, 0.36, 1];

// Folder front outline in a 100 x 58 box (units = % of the folder's width).
// Tab on the upper left, rounded body below it.
const FRONT_PATH =
  "M0 52V3.5A3.5 3.5 0 0 1 3.5 0H41C44.5 0 45 6 49 6H94A6 6 0 0 1 100 12V52A6 6 0 0 1 94 58H6A6 6 0 0 1 0 52Z";

const makeFade = (reduce) => (delay = 0) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 36 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.8, delay, ease: EASE },
      };

function Arrow({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12L12 4M5.5 4H12v6.5" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg className="folder__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}

function Card({ variant, image, label }) {
  const [failed, setFailed] = useState(false);

  let content;
  if (image && !failed) {
    content = (
      <img src={image} alt="" loading="lazy" draggable="false" onError={() => setFailed(true)} />
    );
  } else if (variant === "shot") {
    content = (
      <div className="folder__skeleton">
        <i /><i /><i /><i />
      </div>
    );
  } else {
    content = (
      <>
        <DocIcon />
        <span className="folder__label">{label}</span>
      </>
    );
  }
  return (
    <div className={`folder__card folder__card--${variant}`} aria-hidden="true">
      {content}
    </div>
  );
}

function Folder({ project, fade }) {
  const { title, caption, category, cta, href, images = [] } = project;
  return (
    <motion.article className="folder" {...fade}>
      <div className="folder__stage">
        <div className="folder__back" aria-hidden="true" />
        <Card variant="shot" image={images[0]} />
        <Card variant="left" image={images[2]} label="Project overview" />
        <Card variant="mid" image={images[1]} label="Details & source" />

        <div className="folder__front">
          <svg className="folder__outline" viewBox="0 0 100 58" preserveAspectRatio="none" aria-hidden="true">
            <path d={FRONT_PATH} />
          </svg>
          <h3 className="folder__title">{title}</h3>
          {href && (
            <a className="folder__go" href={href} target="_blank" rel="noreferrer" aria-label={`${cta}: ${title}`}>
              <Arrow size={18} />
            </a>
          )}
        </div>
      </div>

      <div className="folder__meta">
        <p className="folder__caption">{caption}</p>
        {href ? (
          <a className="folder__link" href={href} target="_blank" rel="noreferrer">
            {cta}
            <Arrow size={14} />
          </a>
        ) : (
          <span className="folder__tag">{category}</span>
        )}
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const fade = makeFade(useReducedMotion());

  return (
    <section id="projects" className="projects" aria-labelledby="projects-title">
      {/* Clip shape for the folder fronts (defined once, used by CSS). */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="folder-front-clip" clipPathUnits="objectBoundingBox">
            <path transform="scale(0.01 0.017241)" d={FRONT_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div className="projects__inner">
        <header className="projects__head">
          <motion.h2 id="projects-title" className="projects__title" {...fade(0)}>
            Featured<br />Projects
          </motion.h2>
          <a className="projects__github" href={PROJECTS_SECTION.githubUrl} target="_blank" rel="noreferrer">
            GitHub
            <span className="projects__github-icon"><Arrow size={14} /></span>
          </a>
        </header>

        <motion.p className="projects__blurb" {...fade(0.08)}>
          {PROJECTS_SECTION.blurb}
        </motion.p>

        <div className="projects__grid">
          {PROJECTS.map((project, i) => (
            <Folder key={project.id} project={project} fade={fade(0.1 + i * 0.1)} />
          ))}
        </div>
      </div>
    </section>
  );
}