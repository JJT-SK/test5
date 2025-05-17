import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Community from "@/pages/community";
import Protocols from "@/pages/protocols";
import Achievements from "@/pages/achievements";
import DataAnalysis from "@/pages/data-analysis";

// Determine the base path from the import.meta.env (vite) or use the GitHub Pages path
const basePath = "/test2"; // Use the exact GitHub repository name

// Create router with hash-based routing for GitHub Pages compatibility
function Router() {
  const [location] = useLocation();
  const isLandingPage = location === "/auth";
  
  return (
    <WouterRouter base={basePath}>
      <div className="min-h-screen flex flex-col">
        {!isLandingPage && <Navbar />}
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/auth" component={Landing} />
            <Route path="/community" component={Community} />
            <Route path="/protocols" component={Protocols} />
            <Route path="/achievements" component={Achievements} />
            <Route path="/data-analysis" component={DataAnalysis} />
            <Route component={NotFound} />
          </Switch>
        </main>
        {!isLandingPage && <Footer />}
      </div>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
