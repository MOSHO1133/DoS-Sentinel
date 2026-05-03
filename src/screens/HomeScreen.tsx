import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme/colors';
import { useData } from '../context/DataContext';
import { KpiCard } from '../components/KpiCard';
import { AlertRow } from '../components/AlertRow';

export default function HomeScreen() {
  const { logs, stats, loading, error, updatedAt, refetch } = useData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => { setRefreshing(true); await refetch(); setRefreshing(false); };
  const recent = logs.slice(0, 60);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.blue} />}
      >
        {/* ── App Header ── */}
        <View style={styles.appHeader}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Ionicons name="shield" size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.logoName}>IDS</Text>
              <Text style={styles.logoSub}>Security Operations Center</Text>
            </View>
          </View>
        </View>

        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <Text style={styles.breadText}>SOC Dashboard › </Text>
          <Text style={styles.breadBold}>Threat Overview</Text>
          {updatedAt ? <Text style={styles.breadMuted}>  ·  Updated {updatedAt}</Text> : null}
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBar}>
            <Ionicons name="warning" size={14} color={C.orange} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* ── KPI Strip ── */}
        <View style={styles.kpiStrip}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.kpiRow}>
              <KpiCard label="Total Flows" value={stats.total.toLocaleString()} meta="captured events" color={C.blue} />
              <KpiCard label="Attacks Detected" value={stats.attacks.toLocaleString()} meta={`${stats.attackPct}% of traffic`} color={C.red} />
              <KpiCard label="DoS / DDoS" value={stats.dos.toLocaleString()} meta="volumetric events" color={C.red} />
              <KpiCard label="Port Scans" value={stats.scan.toLocaleString()} meta="recon attempts" color={C.orange} />
              <KpiCard label="Brute Force" value={stats.brute.toLocaleString()} meta="credential attacks" color={C.purple} />
              <KpiCard label="Normal Traffic" value={stats.normal.toLocaleString()} meta="benign flows" color={C.greenVis} />
              <KpiCard label="Unique Src IPs" value={stats.uniqueIPs.toLocaleString()} meta="distinct addresses" color={C.blue} />
            </View>
          </ScrollView>
        </View>

        {/* ── Live Alert Feed ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>LIVE ALERT FEED</Text>
            <Text style={styles.sectionTag}>{logs.length} events</Text>
          </View>

          {loading && !recent.length ? (
            <View style={styles.center}>
              <ActivityIndicator color={C.blue} />
              <Text style={styles.loadText}>Connecting to Supabase…</Text>
            </View>
          ) : recent.length > 0 ? (
            <View style={styles.card}>
              {recent.map((log, i) => (
                <AlertRow key={`${log.id ?? i}`} log={log} />
              ))}
            </View>
          ) : (
            <View style={styles.center}>
              <Ionicons name="shield-checkmark-outline" size={40} color={C.greenVis} />
              <Text style={styles.emptyText}>No events yet — pull to refresh</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  appHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { width: 32, height: 32, backgroundColor: C.blue, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  logoName: { fontSize: 15, fontWeight: '700', color: C.text, letterSpacing: -0.3 },
  logoSub: { fontSize: 10, color: C.muted },
  breadcrumb: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  breadText: { fontSize: 12, color: C.muted },
  breadBold: { fontSize: 12, fontWeight: '600', color: C.text },
  breadMuted: { fontSize: 11, color: C.muted },
  errorBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFAF0', borderBottomWidth: 1, borderBottomColor: '#FBD38D', paddingHorizontal: 16, paddingVertical: 8 },
  errorText: { fontSize: 12, color: C.orange, flex: 1 },
  kpiStrip: { backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  kpiRow: { flexDirection: 'row' },
  section: { padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: C.text, letterSpacing: 0.6 },
  sectionTag: { fontSize: 10, color: C.muted, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2 },
  card: { backgroundColor: C.surface, borderRadius: 6, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, ...C.shadow },
  center: { alignItems: 'center', paddingVertical: 50, gap: 12 },
  loadText: { fontSize: 13, color: C.muted, marginTop: 8 },
  emptyText: { fontSize: 13, color: C.muted },
});