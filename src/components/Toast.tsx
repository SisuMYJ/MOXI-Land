import { useGameStore } from '../store/useGameStore';
export function Toast(){const toast=useGameStore(s=>s.toast); return toast?<div className="toast">{toast}</div>:null}
