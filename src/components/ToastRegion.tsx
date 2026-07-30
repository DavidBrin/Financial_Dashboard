import { CheckCircle2, RotateCcw, X } from 'lucide-react';
import type { CommandResult } from '@/data/commands';

type ToastRegionProps = {
  result: CommandResult | null;
  resourceName?: string;
  canUndo?: boolean;
  onUndo?: () => void | Promise<void>;
  onClose: () => void;
};

export function ToastRegion({ result, resourceName, canUndo, onUndo, onClose }: ToastRegionProps) {
  if (!result) return <div className="toast-live" aria-live="polite" />;
  return (
    <div className="toast-live" aria-live="polite">
      <div className="command-toast">
        <CheckCircle2 size={20} aria-hidden="true" />
        <div>
          <strong>{result.message}</strong>
          <span>{resourceName ? `${resourceName} · ` : ''}Request ID {result.requestId}</span>
        </div>
        {canUndo && <button type="button" onClick={onUndo} aria-label="Undo staged cancellation"><RotateCcw size={15} /> Undo</button>}
        <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss message"><X size={16} /></button>
      </div>
    </div>
  );
}
