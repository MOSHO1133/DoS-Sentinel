import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, TABLE } from '../lib/supabase';
import type { AttackLog, Stats, TopIP, FlagTotals, DecisionCounts } from '../types';

export interface Ctx {
  logs: AttackLog[];
  stats: Stats;
  topIPs: TopIP[];
  flags: { attack: FlagTotals; normal: FlagTotals };
  decisions: DecisionCounts;
  labelCounts: Record<string, number>;
  protoCounts: Record<string, number>;
  portCounts: Record<number, number>;
  confBuckets: number[];
  timeline: { label: string; counts: Record<string, number> }[];
  avgBytes: Record<string, number>;
  avgPkts: Record<string, number>;
  flagTotals: { attack: FlagTotals; normal: FlagTotals };
  loading: boolean;
  error: string | null;
  updatedAt: string;
  isLive: boolean;
  refetch: () => Promise<void>;
}

const mkFlags = (): FlagTotals => ({ SYN: 0, FIN: 0, RST: 0, ACK: 0, PSH: 0 });
const defaultDecisions: DecisionCounts = {
  heuristic: 0, dl: 0, both: 0, heuristic_fallback: 0, dl_fallback: 0,
};

export const DataCtx = createContext<Ctx>({} as Ctx);
export const useData = () => useContext(DataCtx);

function derive(logs: AttackLog[]) {
  const total = logs.length;
  const attacks = logs.filter(l => l.is_attack).length;

  const stats: Stats = {
    total, attacks,
    attackPct: total ? Math.round((attacks / total) * 100) : 0,
    dos: logs.filter(l => ['DoS', 'DDoS'].includes(l.final_label)).length,
    scan: logs.filter(l => l.final_label === 'Port Scanning').length,
    brute: logs.filter(l => l.final_label === 'Brute Force').length,
    normal: logs.filter(l => !l.is_attack).length,
    uniqueIPs: new Set(logs.map(l => l.source_ip)).size,
  };

  // Top IPs
  const ipMap: Record<string, TopIP> = {};
  logs.forEach(l => {
    if (!ipMap[l.source_ip]) {
      ipMap[l.source_ip] = {
        ip: l.source_ip, flowCount: 0, attackCount: 0,
        topLabel: l.final_label, protocols: [],
      };
    }
    const e = ipMap[l.source_ip];
    e.flowCount++;
    if (l.is_attack) { e.attackCount++; e.topLabel = l.final_label; }
    if (!e.protocols.includes(l.protocol)) e.protocols.push(l.protocol);
  });
  const topIPs = Object.values(ipMap)
    .sort((a, b) => b.flowCount - a.flowCount)
    .slice(0, 20);

  // Flags
  const flagA = mkFlags(), flagN = mkFlags();
  logs.forEach(l => {
    const t = l.is_attack ? flagA : flagN;
    t.SYN += l.syn || 0; t.FIN += l.fin || 0; t.RST += l.rst || 0;
    t.ACK += l.ack || 0; t.PSH += l.psh || 0;
  });

  // Decisions
  const decisions = { ...defaultDecisions };
  logs.forEach(l => {
    const k = l.decided_by as keyof DecisionCounts;
    if (k in decisions) decisions[k]++;
  });

  // Label counts
  const labelCounts: Record<string, number> = {};
  logs.forEach(l => {
    labelCounts[l.final_label] = (labelCounts[l.final_label] || 0) + 1;
  });

  // Protocol counts
  const protoCounts: Record<string, number> = {};
  logs.forEach(l => {
    if (l.protocol) protoCounts[l.protocol] = (protoCounts[l.protocol] || 0) + 1;
  });

  // Port counts
  const portCounts: Record<number, number> = {};
  logs.forEach(l => {
    if (l.dest_port) portCounts[l.dest_port] = (portCounts[l.dest_port] || 0) + 1;
  });

  // Confidence buckets
  const confBuckets = Array(10).fill(0);
  logs.forEach(l => {
    confBuckets[Math.min(Math.floor((l.dl_confidence || 0) * 10), 9)]++;
  });

  // Timeline (last 20 minute buckets)
  const tlMap: Record<string, Record<string, number>> = {};
  logs.forEach(l => {
    const k = (l.timestamp || '').substring(0, 16).replace('T', ' ');
    if (!tlMap[k]) tlMap[k] = {};
    tlMap[k][l.final_label] = (tlMap[k][l.final_label] || 0) + 1;
  });
  const timeline = Object.entries(tlMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-20)
    .map(([label, counts]) => ({ label: label.substring(11), counts }));

  // Avg bytes/s and pkt/s per label
  const byteSum: Record<string, number> = {};
  const byteN: Record<string, number> = {};
  const pktSum: Record<string, number> = {};
  const pktN: Record<string, number> = {};

  logs.forEach(l => {
    byteSum[l.final_label] = (byteSum[l.final_label] || 0) + (l.bytes_per_sec || 0);
    byteN[l.final_label] = (byteN[l.final_label] || 0) + 1;
    pktSum[l.final_label] = (pktSum[l.final_label] || 0) + (l.pkt_per_sec || 0);
    pktN[l.final_label] = (pktN[l.final_label] || 0) + 1;
  });

  const avgBytes: Record<string, number> = {};
  const avgPkts: Record<string, number> = {};
  Object.keys(byteSum).forEach(k => { avgBytes[k] = Math.round(byteSum[k] / byteN[k]); });
  Object.keys(pktSum).forEach(k => { avgPkts[k] = parseFloat((pktSum[k] / pktN[k]).toFixed(1)); });

  return {
    stats, topIPs,
    flags: { attack: flagA, normal: flagN },
    flagTotals: { attack: flagA, normal: flagN },
    decisions, labelCounts, protoCounts, portCounts,
    confBuckets, timeline, avgBytes, avgPkts,
  };
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<AttackLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState('');
  const [isLive, setIsLive] = useState(false);
  const channelRef = useRef<any>(null);

  // ── Fetch ALL records in batches of 1000 ──────────────
  const fetchLogs = useCallback(async () => {
    try {
      let allData: AttackLog[] = [];
      let from = 0;
      const batchSize = 1000;

      while (true) {
        const { data, error: e } = await supabase
          .from(TABLE)
          .select('*')
          .order('timestamp', { ascending: false })
          .range(from, from + batchSize - 1);

        if (e) throw new Error(e.message);
        if (!data || data.length === 0) break;

        allData = [...allData, ...(data as AttackLog[])];
        if (data.length < batchSize) break;
        from += batchSize;
      }

      setLogs(allData);
      setUpdatedAt(new Date().toLocaleTimeString());
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to connect to Supabase');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Real-time subscription for new INSERTs ────────────
  useEffect(() => {
    fetchLogs();

    channelRef.current = supabase
      .channel('ids_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: TABLE },
        payload => {
          setLogs(prev => [payload.new as AttackLog, ...prev]);
          setUpdatedAt(new Date().toLocaleTimeString());
          setIsLive(true);
        }
      )
      .subscribe(status => {
        if (status === 'SUBSCRIBED') {
          setIsLive(true);
          setError(null);
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsLive(false);
          // Fallback: poll every 15s if WebSocket fails
          const iv = setInterval(fetchLogs, 15_000);
          return () => clearInterval(iv);
        }
      });

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [fetchLogs]);

  const d = derive(logs);

  return (
    <DataCtx.Provider
      value={{
        logs, loading, error, updatedAt, isLive,
        refetch: fetchLogs,
        ...d,
      }}
    >
      {children}
    </DataCtx.Provider>
  );
};