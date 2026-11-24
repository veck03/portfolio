import { PROFILE, PROJECTS_DATA, CASE_STUDIES, assetUrl } from "./profileData";

export const PROJECTS_SECTION = {
  blurb:
    "Selected AI/ML projects. Hover over a folder to peek inside, then open it to explore.",
  githubUrl: PROFILE.links.github,
};

/*
  What each folder needs. A project with a details page opens it;
  one without links straight to GitHub or its live demo.
  detailKind decides the wording: "project" -> "View details",
  "case_study" -> "Read case study".
*/
export const PROJECTS = PROJECTS_DATA.map((p) => {
  const live = p.links?.live_demo || null;
  const github = p.links?.github || null;
  const cs = CASE_STUDIES[p.id];
  return {
    id: p.id,
    title: p.title,
    caption: p.status === "in_progress" ? `${p.tagline} · In progress` : p.tagline,
    category: p.category,
    hasCaseStudy: Boolean(cs),
    detailKind: cs?.kind === "case_study" ? "case_study" : "project",
    href: live || github,
    cta: live ? "Live demo" : "View on GitHub",
    images: [p.image, ...(p.gallery || [])]
      .filter(Boolean)
      .map((file) => assetUrl(`projects/${file}`)),
  };
});

export const CASE_STUDY_IDS = PROJECTS.filter((p) => p.hasCaseStudy).map((p) => p.id);

const STATUS = { completed: "Completed", in_progress: "In progress" };
const DEFAULT_LABEL = { project: "Project details", case_study: "Professional case study" };

// Everything the details page needs for one project (or null).
export function getProjectDetail(id) {
  const p = PROJECTS_DATA.find((x) => x.id === id);
  const cs = CASE_STUDIES[id];
  if (!p || !cs) return null;

  const kind = cs.kind === "case_study" ? "case_study" : "project";

  const images = cs.images?.length
    ? cs.images.map((img) => ({
        src: assetUrl(`case-studies/${img.file}`),
        alt: img.alt || p.title,
        caption: img.caption || "",
      }))
    : p.image
    ? [{ src: assetUrl(`projects/${p.image}`), alt: `${p.title} screenshot`, caption: "" }]
    : [];

  return {
    id: p.id,
    kind,
    title: p.title,
    tagline: p.tagline,
    category: p.category,
    statusLabel: STATUS[p.status] || "",
    label: cs.label || DEFAULT_LABEL[kind],
    summary: cs.summary || p.portfolio_description,
    stack: cs.stack?.length ? cs.stack : p.technologies,
    facts: cs.facts || [],
    links: { github: p.links?.github || null, live: p.links?.live_demo || null },
    images,
    note: cs.note || null,
    sections: (cs.sections || []).map((s) =>
      s.type === "image" ? { ...s, src: assetUrl(`case-studies/${s.file}`) } : s
    ),
  };
}