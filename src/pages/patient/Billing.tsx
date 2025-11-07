import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2, Calendar, DollarSign } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Billing = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    fetchBills();
  }, [user]);

  const fetchBills = async () => {
    if (!user) return;

    try {
      const { data: patientData } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!patientData) return;

      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .eq("patient_id", patientData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBills(data || []);

      const pending = data?.filter(b => b.payment_status === "pending")
        .reduce((sum, b) => sum + Number(b.amount), 0) || 0;
      setTotalPending(pending);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-secondary/10 text-secondary";
      case "pending":
        return "bg-orange-500/10 text-orange-500";
      case "overdue":
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
        <div>
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage your medical bills and payment history</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-orange-500" />
                Pending Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">${totalPending.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-secondary" />
                Total Bills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{bills.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All your medical bills and payment records</CardDescription>
          </CardHeader>
          <CardContent>
            {bills.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No bills found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bills.map((bill) => (
                  <div key={bill.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">${Number(bill.amount).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{bill.description || "Medical Service"}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(bill.payment_status)}`}>
                        {bill.payment_status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Issued: {new Date(bill.created_at).toLocaleDateString()}
                      </span>
                      {bill.due_date && (
                        <span className="flex items-center gap-1">
                          Due: {new Date(bill.due_date).toLocaleDateString()}
                        </span>
                      )}
                      {bill.paid_date && (
                        <span className="flex items-center gap-1">
                          Paid: {new Date(bill.paid_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
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

export default Billing;
