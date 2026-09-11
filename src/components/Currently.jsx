const items = [
  {
    title: "Generative AI",
    description:
      "LLMs, agents and practical AI applications."
  },
  {
    title: "AI Engineering",
    description:
      "Building reliable systems around intelligent models."
  },
  {
    title: "Algorithms",
    description:
      "Data structures, algorithms and computational thinking."
  },
  {
    title: "Research",
    description:
      "Exploring problems where mathematics meets computation."
  }
];

function Currently() {
  return (
    <section className="section">
      <div className="container">
        <div className="currently-heading">
          <div>
            <span className="eyebrow">
              05 — Now
            </span>

            <h2>
              What I’m
              <br />
              <em>working on.</em>
            </h2>
          </div>

          <span className="updated">
            Updated 2026
          </span>
        </div>

        <div className="currently-list">
          {items.map((item, index) => (
            <article
              className="currently-item"
              key={item.title}
            >
              <span className="item-number">
                0{index + 1}
              </span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <span className="item-arrow">↗</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Currently;