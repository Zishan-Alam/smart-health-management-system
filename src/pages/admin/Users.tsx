import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Loader2, UserCircle, Stethoscope, Shield } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

const UsersPage = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ patients: 0, doctors: 0, admins: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProfiles(data || []);

      const patients = data?.filter(p => p.role === "patient").length || 0;
      const doctors = data?.filter(p => p.role === "doctor").length || 0;
      const admins = data?.filter(p => p.role === "admin").length || 0;
      setStats({ patients, doctors, admins });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "doctor":
        return <Stethoscope className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      default:
        return <UserCircle className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-primary/10 text-primary";
      case "admin":
        return "bg-secondary/10 text-secondary";
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
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all system users</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.patients}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.doctors}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.admins}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>System-wide user directory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{profile.full_name}</p>
                      <p className="text-sm text-muted-foreground">{profile.phone || "No phone"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${getRoleColor(profile.role)}`}>
                      {getRoleIcon(profile.role)}
                      {profile.role}
                    </span>
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

export default UsersPage;
