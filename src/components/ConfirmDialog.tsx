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
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="confirm-dialog">
        <button type="button" className="dialog-close" onClick={onClose} aria-label="Close cancellation dialog"><X size={18} /></button>
        <span className="dialog-kicker">Cancellation request</span>
        <h2 id="confirm-title">Stop paying for {item.institution}?</h2>
        <p>This sends a cancellation request for <strong>{item.name}</strong>. The next renewal is {item.renewalDate ? formatDate(item.renewalDate) : 'not available'}.</p>
        <div className="dialog-notice"><strong>Demo behavior</strong><span>No institution is connected. The request will be staged locally with a traceable ID.</span></div>
        <div className="dialog-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Keep subscription</button>
          <button type="button" className="danger-button" onClick={onConfirm} disabled={pending}>{pending ? 'Requesting…' : 'Request cancellation'}</button>
        </div>
      </div>
    </div>
  );
}
