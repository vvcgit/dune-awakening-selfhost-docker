export function ReadinessTimeline({ text }: { text: string }) {
  const checks = parseChecks(text);
  return <section className="action-section">
    <h4>Readiness Checklist</h4>
    {checks.length ? <div className="check-grid">{checks.map((check, index) => <article className="check-card" key={`${check.name}-${index}`}>
      <div><strong>{check.name}</strong><p>{check.detail}</p></div>
      <span className={`badge badge-${check.kind}`}>{check.status}</span>
    </article>)}</div> : <p>Readiness has not been checked yet.</p>}
    <details className="technical-details"><summary>Readiness technical details</summary><pre className="mini-output">{text || "Readiness has not been checked yet."}</pre></details>
  </section>;
}

function parseChecks(text: string) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, 18).map((line) => {
    const status = /fail|error|not ready|missing|down/i.test(line) ? "Failed" : /warn|waiting|starting|partial/i.test(line) ? "Warning" : /ok|ready|healthy|running|up|pass|found/i.test(line) ? "Ready" : "Checked";
    return {
      name: line.split(/[:|-]/)[0]?.trim() || "Readiness check",
      detail: line,
      status,
      kind: status === "Ready" || status === "Checked" ? "pass" : status === "Failed" ? "fail" : "warn"
    };
  });
}
