import { useEffect, useState } from "react";
import "./Cursor.css";

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const hoveredElement = e.target.closest("a, button, input, textarea");
      setIsHovering(!!hoveredElement);
    };

    window.addEventListener("mousemove", updateCursor);
    return () => window.removeEventListener("mousemove", updateCursor);
  }, []);

  return (
    <>
      {/* 🌿 Cursor personalizado */}
      <div
        className={`custom-cursor ${isHovering ? "hovering" : ""}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      ></div>

      {/* ✨ Resplandor del cursor */}
      <div
        className="cursor-glow"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      ></div>
    </>
  );
}

export default CustomCursor;
