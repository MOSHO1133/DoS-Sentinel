import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';
import type { AttackLog } from '../types';

const SEV: Record<string, string> = {
  'DDoS': C.red, 'DoS': C.red,
  'Brute Force': C.orange,
  'Port Scanning': C.blue,
  'Normal Traffic': C.greenVis,
};

const DECIDED: Record<string, string> = {
  heuristic: '[H]', dl: '[D]', both: '[H+D]',
  heuristic_fallback: '[H~]', dl_fallback: '[D~]',
};

export const AlertRow: React.FC<{ log: AttackLog }> = ({ log }) => {
  const dotColor = SEV[log.final_label] ?? C.muted;
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <View style={styles.main}>
        <Text style={styles.type}>{log.final_label}</Text>
        <Text style={styles.detail} numberOfLines={1}>
          {log.source_ip} → {log.dest_ip ?? '?'}:{log.dest_port ?? '?'} · {log.protocol ?? '?'} · {DECIDED[log.decided_by] ?? log.decided_by}
        </Text>
      </View>
      <Text style={styles.ts}>{(log.timestamp ?? '').substring(11, 19)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 3,
    flexShrink: 0,
  },
  main: { flex: 1, minWidth: 0 },
  type: { fontSize: 12, fontWeight: '600', color: C.text },
  detail: { fontSize: 10, color: C.muted, marginTop: 1 },
  ts: { fontSize: 10, color: C.muted, flexShrink: 0 },
});
