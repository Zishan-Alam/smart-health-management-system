import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Activity, FileText, Shield, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-medical.jpg";

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Book appointments with real-time doctor availability"
    },
    {
      icon: Activity,
      title: "Health Records",
      description: "Access your complete medical history anytime, anywhere"
    },
    {
      icon: FileText,
      title: "Digital Prescriptions",
      description: "Get and track prescriptions electronically"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data protected with enterprise-grade security"
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Seamless experience for patients, doctors, and admins"
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Streamlined workflows that save time"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navbar */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              HealthHub
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Modern Healthcare
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Experience seamless digital healthcare. Connect patients, doctors, and administrators 
              in one intelligent platform designed for efficiency and care.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8">
                  Book Your Appointment Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
            <img 
              src={heroImage} 
              alt="Modern Healthcare Management" 
              className="relative rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">Everything You Need</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive features designed to modernize healthcare delivery
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Healthcare?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals using HealthHub to deliver better patient care
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8">
              Start Your Journey Today
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Built for Cardiff Met University – SEN6000 Advanced Programming Module</p>
          <p className="mt-2">© 2025 HealthHub. Secure & HIPAA Compliant Healthcare Management.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
