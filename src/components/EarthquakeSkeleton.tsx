import React from 'react';

interface EarthquakeSkeletonProps {
  count?: number;
  type?: 'list' | 'map' | 'card';
}

export const EarthquakeSkeleton: React.FC<EarthquakeSkeletonProps> = ({
  count = 5,
  type = 'list',
}) => {
  if (type === 'map') {
    return (
      <div className="w-full h-[500px] rounded-2xl bg-slate-900/80 border border-slate-800 animate-pulse flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800"></div>
        <div className="h-4 w-48 bg-slate-800 rounded"></div>
        <div className="h-3 w-64 bg-slate-800/60 rounded"></div>
        <div className="flex gap-2">
          <div className="h-7 w-20 bg-slate-800 rounded-lg"></div>
          <div className="h-7 w-20 bg-slate-800 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 animate-pulse flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Magnitude badge skeleton */}
            <div className="w-11 h-11 rounded-xl bg-slate-800 shrink-0"></div>

            {/* Title & metadata skeleton */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="h-3.5 bg-slate-800 rounded w-3/4"></div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 bg-slate-800/60 rounded w-16"></div>
                <div className="h-2.5 bg-slate-800/60 rounded w-20"></div>
              </div>
            </div>
          </div>

          {/* Time skeleton */}
          <div className="h-3 bg-slate-800/70 rounded w-14 shrink-0"></div>
        </div>
      ))}
    </div>
  );
};
