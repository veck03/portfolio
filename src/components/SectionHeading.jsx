function SectionHeading({
  number,
  eyebrow,
  title,
  accent,
  description,
  className = ""
}) {
  return (
    <div className={`section-heading ${className}`}>
      <div>
        <span className="eyebrow">
          {number} — {eyebrow}
        </span>

        <h2>
          {title}
          {accent && (
            <>
              <br />
              <em>{accent}</em>
            </>
          )}
        </h2>
      </div>

      {description && (
        <p className="section-heading-description">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;