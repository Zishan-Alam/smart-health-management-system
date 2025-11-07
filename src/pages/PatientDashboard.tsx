import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, CreditCard, User, Activity } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const PatientDashboard = () => {
  const quickStats = [
    { label: "Upcoming Appointments", value: "2", icon: Calendar, color: "text-primary" },
    { label: "Active Prescriptions", value: "3", icon: FileText, color: "text-secondary" },
    { label: "Pending Bills", value: "$250", icon: CreditCard, color: "text-orange-500" },
  ];

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back, Patient</h1>
          <p className="text-muted-foreground">Manage your health records and appointments</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
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
              <Button className="w-full mt-4" variant="outline">
                Book New Appointment
              </Button>
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
              <Button className="w-full mt-4" variant="outline">
                View All Records
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
