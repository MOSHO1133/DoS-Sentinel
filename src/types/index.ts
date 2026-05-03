export type FinalLabel = 'Normal Traffic' | 'DoS' | 'DDoS' | 'Port Scanning' | 'Brute Force' | string;
export type DecidedBy  = 'heuristic' | 'dl' | 'both' | 'heuristic_fallback' | 'dl_fallback' | string;

export interface AttackLog {
  id?: number;
  timestamp: string;
  source_ip: string;
  dest_ip: string;
  dest_port: number;
  protocol: string;
  final_label: FinalLabel;
  is_attack: boolean;
  decided_by: DecidedBy;
  dl_prediction: string;
  dl_confidence: number;
  heuristic_label: string;
  unique_ports_seen: number;
  flows_from_ip: number;
  packet_count: number;
  pkt_per_sec: number;
  bytes_per_sec: number;
  duration_ms: number;
  syn: number; fin: number; rst: number; ack: number; psh: number;
}

export interface Stats {
  total: number; attacks: number; attackPct: number;
  dos: number; scan: number; brute: number; normal: number; uniqueIPs: number;
}

export interface TopIP {
  ip: string; flowCount: number; attackCount: number;
  topLabel: FinalLabel; protocols: string[];
}

export interface FlagTotals { SYN: number; FIN: number; RST: number; ACK: number; PSH: number; }
export interface DecisionCounts { heuristic: number; dl: number; both: number; heuristic_fallback: number; dl_fallback: number; }
