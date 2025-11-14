import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Heart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ComfortPointsMap from "@/components/ComfortPointsMap";

const ComfortMap = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [dementiaUserId, setDementiaUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchDementiaUser = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('caregiving_relationships')
        .select('dementia_user_id')
        .eq('caregiver_id', user.id)
        .limit(1)
        .maybeSingle();

      if (data) {
        setDementiaUserId(data.dementia_user_id);
      }
    };

    fetchDementiaUser();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/caregiver">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Comfort & Stress Map</h1>
                <p className="text-muted-foreground mt-1">
                  Mark emotional landmarks for better navigation
                </p>
              </div>
            </div>
            <Button className="rounded-xl bg-gradient-warm text-foreground hover:opacity-90 shadow-button">
              <MapPin className="w-5 h-5 mr-2" />
              Add Location
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map View */}
          <div className="lg:col-span-2">
            <Card className="p-6 rounded-2xl shadow-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Emotional Landmark Map</h2>
                <div className="flex space-x-2">
                  <Badge className="bg-comfort text-comfort-foreground rounded-full px-4 py-2">
                    Comfort
                  </Badge>
                  <Badge className="bg-stress text-stress-foreground rounded-full px-4 py-2">
                    Stress
                  </Badge>
                </div>
              </div>

              {dementiaUserId ? (
                <div className="rounded-2xl h-[600px] overflow-hidden border-2 border-border">
                  <ComfortPointsMap dementiaUserId={dementiaUserId} className="h-full" />
                </div>
              ) : (
                <div className="bg-muted/30 rounded-2xl h-[600px] flex items-center justify-center border-2 border-border">
                  <div className="text-center space-y-2">
                    <MapPin className="w-16 h-16 text-primary mx-auto" />
                    <p className="text-muted-foreground">No patient assigned</p>
                    <p className="text-sm text-muted-foreground">
                      Connect with a dementia user to manage comfort points
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Points List */}
          <div className="space-y-6">
            {/* Info Card */}
            <Card className="p-6 rounded-2xl shadow-card bg-accent/10 border-accent/30">
              <h3 className="text-lg font-bold text-foreground mb-3">How It Works</h3>
              <p className="text-sm text-muted-foreground">
                Soma uses these emotional landmarks to create routes that naturally guide through
                comforting spaces and avoid stressful areas, reducing confusion and anxiety.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComfortMap;
