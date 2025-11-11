import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Loader2, Phone, Mail } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client-fallback";
import { useAuth } from "@/contexts/AuthContext";

const Patients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, [user]);

  const fetchPatients = async () => {
    if (!user) return;

    try {
      const { data: doctorData } = await supabase
        .from("doctors")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!doctorData) return;

      // Get unique patient IDs from appointments
      const { data: appointmentData } = await supabase
        .from("appointments")
        .select("patient_id")
        .eq("doctor_id", doctorData.id);

      if (!appointmentData) return;

      const patientIds = [...new Set(appointmentData.map(a => a.patient_id))];

      if (patientIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("patients")
        .select(`
          *,
          profiles:user_id (full_name, phone)
        `)
        .in("id", patientIds);

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold">My Patients</h1>
          <p className="text-muted-foreground">View and manage your patient records</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
            <CardDescription>All patients who have appointments with you</CardDescription>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No patients found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {patients.map((patient) => (
                  <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {patient.profiles?.full_name || "Patient"}
                          </CardTitle>
                          <CardDescription>
                            {patient.gender && `${patient.gender} • `}
                            {patient.blood_type && `Blood Type: ${patient.blood_type}`}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {patient.profiles?.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{patient.profiles.phone}</span>
                        </div>
                      )}
                      {patient.date_of_birth && (
                        <div className="text-sm text-muted-foreground">
                          DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                        </div>
                      )}
                      {patient.allergies && (
                        <div className="mt-2 p-2 bg-orange-500/10 rounded text-sm">
                          <strong className="text-orange-600">Allergies:</strong> {patient.allergies}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
