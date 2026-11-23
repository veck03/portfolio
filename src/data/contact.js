import { PROFILE } from "./profileData";

export const CONTACT = {
  heading: "Let’s talk.",
  blurb:
    "Whether it’s an internship, a full-time role or a project idea, my inbox is open.",
  email: PROFILE.email,
  socials: [
    { label: "LinkedIn", href: PROFILE.links.linkedin, icon: "linkedin" },
    { label: "GitHub", href: PROFILE.links.github, icon: "github" },
  ],
};

export const FOOTER = {
  brand: `${PROFILE.display_name}.`,
  tagline: PROFILE.headline_long,
  closing: "See you around.",
  links: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Tech Stack", href: "#stack" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],
};