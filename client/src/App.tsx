import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUpVerified from "./pages/SignUpVerified";
import Home from "./pages/Home";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminVerificationDashboard from "./pages/AdminVerificationDashboard";
import VerificationStatus from "./pages/VerificationStatus";
import DepartmentManagement from "./pages/DepartmentManagement";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import DepartmentMemberManagement from "./pages/DepartmentMemberManagement";
import OTPTracker from "./pages/OTPTracker";
import VerificationAnalyticsDashboard from "./pages/VerificationAnalyticsDashboard";
import RegistrationStatusDashboard from "./pages/RegistrationStatusDashboard";
import EmailNotificationHistory from "./pages/EmailNotificationHistory";
import EventManagement from "./pages/EventManagement";
import EventDiscovery from "./pages/EventDiscovery";

function Router() {
  return (
    <Switch>
      <Route path={"/?from_webdev=1"} component={Landing} />
      <Route path={"/"} component={Landing} />
      <Route path={"/signin"} component={SignIn} />
      <Route path={"/signup"} component={SignUpVerified} />
      <Route path={"/verify-admin"} component={AdminVerificationDashboard} />
      <Route path={"/verification-status"} component={VerificationStatus} />
      <Route path={"/owner"} component={OwnerDashboard} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/staff"} component={StaffDashboard} />
      <Route path={"/student"} component={StudentDashboard} />
      <Route path={"/departments"} component={DepartmentManagement} />
      <Route path={"/department/:id"} component={DepartmentDashboard} />
      <Route path={"/department/:id/members"} component={DepartmentMemberManagement} />
      <Route path={"/otp-tracker"} component={OTPTracker} />
      <Route path={"/analytics"} component={VerificationAnalyticsDashboard} />
      <Route path={"/status/:id"} component={RegistrationStatusDashboard} />
      <Route path={"/status"} component={RegistrationStatusDashboard} />
      <Route path={"/email-history"} component={EmailNotificationHistory} />
      <Route path={"/events"} component={EventManagement} />
      <Route path={"/discover-events"} component={EventDiscovery} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
