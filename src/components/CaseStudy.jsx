import { Fragment, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "../styles/CaseStudy.css";

function ArrowIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12L12 4M5.5 4H12v6.5" />
    </svg>
  );
}

/* ---------- left column: images ---------- */

function Gallery({ images }) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState({});
  const current = images[active];
  const ok = current && !failed[current.src];

  return (
    <div className="cs__gallery">
      <div className="cs__frame">
        {ok ? (
          <img
            src={current.src}
            alt={current.alt}
            onError={() => setFailed((f) => ({ ...f, [current.src]: true }))}
          />
        ) : (
          <div className="cs__placeholder">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="14" rx="2" />
              <circle cx="9" cy="10" r="1.5" />
              <path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5" />
            </svg>
            <span>Screenshot coming soon</span>
          </div>
        )}
      </div>

      {current?.caption && <p className="cs__caption">{current.caption}</p>}

      {images.length > 1 && (
        <ul className="cs__thumbs">
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                className={`cs__thumb${i === active ? " is-active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={i === active}
              >
                <img src={img.src} alt="" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- right column: section types ---------- */

function Flow({ tabs }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active] || tabs[0];
  const base = `flow-${tabs[0]?.label?.replace(/\W+/g, "-")}`;

  return (
    <div className="flow">
      {tabs.length > 1 && (
        <div className="flow__tabs" role="tablist" aria-label="Walkthrough paths">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              role="tab"
              id={`${base}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${base}-panel`}
              className="flow__tab"
              onClick={() => setActive(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      <ol className="flow__steps" role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${active}`}>
        {tab.steps.map((s, i) => (
          <li key={`${active}-${i}`} className="flow__step">
            <div className="flow__node">
              <span className="flow__n" aria-hidden="true">{i + 1}</span>
              <div>
                <p className="flow__title">{s.title}</p>
                {s.subtitle && <p className="flow__sub">{s.subtitle}</p>}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Section({ section }) {
  const { type, title } = section;
  return (
    <section className="cs__section">
      {title && <h3 className="cs__h">{title}</h3>}

      {type === "text" &&
        (section.body || []).map((p, i) => <p key={i} className="cs__p">{p}</p>)}

      {type === "list" && (
        <ul className="cs__list">
          {(section.items || []).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}

      {type === "steps" && (
        <ol className="cs__steps">
          {(section.steps || []).map((s, i) => (
            <li key={i}>
              <div>
                <p className="cs__step-title">{s.title}</p>
                {s.text && <p className="cs__p">{s.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}

      {type === "metrics" && (
        <>
          <ul className="cs__metrics">
            {(section.items || []).map((m, i) => (
              <li key={i} className="cs__metric">
                <span className="cs__metric-value">{m.value}</span>
                <span className="cs__metric-label">{m.label}</span>
              </li>
            ))}
          </ul>
          {section.note && <p className="cs__metric-note">{section.note}</p>}
        </>
      )}

      {type === "flow" && <Flow tabs={section.tabs || []} />}

      {type === "image" && (
        <figure className="cs__figure">
          <div className="cs__frame cs__frame--wide">
            <img src={section.src} alt={section.alt} loading="lazy" />
          </div>
          {section.caption && <figcaption className="cs__caption">{section.caption}</figcaption>}
        </figure>
      )}
    </section>
  );
}

/* ---------- the page ---------- */

export default function CaseStudy({ detail, innerRef, onClose, onNext, nextTitle }) {
  const reduce = useReducedMotion();
  const { title, tagline, category, statusLabel, label, summary, stack, facts, links, images, note, sections } = detail;

  return (
    <motion.section
      id="case-study"
      ref={innerRef}
      tabIndex={-1}
      className="cs"
      aria-labelledby="cs-title"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="cs__inner">
        <header className="cs__bar">
          <p className="cs__label">{label}</p>
          <button type="button" className="cs__close" onClick={onClose} aria-label="Close project details">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="cs__grid">
          <aside className="cs__side">
            <Gallery images={images} />

            <div className="cs__info">
              <h2 id="cs-title" className="cs__title">{title}</h2>
              <p className="cs__tagline">{tagline}</p>

              <ul className="cs__chips">
                {category && <li>{category}</li>}
                {statusLabel && <li>{statusLabel}</li>}
              </ul>

              {stack?.length > 0 && (
                <p className="cs__stack">
                  {stack.map((s, i) => (
                    <Fragment key={s}>
                      {i > 0 && <span className="cs__slash" aria-hidden="true">/</span>}
                      {s}
                    </Fragment>
                  ))}
                </p>
              )}

              {facts?.length > 0 && (
                <dl className="cs__facts">
                  {facts.map((f) => (
                    <Fragment key={f.label}>
                      <dt>{f.label}</dt>
                      <dd>{f.value}</dd>
                    </Fragment>
                  ))}
                </dl>
              )}

              {(links.live || links.github) && (
                <div className="cs__links">
                  {links.live && (
                    <a className="cs__link" href={links.live} target="_blank" rel="noreferrer">
                      Live app
                      <span className="cs__link-icon"><ArrowIcon /></span>
                    </a>
                  )}
                  {links.github && (
                    <a className="cs__link" href={links.github} target="_blank" rel="noreferrer">
                      Source
                      <span className="cs__link-icon"><ArrowIcon /></span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </aside>

          <div className="cs__main">
            {summary && <p className="cs__lead">{summary}</p>}
            {sections.map((s, i) => (
              <Section key={`${s.type}-${i}`} section={s} />
            ))}
            {note && <p className="cs__note">{note}</p>}
          </div>
        </div>

        <footer className="cs__foot">
          <button type="button" className="cs__textbtn" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" />
            </svg>
            Back to projects
          </button>
          {onNext && (
            <button type="button" className="cs__textbtn" onClick={onNext}>
              Next: {nextTitle}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          )}
        </footer>
      </div>
    </motion.section>
  );
}