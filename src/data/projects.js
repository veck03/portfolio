import { PROFILE, PROJECTS_DATA, assetUrl } from "./profileData";

export const PROJECTS_SECTION = {
  blurb:
    "Selected AI/ML projects. Hover over a folder to peek inside, then open it to explore.",
  githubUrl: PROFILE.links.github,
};

/*
  Folder images: the project's `image` goes on the back card, then any
  `gallery` images fill the middle and left cards. Missing ones show a placeholder.
  A project with no live demo or GitHub link gets a plain folder (no arrow button).
*/
export const PROJECTS = PROJECTS_DATA.map((p) => {
  const live = p.links?.live_demo || null;
  const github = p.links?.github || null;
  return {
    id: p.id,
    title: p.title,
    caption: p.status === "in_progress" ? `${p.tagline} · In progress` : p.tagline,
    category: p.category,
    href: live || github,
    cta: live ? "Live demo" : "View on GitHub",
    images: [p.image, ...(p.gallery || [])]
      .filter(Boolean)
      .map((file) => assetUrl(`projects/${file}`)),
  };
});