'use client';

import { ResponsiveContainer, Tooltip, Treemap, type TreemapNode } from 'recharts';

import { formatNumber } from '@/lib/format';

import { ChartTooltip } from './chart-tooltip';
import { NEUTRAL_COLOR, scaleColor, type ScaleColor } from './color-scale';

export interface TreemapItem {
  /** Null for an item that can't be selected, such as an "Other" bucket. */
  id: string | null;
  label: string;
  value: number;
  /** Small line under the value, e.g. "2 doctors". */
  hint?: string;
}

interface TreemapChartProps {
  /** Largest first; a null-id item is drawn in a neutral tone. */
  items: TreemapItem[];
  unit: string;
  onSelect?: (id: string) => void;
}

const GAP = 3;

const text = (value: unknown) => (typeof value === 'string' ? value : '');

interface TileLabelProps {
  node: TreemapNode;
  width: number;
  height: number;
}

/** Full label on roomy tiles; one compact line on small ones; nothing on slivers (tooltip). */
function TileLabel({ node, width, height }: TileLabelProps) {
  if (width >= 96 && height >= 64) {
    return (
      <div className="flex size-full flex-col gap-0.5 overflow-hidden p-3">
        <p className="truncate text-[0.8rem] font-medium">{node.name}</p>
        <p className="text-xl leading-tight font-semibold tabular-nums">
          {formatNumber(node.value)}
        </p>
        {height > 84 && <p className="truncate text-[0.7rem] opacity-75">{text(node.hint)}</p>}
      </div>
    );
  }
  if (width >= 40 && height >= 26) {
    // Narrow tiles: number on top, name on one line with an ellipsis (the tooltip has it all).
    return (
      <div className="space-y-0.5 overflow-hidden px-2.5 py-2 text-[0.7rem] leading-tight">
        <p className="text-sm font-semibold tabular-nums">{formatNumber(node.value)}</p>
        {height >= 44 && <p className="truncate">{node.name}</p>}
      </div>
    );
  }
  return null;
}

/** One tile: a rounded block with as much of its label as fits. */
function Tile(node: TreemapNode) {
  // Depth 0 is the root rectangle around all tiles.
  if (node.depth !== 1) return <g />;
  const x = node.x + GAP;
  const y = node.y + GAP;
  const width = Math.max(0, node.width - GAP * 2);
  const height = Math.max(0, node.height - GAP * 2);
  const color = node.color as ScaleColor; // Set on every item below; Recharts types extras as unknown.

  return (
    <g className={node.id ? 'cursor-pointer' : undefined}>
      <rect x={x} y={y} width={width} height={height} rx={14} fill={color.fill} />
      <foreignObject x={x} y={y} width={width} height={height}>
        {/* Ink is data-driven (it depends on the tile's colour), hence the inline style. */}
        <div className="size-full" style={{ color: color.ink }}>
          <TileLabel node={node} width={width} height={height} />
        </div>
      </foreignObject>
    </g>
  );
}

/**
 * Treemap of shares: tile area is the value, shaded hunter green → lime by rank.
 * @example <TreemapChart items={[{ id: 'a', label: 'Cardiology', value: 25, hint: '2 doctors' }]} unit="patients" />
 */
export function TreemapChart({ items, unit, onSelect }: TreemapChartProps) {
  const ranked = items.filter((item) => item.id !== null);
  const data = items.map((item, index) => ({
    ...item,
    name: item.label,
    color: item.id === null ? NEUTRAL_COLOR : scaleColor(index, ranked.length),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={data}
        dataKey="value"
        nameKey="name"
        aspectRatio={1.6}
        isAnimationActive={false}
        content={Tile}
        onClick={(node) => {
          if (typeof node.id === 'string') onSelect?.(node.id);
        }}
      >
        <Tooltip
          content={(props) => (
            <ChartTooltip {...props} label={String(props.payload[0]?.name ?? '')} unit={unit} />
          )}
        />
      </Treemap>
    </ResponsiveContainer>
  );
}
