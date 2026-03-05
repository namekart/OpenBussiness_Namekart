import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CRMPage from "@/pages/CRMPage";
import ERPPage from "@/pages/ERPPage";
import AIVoicePage from "@/pages/AIVoicePage";
import SettingsPage from "@/pages/SettingsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/crm" component={CRMPage} />
      <Route path="/erp" component={ERPPage} />
      <Route path="/ai-voice" component={AIVoicePage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="openbusiness-theme-v2">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
