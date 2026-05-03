import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { C } from '../theme/colors';

interface Slice { label: string; value: number; color: string; }

function arc(cx: number, cy: number, r: number, start: number, end: number) {
  const rad = (d: number) => ((d - 90) * Math.PI) / 180;
  const s = { x: cx + r * Math.cos(rad(end)),   y: cy + r * Math.sin(rad(end)) };
  const e = { x: cx + r * Math.cos(rad(start)), y: cy + r * Math.sin(rad(start)) };
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 0 ${e.x} ${e.y} Z`;
}

interface Props { data: Slice[]; size?: number; donut?: boolean; }

export const DonutChart: React.FC<Props> = ({ data, size = 130, donut = true }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <Text style={styles.empty}>No data yet</Text>;

  const cx = size / 2, cy = size / 2, outerR = size / 2 - 4;
  const innerR = donut ? outerR * 0.56 : 0;
  let cum = 0;

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size}>
        {data.map((d, i) => {
          const sweep = (d.value / total) * 360;
          const p = arc(cx, cy, outerR, cum, cum + sweep);
          cum += sweep;
          return <Path key={i} d={p} fill={d.color} opacity={0.88} />;
        })}
        {donut && <Circle cx={cx} cy={cy} r={innerR} fill={C.surface} />}
      </Svg>
      <View style={styles.legend}>
        {data.map((d, i) => (
          <View key={i} style={styles.item}>
            <View style={[styles.dot, { backgroundColor: d.color }]} />
            <Text style={styles.lbl} numberOfLines={1}>{d.label}</Text>
            <Text style={[styles.pct, { color: d.color }]}>
              {Math.round((d.value / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap:   { flexDirection: 'row', alignItems: 'center', gap: 14 },
  legend: { flex: 1, gap: 6 },
  item:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot:    { width: 8, height: 8, borderRadius: 4 },
  lbl:    { flex: 1, fontSize: 11, color: C.text2 },
  pct:    { fontSize: 11, fontWeight: '700' },
  empty:  { fontSize: 12, color: C.muted, textAlign: 'center', paddingVertical: 20 },
});
