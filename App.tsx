import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import AdminDashboard from "@/pages/admin-dashboard";
import BrokerDashboard from "@/pages/broker-dashboard";
import CreateListing from "@/pages/create-listing";
import PropertyDetails from "@/pages/property-details";
import RoleSelection from "@/pages/role-selection";

function Router() {
  const { isAuthenticated, isLoading, user, error } = useAuth();

  // Log authentication state for debugging
  console.log('Router auth state:', { 
    isAuthenticated, 
    isLoading, 
    user: user ? { 
      id: (user as any)?.id, 
      email: (user as any)?.email,
      role: (user as any)?.role,
      phoneNumber: (user as any)?.phoneNumber,
      reraId: (user as any)?.reraId 
    } : null,
    error 
  });

  // Check if user needs to complete profile setup
  const needsRoleSelection = isAuthenticated && user && (
    !(user as any).role || 
    !(user as any).phoneNumber || 
    ((user as any).role === 'broker' && !(user as any).reraId)
  );

  console.log('Needs role selection:', needsRoleSelection);

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : needsRoleSelection ? (
        <>
          <Route path="/" component={RoleSelection} />
          <Route path="/role-selection" component={RoleSelection} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/broker-dashboard" component={BrokerDashboard} />
          <Route path="/create-listing" component={CreateListing} />
          <Route path="/property/:id" component={PropertyDetails} />
          <Route path="/role-selection" component={RoleSelection} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
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
