-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('caregiver', 'dementia_user');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'caregiver', 'dementia_user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  user_type public.user_type NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table (security requirement - separate from profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Create caregiving_relationships table
CREATE TABLE public.caregiving_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  dementia_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  relationship_type TEXT,
  emergency_contact BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(caregiver_id, dementia_user_id)
);

-- Create safe_routes table
CREATE TABLE public.safe_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dementia_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  path_data JSONB NOT NULL, -- GeoJSON format
  distance_meters NUMERIC,
  estimated_duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create location_points table (comfort/stress markers)
CREATE TABLE public.location_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES public.safe_routes(id) ON DELETE CASCADE,
  dementia_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  point_type TEXT NOT NULL CHECK (point_type IN ('comfort', 'stress')),
  name TEXT NOT NULL,
  description TEXT,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create location_tracking table (GPS tracking)
CREATE TABLE public.location_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  accuracy NUMERIC,
  heading NUMERIC,
  speed NUMERIC,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  route_id UUID REFERENCES public.safe_routes(id),
  is_on_route BOOLEAN DEFAULT TRUE,
  deviation_meters NUMERIC
);

-- Create buddy_watch table
CREATE TABLE public.buddy_watch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dementia_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relation TEXT,
  address TEXT,
  phone TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dementia_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('deviation', 'stop', 'sos', 'wander_risk', 'buddy_watch')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  location_lat NUMERIC,
  location_lng NUMERIC,
  route_id UUID REFERENCES public.safe_routes(id),
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiving_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_watch ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is caregiver for dementia user
CREATE OR REPLACE FUNCTION public.is_caregiver_for(_caregiver_id UUID, _dementia_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.caregiving_relationships
    WHERE caregiver_id = _caregiver_id AND dementia_user_id = _dementia_user_id
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Caregivers can view their patients profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.caregiving_relationships
      WHERE caregiver_id = auth.uid() AND dementia_user_id = profiles.id
    )
  );

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for caregiving_relationships
CREATE POLICY "Caregivers can view their relationships"
  ON public.caregiving_relationships FOR SELECT
  USING (auth.uid() = caregiver_id OR auth.uid() = dementia_user_id);

CREATE POLICY "Caregivers can insert relationships"
  ON public.caregiving_relationships FOR INSERT
  WITH CHECK (auth.uid() = caregiver_id);

CREATE POLICY "Caregivers can update their relationships"
  ON public.caregiving_relationships FOR UPDATE
  USING (auth.uid() = caregiver_id);

CREATE POLICY "Caregivers can delete their relationships"
  ON public.caregiving_relationships FOR DELETE
  USING (auth.uid() = caregiver_id);

-- RLS Policies for safe_routes
CREATE POLICY "Caregivers can view routes for their patients"
  ON public.safe_routes FOR SELECT
  USING (
    auth.uid() = dementia_user_id OR
    public.is_caregiver_for(auth.uid(), dementia_user_id)
  );

CREATE POLICY "Caregivers can create routes"
  ON public.safe_routes FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    public.is_caregiver_for(auth.uid(), dementia_user_id)
  );

CREATE POLICY "Caregivers can update routes"
  ON public.safe_routes FOR UPDATE
  USING (public.is_caregiver_for(auth.uid(), dementia_user_id));

CREATE POLICY "Caregivers can delete routes"
  ON public.safe_routes FOR DELETE
  USING (public.is_caregiver_for(auth.uid(), dementia_user_id));

-- RLS Policies for location_points
CREATE POLICY "Users can view location points"
  ON public.location_points FOR SELECT
  USING (
    auth.uid() = dementia_user_id OR
    public.is_caregiver_for(auth.uid(), dementia_user_id)
  );

CREATE POLICY "Caregivers can manage location points"
  ON public.location_points FOR ALL
  USING (public.is_caregiver_for(auth.uid(), dementia_user_id));

-- RLS Policies for location_tracking
CREATE POLICY "Users can view own location tracking"
  ON public.location_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own location"
  ON public.location_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Caregivers can view patient location"
  ON public.location_tracking FOR SELECT
  USING (public.is_caregiver_for(auth.uid(), user_id));

-- RLS Policies for buddy_watch
CREATE POLICY "Users can view buddy watch"
  ON public.buddy_watch FOR SELECT
  USING (
    auth.uid() = dementia_user_id OR
    public.is_caregiver_for(auth.uid(), dementia_user_id)
  );

CREATE POLICY "Caregivers can manage buddy watch"
  ON public.buddy_watch FOR ALL
  USING (public.is_caregiver_for(auth.uid(), dementia_user_id));

-- RLS Policies for alerts
CREATE POLICY "Users can view related alerts"
  ON public.alerts FOR SELECT
  USING (
    auth.uid() = dementia_user_id OR
    public.is_caregiver_for(auth.uid(), dementia_user_id)
  );

CREATE POLICY "System can create alerts"
  ON public.alerts FOR INSERT
  WITH CHECK (auth.uid() = dementia_user_id);

CREATE POLICY "Caregivers can resolve alerts"
  ON public.alerts FOR UPDATE
  USING (public.is_caregiver_for(auth.uid(), dementia_user_id));

-- Create trigger function for updated_at
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

CREATE TRIGGER update_safe_routes_updated_at
  BEFORE UPDATE ON public.safe_routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'user_type')::public.user_type, 'caregiver')
  );
  
  -- Assign role based on user_type
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'user_type')::public.app_role, 'caregiver')
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();