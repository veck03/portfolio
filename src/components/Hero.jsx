function Hero({ profile }) {
  const github = profile.links?.github;
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-bar">
          <span>01 — Profile</span><span className="availability"><span /> Open to relevant opportunities</span>
        </div>
        <div className="hero-grid">
          <div className="hero-main">
            <span className="eyebrow">{profile.headline || "AI / ML Engineering"}</span>
            <h1>Building intelligent <em>systems.</em></h1>
            <p className="hero-focus">Machine Learning <span>·</span> Deep Learning <span>·</span> Agentic AI</p>
            <p className="hero-summary">{profile.hero_summary || profile.summary}</p>
            <div className="hero-actions">
              <a href="#work" className="button button-primary">Explore projects <span>↓</span></a>
              <a href={`${import.meta.env.BASE_URL}resume_2026.pdf`} target="_blank" rel="noreferrer" className="button">Download resume <span>↗</span></a>
              {github && <a href={github} target="_blank" rel="noreferrer" className="button">GitHub <span>↗</span></a>}
            </div>
          </div>
          <aside className="hero-aside">
            <div className="portrait"><img src={`${import.meta.env.BASE_URL}profile.jpg`} alt={`Portrait of ${profile.name}`} /></div>
            <div className="hero-details">
              <div><span>Based in</span><strong>{profile.location || "India"}</strong></div>
              <div><span>Focus</span><strong>AI / ML Engineering</strong></div>
              <div><span>Background</span><strong>{profile.degree || "Mathematics & Computing"}</strong></div>
            </div>
          </aside>
        </div>
        <div className="ticker"><span>Python</span><span>Machine Learning</span><span>LLMs & RAG</span><span>FastAPI</span><span>ChromaDB</span><span>Scientific Computing</span></div>
      </div>
    </section>
  );
}
export default Hero;
