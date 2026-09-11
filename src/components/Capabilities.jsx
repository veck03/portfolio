import SectionHeading from "./SectionHeading";

const capabilities = [
  {
    number: "01",
    title: "Artificial Intelligence",
    description:
      "Designing intelligent applications around models, agents, retrieval, and reasoning.",
    tools:
      "LLMs · RAG · AI Agents · Deep Learning"
  },
  {
    number: "02",
    title: "Machine Learning",
    description:
      "Working with data, modelling, experimentation, and evaluation to solve real problems.",
    tools:
      "Python · NumPy · Scikit-learn · GEE"
  },
  {
    number: "03",
    title: "Software Engineering",
    description:
      "Building the application layer around APIs, interfaces, databases, and services.",
    tools:
      "React · FastAPI · REST · MongoDB"
  },
  {
    number: "04",
    title: "Problem Solving",
    description:
      "Breaking complex problems into well-defined computational and mathematical systems.",
    tools:
      "Python · C++ · DSA · Algorithms"
  }
];

function Capabilities() {
  return (
    <section
      className="section capabilities-section"
      id="capabilities"
    >
      <div className="container">
        <SectionHeading
          number="04"
          eyebrow="Capabilities"
          title="What I"
          accent="work with."
          description="Tools are secondary. The goal is to understand the problem, choose the right approach, and build the system."
        />

        <div className="capability-grid">
          {capabilities.map((item) => (
            <article
              className="capability-card"
              key={item.number}
            >
              <span className="card-number">
                {item.number}
              </span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <span className="card-tools">
                {item.tools}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Capabilities;