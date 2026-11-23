// Edit freely. `featured: true` renders a chip filled off-white.
export const TECH_STACK = {
  title: "Tech Stack",
  tagline: "The tools behind my work.",
  groups: [
    {
      title: "AI & Machine Learning",
      blurb: "Deep Learning, NLP & Retrieval-Augmented Generation",
      items: [
        { name: "Machine Learning", featured: true },
        { name: "Deep Learning" },
        { name: "NLP" },
        { name: "RAG" },
        { name: "PyTorch", featured: true },
        { name: "Keras" },
        { name: "spaCy" },
      ],
    },
    {
      title: "Languages & Frameworks",
      blurb: "Backend APIs and Frontend Interfaces",
      items: [
        { name: "Python", featured: true },
        { name: "JavaScript" },
        { name: "HTML & CSS" },
        { name: "React", featured: true },
        { name: "FastAPI" },
      ],
    },
    {
      title: "Tools, Databases & Data",
      blurb: "Data Storage, Manipulation & Analysis",
      items: [
        { name: "MySQL", featured: true },
        { name: "MongoDB" },
        { name: "pandas", featured: true },
        { name: "Vite" },
      ],
    },
  ],
};