import { motion, useReducedMotion } from "framer-motion";
import { TECH_STACK } from "../data/techStack";
import "../styles/TechStack.css";

const EASE = [0.22, 1, 0.36, 1];

export default function TechStack() {
  const reduce = useReducedMotion();

  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 36 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section id="stack" className="stack" aria-labelledby="stack-title">
      <div className="stack__inner">
        <header className="stack__head">
          <motion.h2 id="stack-title" className="stack__title" {...fade(0)}>
            {TECH_STACK.title}
          </motion.h2>
          <motion.p className="stack__tagline" {...fade(0.08)}>
            {TECH_STACK.tagline}
          </motion.p>
        </header>

        <div className="stack__grid">
          {TECH_STACK.groups.map((group, i) => (
            <motion.article key={group.title} className="stack__col" {...fade(0.1 + i * 0.1)}>
              <h3 className="stack__col-title">{group.title}</h3>
              <p className="stack__col-blurb">{group.blurb}</p>
              <ul className="stack__chips">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className={`chip${item.featured ? " chip--featured" : ""}`}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}