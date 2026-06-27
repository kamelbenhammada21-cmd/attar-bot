const https = require("https");
const http = require("http");

const API_KEY = "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";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot server is running!");
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(404);
    res.end();
    return;
  }

  let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Length": Buffer.byteLength(body)
      }
    };

    const proxy = https.request(options, (r) => {
      let data = "";
      r.on("data", chunk => { data += chunk; });
      r.on("end", () => {
        res.writeHead(r.statusCode, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        });
        res.end(data);
      });
    });

    proxy.on("error", (err) => {
      res.writeHead(500, { "Access-Control-Allow-Origin": "*" });
      res.end(JSON.stringify({ error: err.message }));
    });

    proxy.write(body);
    proxy.end();
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Server running on port " + PORT));
