import { CONTACT, FOOTER } from "../data/contact";
import { PROFILE } from "../data/profileData";
import { RESUME_URL, RESUME_FILENAME } from "../config";
import "../styles/Footer.css";

function Arrow({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12L12 4M5.5 4H12v6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div>
            <p className="footer__brand">{FOOTER.brand}</p>
            <p className="footer__tagline">{FOOTER.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <p className="footer__label">Explore</p>
            <ul className="footer__links">
              {FOOTER.links.map((l) => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
              {RESUME_URL && (
                <li>
                  <a href={RESUME_URL} download={RESUME_FILENAME}>Resume</a>
                </li>
              )}
            </ul>
          </nav>

          <div>
            <p className="footer__label">Get in touch</p>
            <a className="footer__email" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
              <Arrow />
            </a>
            <p className="footer__legal">© {new Date().getFullYear()} {PROFILE.name}</p>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__closing">{FOOTER.closing}</p>
          <a className="footer__top-link" href="#home">
            Back to top
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}