// src/hooks/use-click-outside.ts
import { useEffect, useRef, type RefObject } from "react";

/**
 * Detects clicks outside of a referenced element.
 *
 * @param handler - Callback when click outside is detected
 * @returns Ref to attach to the element
 *
 * @example
 * const ref = useClickOutside<HTMLDivElement>(() => {
 *   setIsOpen(false);
 * });
 * return <div ref={ref}>Dropdown content</div>;
 */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Do nothing if clicking ref's element or its descendants
      if (!ref.current || ref.current.contains(target)) {
        return;
      }

      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler]);

  return ref;
}