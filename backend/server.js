import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.js";
import { rateLimit } from "./middleware/rateLimit.js";

const app = express();
const PORT = process.env.PORT || 8787;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (no Origin header, e.g. health checks).
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

// Small body limit — this API only ever needs short messages/notes/task lists.
app.use(express.json({ limit: "100kb" }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    configured: Boolean(process.env.OPENROUTER_API_KEY),
  });
});

app.use("/api/ai", rateLimit, aiRoutes);

// 404 for anything else under /api
app.use("/api", (req, res) => {
  res.status(404).json({ error: { message: "Not found.", code: "not_found" } });
});

// Central error handler — never leak stack traces or internals to the client.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err?.message === "Not allowed by CORS") {
    return res
      .status(403)
      .json({
        error: { message: "This origin is not allowed.", code: "cors_denied" },
      });
  }
  console.error("[Nexa server error]", err);
  res
    .status(500)
    .json({
      error: {
        message: "Something went wrong on Nexa's server.",
        code: "internal_error",
      },
    });
});

if (!process.env.OPENROUTER_API_KEY) {
  console.warn(
    "\u26a0\ufe0f  OPENROUTER_API_KEY is not set. AI endpoints will return a 'not configured' error until it's added to backend/.env",
  );
}

app.listen(PORT, () => {
  console.log(`Nexa backend listening on http://localhost:${PORT}`);
});
