
-- Create supplier profiles table
CREATE TABLE public.supplier_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT,
  company_house TEXT,
  address TEXT NOT NULL,
  country TEXT NOT NULL,
  industry TEXT NOT NULL,
  other_industry TEXT,
  certifications TEXT[],
  other_certification TEXT,
  company_size TEXT NOT NULL,
  years_in_business INTEGER NOT NULL,
  turnover_time INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.supplier_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for supplier profiles
CREATE POLICY "Users can view their own supplier profile" 
  ON public.supplier_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own supplier profile" 
  ON public.supplier_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supplier profile" 
  ON public.supplier_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_supplier_profiles_updated_at
  BEFORE UPDATE ON public.supplier_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
