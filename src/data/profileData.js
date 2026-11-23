import profile from "./profile/profile.json";
import education from "./profile/education.json";
import skills from "./profile/skills.json";
import projectsFile from "./profile/projects.json";

// "/" locally, "/portfolio/" on GitHub Pages (follows vite.config base).
const BASE = import.meta.env.BASE_URL;

// Images copied from the profile repo's assets/ folder by sync-profile.mjs.
export const assetUrl = (path) => `${BASE}profile/${path}`;

export const PROFILE = profile;
export const EDUCATION = education.education;
export const CURRENT_EDUCATION =
  EDUCATION.find((e) => e.status === "in_progress") ?? EDUCATION[0];
export const SKILLS = skills;

export const PROJECTS_DATA = [...projectsFile.projects].sort(
  (a, b) => a.portfolio_priority - b.portfolio_priority
);