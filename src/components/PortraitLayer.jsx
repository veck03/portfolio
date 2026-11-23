import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll } from "framer-motion";
import "../styles/Portrait.css";

// Flip around the vertical axis, driven by scroll.
// 180 = one half turn (lands facing you, un-mirrored). 360 = a full turn.
const FLIP_DEG = 180;

// Perspective strength, as a multiple of the portrait's width.
// 6 => near edge grows ~9% at mid-flip. Lower = stronger, higher = flatter.
const PERSPECTIVE_FACTOR = 6;

// While travelling, the portrait's bottom edge stays at least this many px
// above the bottom of the window.
const EDGE_MARGIN = 16;

const clamp = (v) => Math.min(1, Math.max(0, v));
// easeInOutCubic: the portrait starts and ends at page-scroll speed,
// so it joins each frame without a visible hand-off.
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const RADIUS = 16; // visible corner radius in px, constant through the journey

export function PortraitImage({ src }) {
  return <img className="portrait-img" src={src} alt="" draggable="false" />;
}

/*
  Journey: cover frame slot (start, bottom-center)  ->  hero slot (end).
  Positions are tracked by the CENTER of the portrait, because scale and
  rotation both happen around the center.
*/
export default function PortraitLayer({
  wrapperRef,
  coverSlotRef,
  heroSlotRef,
  stageRef,
  src,
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotateY = useMotionValue(0);
  const borderRadius = useMotionValue(RADIUS);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const geo = useRef(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const apply = () => {
      const g = geo.current;
      if (!g) return;
      const sy = scrollY.get();
      const e = ease(clamp(g.end > 0 ? sy / g.end : 0));

      const cx = g.scx + (g.ecx - g.scx) * e;
      let cy = g.scy + (g.ecy - g.scy) * e;
      const s = 1 + (g.scale - 1) * e;

      // Keep the enlarged portrait's bottom edge inside the window while it
      // travels. Not applied once the Hero has been reached.
      if (sy < g.end) {
        const limit = Math.max(window.innerHeight - EDGE_MARGIN, g.endBottom);
        const maxCy = sy + limit - (g.h0 * s) / 2; // page coordinates
        cy = Math.min(cy, maxCy);
      }

      x.set(cx - g.w0 / 2);
      y.set(cy - g.h0 / 2);
      scale.set(s);
      rotateY.set(FLIP_DEG * e);
      // the radius is scaled along with the element, so divide to keep it a constant 16px on screen
      borderRadius.set(RADIUS / s);
    };

    const measure = () => {
      const wrap = wrapperRef.current;
      const cover = coverSlotRef.current;
      const hero = heroSlotRef.current;
      const stage = stageRef.current;
      if (!wrap || !cover || !hero || !stage) return;

      const w = wrap.getBoundingClientRect();
      const c = cover.getBoundingClientRect();
      const h = hero.getBoundingClientRect();
      const s = stage.getBoundingClientRect();

      const end = s.bottom - w.top; // scroll distance until the Hero fills the screen
      const ecy = h.top - w.top + h.height / 2;

      geo.current = {
        w0: c.width,
        h0: c.height,
        scx: c.left - w.left + c.width / 2,
        scy: c.top - w.top + c.height / 2,
        ecx: h.left - w.left + h.width / 2,
        ecy,
        scale: h.width / c.width,
        end,
        // where the portrait's bottom edge sits in the window when the Hero is reached
        endBottom: ecy - end + h.height / 2,
      };
      setSize((prev) =>
        prev.w === c.width && prev.h === c.height
          ? prev
          : { w: c.width, h: c.height }
      );
      apply();
    };

    measure();
    const ro = new ResizeObserver(measure);
    [wrapperRef, coverSlotRef, heroSlotRef].forEach(
      (r) => r.current && ro.observe(r.current)
    );
    document.fonts?.ready.then(measure);
    const unsub = scrollY.on("change", apply);

    return () => {
      ro.disconnect();
      unsub();
    };
  }, [wrapperRef, coverSlotRef, heroSlotRef, stageRef, scrollY, x, y, scale, rotateY, borderRadius]);

  return (
    // Outer element: moves + scales, and owns the perspective.
    <motion.div
      className="portrait-layer"
      aria-hidden="true"
      style={{
        width: size.w,
        height: size.h,
        x,
        y,
        scale,
        perspective: `${size.w * PERSPECTIVE_FACTOR}px`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: size.w ? 1 : 0 }}
      transition={{ duration: 0.9, delay: 0.25 }}
    >
      {/* Inner element: only rotates, around the portrait's own center. */}
      <motion.div className="portrait-flip" style={{ rotateY }}>
        {/* front face */}
        <motion.div className="portrait-face" style={{ borderRadius }}>
          <PortraitImage src={src} />
        </motion.div>
        {/* back face: same photo, pre-turned so it reads upright after the flip */}
        <motion.div className="portrait-face" style={{ borderRadius, rotateY: 180 }}>
          <PortraitImage src={src} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}