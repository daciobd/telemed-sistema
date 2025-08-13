const fs = require('fs');
const { globSync } = require('glob');

const files = globSync('perf/*-baseline.json');
if (!files.length) {
  console.error('no perf json found in perf/*-baseline.json');
  process.exit(1);
}

const rows = files.map(f => {
  const base = f.replace(/\.json$/, '');
  const r = JSON.parse(fs.readFileSync(f, 'utf8'));
  const a = r.audits;
  return {
    name: base.split('/').pop(),
    html: base.split('/').pop() + '.html',
    score: Math.round((r.categories.performance.score || 0) * 100),
    LCP: Math.round(a['largest-contentful-paint'].numericValue),
    TBT: Math.round(a['total-blocking-time'].numericValue),
    TTI: Math.round(a['interactive'].numericValue),
    TRANS: Math.round(a['total-byte-weight'].numericValue / 1024),
  };
}).sort((x,y)=>x.name.localeCompare(y.name));

const rowsHtml = rows.map(r => `<tr>
  <td>${r.name}</td>
  <td><a href="./${r.html}">${r.html}</a></td>
  <td>${r.score}</td><td>${r.LCP} ms</td><td>${r.TBT} ms</td><td>${r.TTI} ms</td><td>${r.TRANS} KB</td>
</tr>`).join('\n');

const html = `<!doctype html><meta charset="utf-8"><title>Perf Summary</title>
<style>body{font:14px system-ui,sans-serif;margin:16px}table{border-collapse:collapse}td,th{border:1px solid #ddd;padding:6px}th{background:#f5f5f5}</style>
<h1>Perf Summary</h1>
<table>
<thead><tr><th>Page</th><th>Report</th><th>Score</th><th>LCP</th><th>TBT</th><th>TTI</th><th>Transfer</th></tr></thead>
<tbody>${rowsHtml}</tbody>
</table>`;
fs.writeFileSync('perf/index.html', html);
console.log('-> wrote perf/index.html');
