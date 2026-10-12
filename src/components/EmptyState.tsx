import React from 'react';
import { LucideIcon, WifiOff, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  badge?: string;
  description: string;
  secondaryInfo?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  badge = 'Data Feed Not Connected',
  description,
  secondaryInfo,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  children,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 shadow-[var(--shadow)]">
      {/* Decorative ambient radial glows */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[var(--accent)]/5 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[var(--accent)]/5 blur-3xl"></div>

      <div className="relative flex flex-col items-center text-center max-w-lg mx-auto">
        {/* Icon with layered electric glows */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-2xl bg-[var(--accent)]/10 blur-lg"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shadow-inner">
            <Icon className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center text-amber-400">
            <WifiOff className="w-3 h-3" />
          </div>
        </div>

        {/* Clean unboxed status indicator */}
        <div className="flex items-center gap-2 text-xs text-amber-400/90 mb-2 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span>{badge}</span>
          <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
          <span className="text-[var(--text-muted)]">Phase 1 Standby</span>
        </div>

        {/* Title */}
        <h2 className="text-lg md:text-xl font-bold tracking-tight text-[var(--text)] mb-2.5">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-[var(--text)] leading-relaxed mb-4">
          {description}
        </p>

        {secondaryInfo && (
          <div className="w-full mb-5 p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-left text-xs text-[var(--text-muted)] space-y-1">
            <div className="text-[var(--accent)]/90 font-medium flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <AlertTriangle className="w-3 h-3 text-[var(--accent)]" />
              Pipeline Specification
            </div>
            <p className="text-[var(--text)] leading-relaxed">{secondaryInfo}</p>
          </div>
        )}

        {/* Optional custom content inside empty state */}
        {children && <div className="w-full my-3">{children}</div>}

        {/* Action Buttons */}
        {(actionText || secondaryActionText) && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2 w-full">
            {actionText && onAction && (
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs tracking-wide shadow-md shadow-black/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{actionText}</span>
              </button>
            )}
            {secondaryActionText && onSecondaryAction && (
              <button
                type="button"
                onClick={onSecondaryAction}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text)] font-medium text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <span>{secondaryActionText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
