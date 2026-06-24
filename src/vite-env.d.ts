declare module 'react' {
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useRef<T>(initialValue?: T): { current: T | undefined };
  export function useState<S>(initialState?: S | (() => S)): [S, (nextState: S) => void];
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export const StrictMode: unknown;
  export type ReactNode = unknown;
  export type MouseEvent<T = Element> = { stopPropagation: () => void; currentTarget: T };
}

declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): { render: (node: unknown) => void };
}

declare module 'react/jsx-runtime' {
  export const jsx: unknown;
  export const jsxs: unknown;
  export const Fragment: unknown;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
