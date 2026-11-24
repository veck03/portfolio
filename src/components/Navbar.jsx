import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONTACT } from "../data/contact";
import { RESUME_URL, RESUME_FILENAME } from "../config";
import "../styles/Navbar.css";

const PAGES = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#hero" },
  { label: "Tech Stack", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const CONNECT = [
  { label: "Email", href: `mailto:${CONTACT.email}`, newTab: false },
  ...CONTACT.socials.map((s) => ({ label: s.label, href: s.href, newTab: true })),
];

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12L12 4M5.5 4H12v6.5" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 2.5v8M4.5 7.5L8 11l3.5-3.5M3 13.5h10" />
  </svg>
);

export default function Navbar({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="nav" ref={rootRef}>
      <nav className="nav__pill" aria-label="Primary">
        <a className="nav__brand" href="#home">Vansh</a>

        <div className="nav__actions">
          <button
            type="button"
            className="nav__icon"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} appearance`}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            type="button"
            className="nav__menu"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="5" cy="12" r="1.9" />
              <circle cx="12" cy="12" r="1.9" />
              <circle cx="19" cy="12" r="1.9" />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-menu"
            className="nav__dropdown"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="nav__col">
              <p className="nav__label">Pages</p>
              <ul className="nav__list" aria-label="Pages">
                {PAGES.map((l) => (
                  <li key={l.href}>
                    <a className="nav__link" href={l.href} onClick={close}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav__col">
              <p className="nav__label">Connect</p>
              <ul className="nav__list" aria-label="Contact links">
                {CONNECT.map((l) => (
                  <li key={l.label}>
                    <a
                      className="nav__link"
                      href={l.href}
                      onClick={close}
                      {...(l.newTab ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      {l.label}
                      <ArrowIcon />
                    </a>
                  </li>
                ))}
              </ul>

              {RESUME_URL && (
                <a className="nav__resume" href={RESUME_URL} download={RESUME_FILENAME} onClick={close}>
                  Download resume
                  <DownloadIcon />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}