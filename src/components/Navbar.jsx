function Navbar({ profile }) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#top" className="brand" aria-label={`${profile.name} home`}>
          <span className="brand-mark">VT</span><span>{profile.name}</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Projects</a><a href="#about">About</a><a href="#skills">Skills</a><a href="#education">Education</a>
        </nav>
        <a href="#contact" className="nav-cta">Contact ↗</a>
      </div>
    </header>
  );
}

export default Navbar;