import { useState, useEffect } from "react";
import { Home, Phone, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import GPSTracker from "@/components/GPSTracker";
import { GPSPosition } from "@/hooks/useGPSTracking";

const DementiaUser = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [helpRequested, setHelpRequested] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<GPSPosition | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleHelpRequest = async () => {
    setHelpRequested(true);
    
    // Create SOS alert in database
    if (user && currentLocation) {
      await supabase.from("alerts").insert({
        dementia_user_id: user.id,
        alert_type: "sos",
        severity: "critical",
        message: "SOS: Help requested by user",
        location_lat: currentLocation.latitude,
        location_lng: currentLocation.longitude,
      });
    }
    
    toast({
      title: "Help is on the way",
      description: "Your caregiver has been notified. Stay where you are.",
      duration: 10000,
    });
  };

  const handleLocationUpdate = (position: GPSPosition) => {
    setCurrentLocation(position);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/">
          <Button variant="ghost" size="lg" className="text-2xl px-6 py-8 rounded-2xl">
            <Home className="w-8 h-8" />
          </Button>
        </Link>
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">Hello!</p>
          <p className="text-xl text-muted-foreground">You're doing great</p>
        </div>
        <Button
          variant="ghost"
          size="lg"
          onClick={handleSignOut}
          className="text-2xl px-6 py-8 rounded-2xl"
        >
          <LogOut className="w-8 h-8" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto w-full">
        {/* GPS Tracker */}
        <GPSTracker enabled={trackingEnabled} onLocationUpdate={handleLocationUpdate} />
        {/* Current Route Status */}
        <div className="w-full bg-card rounded-3xl p-8 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-calm flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">Morning Walk</p>
                <p className="text-xl text-muted-foreground">To the park and back</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block px-6 py-3 bg-comfort/20 rounded-full">
                <p className="text-xl font-semibold text-comfort">On Track</p>
              </div>
            </div>
          </div>
        </div>

        {/* Large Help Button */}
        <Button
          onClick={handleHelpRequest}
          disabled={helpRequested}
          className={`w-full h-64 text-4xl font-bold rounded-3xl shadow-soft transition-all duration-300 ${
            helpRequested
              ? "bg-gradient-to-br from-comfort to-accent hover:opacity-90"
              : "bg-gradient-to-br from-help to-secondary hover:opacity-90"
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <Phone className="w-20 h-20" />
            <span>{helpRequested ? "Help is Coming" : "I Need Help"}</span>
          </div>
        </Button>

        {/* Simple Instructions */}
        <div className="w-full bg-accent/10 rounded-3xl p-8">
          <p className="text-2xl text-center text-foreground font-medium">
            {helpRequested
              ? "Stay where you are. Someone will be with you soon."
              : "Keep walking straight. You're doing wonderfully!"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-xl text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
};

export default DementiaUser;
