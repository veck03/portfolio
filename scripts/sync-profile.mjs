#!/usr/bin/env node
/*
  Copies profile data + images from the professional-profile repo into this site.
  Source order: local checkout -> GitHub raw download -> committed copy (offline only).
  Runs automatically before `npm run dev` and `npm run build`.

  Env vars (all optional):
    PROFILE_DIR       path to a checkout of the profile repo (default ../professional-profile)
    PROFILE_RAW_BASE  raw GitHub base URL used when there is no local checkout
*/
import {
  cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_OUT = join(ROOT, "src", "data", "profile");
const CASE_OUT = join(DATA_OUT, "case-studies");
const ASSETS_OUT = join(ROOT, "public", "profile");
const FILES = ["profile.json", "education.json", "skills.json", "projects.json"];
const SECTION_TYPES = ["text", "list", "steps", "metrics", "flow", "image"];

const IN_CI = Boolean(process.env.CI);
const LOCAL_DIR = resolve(ROOT, process.env.PROFILE_DIR || "../professional-profile");
const RAW_BASE = (
  process.env.PROFILE_RAW_BASE ||
  "https://raw.githubusercontent.com/veck03/professional-profile/main"
).replace(/\/$/, "");

const log = (m) => console.log(`[sync-profile] ${m}`);
const warn = (m) => console.warn(`[sync-profile] warn: ${m}`);
const isUrl = (v) => typeof v === "string" && /^https?:\/\//.test(v);
const dupes = (list) => list.filter((v, i) => list.indexOf(v) !== i);

/* ---------- case study helpers ---------- */

function caseStudyList(projectsFile) {
  return (projectsFile.projects || [])
    .filter((p) => p.case_study)
    .map((p) => ({ id: p.id, path: p.case_study }));
}

// image paths inside assets/, for one case study
function caseStudyAssets(cs) {
  const files = [];
  (cs.images || []).forEach((i) => i?.file && files.push(i.file));
  (cs.sections || []).forEach((s) => s?.type === "image" && s.file && files.push(s.file));
  return files.map((f) => `case-studies/${f}`);
}

/* ---------- sources ---------- */

function loadLocal() {
  const dataDir = join(LOCAL_DIR, "data");
  if (!existsSync(join(dataDir, "profile.json"))) return null;

  const data = {};
  for (const f of FILES) data[f] = JSON.parse(readFileSync(join(dataDir, f), "utf8"));

  const caseStudies = {};
  for (const { id, path } of caseStudyList(data["projects.json"])) {
    const file = join(dataDir, path);
    if (!existsSync(file)) throw new Error(`project "${id}" points to data/${path}, which does not exist`);
    caseStudies[id] = JSON.parse(readFileSync(file, "utf8"));
  }

  const assetsDir = join(LOCAL_DIR, "assets");
  const copyAssets = async () => {
    rmSync(ASSETS_OUT, { recursive: true, force: true });
    if (existsSync(assetsDir)) cpSync(assetsDir, ASSETS_OUT, { recursive: true });
    else warn("the profile repo has no assets/ folder");
  };
  return { label: `local checkout (${LOCAL_DIR})`, data, caseStudies, copyAssets };
}

async function get(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res;
}

async function loadRemote() {
  try {
    const data = {};
    for (const f of FILES) data[f] = await (await get(`${RAW_BASE}/data/${f}`)).json();

    const caseStudies = {};
    for (const { id, path } of caseStudyList(data["projects.json"])) {
      caseStudies[id] = await (await get(`${RAW_BASE}/data/${path}`)).json();
    }

    const copyAssets = async () => {
      rmSync(ASSETS_OUT, { recursive: true, force: true });
      const wanted = new Set();
      const profile = data["profile.json"];
      if (profile.avatar?.file) wanted.add(profile.avatar.file);
      if (profile.resume?.file) wanted.add(profile.resume.file);
      for (const p of data["projects.json"].projects || []) {
        [p.image, ...(p.gallery || [])].filter(Boolean).forEach((f) => wanted.add(`projects/${f}`));
      }
      Object.values(caseStudies).forEach((cs) => caseStudyAssets(cs).forEach((f) => wanted.add(f)));

      for (const rel of wanted) {
        try {
          const buf = Buffer.from(await (await get(`${RAW_BASE}/assets/${rel}`)).arrayBuffer());
          const dest = join(ASSETS_OUT, rel);
          mkdirSync(dirname(dest), { recursive: true });
          writeFileSync(dest, buf);
        } catch {
          warn(`could not download assets/${rel}`);
        }
      }
    };
    return { label: `GitHub raw (${RAW_BASE})`, data, caseStudies, copyAssets };
  } catch (e) {
    warn(`remote download failed: ${e.message}`);
    return null;
  }
}

function loadCommitted() {
  if (!FILES.every((f) => existsSync(join(DATA_OUT, f)))) return null;
  const data = {};
  for (const f of FILES) data[f] = JSON.parse(readFileSync(join(DATA_OUT, f), "utf8"));
  const caseStudies = {};
  if (existsSync(CASE_OUT)) {
    for (const f of readdirSync(CASE_OUT)) {
      if (f.endsWith(".json")) caseStudies[f.slice(0, -5)] = JSON.parse(readFileSync(join(CASE_OUT, f), "utf8"));
    }
  }
  return { label: "committed copy in src/data/profile", data, caseStudies };
}

/* ---------- validation ---------- */

function validateCaseStudy(id, cs) {
  const e = [];
  const w = `case study "${id}"`;
  if (!cs?.summary) e.push(`${w}: missing "summary"`);
  if (!Array.isArray(cs?.sections) || !cs.sections.length) {
    e.push(`${w}: "sections" must be a non-empty array`);
    return e;
  }
  cs.sections.forEach((s, i) => {
    if (!SECTION_TYPES.includes(s?.type)) e.push(`${w}, section ${i + 1}: unknown type "${s?.type}"`);
  });
  return e;
}

function validate(d, caseStudies) {
  const e = [];
  const p = d["profile.json"] || {};
  const ed = d["education.json"] || {};
  const sk = d["skills.json"] || {};
  const pr = d["projects.json"] || {};

  for (const k of ["name", "display_name", "headline", "headline_long", "email", "links", "avatar"]) {
    if (!p[k]) e.push(`profile.json: missing "${k}"`);
  }
  if (p.avatar && !p.avatar.file) e.push("profile.json: avatar.file is missing");
  for (const [k, v] of Object.entries(p.links || {})) {
    if (!isUrl(v)) e.push(`profile.json: links.${k} is not a URL`);
  }

  if (!Array.isArray(ed.education) || !ed.education.length) {
    e.push("education.json: 'education' must be a non-empty array");
  }
  if (!Array.isArray(sk.display_groups) || !sk.display_groups.length) {
    e.push("skills.json: 'display_groups' must be a non-empty array");
  }

  if (!Array.isArray(pr.projects) || !pr.projects.length) {
    e.push("projects.json: 'projects' must be a non-empty array");
  } else {
    dupes(pr.projects.map((x) => x.id)).forEach((id) => e.push(`projects.json: duplicate id "${id}"`));
    dupes(pr.projects.map((x) => x.portfolio_priority)).forEach((n) =>
      e.push(`projects.json: portfolio_priority ${n} is used more than once`)
    );
    for (const x of pr.projects) {
      for (const k of ["id", "title", "tagline", "status", "image"]) {
        if (!x[k]) e.push(`project "${x.id ?? "?"}": missing "${k}"`);
      }
      for (const k of ["github", "live_demo"]) {
        const v = x.links?.[k];
        if (v !== null && v !== undefined && !isUrl(v)) {
          e.push(`project "${x.id}": links.${k} must be a URL or null`);
        }
      }
      if (x.case_study) e.push(...validateCaseStudy(x.id, caseStudies[x.id]));
    }
  }
  return e;
}

/* ---------- main ---------- */

async function main() {
  let source = loadLocal() ?? (await loadRemote());
  let fallback = false;

  if (!source) {
    source = loadCommitted();
    fallback = true;
    if (!source) throw new Error("No profile data found (no local checkout, download failed, no committed copy).");
    if (IN_CI) throw new Error("Could not get fresh profile data in CI; refusing to build from the committed copy.");
    warn("using the committed copy; it may be out of date");
  }

  const errors = validate(source.data, source.caseStudies);
  if (errors.length) throw new Error(`Invalid profile data:\n - ${errors.join("\n - ")}`);

  if (!fallback) {
    mkdirSync(DATA_OUT, { recursive: true });
    for (const f of FILES) {
      writeFileSync(join(DATA_OUT, f), JSON.stringify(source.data[f], null, 2) + "\n");
    }
    rmSync(CASE_OUT, { recursive: true, force: true });
    mkdirSync(CASE_OUT, { recursive: true });
    for (const [id, cs] of Object.entries(source.caseStudies)) {
      writeFileSync(join(CASE_OUT, `${id}.json`), JSON.stringify(cs, null, 2) + "\n");
    }
    await source.copyAssets();
  }
  log(`ok: loaded from ${source.label} (${Object.keys(source.caseStudies).length} case study file(s))`);
}

main().catch((e) => {
  console.error(`[sync-profile] ${e.message}`);
  process.exit(1);
});