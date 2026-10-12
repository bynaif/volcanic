import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { BarChart3, TrendingUp, Info } from 'lucide-react';
import { EarthquakeFeature } from '../types';
import { formatDepthKm } from '../utils/units';

interface EarthquakeMagnitudeChartProps {
  quakes: EarthquakeFeature[];
}

interface ChartDataPoint {
  index: number;
  id: string;
  place: string;
  fullPlace: string;
  mag: number;
  timeFormatted: string;
  depth: number;
  color: string;
}

// Map magnitude to color matching VOLCANIC color code
function getMagnitudeBarColor(mag: number): string {
  if (mag >= 7.0) return '#ef4444'; // Red-500 M7+ Major
  if (mag >= 6.0) return '#f97316'; // Orange-500 M6+ Strong
  if (mag >= 4.5) return '#f59e0b'; // Amber-500 M4.5+ Moderate
  if (mag >= 2.5) return '#38bdf8'; // Sky-400 M2.5+ Light
  return '#22c55e'; // Emerald-500 <2.5 Minor
}

interface TooltipPayloadItem {
  payload: ChartDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl bg-[#090d20]/95 border border-cyan-500/30 p-3 shadow-2xl backdrop-blur-md text-xs font-sans max-w-xs pointer-events-none">
        <div className="flex items-center justify-between gap-3 mb-1.5 pb-1.5 border-b border-slate-800">
          <span className="font-mono font-semibold text-slate-300">
            Event #{data.index}
          </span>
          <span
            className="font-mono font-bold px-2 py-0.5 rounded text-xs"
            style={{
              backgroundColor: `${data.color}22`,
              color: data.color,
              border: `1px solid ${data.color}55`,
            }}
          >
            M{data.mag.toFixed(1)}
          </span>
        </div>
        <p className="text-white font-medium mb-1 line-clamp-2">
          {data.fullPlace}
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mt-2 font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">TIME</span>
            <span className="text-slate-300">{data.timeFormatted}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">DEPTH</span>
            <span className="text-slate-300">{formatDepthKm(data.depth)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const EarthquakeMagnitudeChart: React.FC<EarthquakeMagnitudeChartProps> = ({ quakes }) => {
  if (!quakes || quakes.length === 0) {
    return null;
  }

  // Take the 10 most recent earthquakes
  const recentTen = quakes.slice(0, 10);

  // Transform data for recharts
  const chartData: ChartDataPoint[] = recentTen.map((q, idx) => {
    const mag = q.properties.mag !== null ? Math.max(0, q.properties.mag) : 0;
    const rawPlace = q.properties.place || 'Unknown';
    // Shorten place name for label
    const shortPlace = rawPlace.length > 18 ? `${rawPlace.slice(0, 16)}…` : rawPlace;
    const time = new Date(q.properties.time);
    const timeFormatted = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const depth = q.geometry.coordinates[2] ?? 0;

    return {
      index: idx + 1,
      id: q.id,
      place: `#${idx + 1} ${shortPlace}`,
      fullPlace: rawPlace,
      mag: Number(mag.toFixed(2)),
      timeFormatted,
      depth,
      color: getMagnitudeBarColor(mag),
    };
  });

  // Calculate statistics
  const magnitudes = chartData.map((d) => d.mag);
  const avgMag = magnitudes.length > 0 ? (magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length) : 0;
  const maxMag = magnitudes.length > 0 ? Math.max(...magnitudes) : 0;
  const minMag = magnitudes.length > 0 ? Math.min(...magnitudes) : 0;

  return (
    <div
      aria-label="Earthquake magnitude distribution chart"
      className="rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-2xl backdrop-blur-xl p-4 sm:p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span>Recent Activity Trend</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                10 Most Recent
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Distribution of tremor intensities from newest (left) to 10th newest (right)
            </p>
          </div>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div className="px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <span className="text-slate-500">MAX:</span>
            <span className="font-bold text-amber-400">M{maxMag.toFixed(1)}</span>
          </div>
          <div className="px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <span className="text-slate-500">AVG:</span>
            <span className="font-bold text-cyan-300">M{avgMag.toFixed(1)}</span>
          </div>
          <div className="px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <span className="text-slate-500">MIN:</span>
            <span className="font-bold text-emerald-400">M{minMag.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-56 sm:h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="index"
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
              tickFormatter={(value) => `#${value}`}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
              domain={[0, 'auto']}
              unit="M"
              tickCount={5}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(56, 189, 248, 0.06)' }}
            />
            <ReferenceLine
              y={avgMag}
              stroke="#06b6d4"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Avg M${avgMag.toFixed(1)}`,
                position: 'insideTopRight',
                fill: '#22d3ee',
                fontSize: 10,
                fontFamily: 'monospace',
              }}
            />
            <Bar
              dataKey="mag"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.id}`}
                  fill={entry.color}
                  stroke={entry.color}
                  strokeOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend & Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-500 font-mono text-[10px]">SEVERITY:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500"></span>
            <span>M7+ Major</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-500"></span>
            <span>M6+ Strong</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
            <span>M4.5+ Mod</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400"></span>
            <span>M2.5+ Light</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
            <span>&lt;2.5 Minor</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
          <TrendingUp className="w-3 h-3 text-cyan-400" />
          <span>Real-time USGS Feed</span>
        </div>
      </div>
    </div>
  );
};
