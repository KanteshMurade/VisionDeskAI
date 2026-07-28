import { useEffect, useRef, useState } from "react";
import { screenshotService } from "../services/ScreenshotService";
import styles from "./RegionCapture.module.css";

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function RegionCapture() {
  const [isDragging, setIsDragging] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        screenshotService.cancelRegionCapture();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setSelection({ x, y, width: 0, height: 0 });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !startPos || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = x - startPos.x;
    const height = y - startPos.y;

    setSelection({
      x: width > 0 ? startPos.x : x,
      y: height > 0 ? startPos.y : y,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  };

  const handleMouseUp = async () => {
    if (!isDragging || !selection) return;
    setIsDragging(false);

    // Minimum selection size to avoid accidental clicks
    if (selection.width < 10 || selection.height < 10) {
      screenshotService.cancelRegionCapture();
      return;
    }

    try {
      await screenshotService.captureRegion(selection.x, selection.y, selection.width, selection.height);
    } catch (error) {
      console.error("Failed to capture region:", error);
      screenshotService.cancelRegionCapture();
    }
  };

  const formatDimensions = () => {
    if (!selection) return "";
    return `${Math.round(selection.width)} × ${Math.round(selection.height)}`;
  };

  return (
    <div
      ref={containerRef}
      className={styles.overlay}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        if (isDragging) {
          screenshotService.cancelRegionCapture();
        }
      }}
    >
      <div className={styles.dimOverlay} />
      {selection && (
        <>
          <div
            className={styles.selectionBox}
            style={{
              left: selection.x,
              top: selection.y,
              width: selection.width,
              height: selection.height,
            }}
          />
          <div
            className={styles.dimensions}
            style={{
              left: selection.x + selection.width / 2,
              top: selection.y - 30,
            }}
          >
            {formatDimensions()}
          </div>
        </>
      )}
      <div className={styles.instructions}>
        Press ESC to cancel
      </div>
    </div>
  );
}
