const capabilities = [
  {
    number: "01",
    title: "Artificial Intelligence",
    description:
      "Designing and implementing intelligent systems using machine learning, deep learning, LLMs and agentic workflows.",
    technologies:
      "LLMs · RAG · AI Agents · Prompt Engineering · Deep Learning"
  },
  {
    number: "02",
    title: "Machine Learning",
    description:
      "Working with data, models and experimentation to solve structured and real-world problems.",
    technologies:
      "Python · NumPy · Scikit-learn · Remote Sensing · GEE"
  },
  {
    number: "03",
    title: "Software Engineering",
    description:
      "Building reliable applications around APIs, interfaces, databases and backend services.",
    technologies:
      "React · JavaScript · FastAPI · REST · MongoDB"
  },
  {
    number: "04",
    title: "Problem Solving",
    description:
      "Applying mathematical and algorithmic thinking to break complex problems into implementable systems.",
    technologies:
      "C++ · Python · DSA · Algorithms · Mathematics"
  }
];

function Skills() {
  return (
    <section
      className="section capabilities-section"
      id="capabilities"
    >
      <div className="container">
        <div className="section-intro compact">
          <div>
            <span className="section-label">
              04 — Capabilities
            </span>

            <h2>
              What I
              <br />
              <em>work with.</em>
            </h2>
          </div>

          <p>
            Tools are secondary. The goal is to understand
            the problem, choose the right approach, and
            build the system.
          </p>
        </div>

        <div className="capabilities">
          {capabilities.map((item) => (
            <article
              className="capability"
              key={item.number}
            >
              <span className="capability-number">
                {item.number}
              </span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <div className="capability-tech">
                {item.technologies}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;