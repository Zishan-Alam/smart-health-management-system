import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, Activity } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const DoctorDashboard = () => {
  const quickStats = [
    { label: "Today's Appointments", value: "8", icon: Calendar, color: "text-primary" },
    { label: "Total Patients", value: "142", icon: Users, color: "text-secondary" },
    { label: "Pending Reviews", value: "5", icon: FileText, color: "text-orange-500" },
  ];

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Good Morning, Dr. Smith</h1>
          <p className="text-muted-foreground">You have 8 appointments scheduled for today</p>
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "09:00 AM", patient: "John Doe", type: "General Checkup", status: "Waiting" },
                  { time: "10:30 AM", patient: "Jane Smith", type: "Follow-up", status: "In Progress" },
                  { time: "02:00 PM", patient: "Mike Johnson", type: "Consultation", status: "Scheduled" },
                ].map((appointment, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        appointment.status === 'In Progress' ? 'bg-primary/10 text-primary' :
                        appointment.status === 'Waiting' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-secondary/10 text-secondary'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{appointment.time}</p>
                    <Button size="sm" className="mt-2" variant="outline">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" />
                Recent Consultations
              </CardTitle>
              <CardDescription>Patients requiring follow-up</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { patient: "Sarah Williams", condition: "Hypertension Follow-up", date: "Yesterday" },
                  { patient: "Robert Brown", condition: "Diabetes Management", date: "2 days ago" },
                  { patient: "Emily Davis", condition: "Annual Physical", date: "3 days ago" },
                ].map((record, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{record.patient}</p>
                        <p className="text-sm text-muted-foreground">{record.condition}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        Review
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{record.date}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                View All Patients
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
