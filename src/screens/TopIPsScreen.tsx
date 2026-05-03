import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme/colors';
import { useData } from '../context/DataContext';
import { Tag, labelVariant } from '../components/Tag';

type Filter = 'all' | 'attacks' | 'normal';
type Sort   = 'flows' | 'attacks';

export default function TopIPsScreen() {
  const { topIPs, refetch } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort,   setSort]   = useState<Sort>('flows');
  const [expanded, setExpanded] = useState<string | null>(null);

  const onRefresh = async () => { setRefreshing(true); await refetch(); setRefreshing(false); };

  const list = useMemo(() => {
    let d = [...topIPs];
    if (filter === 'attacks') d = d.filter(ip => ip.attackCount > 0);
    if (filter === 'normal')  d = d.filter(ip => ip.attackCount === 0);
    return sort === 'attacks'
      ? d.sort((a,b) => b.attackCount - a.attackCount)
      : d.sort((a,b) => b.flowCount  - a.flowCount);
  }, [topIPs, filter, sort]);

  const maxFlows = list[0]?.flowCount ?? 1;

  const Pill = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={[styles.pill, active && styles.pillOn]}>
      <Text style={[styles.pillTxt, active && styles.pillTxtOn]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.blue} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Top Source IPs</Text>
          <Text style={styles.sub}>{list.length} addresses · pull to refresh</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.ctrlRow}>
            <Text style={styles.ctrlLabel}>FILTER:</Text>
            {(['all','attacks','normal'] as Filter[]).map(f => (
              <Pill key={f} label={f.charAt(0).toUpperCase()+f.slice(1)} active={filter===f} onPress={() => setFilter(f)} />
            ))}
          </View>
          <View style={styles.ctrlRow}>
            <Text style={styles.ctrlLabel}>SORT:</Text>
            {(['flows','attacks'] as Sort[]).map(s => (
              <Pill key={s} label={s.charAt(0).toUpperCase()+s.slice(1)} active={sort===s} onPress={() => setSort(s)} />
            ))}
          </View>
        </View>

        {/* Table header */}
        <View style={styles.tableHead}>
          <Text style={[styles.th, { width: 24 }]}>#</Text>
          <Text style={[styles.th, { flex: 1 }]}>SOURCE IP</Text>
          <Text style={[styles.th, { width: 60, textAlign: 'right' }]}>FLOWS</Text>
          <Text style={[styles.th, { width: 60, textAlign: 'right' }]}>ATTACKS</Text>
          <Text style={[styles.th, { width: 100 }]}>LABEL</Text>
        </View>

        {/* Rows */}
        {list.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No IPs match this filter</Text>
          </View>
        ) : list.map((ip, i) => {
          const pct = Math.round((ip.flowCount / maxFlows) * 100);
          const accent = ip.attackCount > 0 ? (C.chart[ip.topLabel] ?? C.red) : C.greenVis;
          const isOpen = expanded === ip.ip;

          return (
            <TouchableOpacity
              key={ip.ip}
              onPress={() => setExpanded(isOpen ? null : ip.ip)}
              activeOpacity={0.75}
            >
              <View style={styles.row}>
                <Text style={styles.rank}>{i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ip}>{ip.ip}</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: accent }]} />
                  </View>
                </View>
                <Text style={[styles.td, { width: 60, textAlign: 'right' }]}>{ip.flowCount}</Text>
                <Text style={[styles.td, { width: 60, textAlign: 'right', color: ip.attackCount > 0 ? C.red : C.muted }]}>
                  {ip.attackCount}
                </Text>
                <View style={{ width: 100 }}>
                  <Tag text={ip.attackCount > 0 ? ip.topLabel : 'Normal'} variant={labelVariant(ip.attackCount > 0 ? ip.topLabel : 'Normal Traffic')} />
                </View>
                <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={13} color={C.muted} />
              </View>

              {isOpen && (
                <View style={styles.detail}>
                  {[
                    ['Total flows',   String(ip.flowCount)],
                    ['Attack flows',  String(ip.attackCount)],
                    ['Normal flows',  String(ip.flowCount - ip.attackCount)],
                    ['Attack rate',   `${Math.round((ip.attackCount / Math.max(ip.flowCount,1))*100)}%`],
                    ['Protocols',     ip.protocols.join(', ')],
                  ].map(([label, val], di) => (
                    <View key={di} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{label}</Text>
                      <Text style={styles.detailVal}>{val}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}

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
  controls:   { backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border, paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  ctrlRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  ctrlLabel:  { fontSize: 10, fontWeight: '600', color: C.muted, letterSpacing: 0.5 },
  pill:       { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 4, borderWidth: 1, borderColor: C.border2, backgroundColor: C.surface },
  pillOn:     { borderColor: C.blue, backgroundColor: C.blueLight },
  pillTxt:    { fontSize: 12, fontWeight: '600', color: C.text2 },
  pillTxtOn:  { color: C.blue },
  tableHead:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: C.surface2, borderBottomWidth: 2, borderBottomColor: C.border },
  th:         { fontSize: 10, fontWeight: '600', color: C.muted, letterSpacing: 0.5 },
  row:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border, gap: 6 },
  rank:       { fontSize: 11, color: C.muted, width: 24 },
  ip:         { fontSize: 12, color: C.blue, fontWeight: '600', marginBottom: 4 },
  barBg:      { height: 4, backgroundColor: C.bg, borderRadius: 2, overflow: 'hidden' },
  barFill:    { height: 4, borderRadius: 2 },
  td:         { fontSize: 12, color: C.text },
  detail:     { backgroundColor: C.surface2, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  detailRow:  { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: C.border },
  detailLabel:{ fontSize: 11, color: C.muted },
  detailVal:  { fontSize: 11, fontWeight: '600', color: C.text },
  empty:      { alignItems: 'center', paddingVertical: 60, backgroundColor: C.surface },
  emptyText:  { fontSize: 13, color: C.muted },
});
