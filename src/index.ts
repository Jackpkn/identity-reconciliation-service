import express, { Request, Response } from "express";
import { env } from "./config/env";
const app = express();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(env.PORT, () => {
  console.log(`server is listen on port number http://localhost:${env.PORT}`);
});
console.log("Hello, world!");
