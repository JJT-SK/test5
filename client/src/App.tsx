import { Switch, Route, useLocation } from "wouter";
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
import { useHashLocation } from '@/lib/use-hash-location';

// Create router with hash-based routing for GitHub Pages compatibility
function Router() {
  // Use hash-based routing for GitHub Pages compatibility
  const [location] = useHashLocation();
  const isLandingPage = location === "/auth";
  
  return (
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
