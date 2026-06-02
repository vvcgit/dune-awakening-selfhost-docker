export function PortChecklist({ text }: { text: string }) {
  const rows = parsePorts(text);
  const warnings = parseNetworkWarnings(text);
  return <section className="action-section">
    <h4>Ports / Listeners</h4>
    {warnings.map((warning, index) => <article className="warning-panel action-section" key={`${warning}-${index}`}>
      <strong>Network Warning</strong>
      <p>{warning}</p>
    </article>)}
    {rows.length ? <div className="table-wrap"><table><thead><tr><th>Name</th><th>Port</th><th>Protocol</th><th>Status</th><th>Details</th></tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.name}-${index}`}><td>{row.name}</td><td>{row.port}</td><td>{row.protocol}</td><td><span className={`badge badge-${row.kind}`}>{row.status}</span></td><td>{row.detail}</td></tr>)}</tbody></table></div> : <p>Run port checks to see listener status.</p>}
    <details className="technical-details"><summary>Advanced port output</summary><pre className="mini-output">{text || "Run port checks to see listener status."}</pre></details>
  </section>;
}

function parsePorts(text: string) {
  const seen = new Set<string>();
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).filter((line) => {
    if (!/\b\d{2,5}\b/.test(line)) return false;
    if (/battlegroup|advertised ip|local bind|public mode|private ip|in-game ping|server ip/i.test(line)) return false;
    return /\b(udp|tcp)\b/i.test(line) || /\b(listen|listening|port|open|ready|ok)\b/i.test(line);
  }).slice(0, 60).map((line) => {
    const portToken = line.match(/\b(\d{2,5})(?:\/(udp|tcp))?\b/i);
    const port = portToken?.[1] || "";
    const protocol = (portToken?.[2] || line.match(/\b(udp|tcp)\b/i)?.[1] || "").toUpperCase();
    if (!protocol || !port) return null;
    const status = /fail|closed|missing|error|down/i.test(line) ? "Failed" : /warn|not ready|waiting/i.test(line) ? "Attention Needed" : /open|listen|listening|ok|ready|up/i.test(line) ? "Ready" : "Checked";
    const beforePort = portToken ? line.slice(0, portToken.index).trim() : line;
    const name = friendlyPortName(beforePort || line, port, protocol);
    const key = `${name}-${port}-${protocol}`;
    if (seen.has(key)) return null;
    seen.add(key);
    return { name, port, protocol, status, detail: status === "Ready" ? "Listening" : cleanDetail(line), kind: status === "Failed" ? "fail" : status === "Attention Needed" ? "warn" : "pass" };
  }).filter(Boolean) as { name: string; port: string; protocol: string; status: string; detail: string; kind: string }[];
}

function parseNetworkWarnings(text: string) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter((line) => /advertised ip|public mode|private ip|local bind|in-game ping/i.test(line)).map(cleanDetail).slice(0, 4);
}

function cleanDetail(line: string) {
  return line.replace(/^OK\s+/i, "").replace(/^WARN\s+/i, "").replace(/^FAIL\s+/i, "").replace(/\s+/g, " ").trim();
}

function friendlyPortName(raw: string, port: string, protocol: string) {
  const normalized = raw.replace(/^ok\s+/i, "").replace(/\blistening\b.*$/i, "").replace(/[:=-]/g, " ").trim().toLowerCase();
  const byPort: Record<string, string> = {
    "15432/tcp": "Postgres",
    "32573/tcp": "RabbitMQ Admin",
    "31982/tcp": "RabbitMQ Game",
    "31983/tcp": "RabbitMQ Game HTTP",
    "5059/tcp": "Text Router",
    "11717/tcp": "Director"
  };
  const known = byPort[`${port}/${protocol.toLowerCase()}`];
  if (known) return known;
  if (/overmap.*client/.test(normalized)) return "Overmap Clients";
  if (/survival.*client/.test(normalized)) return "Survival 1 Clients";
  if (/survival.*s2s|survival.*igw/.test(normalized)) return "Survival 1 IGW";
  if (/overmap.*s2s|overmap.*igw/.test(normalized)) return "Overmap IGW";
  if (/rabbit.*game.*http/.test(normalized)) return "RabbitMQ Game HTTP";
  if (/rabbit.*game/.test(normalized)) return "RabbitMQ Game";
  if (/rabbit.*admin/.test(normalized)) return "RabbitMQ Admin";
  if (/postgres/.test(normalized)) return "Postgres";
  if (/director/.test(normalized)) return "Director";
  return raw.replace(/\s+/g, " ").trim() || "Listener";
}
