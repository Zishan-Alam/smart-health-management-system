-- Fix security warning: Set search_path for handle_new_user function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix security warning: Set search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;