import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Search from "@/pages/search";
import Discover from "@/pages/discover";
import Spaces from "@/pages/spaces";
import Library from "@/pages/library";
import Category from "@/pages/category";
import ChatThread from "@/pages/chat-thread";
import ChatHistory from "@/pages/chat-history";
import Login from "@/pages/login";
import Signup from "@/pages/signup";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/search" component={Search} />
          <Route path="/chat/:id" component={ChatThread} />
          <Route path="/chat/history" component={ChatHistory} />

          <Route path="/discover" component={Discover} />
          <Route path="/spaces" component={Spaces} />
          <Route path="/:category" component={Category} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/chat/:id" component={ChatThread} />
          <Route path="/chat/history" component={ChatHistory} />

          <Route path="/discover" component={Discover} />
          <Route path="/spaces" component={Spaces} />
          <Route path="/library" component={Library} />
          <Route path="/:category" component={Category} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;