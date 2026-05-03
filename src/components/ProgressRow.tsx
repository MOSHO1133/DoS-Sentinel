import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

interface Props { label: string; value: number; total: number; color: string; }

export const ProgressRow: React.FC<Props> = ({ label, value, total, color }) => {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <View style={styles.row}>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.val}>{pct}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  label: { fontSize: 11, fontWeight: '500', color: C.text2, minWidth: 100 },
  track: { flex: 1, height: 6, backgroundColor: C.bg, borderRadius: 3, overflow: 'hidden' },
  fill:  { height: 6, borderRadius: 3 },
  val:   { fontSize: 11, color: C.muted, minWidth: 32, textAlign: 'right' },
});
