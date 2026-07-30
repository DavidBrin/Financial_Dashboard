import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import type { FinanceItem } from '@/domain/finance';
import { formatDate } from '@/lib/format';

type ConfirmDialogProps = {
  item: FinanceItem;
  pending: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({ item, pending, onConfirm, onClose }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const safeActionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    safeActionRef.current?.focus();
    return () => previousFocus?.focus();
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled)') ?? [])];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description" className="confirm-dialog" onKeyDown={handleKeyDown}>
        <button type="button" className="dialog-close" onClick={onClose} aria-label="Close cancellation dialog"><X size={18} /></button>
        <span className="dialog-kicker">Cancellation request</span>
        <h2 id="confirm-title">Stop paying for {item.institution}?</h2>
        <p id="confirm-description">This sends a cancellation request for <strong>{item.name}</strong>. The next renewal is {item.renewalDate ? formatDate(item.renewalDate) : 'not available'}.</p>
        <div className="dialog-notice"><strong>Demo behavior</strong><span>No institution is connected. The request will be staged locally with a traceable ID.</span></div>
        <div className="dialog-actions">
          <button ref={safeActionRef} type="button" className="secondary-button" onClick={onClose}>Keep subscription</button>
          <button type="button" className="danger-button" onClick={onConfirm} disabled={pending}>{pending ? 'Requesting…' : 'Request cancellation'}</button>
        </div>
      </div>
    </div>
  );
}
