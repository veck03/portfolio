import SectionHeading from "./SectionHeading";

function formatDate(value) {
  if (!value) return "";
  const [year, month] = value.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function Education({ education }) {
  return (
    <section className="section education-section" id="education">
      <div className="container">
        <SectionHeading number="05" eyebrow="Education" title="Academic" accent="background." description="My academic foundation in mathematics, computing and science." />
        <div className="education-list">
          {education.map((item) => <article className="education-item" key={`${item.institution}-${item.degree}`}>
            <div className="education-main"><h3>{item.institution}</h3><p>{item.degree}</p><span>{item.location}</span></div>
            <div className="education-meta">
              <span>{formatDate(item.start_date)} – {formatDate(item.expected_end_date || item.end_date)}</span>
              {item.cgpa != null && <strong>CGPA {item.cgpa}</strong>}
              {item.percentage != null && <strong>{item.percentage}%</strong>}
            </div>
          </article>)}
        </div>
      </div>
    </section>
  );
}
export default Education;
