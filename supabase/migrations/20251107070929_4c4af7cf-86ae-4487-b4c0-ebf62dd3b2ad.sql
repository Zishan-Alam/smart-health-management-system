-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('patient', 'doctor', 'admin');

-- Create enum for appointment status
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'overdue');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create patients table (additional patient-specific info)
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender TEXT,
  blood_type TEXT,
  address TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  medical_history TEXT,
  allergies TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create doctors table (doctor-specific info)
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialization TEXT NOT NULL,
  license_number TEXT NOT NULL,
  years_of_experience INTEGER,
  consultation_fee DECIMAL(10, 2),
  available_days TEXT[], -- Array of days like ['Monday', 'Tuesday']
  available_hours TEXT, -- e.g., '9:00 AM - 5:00 PM'
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(license_number)
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create health_records table (EHR)
CREATE TABLE public.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  diagnosis TEXT NOT NULL,
  symptoms TEXT,
  treatment_plan TEXT,
  notes TEXT,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  health_record_id UUID NOT NULL REFERENCES public.health_records(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT NOT NULL,
  instructions TEXT,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create bills table
CREATE TABLE public.bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for patients
CREATE POLICY "Patients can view their own data"
  ON public.patients FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Patients can update their own data"
  ON public.patients FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Doctors and admins can view all patients"
  ON public.patients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('doctor', 'admin')
    )
  );

-- RLS Policies for doctors
CREATE POLICY "Everyone can view doctors"
  ON public.doctors FOR SELECT
  USING (true);

CREATE POLICY "Doctors can update their own data"
  ON public.doctors FOR UPDATE
  USING (user_id = auth.uid());

-- RLS Policies for appointments
CREATE POLICY "Patients can view their own appointments"
  ON public.appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = appointments.patient_id AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view their appointments"
  ON public.appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.doctors
      WHERE doctors.id = appointments.doctor_id AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = appointments.patient_id AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can update their own appointments"
  ON public.appointments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = appointments.patient_id AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their appointments"
  ON public.appointments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.doctors
      WHERE doctors.id = appointments.doctor_id AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all appointments"
  ON public.appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for health_records
CREATE POLICY "Patients can view their own health records"
  ON public.health_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = health_records.patient_id AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view and manage health records"
  ON public.health_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.doctors
      WHERE doctors.id = health_records.doctor_id AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can create health records"
  ON public.health_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.doctors
      WHERE doctors.id = health_records.doctor_id AND doctors.user_id = auth.uid()
    )
  );

-- RLS Policies for prescriptions
CREATE POLICY "Patients can view their prescriptions"
  ON public.prescriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = prescriptions.patient_id AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage their prescriptions"
  ON public.prescriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.doctors
      WHERE doctors.id = prescriptions.doctor_id AND doctors.user_id = auth.uid()
    )
  );

-- RLS Policies for bills
CREATE POLICY "Patients can view their bills"
  ON public.bills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = bills.patient_id AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all bills"
  ON public.bills FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- If the user is a patient, create a patient record
  IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient') = 'patient' THEN
    INSERT INTO public.patients (user_id)
    VALUES (NEW.id);
  END IF;
  
  -- If the user is a doctor, create a doctor record
  IF (NEW.raw_user_meta_data->>'role')::user_role = 'doctor' THEN
    INSERT INTO public.doctors (user_id, specialization, license_number)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'specialization', 'General Practice'),
      COALESCE(NEW.raw_user_meta_data->>'license_number', 'PENDING')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_records_updated_at
  BEFORE UPDATE ON public.health_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bills_updated_at
  BEFORE UPDATE ON public.bills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_health_records_patient_id ON public.health_records(patient_id);
CREATE INDEX idx_prescriptions_patient_id ON public.prescriptions(patient_id);
CREATE INDEX idx_bills_patient_id ON public.bills(patient_id);
CREATE INDEX idx_bills_payment_status ON public.bills(payment_status);