<div align="center">

<img src="https://img.shields.io/badge/DoS%20Sentinel-v1.0.0-2B6CB0?style=for-the-badge&logoColor=white" />

# 🛡️ DoS Sentinel

### AI-Powered Hybrid Intrusion Detection System

*Real-time network threat detection with mobile SOC dashboard*

<br/>

[![Expo](https://img.shields.io/badge/Expo-54.0.0-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactnative.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-MLP_Engine-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=flat-square)](LICENSE)

<br/>

> **DoS Sentinel** fuses a deterministic heuristic rule engine with a deep learning MLP to detect network intrusions in real time — delivering instant alerts to a professional SOC mobile dashboard connected live to Supabase.

<br/>

[📱 Screenshots](#-screenshots) · [🧠 How It Works](#-how-it-works) · [⚡ Quick Start](#-quick-start) · [🏗️ Architecture](#%EF%B8%8F-architecture) · [📊 Results](#-results) · [👥 Authors](#-authors)

---

</div>

## 📱 Screenshots

<div align="center">

| 🏠 Home — Overview | 📊 Analytics | 🌐 Top Source IPs | ⚙️ Decision Engine |
|:-:|:-:|:-:|:-:|
| <img src="WhatsApp Image 2026-05-03 at 7.26.44 PM.jpeg" width="190"/> | <img src="WhatsApp Image 2026-05-03 at 7.26.45 PM.jpeg" width="190"/> | <img src="WhatsApp Image 2026-05-03 at 7.26.45 PM (1).jpeg" width="190"/> | <img src="WhatsApp Image 2026-05-03 at 7.26.46 PM.jpeg" width="190"/> |
| Live KPI strip · alert feed | 11 interactive charts | Ranked IPs · filter · expand | Fusion engine · confidence bars |

</div>

---

## 🧠 How It Works

DoS Sentinel runs **two detection engines simultaneously** on every network flow and fuses their outputs using a priority-based combiner:

```
Live Traffic ──► NFStreamer ──► 50+ Features ──┬──► Heuristic Engine [H] ──┐
                                               │                            ├──► Fusion ──► Supabase ──► 📱
                                               └──► Deep Learning MLP [D] ──┘
```

| Layer | Technology | Specialization |
|-------|-----------|----------------|
| 🔵 **Heuristic Engine** | Rule-based · port tracker · flag ratios | Port Scanning · DDoS · Brute Force |
| 🟢 **Deep Learning MLP** | PyTorch · 128 → 64 → N · Softmax | DoS vs Normal Traffic |
| 🟡 **Fusion Logic** | Priority-based combiner | Minimizing false positives |

### 🏷️ Decision Badges

| Badge | Name | When It Fires |
|-------|------|--------------|
| `[H]` | Heuristic | Structural attack pattern detected |
| `[D]` | DL Model | MLP confidence ≥ 80% |
| `[H+D]` | Both Agreed | Independent consensus from both layers |
| `[H~]` | Heuristic Fallback | DL uncertain — heuristic stepped in |
| `[D~]` | DL Fallback | Heuristic said Normal — DL caught it |

---

## 📊 Results

<div align="center">

| 🎯 DL Accuracy | 🔍 Scan Detection | ✅ False Positives | ⚡ Latency | 📦 Dataset |
|:-:|:-:|:-:|:-:|:-:|
| **97 – 100%** | **100%** | **~0%** | **< 100ms** | **44,300 flows** |

</div>

### Attack Detection Coverage

| Attack Type | Detection Layer | Key Signal | Accuracy |
|-------------|----------------|-----------|:--------:|
| Port Scanning | Heuristic `[H]` | `unique_dst_ports ≥ 20` per src IP | **100%** |
| SYN Flood | Heuristic + DL `[H+D]` | `syn_ratio > 0.7` · pkts > 50 · no FIN | **~99%** |
| UDP DDoS | Heuristic `[H]` | High pkt rate + short duration | **100%** |
| HTTP Flood | Heuristic `[H]` | High PSH ratio · port 80/443 | **~98%** |
| DoS (general) | DL Primary `[D]` | Learned flow patterns · conf ≥ 80% | **97–100%** |
| Brute Force | Heuristic `[H]` | Auth ports 22/21/3389 · small pkts | **~98%** |
| Normal Traffic | Both `[H+D]` | All thresholds clear · DL confident | **~99%** |

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- Expo Go (SDK 54) installed on your phone
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MOSHO1133/DoS-Sentinel
cd DoS-Sentinel/sentinel3

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start the development server
npx expo start
```

Scan the QR code with **Expo Go** on your Android or iOS device.

### Supabase Realtime Setup

```sql
-- Run once in Supabase SQL Editor
ALTER TABLE attack_logs REPLICA IDENTITY FULL;
```

Go to **Supabase Dashboard → Database → Replication** and enable `attack_logs`.

---

## 🏗️ Architecture

```
hybrid_ids.py (Python IDS)
       │
       │  POST /store  ──►  Flask REST API
       │                          │
       │                     INSERT row
       │                          │
       │                          ▼
       │               Supabase PostgreSQL
       │                (attack_logs table)
       │                          │
       │            ┌─────────────┴──────────────┐
       │            │                            │
       │     Initial fetch                Real-time WebSocket
       │     (all records,                (postgres_changes)
       │      batched 1,000)              instant push
       │            │                            │
       │            └─────────────┬──────────────┘
       │                          ▼
       │                   DataContext.tsx
       │              (derive stats · charts · topIPs)
       │                          │
       │     ┌────────────────────┼────────────────────┐
       │     │                    │                    │
       ▼     ▼                    ▼                    ▼
     Home  Analytics           Top IPs            Engine
```

### Data Flow Strategy

| Event | Behavior |
|-------|----------|
| 🚀 App opens | Fetches **all** records in batches of 1,000 rows |
| ⚡ New attack inserted | Received **instantly** via Supabase WebSocket |
| 🔄 WebSocket fails | Automatically polls every 15 seconds |
| 👆 Pull to refresh | Manual re-fetch of all records |

---

## 📱 Screen Details

<details>
<summary><b>🏠 Home — Overview</b></summary>
<br/>

- IDS logo header with SOC breadcrumb and last-updated timestamp
- **7 scrollable KPI cards**: Total Flows · Attacks Detected · DoS/DDoS · Port Scans · Brute Force · Normal Traffic · Unique IPs
- **Live Alert Feed** (last 60 events):
  - 🔴 Red dot → DoS / DDoS
  - 🟠 Orange dot → Port Scanning
  - 🟣 Purple dot → Brute Force
  - 🟢 Green dot → Normal Traffic
  - Source IP → Destination IP:Port · Protocol · Fusion badge · Timestamp

</details>

<details>
<summary><b>📊 Analytics — 11 Charts</b></summary>
<br/>

1. **Attack Timeline** — multi-series line chart (last 20 min)
2. **Label Distribution** — donut chart with percentages
3. **TCP Flags (Attack)** — SYN / FIN / RST / ACK / PSH bar chart
4. **TCP Flags (Normal)** — comparison bar chart
5. **DL Confidence Histogram** — 10 confidence buckets (0–100%)
6. **Protocol Split** — TCP vs UDP donut
7. **Avg Bytes/s** — horizontal bar by attack type
8. **Avg Pkt/s** — horizontal bar by label
9. **Attack Mix %** — progress bar breakdown
10. **Top Destination Ports** — bar chart
11. **Decided By** — pie chart

</details>

<details>
<summary><b>🌐 Top Source IPs</b></summary>
<br/>

- Ranked table of top 20 source IP addresses
- **Filter modes**: All · Attacks Only · Normal Only
- **Sort keys**: By Flow Count · By Attack Count
- Tap any row to **expand detail**:
  - Total / Attack / Normal flow counts
  - Attack rate percentage
  - Observed protocols

</details>

<details>
<summary><b>⚙️ Decision Engine</b></summary>
<br/>

- **5 fusion source cards** with counts and percentages:
  - `[H]` Heuristic · `[D]` DL Model · `[H+D]` Both Agreed · `[H~]` Heuristic F/B · `[D~]` DL Fallback
- Decision source comparison bar chart
- Plain-English explanation of each detection layer
- Last 10 decisions with per-row DL confidence progress bars

</details>

---

## 🗄️ Database Schema

<details>
<summary><b>attack_logs table — click to expand</b></summary>
<br/>

| Column | Type | Description |
|--------|------|-------------|
| `id` | int | Auto-increment primary key |
| `timestamp` | text | ISO 8601 timestamp |
| `source_ip` | text | Source IP address |
| `dest_ip` | text | Destination IP address |
| `dest_port` | int | Destination port number |
| `protocol` | text | TCP or UDP |
| `final_label` | text | Normal Traffic / DoS / DDoS / Port Scanning / Brute Force |
| `is_attack` | bool | True if attack detected |
| `decided_by` | text | heuristic / dl / both / heuristic_fallback / dl_fallback |
| `dl_prediction` | text | Raw DL model output |
| `dl_confidence` | float | 0.0 – 1.0 confidence score |
| `heuristic_label` | text | Heuristic engine raw output |
| `unique_ports_seen` | int | Unique destination ports from this src IP |
| `flows_from_ip` | int | Total flows seen from this src IP |
| `packet_count` | int | Packets in this flow |
| `pkt_per_sec` | float | Packet rate |
| `bytes_per_sec` | float | Byte rate |
| `duration_ms` | int | Flow duration in milliseconds |
| `syn` | int | SYN flag count |
| `fin` | int | FIN flag count |
| `rst` | int | RST flag count |
| `ack` | int | ACK flag count |
| `psh` | int | PSH flag count |

</details>

---

## 🏗️ Project Structure

```
sentinel3/
├── App.tsx                          # Root — navigation + DataProvider
├── app.json                         # Expo config
├── babel.config.js                  # Babel config
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
│
└── src/
    ├── lib/
    │   └── supabase.ts              # Supabase client + credentials
    ├── types/
    │   └── index.ts                 # AttackLog · Stats · TopIP interfaces
    ├── theme/
    │   └── colors.ts                # SOC light color palette
    ├── context/
    │   └── DataContext.tsx          # Global state + real-time subscription
    ├── components/
    │   ├── AlertRow.tsx             # Single alert feed entry
    │   ├── BarChart.tsx             # SVG bar chart (vertical + horizontal)
    │   ├── DonutChart.tsx           # SVG donut / pie chart
    │   ├── KpiCard.tsx              # KPI stat card with accent bar
    │   ├── LineChart.tsx            # SVG multi-series line chart
    │   ├── Panel.tsx                # White card wrapper with header
    │   ├── ProgressRow.tsx          # Horizontal progress bar
    │   └── Tag.tsx                  # Color-coded label badge
    └── screens/
        ├── HomeScreen.tsx           # KPI strip + live alert feed
        ├── AnalyticsScreen.tsx      # 11 chart visualizations
        ├── TopIPsScreen.tsx         # Ranked IP table with filter/sort
        └── DecisionEngineScreen.tsx # Fusion engine breakdown
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~54.0.0 | Expo SDK |
| `react-native` | 0.81.5 | Mobile framework |
| `@react-navigation/bottom-tabs` | ^6.6.1 | Bottom tab navigation |
| `@supabase/supabase-js` | ^2.45.4 | Database + real-time |
| `@react-native-async-storage/async-storage` | 2.2.0 | Supabase auth storage |
| `react-native-url-polyfill` | ^2.0.0 | Supabase RN compatibility |
| `react-native-svg` | 15.12.1 | All SVG-based charts |
| `react-native-safe-area-context` | ~5.6.0 | Safe area insets |
| `@expo/vector-icons` | ^15.0.3 | Ionicons icon set |

---

## 🎨 Design System

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#F4F5F7` | App background |
| Surface | `#FFFFFF` | Cards and panels |
| Primary Blue | `#2B6CB0` | Links · info · KPI |
| Danger Red | `#E53E3E` | DoS · DDoS alerts |
| Warning Orange | `#DD6B20` | Port Scanning |
| Success Green | `#276749` | Normal Traffic |
| Purple | `#553C9A` | Brute Force |

---

## 👥 Authors

<div align="center">

| | Name | GitHub | Role |
|-|------|--------|------|
| 👨‍💻 | **Muhammad Shees** | [@MOSHO1133](https://github.com/MOSHO1133) | Mobile App · Integration |
| 👨‍💻 | **Hamza Sajid** | [@HAMZOO0](https://github.com/HAMZOO0) | IDS Engine · ML Model |

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made by **Muhammad Shees** & **Hamza Sajid**

**DoS Sentinel** · React Native · Expo · Supabase · PyTorch · 2026

*⭐ Star this repo if you found it useful*

</div>