# DDoS Sentinel — AI-Powered Hybrid IDS Mobile Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Expo-54.0.0-black?style=flat-square&logo=expo" />
  <img src="https://img.shields.io/badge/React_Native-0.81.5-blue?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Supabase-Live-green?style=flat-square&logo=supabase" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
</p>

A real-time mobile Security Operations Center (SOC) dashboard for the **DDoS Sentinel Hybrid IDS** system. Connects directly to Supabase to visualize live network attack data detected by the Heuristic + Deep Learning fusion engine.

---

## 📱 Screenshots

> Home · Analytics · Top IPs · Decision Engine

---

## 🧠 What is DDoS Sentinel?

DDoS Sentinel is a hybrid Intrusion Detection System that combines:

| Layer | Technology | Best At |
|-------|-----------|---------|
| Heuristic Engine | Rule-based (port tracker + flag ratios) | Port Scanning, DDoS, Brute Force |
| DL Engine | PyTorch MLP (128 → 64 → N) | DoS vs Normal Traffic |
| Fusion Logic | Priority-based combiner | Minimizing false positives |

The system captures live traffic via **NFStreamer**, extracts 50+ statistical flow features, runs both engines simultaneously, and stores structured logs in **Supabase** — which this mobile app reads and visualizes in real time.

---

## 🏗️ Project Structure

```
sentinel3/
├── App.tsx                          # Root — navigation + DataProvider
├── app.json                         # Expo config
├── babel.config.js
├── package.json
├── tsconfig.json
│
└── src/
    ├── lib/
    │   └── supabase.ts              # Supabase client + credentials
    │
    ├── types/
    │   └── index.ts                 # TypeScript interfaces (AttackLog, Stats, etc.)
    │
    ├── theme/
    │   └── colors.ts                # Light SOC color palette
    │
    ├── context/
    │   └── DataContext.tsx          # Global state — fetches + real-time subscription
    │
    ├── components/
    │   ├── AlertRow.tsx             # Single alert feed row
    │   ├── BarChart.tsx             # SVG vertical + horizontal bar chart
    │   ├── DonutChart.tsx           # SVG donut/pie chart
    │   ├── KpiCard.tsx              # KPI stat card with colored bottom bar
    │   ├── LineChart.tsx            # SVG multi-series line chart
    │   ├── Panel.tsx                # White card wrapper with header
    │   ├── ProgressRow.tsx          # Horizontal progress bar row
    │   └── Tag.tsx                  # Colored label badge (red/orange/green/blue/purple)
    │
    └── screens/
        ├── HomeScreen.tsx           # KPI strip + live alert feed
        ├── AnalyticsScreen.tsx      # All charts (11 visualizations)
        ├── TopIPsScreen.tsx         # Ranked IP table with filter + expand
        └── DecisionEngineScreen.tsx # [H] [D] [H+D] breakdown
```

---

## 📱 Screens

### 1. Home — Overview
- Blue IDS logo header
- SOC breadcrumb with last updated time
- **7 KPI cards** (scrollable): Total Flows, Attacks, DoS/DDoS, Port Scans, Brute Force, Normal Traffic, Unique IPs
- **Live Alert Feed** — last 60 events with severity dots, IPs, ports, protocol, decision badge

### 2. Analytics
- **Attack Timeline** — multi-series line chart, last 20 minute buckets
- **Label Distribution** — donut chart (Normal / DoS / DDoS / Port Scanning / Brute Force)
- **TCP Flags** — Attack vs Normal bar charts (SYN / FIN / RST / ACK / PSH)
- **DL Confidence Histogram** — 10 buckets (0–100%)
- **Protocol Split** — TCP vs UDP donut
- **Avg Bytes/s** — horizontal bar chart by attack type
- **Avg Pkt/s** — horizontal bar chart by label
- **Attack Mix %** — progress bars
- **Top Destination Ports** — bar chart
- **Decided By** — pie chart

### 3. Top IPs
- Ranked table of top 20 source IPs
- Filter: **All / Attacks / Normal**
- Sort: **By Flows / By Attacks**
- Tap any row to expand: total flows, attack flows, normal flows, attack rate %, protocols

### 4. Decision Engine
- **5 source cards**: `[H]` Heuristic · `[D]` DL Model · `[H+D]` Both Agreed · `[H~]` Heuristic Fallback · `[D~]` DL Fallback
- Bar chart comparison
- How each layer works (descriptions)
- Last 10 decisions with DL confidence bar

---

## 🗄️ Database Schema

Table: `attack_logs` in Supabase

| Column | Type | Description |
|--------|------|-------------|
| `id` | int | Auto-increment primary key |
| `timestamp` | text | ISO 8601 timestamp |
| `source_ip` | text | Source IP address |
| `dest_ip` | text | Destination IP address |
| `dest_port` | int | Destination port |
| `protocol` | text | TCP or UDP |
| `final_label` | text | Normal Traffic / DoS / DDoS / Port Scanning / Brute Force |
| `is_attack` | bool | True if attack detected |
| `decided_by` | text | heuristic / dl / both / heuristic_fallback / dl_fallback |
| `dl_prediction` | text | Raw DL model output |
| `dl_confidence` | float | 0.0 – 1.0 |
| `heuristic_label` | text | Heuristic engine output |
| `unique_ports_seen` | int | Unique destination ports from this source IP |
| `flows_from_ip` | int | Total flows from this source IP |
| `packet_count` | int | Packets in this flow |
| `pkt_per_sec` | float | Packet rate |
| `bytes_per_sec` | float | Byte rate |
| `duration_ms` | int | Flow duration in milliseconds |
| `syn` | int | SYN flag count |
| `fin` | int | FIN flag count |
| `rst` | int | RST flag count |
| `ack` | int | ACK flag count |
| `psh` | int | PSH flag count |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Expo Go app on your phone (SDK 54)
- Git

### Installation

```bash
# Clone the repo
git clone https://github.com/YOURUSERNAME/DDoS-Sentinel.git
cd DDoS-Sentinel/sentinel3

# Install dependencies
npm install --legacy-peer-deps

# Start the app
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

---

## 🔌 Supabase Setup

### 1. Enable Realtime
Go to **Supabase Dashboard → Database → Replication** and toggle ON `attack_logs`.

### 2. Run this SQL once
```sql
ALTER TABLE attack_logs REPLICA IDENTITY FULL;
```

### 3. Credentials (already configured in `src/lib/supabase.ts`)
```
URL:  https://hjgbcamapsfjyudpfule.supabase.co
Key:  sb_publishable_xWyiVo7rxkg6QtPIIY6VkA_tSzS5OVj
```

---

## 🔄 Data Strategy

| Event | Behavior |
|-------|----------|
| App opens | Fetches **all** records from `attack_logs` in batches of 1000 |
| New attack inserted by `hybrid_ids.py` | Received **instantly** via Supabase WebSocket |
| WebSocket fails | Falls back to polling every 15 seconds |
| Pull to refresh | Re-fetches all records manually |

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~54.0.0 | SDK |
| `react-native` | 0.81.5 | Framework |
| `@react-navigation/bottom-tabs` | ^6.6.1 | Tab navigation |
| `@supabase/supabase-js` | ^2.45.4 | Database + realtime |
| `@react-native-async-storage/async-storage` | 2.2.0 | Required by Supabase |
| `react-native-url-polyfill` | ^2.0.0 | Required by Supabase in RN |
| `react-native-svg` | 15.12.1 | All SVG charts |
| `react-native-safe-area-context` | ~5.6.0 | Safe area handling |
| `@expo/vector-icons` | ^15.0.3 | Ionicons |

---

## 🏛️ Architecture

```
hybrid_ids.py (Python)
      │
      │  INSERT row via Flask API
      ▼
Supabase (attack_logs table)
      │
      ├── Initial fetch (all records, batched)
      │
      └── Real-time WebSocket (postgres_changes INSERT)
                │
                ▼
         DataContext.tsx
         (derive stats, charts, topIPs)
                │
                ▼
    ┌──────────┬──────────┬──────────┬──────────┐
    │  Home    │Analytics │ Top IPs  │ Engine   │
    │  Screen  │ Screen   │ Screen   │ Screen   │
    └──────────┴──────────┴──────────┴──────────┘
```

---

## 🎨 Design System

- **Theme**: Light professional SOC (matches HTML dashboard)
- **Background**: `#F4F5F7`
- **Surface**: `#FFFFFF`
- **Primary**: `#2B6CB0` (blue)
- **Danger**: `#E53E3E` (red)
- **Warning**: `#DD6B20` (orange)
- **Success**: `#276749` (green)
- **Purple**: `#553C9A`
- **Font**: System default (IBM Plex Sans inspired)

---

## 🔮 Attack Types

| Attack | Detection Layer | Key Signals |
|--------|----------------|-------------|
| Port Scanning | Heuristic only | `unique_dst_ports ≥ 20` per src IP |
| SYN Flood | Heuristic + DL | `syn_ratio > 0.7`, pkts > 50, no FIN |
| UDP DDoS | Heuristic | High pkt rate, short duration |
| HTTP Flood | Heuristic | High PSH ratio, port 80/443 |
| DoS (general) | DL primary | Learned flow patterns, MLP confidence ≥ 80% |
| Brute Force | Heuristic | Auth ports (22/21/3389), small packets |
| Normal Traffic | Both agree | All thresholds clear, DL confident |

---

## 👤 Author

**Muhammad Shees**
- GitHub: [@MOSHO1133](https://github.com/MOSHO1133)

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

*Built with React Native + Expo + Supabase · DDoS Sentinel · 2026*