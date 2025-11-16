import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Heart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ComfortPointsMap from "@/components/ComfortPointsMap";
import AddComfortPointDialog from "@/components/AddComfortPointDialog";

const ComfortMap = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [dementiaUserId, setDementiaUserId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lng: number; lat: number } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const handleMapClick = (lngLat: { lng: number; lat: number }) => {
    setSelectedCoords(lngLat);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

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
            <Button 
              className="rounded-xl bg-gradient-warm text-foreground hover:opacity-90 shadow-button"
              disabled={!dementiaUserId}
              onClick={() => setDialogOpen(true)}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Add Location (Click Map)
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* No Patient Warning */}
        {!dementiaUserId && (
          <Card className="mb-8 p-8 rounded-2xl shadow-card border-2 border-amber-500/50 bg-amber-500/5">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">No Patient Connected</h3>
                <p className="text-muted-foreground mb-4">
                  To mark comfort and stress points, you need to establish a caregiving relationship with a dementia user first. 
                  These emotional landmarks help create better navigation routes for your patient.
                </p>
                <div className="bg-card/50 rounded-xl p-4 border border-border">
                  <p className="text-sm font-semibold text-foreground mb-2">How to connect with a patient:</p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Have the dementia user create an account</li>
                    <li>They will share their User ID with you</li>
                    <li>You can then establish a caregiving relationship</li>
                  </ol>
                </div>
              </div>
            </div>
          </Card>
        )}

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
                  <ComfortPointsMap 
                    key={refreshKey}
                    dementiaUserId={dementiaUserId} 
                    onPointClick={handleMapClick}
                    className="h-full" 
                  />
                </div>
              ) : (
                <div className="bg-muted/30 rounded-2xl h-[600px] flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-semibold text-foreground">Map Unavailable</p>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Connect with a patient to mark comfort and stress points
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

      {dementiaUserId && (
        <AddComfortPointDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          coordinates={selectedCoords}
          dementiaUserId={dementiaUserId}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ComfortMap;
