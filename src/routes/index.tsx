import { createAsync, cache } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import pool from "~/lib/db.server";
import { Show } from "solid-js";

// BUILD_TIME is injected by vinxi/vite at build time via define
declare const __SOLID_START_VERSION__: string;
declare const __BUILD_TIME__: string;

type HealthData = {
  greeting: string;
  dbStatus: string;
  dbOk: boolean;
  framework: string;
  frameworkVersion: string;
  environment: string;
  buildTime: string;
  httpStatus: number;
};

const getHealthData = cache(async (): Promise<HealthData> => {
  "use server";

  const framework = "SolidStart";
  const frameworkVersion = __SOLID_START_VERSION__;
  const environment = process.env.NODE_ENV || "production";
  const buildTime = __BUILD_TIME__;

  let greeting = "Hello from Zerops!";
  let dbStatus = "connected";
  let dbOk = true;
  let httpStatus = 200;

  try {
    const result = await pool.query(
      "SELECT message FROM greetings LIMIT 1"
    );
    if (result.rows.length > 0) {
      greeting = result.rows[0].message;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    dbStatus = `ERROR: ${msg}`;
    dbOk = false;
    httpStatus = 503;
  }

  // Set HTTP status on the response for the 503 case
  const event = getRequestEvent();
  if (event && httpStatus !== 200) {
    event.response.status = httpStatus;
  }

  return {
    greeting,
    dbStatus,
    dbOk,
    framework,
    frameworkVersion,
    environment,
    buildTime,
    httpStatus,
  };
}, "health");

export const route = {
  load: () => getHealthData(),
};

export default function Home() {
  const data = createAsync(() => getHealthData());

  return (
    <Show when={data()} fallback={<div>Loading...</div>}>
      {(d) => {
        const h = d();
        return (
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>SolidStart · Zerops</title>
              <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  background: #0f1117;
                  color: #e2e8f0;
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 2rem;
                }
                .card {
                  background: #1a1d27;
                  border: 1px solid #2d3148;
                  border-radius: 16px;
                  padding: 2.5rem;
                  max-width: 540px;
                  width: 100%;
                  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                }
                .logos {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 1.25rem;
                  margin-bottom: 1.75rem;
                }
                .logo-separator {
                  color: #4a5568;
                  font-size: 1.5rem;
                  font-weight: 300;
                }
                h1 {
                  font-size: 1.6rem;
                  font-weight: 700;
                  text-align: center;
                  margin-bottom: 0.5rem;
                  background: linear-gradient(135deg, #2f86d1 0%, #7c3aed 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                }
                .subtitle {
                  text-align: center;
                  color: #718096;
                  font-size: 0.85rem;
                  margin-bottom: 2rem;
                }
                .details {
                  border: 1px solid #2d3148;
                  border-radius: 10px;
                  overflow: hidden;
                }
                .row {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 0.75rem 1rem;
                  border-bottom: 1px solid #2d3148;
                  font-size: 0.875rem;
                }
                .row:last-child { border-bottom: none; }
                .label { color: #718096; }
                .value { color: #e2e8f0; font-weight: 500; text-align: right; max-width: 60%; word-break: break-word; }
                .badge {
                  display: inline-block;
                  padding: 0.2rem 0.65rem;
                  border-radius: 9999px;
                  font-size: 0.75rem;
                  font-weight: 600;
                }
                .ok { background: rgba(16,185,129,0.15); color: #10b981; }
                .err { background: rgba(239,68,68,0.15); color: #ef4444; }
              `}</style>
            </head>
            <body>
              <div class="card">
                <div class="logos">
                  {/* SolidStart logo */}
                  <svg width="40" height="40" viewBox="0 0 166 155.3" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="solid-a" x1="100%" x2="50%" y1="0%" y2="100%">
                        <stop offset="0%" stop-color="#76B3E1"/>
                        <stop offset="30.8%" stop-color="#DCF2FD"/>
                        <stop offset="100%" stop-color="#76B3E1"/>
                      </linearGradient>
                      <linearGradient id="solid-b" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stop-color="#76B3E1"/>
                        <stop offset="31.6%" stop-color="#DCF2FD"/>
                        <stop offset="100%" stop-color="#76B3E1"/>
                      </linearGradient>
                      <linearGradient id="solid-c" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stop-color="#0e60a4"/>
                        <stop offset="100%" stop-color="#0e60a4" stop-opacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 24 10 37 7l4-1 72 30 7-50Z" fill="url(#solid-a)"/>
                    <path d="M159 86S106 46 65 55l-3 1-15 26 26 5c11 7 24 10 37 7l4-1 45 18 7-50Z" fill="url(#solid-b)" opacity=".4"/>
                    <path d="M73 5S10 23 2 81l-2 32 8 40 43 2 3-1c14-4 26-13 33-25l3-6 14-47-15-7c-7-5-12-12-14-20l-1-4-1-41Z" fill="url(#solid-c)"/>
                    <path d="M166 92l-7-6c-21-18-50-26-77-20l-3 1-43-9C22 65 12 79 8 95L0 152l158 3 8-63Z" fill="#0e60a4"/>
                    <path d="M2 81C-4 144 57 158 96 157l70 2-2-10S77 165 60 97L56 84c-8-30-21-56-51-52L3 34 2 81Z" fill="#0e60a4"/>
                  </svg>
                  <span class="logo-separator">×</span>
                  {/* Zerops logomark */}
                  <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" rx="18" fill="#0e60a4"/>
                    <path d="M20 72L52 28H20V20H80V28L48 72H80V80H20V72Z" fill="white"/>
                  </svg>
                </div>

                <h1>{h.greeting}</h1>
                <p class="subtitle">SolidStart running on Zerops SSR – Node.js at runtime.</p>

                <div class="details">
                  <div class="row">
                    <span class="label">Framework</span>
                    <span class="value">{h.framework} {h.frameworkVersion}</span>
                  </div>
                  <div class="row">
                    <span class="label">Environment</span>
                    <span class="value">{h.environment}</span>
                  </div>
                  <div class="row">
                    <span class="label">Build time</span>
                    <span class="value">{h.buildTime}</span>
                  </div>
                  <div class="row">
                    <span class="label">Database</span>
                    <span class="value">
                      {h.dbOk
                        ? <span class="badge ok">✓ {h.dbStatus}</span>
                        : <span class="badge err">✗ {h.dbStatus}</span>
                      }
                    </span>
                  </div>
                </div>
              </div>
            </body>
          </html>
        );
      }}
    </Show>
  );
}
