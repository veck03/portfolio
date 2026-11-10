function Contact({ profile }) {
  const links = profile.links || {};
  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-header"><span>06 — Contact</span><span>Opportunities · Collaboration · Technical conversations</span></div>
        <div className="contact-grid">
          <h2>Let’s build<br /><em>something useful.</em></h2>
          <div className="contact-copy">
            <p>I’m open to relevant opportunities and conversations around AI, machine learning, software engineering and research.</p>
            <a href={`mailto:${profile.email}`} className="email">{profile.email}<span>↗</span></a>
          </div>
        </div>
        <div className="contact-links">
          {links.github && <a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
          {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}
          <a href={`${import.meta.env.BASE_URL}resume_2026.pdf`} target="_blank" rel="noreferrer">Resume ↗</a>
        </div>
      </div>
    </section>
  );
}
export default Contact;
