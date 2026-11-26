import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PROJECTS, PROJECTS_SECTION, CASE_STUDY_IDS, getProjectDetail } from "../data/projects";
import CaseStudy from "./CaseStudy";
import "../styles/Projects.css";

const EASE = [0.22, 1, 0.36, 1];

// Folder front outline in a 100 x 58 box (units = % of the folder's width).
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

const parseHash = () => {
  const id = new URLSearchParams(window.location.hash.slice(1)).get("project");
  return id && CASE_STUDY_IDS.includes(id) ? id : null;
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

function Folder({ project, fade, active, onOpen }) {
  const { id, title, caption, category, cta, href, hasCaseStudy, detailKind, images = [] } = project;
  const detailText = detailKind === "case_study" ? "Read case study" : "View details";
  const [hovered, setHovered] = useState(false);
  const [suppressHover, setSuppressHover] = useState(false);

  const toggleOpen = () => {
    if (active) {
      setSuppressHover(true);
      setHovered(false);
    }
    onOpen(id);
  };

  const onArticleClick = hasCaseStudy
    ? (e) => {
        // buttons and links handle their own clicks
        if (!e.target.closest("a, button")) toggleOpen();
      }
    : undefined;

  return (
    <motion.article
      className={`folder${hasCaseStudy ? " folder--clickable" : ""}${active ? " folder--active" : ""}${hovered && !suppressHover ? " folder--hovered" : ""}`}
      data-folder={id}
      onClick={onArticleClick}
      onMouseEnter={() => { if (!suppressHover) setHovered(true); }}
      onMouseLeave={() => { setHovered(false); setSuppressHover(false); }}
      {...fade}
    >
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

          {hasCaseStudy ? (
            <button
              type="button"
              className="folder__go"
              onClick={toggleOpen}
              aria-label={`${detailText}: ${title}`}
              aria-expanded={active}
              aria-controls="case-study"
            >
              <Arrow size={18} />
            </button>
          ) : (
            href && (
              <a className="folder__go" href={href} target="_blank" rel="noreferrer" aria-label={`${cta}: ${title}`}>
                <Arrow size={18} />
              </a>
            )
          )}
        </div>
      </div>

      <div className="folder__meta">
        <p className="folder__caption">{caption}</p>
        {hasCaseStudy ? (
          <button type="button" className="folder__link" onClick={toggleOpen}>
            {detailText}
            <Arrow size={14} />
          </button>
        ) : href ? (
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
  const reduce = useReducedMotion();
  const fade = makeFade(reduce);

  const [selected, setSelected] = useState(null);
  const selectedRef = useRef(null);
  selectedRef.current = selected;

  const gridRef = useRef(null);
  const detailRef = useRef(null);
  const closeTimer = useRef(null);
  const scrollPlan = useRef(null); // null, or how long to wait before scrolling (ms)
  const api = useRef({});

  const scrollToDetail = () =>
    detailRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });

  const open = (id, { push = true, scroll = true, delay = 80 } = {}) => {
    if (!CASE_STUDY_IDS.includes(id)) return;
    window.clearTimeout(closeTimer.current);
    if (push && parseHash() !== id) window.history.pushState(null, "", `#project=${id}`);

    if (id === selectedRef.current) {
      if (push) close();
      else if (scroll) scrollToDetail();
      return;
    }
    // swapping projects waits for the old page to fade out first
    scrollPlan.current = scroll ? (selectedRef.current ? 400 : delay) : null;
    setSelected(id);
  };

  const close = () => {
    const id = selectedRef.current;
    if (!id) return;
    window.history.pushState(null, "", "#projects");

    if (gridRef.current) {
      const top = gridRef.current.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
    }
    // remove the section only after we've scrolled back up, so the page doesn't jump
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(
      () => {
        setSelected(null);
        document.querySelector(`[data-folder="${id}"] .folder__go`)?.focus({ preventScroll: true });
      },
      reduce ? 0 : 650
    );
  };

  api.current = { open, close };

  // after a project is shown, scroll to it and move focus there
  useEffect(() => {
    if (!selected || scrollPlan.current === null) return;
    const t = window.setTimeout(() => {
      scrollPlan.current = null;
      scrollToDetail();
      detailRef.current?.focus({ preventScroll: true });
    }, scrollPlan.current);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // deep link on load, and the browser's Back / Forward buttons
  useEffect(() => {
    const id = parseHash();
    if (id) api.current.open(id, { push: false, delay: 450 });

    const onPop = () => {
      const next = parseHash();
      if (next) {
        api.current.open(next, { push: false });
      } else {
        window.clearTimeout(closeTimer.current);
        setSelected(null);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  const detail = selected ? getProjectDetail(selected) : null;
  const nextId =
    selected && CASE_STUDY_IDS.length > 1
      ? CASE_STUDY_IDS[(CASE_STUDY_IDS.indexOf(selected) + 1) % CASE_STUDY_IDS.length]
      : null;
  const nextTitle = nextId ? PROJECTS.find((p) => p.id === nextId)?.title : null;

  return (
    <>
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

          <div className="projects__grid" ref={gridRef}>
            {PROJECTS.map((project, i) => (
              <Folder
                key={project.id}
                project={project}
                fade={fade(0.1 + i * 0.1)}
                active={selected === project.id}
                onOpen={open}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {detail && (
          <CaseStudy
            key={detail.id}
            detail={detail}
            innerRef={detailRef}
            onClose={close}
            onNext={nextId ? () => open(nextId) : null}
            nextTitle={nextTitle}
          />
        )}
      </AnimatePresence>
    </>
  );
}
