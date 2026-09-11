import ProjectVisual from "./ProjectVisual";

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-media">
        <ProjectVisual type={project.visual} />

        <span className="project-number">
          {project.number}
        </span>
      </div>

      <div className="project-info">
        <div className="project-meta">
          <span>{project.category}</span>

          <span>
            {project.number} / 04
          </span>
        </div>

        <h3>{project.title}</h3>

        <p>{project.description}</p>

        <div className="tag-list">
          {project.tech.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="project-links">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
          >
            Source
            <span>↗</span>
          </a>

          {project.demo !== "#" && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
            >
              Live
              <span>↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;