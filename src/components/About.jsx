import SectionHeading from "./SectionHeading";

function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHeading
          number="03"
          eyebrow="About"
        />

        <div className="about-grid">
          <h2>
            Mathematics gives me
            <br />
            the <em>framework.</em>
          </h2>

          <div className="about-copy">
            <p className="large-copy">
              I approach software and AI from both sides:
              understanding the underlying ideas and
              turning them into systems that actually work.
            </p>

            <p>
              My work spans machine learning, generative AI,
              software engineering, and computational problem
              solving. I enjoy projects where understanding
              the system matters as much as using the tools.
            </p>

            <p>
              I’m particularly interested in intelligent
              applications, AI agents, machine-learning
              systems, and the engineering required to move
              an idea from experiment to implementation.
            </p>

            <a href="#contact" className="text-link">
              Let’s talk ↗
            </a>
          </div>
        </div>

        <div className="about-facts">
          <div>
            <span>01</span>
            <h3>Mathematics</h3>
            <p>
              Modelling, abstraction, analytical thinking,
              and computational problem solving.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>Artificial Intelligence</h3>
            <p>
              Machine learning, deep learning, LLMs,
              agents, and intelligent systems.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>Engineering</h3>
            <p>
              Turning models, ideas, and experiments into
              usable software.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;