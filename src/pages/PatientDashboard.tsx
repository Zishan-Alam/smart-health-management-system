import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, CreditCard, Activity, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client-fallback";
import { useAuth } from "@/contexts/AuthContext";

const PatientDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ appointments: 0, records: 0, bills: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      const { data: patientData } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!patientData) return;

      const [appointmentsRes, recordsRes, billsRes] = await Promise.all([
        supabase.from("appointments").select("id", { count: "exact" }).eq("patient_id", patientData.id).eq("status", "scheduled"),
        supabase.from("health_records").select("id", { count: "exact" }).eq("patient_id", patientData.id),
        supabase.from("bills").select("amount").eq("patient_id", patientData.id).eq("payment_status", "pending"),
      ]);

      const totalBills = billsRes.data?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;

      setStats({
        appointments: appointmentsRes.count || 0,
        records: recordsRes.count || 0,
        bills: totalBills,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    { label: "Upcoming Appointments", value: stats.appointments.toString(), icon: Calendar, color: "text-primary", link: "/dashboard/patient/appointments" },
    { label: "Health Records", value: stats.records.toString(), icon: FileText, color: "text-secondary", link: "/dashboard/patient/records" },
    { label: "Pending Bills", value: `$${stats.bills.toFixed(2)}`, icon: CreditCard, color: "text-orange-500", link: "/dashboard/patient/billing" },
  ];

  if (loading) {
    return (
      <DashboardLayout role="patient">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back, {profile?.full_name}</h1>
          <p className="text-muted-foreground">Manage your health records and appointments</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => (
            <Link key={index} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Content Tabs */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Dr. Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">General Checkup</p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Confirmed</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Dr. Michael Chen</p>
                      <p className="text-sm text-muted-foreground">Follow-up Consultation</p>
                    </div>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">Scheduled</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Next Week, 2:30 PM</p>
                </div>
              </div>
              <Link to="/dashboard/patient/appointments">
                <Button className="w-full mt-4" variant="outline">
                  Book New Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" />
                Recent Health Records
              </CardTitle>
              <CardDescription>Your medical history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Blood Test Results</p>
                      <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
                    </div>
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">X-Ray Report</p>
                      <p className="text-sm text-muted-foreground">Dr. Michael Chen</p>
                    </div>
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>
              <Link to="/dashboard/patient/records">
                <Button className="w-full mt-4" variant="outline">
                  View All Records
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
