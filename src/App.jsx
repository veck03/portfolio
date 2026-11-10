import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import About from "./components/About";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import { useProfileData } from "./hooks/useProfileData";

function App() {
  const { data, loading, error } = useProfileData();

  if (loading) return <main className="data-state container" aria-live="polite"><p>Loading portfolio…</p></main>;

  if (error || !data) {
    return (
      <main className="data-state container" role="alert">
        <h1>Portfolio data couldn't be loaded.</h1>
        <p>{error}</p>
        <p>Check VITE_PROFILE_DATA_BASE_URL and confirm the professional-profile repository is public and its JSON files are on the main branch.</p>
      </main>
    );
  }

  const { profile, education, skills, projects } = data;
  return (
    <>
      <Navbar profile={profile} />
      <main>
        <Hero profile={profile} />
        <Projects projects={projects} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Education education={education.education} />
        <Contact profile={profile} />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <span>{profile.name}</span>
          <span>{profile.headline || "AI / ML"}</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </>
  );
}

export default App;
