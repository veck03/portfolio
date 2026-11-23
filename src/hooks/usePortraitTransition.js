import { useEffect, useState } from "react";

const QUERY =
  "(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

export default function usePortraitTransition() {
  const [enabled, setEnabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return enabled;
}