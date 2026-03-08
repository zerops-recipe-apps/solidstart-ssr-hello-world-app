import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

// Root application component — wraps all file-based routes.
// The index route (src/routes/index.ts) handles the health
// check as an API handler, bypassing this component tree.
export default function App() {
  return (
    <Router root={(props) => <Suspense>{props.children}</Suspense>}>
      <FileRoutes />
    </Router>
  );
}
