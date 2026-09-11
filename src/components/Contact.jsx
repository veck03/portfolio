function Contact() {
  return (
    <section
      className="contact-section"
      id="contact"
    >
      <div className="container">
        <div className="contact-header">
          <span>06 — Contact</span>

          <span>
            Projects · Opportunities · Collaboration
          </span>
        </div>

        <div className="contact-grid">
          <h2>
            Let’s build
            <br />
            <em>something useful.</em>
          </h2>

          <div className="contact-copy">
            <p>
              I’m open to conversations around AI,
              machine learning, software engineering,
              research, and interesting technical
              problems.
            </p>

            <a
              href="mailto:your.email@example.com"
              className="email"
            >
              your.email@example.com
              <span>↗</span>
            </a>
          </div>
        </div>

        <div className="contact-links">
          <a
            href="https://github.com/veck03"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn ↗
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Resume ↗
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;