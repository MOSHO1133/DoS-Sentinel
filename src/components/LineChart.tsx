import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Line, Text as SvgText } from 'react-native-svg';
import { C } from '../theme/colors';

interface Series { label: string; color: string; data: { x: number; y: number }[]; }

export const LineChart: React.FC<{ series: Series[]; height?: number }> = ({
  series, height = 160,
}) => {
  if (!series.length || !series[0].data.length)
    return <Text style={styles.empty}>No timeline data yet</Text>;

  const W = 320, H = height;
  const pad = { t: 10, r: 8, b: 30, l: 34 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;
  const n = series[0].data.length;
  const maxY = Math.max(...series.flatMap(s => s.data.map(d => d.y)), 1);
  const px = (i: number) => pad.l + (i / Math.max(n - 1, 1)) * cW;
  const py = (y: number) => pad.t + cH - (y / maxY) * cH;

  // X-axis labels: show every ~4th point
  const xLabels = series[0].data.map((_, i) => i).filter(i => i % Math.max(Math.floor(n / 5), 1) === 0);

  return (
    <View>
      {/* Legend */}
      <View style={styles.legend}>
        {series.map((s, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: s.color }]} />
            <Text style={styles.legendLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
      <Svg width="100%" viewBox={`0 0 ${W} ${H}`} height={H}>
        {/* Grid */}
        {[0, 0.5, 1].map((t, i) => {
          const y = pad.t + t * cH;
          return (
            <React.Fragment key={i}>
              <Line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke={C.border} strokeWidth={0.8} />
              <SvgText x={pad.l - 4} y={y + 4} textAnchor="end" fill={C.muted} fontSize={8} fontFamily="sans-serif">
                {Math.round(maxY * (1 - t))}
              </SvgText>
            </React.Fragment>
          );
        })}
        {/* X labels */}
        {xLabels.map(i => (
          <SvgText key={i} x={px(i)} y={H - 4} textAnchor="middle" fill={C.muted} fontSize={8} fontFamily="sans-serif">
            {series[0].data[i] ? String(i) : ''}
          </SvgText>
        ))}
        {/* Lines */}
        {series.map((s, si) => (
          <Polyline key={si}
            points={s.data.map((d, i) => `${px(i)},${py(d.y)}`).join(' ')}
            fill="none" stroke={s.color} strokeWidth={2}
            strokeLinejoin="round" strokeLinecap="round"
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  empty:       { fontSize: 12, color: C.muted, textAlign: 'center', paddingVertical: 30 },
  legend:      { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 6 },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:   { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 10, color: C.text2 },
});
