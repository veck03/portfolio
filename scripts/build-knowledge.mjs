#!/usr/bin/env node
/*
  Builds public/knowledge.json: a compact text version of the profile data
  that the chat Worker reads. Runs after sync-profile.mjs.
*/
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "src", "data", "profile");
const OUT = join(ROOT, "public", "knowledge.json");

const read = (f) => JSON.parse(readFileSync(join(DATA, f), "utf8"));

const profile = read("profile.json");
const education = read("education.json").education;
const skills = read("skills.json");
const projects = [...read("projects.json").projects].sort(
  (a, b) => a.portfolio_priority - b.portfolio_priority
);

const list = (arr) => (arr || []).join(", ");
const out = [];

out.push("ABOUT");
out.push(`Name: ${profile.name} (goes by ${profile.display_name})`);
out.push(`Headline: ${profile.headline_long || profile.headline}`);
if (profile.degree) out.push(`Degree: ${profile.degree}`);
if (profile.location) out.push(`Location: ${profile.location}`);
if (profile.summary) out.push(`Summary: ${profile.summary}`);
if (profile.interests?.length) out.push(`Interests: ${list(profile.interests)}`);
out.push(`Email: ${profile.email}`);
for (const [label, url] of Object.entries(profile.links || {})) out.push(`${label}: ${url}`);

out.push("", "EDUCATION");
for (const e of education) {
  const dates =
    e.status === "in_progress"
      ? `${e.start_date} to ${e.expected_end_date || "present"} (in progress, expected end date)`
      : `${e.start_date} to ${e.end_date}`;
  const score = e.cgpa ? ` CGPA ${e.cgpa}.` : e.percentage ? ` ${e.percentage}%.` : "";
  out.push(`- ${e.degree}, ${e.institution}, ${e.location}. ${dates}.${score}`);
}

out.push("", "SKILLS");
out.push(`Programming: ${list(skills.programming)}`);
out.push(`AI/ML: ${list(skills.ai_ml)}`);
out.push(`Libraries and frameworks: ${list(skills.libraries_frameworks)}`);
out.push(`Tools: ${list(skills.tools)}`);

out.push("", "PROJECTS (most important first)");
projects.forEach((p, i) => {
  out.push(`${i + 1}. ${p.title} (${p.category}, ${p.status === "in_progress" ? "in progress" : "completed"})`);
  out.push(`   Summary: ${p.short_description}`);
  out.push(`   Technologies: ${list(p.technologies)}`);
  out.push(`   Details: ${p.portfolio_description}`);
  (p.resume_bullets || []).forEach((b) => out.push(`   - ${b}`));
  if (p.links?.github) out.push(`   GitHub: ${p.links.github}`);
  if (p.links?.live_demo) out.push(`   Live demo: ${p.links.live_demo}`);
});

const text = out.join("\n");
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify({
    name: profile.name,
    display_name: profile.display_name,
    generated_at: new Date().toISOString(),
    text,
  })
);
console.log(`[build-knowledge] wrote public/knowledge.json (${text.length} characters)`);