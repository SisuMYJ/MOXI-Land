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
declare module 'date-fns' {
  export function format(date: Date, format: string): string;
}
declare module 'date-fns' {
  export function format(date: Date, format: string): string;
}
declare module 'zustand' {
  export type SetState<T> = (partial: Partial<T> | T | ((state: T) => Partial<T> | T)) => void;
  export type GetState<T> = () => T;
  export function create<T>(initializer: (set: SetState<T>, get: GetState<T>) => T): {
    (): T;
    <U>(selector: (state: T) => U): U;
  };
}
declare namespace Phaser {
  class Scene {
    constructor(key?: string);
    add: any;
    tweens: any;
    scale: any;
  }
  class Game {
    constructor(config: any);
    destroy(removeCanvas?: boolean): void;
  }
  namespace GameObjects {
    class Container {
      constructor(scene: Scene, x?: number, y?: number);
      x: number;
      y: number;
      add(children: any): this;
      setSize(width: number, height: number): this;
      setInteractive(config?: any): this;
      on(event: string, callback: (...args: any[]) => void): this;
    }
  }
  const CANVAS: any;
  namespace Scale {
    const RESIZE: any;
    const CENTER_BOTH: any;
  }
  namespace Math {
    function Between(min: number, max: number): number;
  }
}
declare module 'phaser' {
  export = Phaser;
}
