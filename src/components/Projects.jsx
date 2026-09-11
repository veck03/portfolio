import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import { projects } from "../data/projects";

function Projects() {
  return (
    <section className="section" id="work">
      <div className="container">
        <SectionHeading
          number="02"
          eyebrow="Selected Work"
          title="Things I’ve"
          accent="built."
          description="A selection of projects spanning artificial intelligence, machine learning, research, and software engineering."
        />

        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.number}
              project={project}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;