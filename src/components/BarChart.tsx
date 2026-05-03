import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { C } from '../theme/colors';

interface Bar { label: string; value: number; color?: string; }

interface Props {
  data: Bar[];
  height?: number;
  horizontal?: boolean;
  defaultColor?: string;
}

export const BarChart: React.FC<Props> = ({
  data, height = 180, horizontal = false, defaultColor = C.blue,
}) => {
  if (!data.length || data.every(d => d.value === 0)) {
    return <Text style={styles.empty}>No data yet</Text>;
  }

  const max = Math.max(...data.map(d => d.value), 1);
  const W = 300;

  if (horizontal) {
    const rowH = 28;
    const H = data.length * rowH + 10;
    const labelW = 110;
    const barAreaW = W - labelW - 40;

    return (
      <Svg width="100%" viewBox={`0 0 ${W} ${H}`} height={H}>
        {data.map((d, i) => {
          const bw = (d.value / max) * barAreaW;
          const y = i * rowH + 6;
          return (
            <React.Fragment key={i}>
              <SvgText x={labelW - 4} y={y + 14} textAnchor="end" fill={C.muted} fontSize={9} fontFamily="sans-serif">
                {d.label.length > 14 ? d.label.substring(0, 13) + '…' : d.label}
              </SvgText>
              <Rect x={labelW} y={y + 4} width={Math.max(bw, 2)} height={16} rx={2} fill={d.color ?? defaultColor} opacity={0.85} />
              <SvgText x={labelW + Math.max(bw, 2) + 4} y={y + 15} fill={C.muted} fontSize={9} fontFamily="sans-serif">
                {d.value >= 1000 ? `${(d.value/1000).toFixed(1)}k` : String(d.value)}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    );
  }

  // Vertical
  const H = height;
  const pad = { t: 10, r: 8, b: 28, l: 36 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;
  const barW = Math.max(Math.floor(cW / data.length) - 4, 4);

  return (
    <Svg width="100%" viewBox={`0 0 ${W} ${H}`} height={H}>
      {/* Grid lines */}
      {[0, 0.5, 1].map((t, i) => {
        const y = pad.t + t * cH;
        const val = Math.round(max * (1 - t));
        return (
          <React.Fragment key={i}>
            <Line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke={C.border} strokeWidth={0.8} />
            <SvgText x={pad.l - 4} y={y + 4} textAnchor="end" fill={C.muted} fontSize={8} fontFamily="sans-serif">
              {val >= 1000 ? `${(val/1000).toFixed(1)}k` : String(val)}
            </SvgText>
          </React.Fragment>
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const bh = Math.max((d.value / max) * cH, 2);
        const x = pad.l + i * (cW / data.length) + (cW / data.length - barW) / 2;
        const y = pad.t + cH - bh;
        return (
          <React.Fragment key={i}>
            <Rect x={x} y={y} width={barW} height={bh} rx={2} fill={d.color ?? defaultColor} opacity={0.85} />
            <SvgText x={x + barW / 2} y={H - 4} textAnchor="middle" fill={C.muted} fontSize={8} fontFamily="sans-serif">
              {d.label}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
};

const styles = StyleSheet.create({
  empty: { fontSize: 12, color: C.muted, textAlign: 'center', paddingVertical: 30 },
});
