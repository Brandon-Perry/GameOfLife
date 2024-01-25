import { Coord } from "@/types";
import { useRef, useState } from "react";

/**
 * Handles painting behavior
 * @param callBack function for painting coord
 */
export function usePaint(callBack: (coord: Coord) => void) {
  // paintRef stores coords that have already been painted this stroke. Stringifys them for easy comparison.
  const paintRef = useRef<Set<string>>(new Set());

  // whether or not a paint stroke is occuring
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  // used when user begins painting. Resets paintRef
  const startPaint = () => {
    paintRef.current = new Set();
    setMouseDown(true);
  };

  // runs each time the user paints a cell. Checks to make sure that the mousedown state is active.
  // if cell has already been painted, don't do anything to it.
  const onPaint = (coord: Coord) => {
    const stringCoord: string = JSON.stringify(coord);
    if (mouseDown && !paintRef.current.has(stringCoord)) {
      paintRef.current.add(stringCoord);
      callBack(coord);
    }
  };

  // used when user stops painting.
  const stopPaint = () => {
    setMouseDown(false);
    paintRef.current = new Set();
  };

  return {
    startPaint,
    onPaint,
    stopPaint,
  };
}
