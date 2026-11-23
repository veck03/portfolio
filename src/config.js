import { PROFILE, assetUrl } from "./data/profileData";

export const PORTRAIT = {
  src: assetUrl(PROFILE.avatar.file),
  alt: PROFILE.avatar.alt,
};

// Change this if your projects section uses a different id.
export const PROJECTS_ANCHOR = "#projects";