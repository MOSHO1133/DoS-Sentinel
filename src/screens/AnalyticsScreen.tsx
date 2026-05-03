import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { useData } from '../context/DataContext';
import { Panel } from '../components/Panel';
import { DonutChart } from '../components/DonutChart';
import { BarChart } from '../components/BarChart';
import { LineChart } from '../components/LineChart';
import { ProgressRow } from '../components/ProgressRow';

const LABEL_COLORS: Record<string, string> = {
  'Normal Traffic': C.greenVis,
  'DoS':            C.red,
  'DDoS':           '#C53030',
  'Port Scanning':  C.orange,
  'Brute Force':    C.purple,
};

export default function AnalyticsScreen() {
  const {
    labelCounts, protoCounts, portCounts, confBuckets,
    timeline, flagTotals: flags, avgBytes, avgPkts,
    decisions, stats, refetch,
  } = useData();

  // Access flags safely
  const flagData = flags ?? { attack: { SYN:0,FIN:0,RST:0,ACK:0,PSH:0 }, normal: { SYN:0,FIN:0,RST:0,ACK:0,PSH:0 } };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => { setRefreshing(true); await refetch(); setRefreshing(false); };

  // Label donut
  const labelSlices = Object.entries(labelCounts).map(([l, v]) => ({
    label: l, value: v, color: LABEL_COLORS[l] ?? C.blue,
  }));

  // Protocol donut
  const protoSlices = Object.entries(protoCounts).map(([l, v]) => ({
    label: l, value: v, color: l === 'TCP' ? C.blue : C.orange,
  }));

  // Top ports bar
  const portBars = Object.entries(portCounts)
    .sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([p, v]) => ({ label: ':' + p, value: v, color: C.blue + 'cc' }));

  // Confidence bars
  const confBars = confBuckets.map((v, i) => ({
    label: `${i * 10}%`, value: v,
    color: i >= 8 ? C.blue : i >= 5 ? C.orange : C.red,
  }));

  // TCP Flags — attack vs normal
  const flagKeys = ['SYN', 'FIN', 'RST', 'ACK', 'PSH'] as const;
  const flagBarsAtk = flagKeys.map(f => ({ label: f, value: flagData.attack[f], color: C.red + 'cc' }));
  const flagBarsNor = flagKeys.map(f => ({ label: f, value: flagData.normal[f], color: C.greenVis + 'cc' }));

  // Timeline
  const allLabels = new Set<string>();
  timeline.forEach(b => Object.keys(b.counts).forEach(l => allLabels.add(l)));
  const timelineSeries = [...allLabels].map(lbl => ({
    label: lbl, color: LABEL_COLORS[lbl] ?? C.blue,
    data: timeline.map((b, i) => ({ x: i, y: b.counts[lbl] ?? 0 })),
  }));

  // Avg bytes horizontal bars
  const bytesBars = Object.entries(avgBytes).map(([l, v]) => ({
    label: l, value: v, color: LABEL_COLORS[l] ?? C.blue,
  }));
  const pktsBars = Object.entries(avgPkts).map(([l, v]) => ({
    label: l, value: v, color: LABEL_COLORS[l] ?? C.blue,
  }));

  // Decided by pie
  const decidedSlices = [
    { label: 'Heuristic [H]',    value: decisions.heuristic,          color: C.orange },
    { label: 'DL Model [D]',     value: decisions.dl,                 color: C.blue },
    { label: 'Both [H+D]',       value: decisions.both,               color: C.greenVis },
    { label: 'Heuristic F/B',    value: decisions.heuristic_fallback, color: C.red },
    { label: 'DL Fallback',      value: decisions.dl_fallback,        color: C.purple },
  ].filter(s => s.value > 0);

  // Attack mix
  const total = stats.total;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.blue} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.sub}>Real-time traffic breakdown</Text>
        </View>

        <View style={styles.page}>
          {/* Attack Timeline */}
          <Panel title="Attack Timeline — Events per Minute" tag="LAST 20 INTERVALS">
            <LineChart series={timelineSeries} height={160} />
          </Panel>

          {/* Label Distribution */}
          <Panel title="Label Distribution">
            <DonutChart data={labelSlices} size={130} />
          </Panel>

          {/* TCP Flags Attack */}
          <Panel title="TCP Flags — Attack Traffic">
            <BarChart data={flagBarsAtk} height={160} />
          </Panel>

          {/* TCP Flags Normal */}
          <Panel title="TCP Flags — Normal Traffic">
            <BarChart data={flagBarsNor} height={160} />
          </Panel>

          {/* DL Confidence */}
          <Panel title="DL Confidence Histogram">
            <BarChart data={confBars} height={160} />
          </Panel>

          {/* Protocol Split */}
          <Panel title="Protocol Split">
            <DonutChart data={protoSlices} size={120} />
          </Panel>

          {/* Avg Bytes/s */}
          <Panel title="Avg Bytes/s — by Attack Type">
            <BarChart data={bytesBars} horizontal height={180} />
          </Panel>

          {/* Avg Pkt/s */}
          <Panel title="Avg Pkt/s by Label">
            <BarChart data={pktsBars} horizontal height={180} />
          </Panel>

          {/* Attack Mix */}
          <Panel title="Attack Mix — % Breakdown">
            {labelSlices.length > 0 ? (
              labelSlices.sort((a,b)=>b.value-a.value).map((s, i) => (
                <ProgressRow key={i} label={s.label} value={s.value} total={total} color={s.color} />
              ))
            ) : (
              <Text style={styles.empty}>No data yet</Text>
            )}
          </Panel>

          {/* Top Dest Ports */}
          <Panel title="Top Destination Ports">
            <BarChart data={portBars} height={160} />
          </Panel>

          {/* Decided By */}
          <Panel title="Decided By — Breakdown">
            <DonutChart data={decidedSlices} size={120} donut={false} />
          </Panel>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  title:  { fontSize: 22, fontWeight: '700', color: C.text },
  sub:    { fontSize: 12, color: C.muted, marginTop: 2 },
  page:   { padding: 16 },
  empty:  { fontSize: 12, color: C.muted, textAlign: 'center', paddingVertical: 20 },
});
