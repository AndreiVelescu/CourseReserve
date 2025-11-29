import { RefObject, useCallback, useEffect, useState } from "react";

export function useGetElementDimensions<T extends HTMLElement>(
  ref: RefObject<T>,
) {
  const [calculatedElementWidth, setCalculatedElementWidth] = useState(0);
  const [calculatedElementHeight, setCalculatedElementHeight] = useState(0);

  const onResize = useCallback(() => {
    if (ref.current) {
      setCalculatedElementWidth(ref.current.offsetWidth);
      setCalculatedElementHeight(ref.current.offsetHeight);
    }
  }, [ref]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(onResize);

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [onResize, ref]);

  return { calculatedElementWidth, calculatedElementHeight };
}
