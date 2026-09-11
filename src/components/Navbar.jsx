function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#top" className="brand">
          <span className="brand-mark">VT</span>
          <span>Vansh Tomar</span>
        </a>

        <nav>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#capabilities">
            Capabilities
          </a>
          <a
            href={`${import.meta.env.BASE_URL}resume.pdf`}
            target="_blank"
            rel="noreferrer"
          >
            Resume ↗
          </a>
        </nav>

        <a href="#contact" className="nav-cta">
          Get in touch ↗
        </a>
      </div>
    </header>
  );
}

export default Navbar;