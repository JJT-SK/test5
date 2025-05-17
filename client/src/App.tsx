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
import SignIn from "@/pages/signin";
import Community from "@/pages/community";
import Protocols from "@/pages/protocols";
import Achievements from "@/pages/achievements";
import DataAnalysis from "@/pages/data-analysis";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/protected-route";

// Determine the base path from the import.meta.env (vite) or use an empty string
const basePath = typeof import.meta.env.BASE_URL === 'string' 
  ? import.meta.env.BASE_URL.replace(/\/$/, '')
  : '';

// Create router with hash-based routing for GitHub Pages compatibility
function Router() {
  const [location] = useLocation();
  const isLandingPage = location === "/auth";
  const isSignInPage = location === "/signin";
  
  return (
    <WouterRouter base={basePath}>
      <div className="min-h-screen flex flex-col">
        {!isLandingPage && !isSignInPage && <Navbar />}
        <main className="flex-1">
          <Switch>
            <Route path="/auth" component={Landing} />
            <Route path="/signin" component={SignIn} />
            <ProtectedRoute path="/" component={Home} />
            <ProtectedRoute path="/community" component={Community} />
            <ProtectedRoute path="/protocols" component={Protocols} />
            <ProtectedRoute path="/achievements" component={Achievements} />
            <ProtectedRoute path="/data-analysis" component={DataAnalysis} />
            <Route component={NotFound} />
          </Switch>
        </main>
        {!isLandingPage && !isSignInPage && <Footer />}
      </div>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
