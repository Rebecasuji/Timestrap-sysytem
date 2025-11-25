import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import LoginPage from "@/pages/LoginPage";
import TrackerPage from "@/pages/TrackerPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/tracker" component={TrackerPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* ⭐ Simple, global beautiful popup system */}
        <Toaster />

        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
