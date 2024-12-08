export const handleMouseDown = (e, id, startWidth, onAdjustWidth) => {
    const startX = e.clientX;
    const handleMouseMove = (event) => {
      const deltaX = event.clientX - startX;
      onAdjustWidth(id, startWidth + deltaX);
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    e.preventDefault();
  };
  