import { ReactNode } from 'react';
export function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){return <div className="scrim" onClick={onClose}><section className="modal" onClick={(e: { stopPropagation: () => void })=>e.stopPropagation()}><button className="close" onClick={onClose}>×</button><h2>{title}</h2>{children}</section></div>}
