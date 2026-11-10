import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";

function Projects({ projects }) {
  const visibleProjects = [...projects]
    .filter((project) => project.featured !== false)
    .sort((a, b) => (a.portfolio_priority ?? 999) - (b.portfolio_priority ?? 999));

  return (
    <section className="section" id="work">
      <div className="container">
        <SectionHeading number="02" eyebrow="Selected Work" title="Things I’ve" accent="built." description="Selected projects across AI engineering, machine learning, deep learning and scientific data applications." />
        <div className="projects-grid">
          {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} number={index + 1} total={visibleProjects.length} />)}
        </div>
      </div>
    </section>
  );
}
export default Projects;
