import SectionHeading from "./SectionHeading";

const labels = {
  programming: "Programming",
  ai_ml: "AI & Machine Learning",
  libraries_frameworks: "Libraries & Frameworks",
  tools: "Tools & Platforms",
};

function Skills({ skills }) {
  return (
    <section className="section capabilities-section" id="skills">
      <div className="container">
        <SectionHeading number="04" eyebrow="Technical Skills" title="Tools and" accent="technologies." description="A categorized overview of the languages, frameworks and tools I have used in my project work." />
        <div className="skills-grid">
          {Object.entries(labels).map(([key, label], index) => {
            const items = skills[key] || [];
            if (!items.length) return null;
            return <article className="skill-card" key={key}>
              <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{label}</h3>
              <div className="skill-tags">{items.map((item) => <span key={item}>{item}</span>)}</div>
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}
export default Skills;
