import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const API = "http://127.0.0.1:8000"

const styles = {
  app:        { minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  header:     { background: "#1e293b", borderBottom: "1px solid #334155", padding: "16px 32px", display: "flex", alignItems: "center", gap: "12px" },
  h1:         { fontSize: "20px", fontWeight: "600", color: "#f1f5f9", margin: 0 },
  shield:     { fontSize: "26px" },
  main:       { maxWidth: "900px", margin: "0 auto", padding: "32px 24px" },
  section:    { marginBottom: "36px" },
  label:      { fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" },
  sectionTitle:{ fontSize: "16px", fontWeight: "600", color: "#f1f5f9", marginBottom: "16px" },
  inputRow:   { display: "flex", gap: "10px", marginBottom: "20px" },
  input:      { flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "12px 16px", color: "#e2e8f0", fontSize: "14px", outline: "none" },
  btn:        { padding: "12px 24px", background: "#3b82f6", border: "none", borderRadius: "8px", color: "white", fontSize: "14px", fontWeight: "500", cursor: "pointer" },
  btnDis:     { padding: "12px 24px", background: "#334155", border: "none", borderRadius: "8px", color: "#64748b", fontSize: "14px", cursor: "not-allowed" },
  btnGray:    { padding: "10px 20px", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#94a3b8", fontSize: "13px", cursor: "pointer" },
  card:       { background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "20px 24px", marginBottom: "12px" },
  grid2:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" },
  grid4:      { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "16px" },
  miniCard:   { background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "12px 14px" },
  miniLabel:  { fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" },
  miniVal:    { fontSize: "14px", fontWeight: "600" },
  safe:       { color: "#4ade80" },
  danger:     { color: "#f87171" },
  warn:       { color: "#fbbf24" },
  neutral:    { color: "#e2e8f0" },
  verdictSafe:    { background: "#052e16", border: "1px solid #166534", borderRadius: "10px", padding: "16px", textAlign: "center", marginBottom: "16px" },
  verdictPhish:   { background: "#450a0a", border: "1px solid #991b1b", borderRadius: "10px", padding: "16px", textAlign: "center", marginBottom: "16px" },
  verdictLabel:   { fontSize: "22px", fontWeight: "700", marginBottom: "4px" },
  verdictSub:     { fontSize: "13px", color: "#94a3b8" },
  riskBarWrap:    { marginBottom: "16px" },
  riskBarTrack:   { height: "8px", background: "#0f172a", borderRadius: "4px", overflow: "hidden" },
  historyRow: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #1e293b" },
  historyUrl: { flex: 1, fontSize: "12px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  badge:      { fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "4px" },
  badgeSafe:  { background: "#052e16", color: "#4ade80" },
  badgePhish: { background: "#450a0a", color: "#f87171" },
  empty:      { textAlign: "center", color: "#475569", padding: "40px", fontSize: "14px" },
}

function RiskBar({ score }) {
  const pct   = Math.round(score * 100)
  const color = pct > 70 ? "#ef4444" : pct > 40 ? "#f59e0b" : "#22c55e"
  return (
    <div style={styles.riskBarWrap}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginBottom: "6px" }}>
        <span>Risk score</span><span>{pct}%</span>
      </div>
      <div style={styles.riskBarTrack}>
        <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: "4px", transition: "width 0.4s" }} />
      </div>
    </div>
  )
}

function ResultCard({ data }) {
  const isPhishing = data.verdict === "phishing"
  const vtMal      = data.virustotal?.malicious ?? 0

  return (
    <div style={styles.card}>
      <div style={isPhishing ? styles.verdictPhish : styles.verdictSafe}>
        <div style={{ ...styles.verdictLabel, color: isPhishing ? "#f87171" : "#4ade80" }}>
          {isPhishing ? "⚠ Phishing" : "✓ Safe"}
        </div>
        <div style={styles.verdictSub}>{data.url}</div>
      </div>

      <RiskBar score={data.risk_score} />

      <div style={styles.grid4}>
        <div style={styles.miniCard}>
          <div style={styles.miniLabel}>VirusTotal</div>
          <div style={{ ...styles.miniVal, ...(vtMal > 0 ? styles.danger : styles.safe) }}>
            {vtMal} flags
          </div>
        </div>
        <div style={styles.miniCard}>
          <div style={styles.miniLabel}>URLhaus</div>
          <div style={{ ...styles.miniVal, ...(data.urlhaus?.is_malicious ? styles.danger : styles.safe) }}>
            {data.urlhaus?.is_malicious ? "Listed ⚠" : "Clean ✓"}
          </div>
        </div>
        <div style={styles.miniCard}>
          <div style={styles.miniLabel}>Domain age</div>
          <div style={{ ...styles.miniVal, ...(data.new_domain ? styles.warn : styles.safe) }}>
            {data.new_domain ? "New <90d ⚠" : "Established"}
          </div>
        </div>
        <div style={styles.miniCard}>
          <div style={styles.miniLabel}>Registrar</div>
          <div style={{ ...styles.miniVal, ...styles.neutral }}>
            {data.whois?.registrar ? data.whois.registrar.split(",")[0].trim() : "Unknown"}
          </div>
        </div>
      </div>

      <div style={styles.grid2}>
        <div style={styles.miniCard}>
          <div style={styles.miniLabel}>ML confidence</div>
          <div style={{ ...styles.miniVal, ...styles.neutral }}>
            {(data.ml?.confidence * 100).toFixed(1)}%
          </div>
        </div>
        <div style={styles.miniCard}>
          <div style={styles.miniLabel}>Created</div>
          <div style={{ ...styles.miniVal, ...styles.neutral }}>
            {data.whois?.creation_date ?? "Unknown"}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [url,     setUrl]     = useState("")
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)
  const [history, setHistory] = useState([])

  const scan = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res  = await fetch(`${API}/scan`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url: url.trim() })
      })
      const data = await res.json()
      setResult(data)
      setHistory(prev => [{
        url:       data.url,
        risk:      parseFloat((data.risk_score * 100).toFixed(1)),
        verdict:   data.verdict,
        time:      new Date().toLocaleTimeString()
      }, ...prev].slice(0, 50))   // keep last 50
    } catch (e) {
      setError("Could not reach API — is your FastAPI server running?")
    }
    setLoading(false)
  }

  const exportIoC = () => {
    const lines = [
      "PhishGuard IoC Report",
      `Generated: ${new Date().toISOString()}`,
      "─".repeat(60),
      ...history.map(h =>
        `[${h.time}] ${h.verdict.toUpperCase().padEnd(8)} risk:${h.risk}%  ${h.url}`
      )
    ].join("\n")

    const a    = document.createElement("a")
    a.href     = URL.createObjectURL(new Blob([lines], { type: "text/plain" }))
    a.download = `phishguard_ioc_${Date.now()}.txt`
    a.click()
  }

  const chartData = [...history].reverse()

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <span style={styles.shield}>🛡</span>
        <h1 style={styles.h1}>PhishGuard Dashboard</h1>
      </div>

      <div style={styles.main}>

        {/* Scanner */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>URL Scanner</div>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && scan()}
              placeholder="https://example.com"
            />
            <button
              style={loading ? styles.btnDis : styles.btn}
              onClick={scan}
              disabled={loading}
            >
              {loading ? "Scanning..." : "Scan"}
            </button>
          </div>
          {error  && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px" }}>{error}</div>}
          {result && <ResultCard data={result} />}
        </div>

        {/* Risk history chart */}
        {history.length > 0 && (
          <div style={styles.section}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={styles.sectionTitle}>Risk history</div>
              <button style={styles.btnGray} onClick={exportIoC}>Export IoC report</button>
            </div>
            <div style={styles.card}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} unit="%" />
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }}
                    formatter={(v) => [v + "%", "Risk"]}
                  />
                  <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Scan history table */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Scan history</div>
          <div style={styles.card}>
            {history.length === 0
              ? <div style={styles.empty}>No scans yet — enter a URL above to get started</div>
              : history.map((h, i) => (
                <div key={i} style={styles.historyRow}>
                  <span style={{ ...styles.badge, ...(h.verdict === "phishing" ? styles.badgePhish : styles.badgeSafe) }}>
                    {h.verdict}
                  </span>
                  <span style={styles.historyUrl}>{h.url}</span>
                  <span style={{ fontSize: "12px", color: h.risk > 70 ? "#f87171" : h.risk > 40 ? "#fbbf24" : "#4ade80", minWidth: "48px", textAlign: "right" }}>
                    {h.risk}%
                  </span>
                  <span style={{ fontSize: "11px", color: "#475569", minWidth: "60px", textAlign: "right" }}>
                    {h.time}
                  </span>
                </div>
              ))
            }
          </div>
        </div>

      </div>
    </div>
  )
}