import { PROFILE, assetUrl } from "./data/profileData";

export const PORTRAIT = {
  src: assetUrl(PROFILE.avatar.file),
  alt: PROFILE.avatar.alt,
};

// Change this if your projects section uses a different id.
export const PROJECTS_ANCHOR = "#projects";

// Resume PDF from the profile repo. null hides every resume link on the site.
export const RESUME_URL = PROFILE.resume?.file ? assetUrl(PROFILE.resume.file) : null;
export const RESUME_FILENAME = RESUME_URL ? RESUME_URL.split("/").pop() : null;