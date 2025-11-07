import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatientAppointments from "./pages/patient/Appointments";
import PatientHealthRecords from "./pages/patient/HealthRecords";
import PatientBilling from "./pages/patient/Billing";
import DoctorSchedule from "./pages/doctor/Schedule";
import DoctorPatients from "./pages/doctor/Patients";
import AdminUsers from "./pages/admin/Users";
import AdminBillingManagement from "./pages/admin/BillingManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            {/* Patient Routes */}
            <Route 
              path="/dashboard/patient" 
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/patient/appointments" 
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientAppointments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/patient/records" 
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientHealthRecords />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/patient/billing" 
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientBilling />
                </ProtectedRoute>
              } 
            />
            
            {/* Doctor Routes */}
            <Route 
              path="/dashboard/doctor" 
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/doctor/schedule" 
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorSchedule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/doctor/patients" 
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorPatients />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/users" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/billing" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminBillingManagement />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
