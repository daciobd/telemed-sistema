const token = process.env.TEST_JWT || ""; // cole um JWT válido em TEST_JWT
if (!token) { console.warn("Defina TEST_JWT para validar (export TEST_JWT=...)"); process.exit(0); }
const [hdr, payload] = token.split('.').slice(0,2)
const dec = (s)=> Buffer.from(s.replace(/-/g,'+').replace(/_/g,'/'), 'base64').toString('utf8');
const H = JSON.parse(dec(hdr)), P = JSON.parse(dec(payload));
const now = Math.floor(Date.now()/1000);
const ok = P.exp>now && !!P.sub && !!P.iss && !!P.aud;
console.log({ header:H, payload:P, now, exp_ok:P.exp>now });
if (!ok) process.exit(1);
console.log("✓ JWT fields ok");