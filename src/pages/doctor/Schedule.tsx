import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, Clock, User } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client-fallback";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Schedule = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data: doctorData } = await supabase
        .from("doctors")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!doctorData) return;

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patients (
            profiles:user_id (full_name, phone)
          )
        `)
        .eq("doctor_id", doctorData.id)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: "scheduled" | "completed" | "cancelled") => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Appointment ${status}`,
      });

      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-primary/10 text-primary";
      case "completed":
        return "bg-secondary/10 text-secondary";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="doctor">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Schedule</h1>
          <p className="text-muted-foreground">Manage your appointments and consultations</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled patient consultations</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {appointment.patients?.profiles?.full_name || "Patient"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.patients?.profiles?.phone}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {appointment.appointment_time}
                      </span>
                    </div>
                    {appointment.reason && (
                      <p className="text-sm mb-3"><strong>Reason:</strong> {appointment.reason}</p>
                    )}
                    {appointment.status === "scheduled" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                          className="bg-secondary"
                        >
                          Mark Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                          className="text-destructive hover:text-destructive"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
