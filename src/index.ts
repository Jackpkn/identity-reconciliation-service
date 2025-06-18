import { createServer } from "http";
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hi there!");
});

server.listen(3000, () => {
  console.log(`server is listen on port number http://localhost:${3000}`);
});
console.log("Hello, world!");
