import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CONTACT } from "../data/contact";
import "../styles/Contact.css";

const EASE = [0.22, 1, 0.36, 1];

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

const ICONS = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
};

export default function Contact() {
  const fade = makeFade(useReducedMotion());
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
  };

  // No backend: hand the pre-filled message to the visitor's mail app.
  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const from = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const mailto = new URL(`mailto:${CONTACT.email}`);
    mailto.searchParams.set("subject", `Portfolio enquiry from ${name}`);
    mailto.searchParams.set("body", `${message}\n\n— ${name}\n${from}`);

    // Clicking a mailto anchor is more consistently handled by browsers than
    // assigning window.location, and leaves the portfolio page in place.
    const link = document.createElement("a");
    link.href = mailto.toString();
    link.click();
  };

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__inner">
        <div className="contact__left">
          <motion.h2 id="contact-title" className="contact__title" {...fade(0)}>
            {CONTACT.heading}
          </motion.h2>
          <motion.p className="contact__blurb" {...fade(0.08)}>
            {CONTACT.blurb}
          </motion.p>

          <motion.div className="contact__mail" {...fade(0.14)}>
            <a className="contact__email" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
              <Arrow size={15} />
            </a>
            <button
              type="button"
              className="contact__copy"
              onClick={copyEmail}
              aria-label={copied ? "Email copied" : "Copy email address"}
            >
              {copied ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M5 15V6a2 2 0 0 1 2-2h9" />
                </svg>
              )}
            </button>
            <span className="sr-only" aria-live="polite">{copied ? "Email copied" : ""}</span>
          </motion.div>

          <motion.ul className="contact__social" {...fade(0.2)}>
            {CONTACT.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {ICONS[s.icon] || <Arrow size={16} />}
                  {s.label}
                </a>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.form className="contact__form" onSubmit={onSubmit} {...fade(0.12)}>
          <div className="form__row">
            <div className="field">
              <label className="field__label" htmlFor="c-name">Your name</label>
              <input id="c-name" name="name" className="field__control" type="text" placeholder="What should I call you?" autoComplete="name" required />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="c-email">Email address</label>
              <input id="c-email" name="email" className="field__control" type="email" placeholder="you@company.com" autoComplete="email" required />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="c-message">What do you have in mind?</label>
            <textarea id="c-message" name="message" className="field__control" placeholder="A little about your opportunity or project…" required />
          </div>

          <button type="submit" className="contact__submit">
            Create email draft
            <Arrow size={18} />
          </button>
        </motion.form>
      </div>
    </section>
  );
}
