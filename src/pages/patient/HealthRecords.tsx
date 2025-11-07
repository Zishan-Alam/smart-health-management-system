import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, Calendar, User } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const HealthRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const fetchRecords = async () => {
    if (!user) return;

    try {
      const { data: patientData } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!patientData) return;

      const { data, error } = await supabase
        .from("health_records")
        .select(`
          *,
          doctors (
            specialization,
            profiles:user_id (full_name)
          )
        `)
        .eq("patient_id", patientData.id)
        .order("record_date", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching health records:", error);
    } finally {
      setLoading(false);
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
        <div>
          <h1 className="text-3xl font-bold">Health Records</h1>
          <p className="text-muted-foreground">View your medical history and diagnoses</p>
        </div>

        {records.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No health records found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your medical records will appear here after doctor consultations
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        {record.diagnosis}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <span className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Dr. {record.doctors?.profiles?.full_name} - {record.doctors?.specialization}
                        </span>
                      </CardDescription>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(record.record_date).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {record.symptoms && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Symptoms:</h4>
                      <p className="text-sm text-muted-foreground">{record.symptoms}</p>
                    </div>
                  )}
                  {record.treatment_plan && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Treatment Plan:</h4>
                      <p className="text-sm text-muted-foreground">{record.treatment_plan}</p>
                    </div>
                  )}
                  {record.notes && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Doctor's Notes:</h4>
                      <p className="text-sm text-muted-foreground">{record.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HealthRecords;
