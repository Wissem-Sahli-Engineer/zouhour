import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function adminAuthPlugin() {
  const adminFilePath = path.resolve(__dirname, "admin.json");

  function readUsers() {
    try {
      if (!fs.existsSync(adminFilePath)) return [];
      const content = fs.readFileSync(adminFilePath, "utf-8").trim();
      if (!content) return [];
      const data = JSON.parse(content);
      if (Array.isArray(data)) return data;
      if (typeof data === "object" && data !== null) {
        return [
          {
            name: data.name || data.email?.split("@")[0] || "Admin",
            role: data.role || "Admin",
            ...data,
          },
        ];
      }
      return [];
    } catch (err) {
      console.error("[adminAuthPlugin] Error reading admin.json:", err);
      return [];
    }
  }

  function writeUsers(users) {
    fs.writeFileSync(adminFilePath, JSON.stringify(users, null, 2) + "\n", "utf-8");
  }

  const handleAuth = (req, res, next) => {
    const url = req.url?.split("?")[0];

    // Login endpoint - verifies credentials against admin.json
    if (req.method === "POST" && (url === "/api/auth/login" || url === "/api/login")) {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const { email, password } = JSON.parse(body || "{}");
          const users = readUsers();
          const cleanEmail = (email || "").trim().toLowerCase();
          const cleanPass = String(password || "");

          const found = users.find(
            (u) =>
              (u.email || "").trim().toLowerCase() === cleanEmail &&
              String(u.password || "") === cleanPass
          );

          res.setHeader("Content-Type", "application/json");
          if (found) {
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                ok: true,
                user: {
                  name: found.name || found.email?.split("@")[0] || "Admin",
                  email: found.email,
                  role: found.role || "Agent",
                },
              })
            );
          } else {
            res.statusCode = 401;
            res.end(
              JSON.stringify({
                ok: false,
                error: "Invalid email or password",
              })
            );
          }
        } catch (e) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: e.message }));
        }
      });
      return;
    }

    // Signup endpoint - appends new credentials to admin.json
    if (
      req.method === "POST" &&
      (url === "/api/auth/signup" || url === "/api/signup" || url === "/api/signup-request")
    ) {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const { name, email, password, role } = JSON.parse(body || "{}");
          const cleanEmail = (email || "").trim().toLowerCase();
          const cleanPass = String(password || "");

          if (!cleanEmail || !cleanPass) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            return res.end(
              JSON.stringify({ ok: false, error: "Email and password are required" })
            );
          }

          const users = readUsers();
          const exists = users.some(
            (u) => (u.email || "").trim().toLowerCase() === cleanEmail
          );

          if (exists) {
            res.statusCode = 409;
            res.setHeader("Content-Type", "application/json");
            return res.end(
              JSON.stringify({ ok: false, error: "An account with this email already exists in admin.json" })
            );
          }

          const newUser = {
            name: (name || "").trim() || cleanEmail.split("@")[0],
            email: cleanEmail,
            password: cleanPass,
            role: (role || "").trim() || "Agent",
          };

          users.push(newUser);
          writeUsers(users);

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              ok: true,
              user: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
              },
            })
          );
        } catch (e) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: e.message }));
        }
      });
      return;
    }

    next();
  };

  return {
    name: "vite-plugin-admin-auth",
    configureServer(server) {
      server.middlewares.use(handleAuth);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleAuth);
    },
  };
}

export default defineConfig({
  plugins: [react(), adminAuthPlugin()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
