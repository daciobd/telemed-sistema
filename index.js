-1
+1
module.exports = (req, res) => {
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  
-1
+1
</html>`;
  res.status(200).send(html);
};
}
