import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { useData } from '../context/DataContext';
import { Panel } from '../components/Panel';
import { BarChart } from '../components/BarChart';

const SOURCES = [
  { key: 'heuristic'          as const, badge: '[H]',   name: 'Heuristic',      desc: 'Rule engine was authoritative', color: C.orange },
  { key: 'dl'                 as const, badge: '[D]',   name: 'DL Model',       desc: 'MLP confidence ≥ 80%',          color: C.blue },
  { key: 'both'               as const, badge: '[H+D]', name: 'Both Agreed',    desc: 'Both layers same verdict',      color: C.greenVis },
  { key: 'heuristic_fallback' as const, badge: '[H~]',  name: 'Heuristic F/B',  desc: 'DL uncertain, heuristic used',  color: C.red },
  { key: 'dl_fallback'        as const, badge: '[D~]',  name: 'DL Fallback',    desc: 'Heuristic said Normal, DL caught', color: C.purple },
];

export default function DecisionEngineScreen() {
  const { decisions, logs, refetch } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => { setRefreshing(true); await refetch(); setRefreshing(false); };

  const total = Object.values(decisions).reduce((s, v) => s + v, 0);

  const chartBars = SOURCES.map(s => ({
    label: s.badge, value: decisions[s.key], color: s.color,
  }));

  const recent = logs.slice(0, 10);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.blue} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Decision Engine</Text>
          <Text style={styles.sub}>Heuristic + Deep Learning fusion</Text>
        </View>

        <View style={styles.page}>
          {/* Source cards */}
          <View style={styles.cardsGrid}>
            {SOURCES.map(s => {
              const count = decisions[s.key];
              const pct   = total ? Math.round((count / total) * 100) : 0;
              return (
                <View key={s.key} style={[styles.sourceCard, { borderTopColor: s.color }]}>
                  <Text style={styles.cardLabel}>{s.name.toUpperCase()}</Text>
                  <Text style={[styles.cardValue, { color: s.color }]}>{count.toLocaleString()}</Text>
                  <Text style={[styles.cardBadge, { color: s.color }]}>{s.badge}</Text>
                  <Text style={styles.cardPct}>{pct}%</Text>
                </View>
              );
            })}
          </View>

          {/* Bar chart */}
          <Panel title="Decision Source Comparison">
            <BarChart data={chartBars} height={160} />
          </Panel>

          {/* How it works */}
          <Panel title="How Each Layer Works">
            {SOURCES.map(s => (
              <View key={s.key} style={styles.algoRow}>
                <View style={[styles.algoDot, { backgroundColor: s.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.algoName, { color: s.color }]}>{s.badge}  {s.name}</Text>
                  <Text style={styles.algoDesc}>{s.desc}</Text>
                </View>
              </View>
            ))}
          </Panel>

          {/* Recent decisions */}
          <Panel title="Recent Decisions" tag="LAST 10">
            {recent.length > 0 ? recent.map((log, i) => {
              const src = SOURCES.find(s => s.key === log.decided_by);
              const conf = (log.dl_confidence ?? 0) * 100;
              const confColor = conf >= 80 ? C.greenVis : conf >= 50 ? C.orange : C.red;
              return (
                <View key={i} style={styles.decRow}>
                  <Text style={[styles.decBadge, { color: src?.color ?? C.muted }]}>
                    {src?.badge ?? '?'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.decLabel}>{log.final_label}</Text>
                    <Text style={styles.decIp}>{log.source_ip}</Text>
                  </View>
                  <View style={styles.confWrap}>
                    <View style={styles.confTrack}>
                      <View style={[styles.confFill, { width: `${conf.toFixed(0)}%` as any, backgroundColor: confColor }]} />
                    </View>
                    <Text style={[styles.confPct, { color: confColor }]}>{conf.toFixed(0)}%</Text>
                  </View>
                </View>
              );
            }) : (
              <Text style={styles.noData}>No data yet</Text>
            )}
          </Panel>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: C.bg },
  header:     { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  title:      { fontSize: 22, fontWeight: '700', color: C.text },
  sub:        { fontSize: 12, color: C.muted, marginTop: 2 },
  page:       { padding: 16 },

  cardsGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  sourceCard: { flex: 1, minWidth: 100, backgroundColor: C.surface, borderRadius: 6, padding: 12, borderTopWidth: 3, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...C.shadow },
  cardLabel:  { fontSize: 9, fontWeight: '600', color: C.muted, letterSpacing: 0.5, marginBottom: 4 },
  cardValue:  { fontSize: 22, fontWeight: '700', lineHeight: 24 },
  cardBadge:  { fontSize: 11, fontWeight: '700', marginTop: 2 },
  cardPct:    { fontSize: 10, color: C.muted, marginTop: 1 },

  algoRow:  { flexDirection: 'row', gap: 10, marginBottom: 12 },
  algoDot:  { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
  algoName: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  algoDesc: { fontSize: 11, color: C.text2, lineHeight: 16 },

  decRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: C.border, gap: 10 },
  decBadge:  { fontSize: 11, fontWeight: '800', width: 44 },
  decLabel:  { fontSize: 11, fontWeight: '600', color: C.text },
  decIp:     { fontSize: 10, color: C.muted },
  confWrap:  { alignItems: 'flex-end', gap: 3 },
  confTrack: { width: 64, height: 5, backgroundColor: C.bg, borderRadius: 3, overflow: 'hidden' },
  confFill:  { height: 5, borderRadius: 3, minWidth: 2 },
  confPct:   { fontSize: 9, fontWeight: '700' },
  noData:    { fontSize: 12, color: C.muted, textAlign: 'center', paddingVertical: 24 },
});
