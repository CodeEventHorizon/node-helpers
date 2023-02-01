import express from "express";
import mongoose from "mongoose";
// Cors?
import { readdirSync } from "fs";
import * as dotenv from "dotenv";
import http from "http";
dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Database
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`MongoDB connected at ${process.env.MONGO_URI}`))
  .catch((err) => console.log(`MongoDB Connection Error: ${err}`));

// Middlewares
app.use(express.urlencoded({ extended: true }));

// Automatically load routes
await Promise.all(
  readdirSync("./routes").map(async (r) => {
    const route = await import(`./routes/${r}`);
    app.use("/api", route.default);
  })
);

// Server
const port = process.env.PORT || 4000;
httpServer.listen(port, () => console.log(`Server started on port ${port}`));
