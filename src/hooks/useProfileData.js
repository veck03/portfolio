import { useEffect, useState } from "react";

const DATA_BASE_URL = import.meta.env.VITE_PROFILE_DATA_BASE_URL;

async function fetchJson(filename, signal) {
  if (!DATA_BASE_URL) {
    throw new Error("Missing VITE_PROFILE_DATA_BASE_URL. Add it to your portfolio .env file.");
  }
  const response = await fetch(`${DATA_BASE_URL}/${filename}`, { cache: "no-cache", signal });
  if (!response.ok) throw new Error(`Could not load ${filename} (${response.status}).`);
  return response.json();
}

export function useProfileData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const [profile, education, skills, projects] = await Promise.all([
          fetchJson("profile.json", controller.signal),
          fetchJson("education.json", controller.signal),
          fetchJson("skills.json", controller.signal),
          fetchJson("projects.json", controller.signal),
        ]);
        if (!profile.name || !Array.isArray(education.education) || !Array.isArray(projects.projects)) {
          throw new Error("The profile data has an unexpected structure.");
        }
        setData({ profile, education, skills, projects: projects.projects });
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Unable to load portfolio data.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadData();
    return () => controller.abort();
  }, []);

  return { data, loading, error };
}
