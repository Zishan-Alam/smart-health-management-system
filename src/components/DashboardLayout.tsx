import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, FileText, Users, Settings, LogOut, LayoutDashboard, CreditCard, Stethoscope, BarChart3 } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "patient" | "doctor" | "admin";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const location = useLocation();
  
  const patientNav = [
    { name: "Dashboard", path: "/dashboard/patient", icon: LayoutDashboard },
    { name: "Appointments", path: "/dashboard/patient/appointments", icon: Calendar },
    { name: "Health Records", path: "/dashboard/patient/records", icon: FileText },
    { name: "Billing", path: "/dashboard/patient/billing", icon: CreditCard },
    { name: "Settings", path: "/dashboard/patient/settings", icon: Settings },
  ];

  const doctorNav = [
    { name: "Dashboard", path: "/dashboard/doctor", icon: LayoutDashboard },
    { name: "Schedule", path: "/dashboard/doctor/schedule", icon: Calendar },
    { name: "Patients", path: "/dashboard/doctor/patients", icon: Users },
    { name: "Consultations", path: "/dashboard/doctor/consultations", icon: Stethoscope },
    { name: "Settings", path: "/dashboard/doctor/settings", icon: Settings },
  ];

  const adminNav = [
    { name: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", path: "/dashboard/admin/users", icon: Users },
    { name: "Analytics", path: "/dashboard/admin/analytics", icon: BarChart3 },
    { name: "Billing", path: "/dashboard/admin/billing", icon: CreditCard },
    { name: "Settings", path: "/dashboard/admin/settings", icon: Settings },
  ];

  const navigation = role === "patient" ? patientNav : role === "doctor" ? doctorNav : adminNav;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-6 hidden lg:block">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            HealthHub
          </span>
        </Link>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive ? "bg-gradient-to-r from-primary to-secondary" : ""
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-border/50">
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  HealthHub
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-muted-foreground hidden md:block">
                {role.charAt(0).toUpperCase() + role.slice(1)} Portal
              </span>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-semibold">
                {role.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
