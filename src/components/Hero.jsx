function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-bar">
          <span>01 — Profile</span>
        </div>

        <div className="hero-grid">
          <div className="hero-main">
            <span className="eyebrow">
              Mathematics & Computing
            </span>

            <h1>
              Building intelligent{" "}
              <em>systems.</em>
            </h1>

            <p className="hero-summary">
              I build software at the intersection of
              mathematics, machine learning, generative
              AI, and modern software engineering.
            </p>

            <div className="hero-actions">
              <a
                href="#work"
                className="button button-primary"
              >
                Explore work
                <span>↓</span>
              </a>

              <a
                href="https://github.com/veck03"
                target="_blank"
                rel="noreferrer"
                className="button"
              >
                GitHub
                <span>↗</span>
              </a>
            </div>
          </div>

          <aside className="hero-aside">
            <div className="portrait">
              <img
                src={`${import.meta.env.BASE_URL}profile.jpg`}
                alt="Vansh Tomar"
              />
            </div>

            <div className="hero-details">
              <div>
                <span>Based in</span>
                <strong>India</strong>
              </div>

              <div>
                <span>Focus</span>
                <strong>AI / ML / GenAI</strong>
              </div>

              <div>
                <span>Approach</span>
                <strong>Build · Research · Iterate</strong>
              </div>
            </div>
          </aside>
        </div>

        <div className="ticker">
          <span>Python</span>
          <span>Machine Learning</span>
          <span>Generative AI</span>
          <span>React</span>
          <span>FastAPI</span>
          <span>Research</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;