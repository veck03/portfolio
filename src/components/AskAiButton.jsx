import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import "../styles/AskAi.css";

export default function AskAiButton({ open, onOpen }) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const btnRef = useRef(null);
  const wasOpen = useRef(false);

  // appears once the opening big-type frame has been scrolled past
  useEffect(() => {
    const update = () => setVisible(scrollY.get() > window.innerHeight * 0.7);
    update();
    return scrollY.on("change", update);
  }, [scrollY]);

  // hand focus back to the button when the panel closes
  useEffect(() => {
    if (wasOpen.current && !open) btnRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <AnimatePresence>
      {visible && !open && (
        <motion.button
          ref={btnRef}
          type="button"
          className="ask-ai"
          onClick={onOpen}
          aria-haspopup="dialog"
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