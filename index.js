const https = require("https");

const API_KEY = "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";

const server = require("http").createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return; }
  if (req.method !== "POST") { res.writeHead(404); res.end(); return; }

  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", () => {
    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01"
      }
    };

    const proxy = https.request(options, (r) => {
      let data = "";
      r.on("data", chunk => data += chunk);
      r.on("end", () => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
      });
    });

    proxy.on("error", () => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Server error" }));
    });

    proxy.write(body);
    proxy.end();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running on port " + PORT));
