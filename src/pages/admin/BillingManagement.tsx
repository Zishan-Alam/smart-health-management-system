import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Loader2, Calendar } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const BillingManagement = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0 });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const { data, error } = await supabase
        .from("bills")
        .select(`
          *,
          patients (
            profiles:user_id (full_name)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBills(data || []);

      const total = data?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
      const paid = data?.filter(b => b.payment_status === "paid")
        .reduce((sum, b) => sum + Number(b.amount), 0) || 0;
      const pending = data?.filter(b => b.payment_status === "pending")
        .reduce((sum, b) => sum + Number(b.amount), 0) || 0;

      setStats({ total, paid, pending });
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (billId: string) => {
    try {
      const { error } = await supabase
        .from("bills")
        .update({ 
          payment_status: "paid",
          paid_date: new Date().toISOString().split('T')[0]
        })
        .eq("id", billId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bill marked as paid",
      });

      fetchBills();
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
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Billing Management</h1>
          <p className="text-muted-foreground">Manage all system billing and payments</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${stats.total.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">${stats.paid.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-500">${stats.pending.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bills</CardTitle>
            <CardDescription>Complete billing history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">${Number(bill.amount).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          Patient: {bill.patients?.profiles?.full_name || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {bill.description || "Medical Service"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(bill.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(bill.payment_status)}`}>
                      {bill.payment_status}
                    </span>
                    {bill.payment_status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => markAsPaid(bill.id)}
                        className="bg-secondary"
                      >
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BillingManagement;
