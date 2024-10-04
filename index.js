import express from 'express';
import promClient from 'prom-client';


const app = express();
const port = 3002;

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

const requestCounter = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "status_code"],
});

app.get("/", (req, res) => {
  requestCounter.inc({ method: req.method, status_code: res.statusCode });
  res.send("Hello World!");
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});