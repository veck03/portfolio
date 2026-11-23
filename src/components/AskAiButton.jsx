import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import "../styles/AskAi.css";

// Pass onClick when the chat feature exists. It's a placeholder for now.
export default function AskAiButton({ onClick }) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(scrollY.get() > window.innerHeight * 0.7);
    update();
    return scrollY.on("change", update);
  }, [scrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="ask-ai"
          onClick={onClick}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3.5a8.5 8.5 0 1 1-4.1 15.9L3.5 20.5l1.2-4.1A8.5 8.5 0 0 1 12 3.5z" />
          </svg>
          Ask AI
        </motion.button>
      )}
    </AnimatePresence>
  );
}