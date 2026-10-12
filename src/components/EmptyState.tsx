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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0c1022]/90 border border-slate-800/80 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
      {/* Decorative ambient radial glows */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl"></div>

      <div className="relative flex flex-col items-center text-center max-w-lg mx-auto">
        {/* Icon with layered electric glows */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 blur-lg"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
            <Icon className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0a0e1e] border border-amber-500/50 flex items-center justify-center text-amber-400">
            <WifiOff className="w-3 h-3" />
          </div>
        </div>

        {/* Clean unboxed status indicator */}
        <div className="flex items-center gap-2 text-xs text-amber-400/90 mb-2 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span>{badge}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">Phase 1 Standby</span>
        </div>

        {/* Title */}
        <h2 className="text-lg md:text-xl font-bold tracking-tight text-white mb-2.5">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {description}
        </p>

        {secondaryInfo && (
          <div className="w-full mb-5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-left text-xs text-slate-400 space-y-1">
            <div className="text-cyan-400/90 font-medium flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <AlertTriangle className="w-3 h-3 text-cyan-400" />
              Pipeline Specification
            </div>
            <p className="text-slate-300 leading-relaxed">{secondaryInfo}</p>
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
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs tracking-wide shadow-lg shadow-cyan-950/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{actionText}</span>
              </button>
            )}
            {secondaryActionText && onSecondaryAction && (
              <button
                type="button"
                onClick={onSecondaryAction}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 text-slate-200 font-medium text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>{secondaryActionText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
