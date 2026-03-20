// src/hooks/index.ts
/**
 * Re-export all hooks from a single entry point.
 */

export { useDebounce } from "./use-debounce";
export { useLocalStorage } from "./use-local-storage";
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersDarkMode,
  usePrefersReducedMotion,
} from "./use-media-query";
export { useClickOutside } from "./use-click-outside";