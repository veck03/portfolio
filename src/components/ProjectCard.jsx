import ProjectVisual from "./ProjectVisual";

function ProjectCard({ project, number, total }) {
  const github = project.links?.github;
  const demo = project.links?.live_demo;
  const displayNumber = String(number).padStart(2, "0");
  const thumbnail = typeof project.image === "string" && /^[\w.-]+$/.test(project.image)
    ? `${import.meta.env.BASE_URL}project-thumbnails/${project.image}`
    : null;

  return (
    <article className="project-card">
      <div className="project-media">
        {thumbnail ? (
          <img className="project-thumbnail" src={thumbnail} alt={`${project.title} project preview`} loading="lazy" />
        ) : (
          <ProjectVisual type={project.visual} />
        )}
        <span className="project-number">{displayNumber}</span>
      </div>
      <div className="project-info">
        <div className="project-meta"><span>{project.category}</span><span>{displayNumber} / {String(total).padStart(2, "0")}</span></div>
        <h3>{project.title}</h3>
        <p>{project.portfolio_description || project.short_description}</p>
        <div className="tag-list">{(project.technologies || []).map((item) => <span key={item}>{item}</span>)}</div>
        {(github || demo) && <div className="project-links">
          {github && github !== "#" && <a href={github} target="_blank" rel="noreferrer">Source <span>↗</span></a>}
          {demo && demo !== "#" && <a href={demo} target="_blank" rel="noreferrer">Live demo <span>↗</span></a>}
        </div>}
      </div>
    </article>
  );
}
export default ProjectCard;
