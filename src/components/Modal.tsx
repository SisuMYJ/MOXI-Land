import type { ReactNode } from 'react';

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="scrim" onClick={onClose}>
      <section className="modal" onClick={(event: MouseEvent) => event.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}
