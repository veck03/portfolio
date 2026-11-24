import { Fragment, useLayoutEffect, useMemo, useRef, useState } from "react";
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
            className="cs__gallery-image"
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

/* ---------- pipeline diagram ---------- */

const ICONS = {
  message: <path d="M4 5.5h16v10H9.5L5.5 19v-3.5H4z" />,
  route: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 6h6a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  sort: (
    <>
      <path d="M4 7h10M4 12h7M4 17h4" />
      <path d="M17 5v14M14 16l3 3 3-3" />
    </>
  ),
  table: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M4 10h16M10 10v9" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  code: <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />,
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  layers: (
    <>
      <path d="M12 4l8 4-8 4-8-4z" />
      <path d="M4 12l8 4 8-4M4 16l8 4 8-4" />
    </>
  ),
  sparkle: <path d="M12 4l1.8 4.7L18.5 10l-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.3z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
};

function Icon({ name, size = 20 }) {
  const shape = ICONS[name];
  if (!shape) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="pipe__icon">
      {shape}
    </svg>
  );
}

// Line from the bottom of one node to the top of the next, with a rounded
// elbow that bends just above the target so merging lines share their last stretch.
function edgePath(a, b) {
  const x1 = a.x, y1 = a.bottom, x2 = b.x, y2 = b.top;
  if (Math.abs(x1 - x2) < 1) return `M${x1} ${y1}V${y2}`;
  const mid = y2 - 22;
  const r = Math.min(14, Math.abs(x2 - x1) / 2, Math.max(2, mid - y1));
  const dir = x2 > x1 ? 1 : -1;
  return `M${x1} ${y1}V${mid - r}Q${x1} ${mid} ${x1 + dir * r} ${mid}H${x2 - dir * r}Q${x2} ${mid} ${x2} ${mid + r}V${y2}`;
}

function Pipeline({ nodes, layers, routes }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [geo, setGeo] = useState({ w: 0, h: 0, pos: {} });
  const canvasRef = useRef(null);
  const nodeRefs = useRef({});
  const uid = useRef(`pipe-${Math.random().toString(36).slice(2, 7)}`).current;

  const route = routes[active] || routes[0];
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const rowOf = useMemo(() => {
    const map = {};
    layers.forEach((row, i) => row.forEach((id) => id && (map[id] = i)));
    return map;
  }, [layers]);

  // every line used by any route, once
  const edges = useMemo(() => {
    const seen = new Map();
    routes.forEach((r) =>
      r.paths.forEach((p) => {
        for (let i = 1; i < p.length; i++) {
          const key = `${p[i - 1]}>${p[i]}`;
          if (!seen.has(key)) seen.set(key, { key, from: p[i - 1], to: p[i] });
        }
      })
    );
    return [...seen.values()];
  }, [routes]);

  const onNodes = useMemo(() => new Set(route.paths.flat()), [route]);
  const onEdges = useMemo(() => {
    const set = new Set();
    route.paths.forEach((p) => {
      for (let i = 1; i < p.length; i++) set.add(`${p[i - 1]}>${p[i]}`);
    });
    return set;
  }, [route]);

  // measure where every box sits, so the lines can be drawn between them
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const measure = () => {
      const box = canvas.getBoundingClientRect();
      const pos = {};
      for (const [id, el] of Object.entries(nodeRefs.current)) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        pos[id] = { x: r.left - box.left + r.width / 2, top: r.top - box.top, bottom: r.bottom - box.top };
      }
      setGeo({ w: box.width, h: box.height, pos });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(canvas);
    Object.values(nodeRefs.current).forEach((el) => el && ro.observe(el));
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [layers, nodes]);

  const drawable = (e) => geo.pos[e.from] && geo.pos[e.to];
  const spoken = route.paths
    .map((p) => p.map((id) => byId[id]?.title || id).join(", then "))
    .join("; ");

  return (
    <div className="pipe">
      {routes.length > 1 && (
        <div className="pipe__tabs" role="tablist" aria-label="Question types">
          {routes.map((r, i) => (
            <button
              key={r.label}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${uid}-panel`}
              className="pipe__tab"
              onClick={() => setActive(i)}
            >
              <Icon name={r.icon} size={18} />
              {r.label}
            </button>
          ))}
        </div>
      )}

      <div
        className="pipe__canvas"
        ref={canvasRef}
        {...(routes.length > 1
          ? { role: "tabpanel", id: `${uid}-panel`, "aria-labelledby": `${uid}-tab-${active}` }
          : {})}
      >
        <svg className="pipe__edges" width={geo.w} height={geo.h} aria-hidden="true" focusable="false">
          {/* all lines, dimmed */}
          {edges.filter(drawable).map((e) => (
            <path key={e.key} className="pipe__edge" d={edgePath(geo.pos[e.from], geo.pos[e.to])} />
          ))}
          {/* the lines on the chosen route, drawn on top */}
          {edges
            .filter((e) => onEdges.has(e.key) && drawable(e))
            .map((e) => (
              <motion.path
                key={`${active}-${e.key}`}
                className="pipe__edge pipe__edge--on"
                d={edgePath(geo.pos[e.from], geo.pos[e.to])}
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: (rowOf[e.from] ?? 0) * 0.1 }}
              />
            ))}
        </svg>

        {layers.map((row, i) => (
          <div key={i} className={`pipe__row pipe__row--${row.length}`}>
            {row.map((id, j) => {
              const node = id && byId[id];
              if (!node) return <div key={`empty-${j}`} aria-hidden="true" />;
              return (
                <div
                  key={id}
                  ref={(el) => {
                    nodeRefs.current[id] = el;
                  }}
                  className={`pipe__node${onNodes.has(id) ? " is-on" : ""}`}
                >
                  <Icon name={node.icon} />
                  <div>
                    <p className="pipe__title">{node.title}</p>
                    {node.subtitle && <p className="pipe__sub">{node.subtitle}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="cs__sr" aria-live="polite">Path: {spoken}.</p>

      {route.note && (
        <p className="pipe__note">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
          {route.note}
        </p>
      )}
    </div>
  );
}

/* ---------- right column: section types ---------- */

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

      {type === "pipeline" && (
        <Pipeline nodes={section.nodes || []} layers={section.layers || []} routes={section.routes || []} />
      )}

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
  const meta = [category, statusLabel].filter(Boolean).join(" · ");

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
          {/* left: images and the essentials, kept short so it always fits */}
          <aside className="cs__side">
            <Gallery images={images} />

            <div className="cs__info">
              <h2 id="cs-title" className="cs__title">{title}</h2>
              {tagline && <p className="cs__tagline">{tagline}</p>}
              {meta && <p className="cs__meta">{meta}</p>}

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
            </div>
          </aside>

          {/* right: the story */}
          <div className="cs__main">
            {summary && <p className="cs__lead">{summary}</p>}

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
