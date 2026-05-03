import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

interface Props {
  label: string;
  value: string | number;
  meta?: string;
  color: string;
}

export const KpiCard: React.FC<Props> = ({ label, value, meta, color }) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label.toUpperCase()}</Text>
    <Text style={[styles.value, { color }]}>{value}</Text>
    {meta ? <Text style={styles.meta}>{meta}</Text> : null}
    <View style={[styles.bar, { backgroundColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: C.surface,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
    borderRightWidth: 1,
    borderRightColor: C.border,
    position: 'relative',
    minWidth: 90,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    color: C.muted,
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
  meta: {
    fontSize: 10,
    color: C.muted,
    marginTop: 3,
  },
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});
