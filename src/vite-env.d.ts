declare module '*.css';
declare module 'react' {
  export type ReactNode = any;
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps?: unknown[]): T;
  export function useRef<T>(initialValue?: T | null): { current: T | null | undefined };
  const React: { StrictMode: (props: { children?: any }) => any };
  export default React;
}
declare module 'react-dom/client' {
  export function createRoot(container: Element): { render(children: any): void };
}
declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
declare namespace JSX {
  interface IntrinsicElements { [elemName: string]: any; }
}
