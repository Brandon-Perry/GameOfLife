import { MutableRefObject, useEffect, useState } from "react";

type Size = { height: number; width: number };

/**
 * Returns the size that the board should be based on its wrapper div
 */
export default function useBoardSize(
  ref: MutableRefObject<HTMLElement | null>,
): Size {
  const [size, setSize] = useState<Size>({ height: 0, width: 0 });

  useEffect(() => {
    if (ref.current === null) return;
    const observer = new ResizeObserver((element) => {
      // TODO Review for better approach. Element[0] seems off.
      setSize(() => ({
        height: element[0].target.clientHeight,
        width: element[0].target.clientWidth,
      }));
    });
    observer.observe(ref.current);
    return () => (ref.current ? observer.unobserve(ref.current) : undefined);
  }, [ref.current]);

  return size;
}
