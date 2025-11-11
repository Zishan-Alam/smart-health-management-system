import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client-fallback";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;
    
    try {
      const { data: patientData } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!patientData) return;

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          doctors (
            id,
            specialization,
            profiles:user_id (full_name)
          )
        `)
        .eq("patient_id", patientData.id)
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from("doctors")
        .select(`
          id,
          specialization,
          consultation_fee,
          profiles:user_id (full_name)
        `);

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setBookingLoading(true);
    try {
      const { data: patientData } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (!patientData) throw new Error("Patient profile not found");

      const { error } = await supabase.from("appointments").insert({
        patient_id: patientData.id,
        doctor_id: selectedDoctor,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        reason: reason,
        status: "scheduled",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });

      fetchAppointments();
      setSelectedDoctor("");
      setSelectedDate("");
      setSelectedTime("");
      setReason("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment cancelled",
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Appointments</h1>
            <p className="text-muted-foreground">Manage your medical appointments</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-secondary">
                <Calendar className="mr-2 h-4 w-4" />
                Book New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book an Appointment</DialogTitle>
                <DialogDescription>Choose a doctor and schedule your visit</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Doctor</label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.profiles?.full_name} - {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-md"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Reason for Visit</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe your symptoms or reason for visit"
                  />
                </div>
                <Button
                  onClick={handleBookAppointment}
                  disabled={bookingLoading}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Appointments</CardTitle>
            <CardDescription>View and manage your scheduled appointments</CardDescription>
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
                      <div>
                        <p className="font-semibold text-lg">
                          {appointment.doctors?.profiles?.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.doctors?.specialization}
                        </p>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Cancel Appointment
                      </Button>
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

export default Appointments;
