import SectionHeading from "./SectionHeading";

function About({ profile }) {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHeading number="03" eyebrow="About" />
        <div className="about-grid">
          <h2>Mathematics gives me<br />the <em>framework.</em></h2>
          <div className="about-copy">
            <p className="large-copy">{profile.about || profile.summary}</p>
            <p>My project work includes LLM-powered research retrieval, neural-network implementation, and geospatial analysis using satellite-derived data. I am interested in the engineering behind these systems: how data is processed, how models are evaluated, and how separate components become useful applications.</p>
            <a href="#contact" className="text-link">Get in touch ↗</a>
          </div>
        </div>
        <div className="about-facts">
          <div><span>01</span><h3>Mathematics</h3><p>Modelling, analytical thinking and computational problem solving.</p></div>
          <div><span>02</span><h3>Artificial Intelligence</h3><p>Machine learning, neural networks, LLMs and retrieval systems.</p></div>
          <div><span>03</span><h3>Engineering</h3><p>Building APIs and applications around data and intelligent models.</p></div>
        </div>
      </div>
    </section>
  );
}
export default About;
