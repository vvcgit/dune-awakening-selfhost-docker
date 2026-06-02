export function PortChecklist({ text }: { text: string }) {
  const rows = parsePorts(text);
  return <section className="action-section">
    <h4>Ports / Listeners</h4>
    {rows.length ? <div className="table-wrap"><table><thead><tr><th>Name</th><th>Port</th><th>Protocol</th><th>Status</th></tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.name}-${index}`}><td>{row.name}</td><td>{row.port}</td><td>{row.protocol}</td><td><span className={`badge badge-${row.kind}`}>{row.status}</span></td></tr>)}</tbody></table></div> : <p>Run port checks to see listener status.</p>}
    <details className="technical-details"><summary>Port technical details</summary><pre className="mini-output">{text || "Run port checks to see listener status."}</pre></details>
  </section>;
}

function parsePorts(text: string) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).filter((line) => /\d{2,5}/.test(line)).slice(0, 30).map((line) => {
    const port = line.match(/\b(\d{2,5})\b/)?.[1] || "";
    const protocol = line.match(/\b(udp|tcp)\b/i)?.[1]?.toUpperCase() || "";
    const status = /fail|closed|missing|error|down/i.test(line) ? "Failed" : /warn|not ready|waiting/i.test(line) ? "Warning" : /open|listen|listening|ok|ready|up/i.test(line) ? "Ready" : "Checked";
    const name = line.replace(/\b(udp|tcp)\b/ig, "").replace(/\b\d{2,5}\b/g, "").replace(/[:=-]/g, " ").trim() || "Listener";
    return { name, port, protocol, status, kind: status === "Failed" ? "fail" : status === "Warning" ? "warn" : "pass" };
  });
}
