import { type ReactNode, useEffect, useRef } from 'react';

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const titleId = 'moxi-modal-title';
  const closeButton = useRef<HTMLButtonElement>();

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    closeButton.current?.focus();
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="scrim"
      onMouseDown={(event: { target: EventTarget; currentTarget: EventTarget }) => event.target === event.currentTarget && onClose()}
    >
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button ref={closeButton} type="button" className="close" aria-label="关闭弹窗" onClick={onClose}>
          ×
        </button>
        <h2 id={titleId}>{title}</h2>
        {children}
      </section>
    </div>
  );
}
