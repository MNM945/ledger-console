import { Button } from './Controls';
import { useEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import type { Transaction } from '../data/transactions';
import { intlLocale, useI18n } from '../i18n';
import { MoneyText } from './MoneyText';
import { addMoney } from '../money';
import { StatusBadge } from './StatusBadge';

interface TransactionDrawerProps {
  transaction: Transaction;
  onClose: () => void;
  /** Focus returns to this element (the triggering row) when the drawer closes. */
  returnFocusRef: RefObject<HTMLElement | null>;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function TransactionDrawer({ transaction, onClose, returnFocusRef }: TransactionDrawerProps) {
  const { locale, t } = useI18n();
  const tag = intlLocale(locale);
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus trap + background inert. The drawer is portaled to <body>, so every
  // other top-level subtree (app root, etc.) can be inerted while it is open.
  // Restore the original inert state before returning focus on actual unmount.
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    const inerted: { element: HTMLElement; previous: boolean }[] = [];
    const trigger = returnFocusRef.current;
    for (const child of Array.from(document.body.children)) {
      if (child instanceof HTMLElement && !child.contains(drawer)) {
        inerted.push({ element: child, previous: child.inert });
        child.inert = true;
      }
    }

    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      // Wrap around at both ends; also pull focus back in if it somehow escaped.
      if (e.shiftKey) {
        if (active === first || !drawer.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !drawer.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      for (const { element, previous } of inerted) element.inert = previous;
      // StrictMode replays effect cleanup while the drawer is still mounted.
      // Restore only after an actual unmount and after background inert is lifted.
      queueMicrotask(() => {
        if (!drawer.isConnected && trigger?.isConnected) trigger.focus();
      });
    };
  }, [onClose, returnFocusRef]);

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(tag, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(iso)) + ' UTC';

  return createPortal(
    <>
      <div className="drawer-scrim" onClick={onClose} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" ref={drawerRef}>
        <header className="drawer__header">
          <h2 id="drawer-title">{t.drawerTitle}</h2>
          <Button type="button" className="btn btn--icon" onClick={onClose} ref={closeRef} aria-label={t.close}>
            ✕
          </Button>
        </header>

        <dl className="drawer__facts">
          <div>
            <dt>{t.colCounterparty}</dt>
            <dd>{transaction.counterparty}</dd>
          </div>
          <div>
            <dt>{t.reference}</dt>
            <dd className="mono">{transaction.reference}</dd>
          </div>
          <div>
            <dt>{t.colDate}</dt>
            <dd>{fmtDate(transaction.createdAt)}</dd>
          </div>
          <div>
            <dt>{t.colStatus}</dt>
            <dd>
              <StatusBadge status={transaction.status} />
            </dd>
          </div>
        </dl>

        <div className="drawer__money">
          <div className="money-line">
            <span>{t.amount}</span>
            <MoneyText amount={transaction.amount} currency={transaction.currency} />
          </div>
          <div className="money-line">
            <span>{t.fee}</span>
            <MoneyText amount={transaction.fee} currency={transaction.currency} />
          </div>
          <div className="money-line money-line--total">
            <span>{transaction.refund ? t.originalDebit : t.total}</span>
            <MoneyText amount={addMoney(transaction.currency, transaction.amount, transaction.fee)} currency={transaction.currency} />
          </div>
        </div>

        <p className="money-policy">{t.precisionPolicy}</p>
        {transaction.refund && <section className="refund-summary" aria-labelledby="refund-title">
          <h3 id="refund-title" className="drawer__section">{transaction.refund.kind === 'partial' ? t.partialRefund : t.fullRefund}</h3>
          <div className="money-line"><span>{t.refundAmount}</span><MoneyText amount={transaction.refund.amount} currency={transaction.currency} /></div>
          <div className="money-line"><span>{t.feeReturned}</span><MoneyText amount={transaction.refund.feeReturned} currency={transaction.currency} /></div>
          <div className="money-line money-line--total"><span>{t.refundCredit}</span><MoneyText amount={addMoney(transaction.currency, transaction.refund.amount, transaction.refund.feeReturned)} currency={transaction.currency} /></div>
          <div className="money-line money-line--total"><span>{t.netDebit}</span><MoneyText amount={addMoney(transaction.currency, transaction.amount, transaction.fee, -transaction.refund.amount, -transaction.refund.feeReturned)} currency={transaction.currency} /></div>
          <p className="money-policy">{t.refundPolicy}</p>
        </section>}
        <h3 className="drawer__section">{t.timeline}</h3>
        <ol className="timeline">
          {transaction.timeline.map((event) => (
            <li key={event.at} className={`timeline__item timeline__item--${event.status}`}>
              <span className="timeline__dot" aria-hidden="true" />
              <div>
                <div className="timeline__status">{t.status[event.status]}</div>
                <div className="timeline__note">{t.timelineNotes[event.note as keyof typeof t.timelineNotes] ?? event.note}</div>
                <time className="timeline__time" dateTime={event.at}>
                  {fmtDate(event.at)}
                </time>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </>,
    document.body,
  );
}
