import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Heart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const ComfortMap = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const comfortPoints = [
    { id: 1, name: "Corner Cafe", type: "comfort", description: "Favorite coffee spot" },
    { id: 2, name: "Park Bench", type: "comfort", description: "Peaceful resting place" },
    { id: 3, name: "Neighbor Mary's House", type: "comfort", description: "Trusted friend" },
    { id: 4, name: "Library", type: "comfort", description: "Familiar landmark" },
  ];

  const stressPoints = [
    { id: 1, name: "Busy Intersection", type: "stress", description: "Heavy traffic" },
    { id: 2, name: "Construction Zone", type: "stress", description: "Loud noises" },
  ];

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
                    {comfortPoints.length} Comfort
                  </Badge>
                  <Badge className="bg-stress text-stress-foreground rounded-full px-4 py-2">
                    {stressPoints.length} Stress
                  </Badge>
                </div>
              </div>

              {/* Mock Interactive Map */}
              <div className="bg-muted/30 rounded-2xl h-[600px] flex items-center justify-center border-2 border-border relative overflow-hidden">
                <div className="text-center space-y-2">
                  <MapPin className="w-16 h-16 text-primary mx-auto" />
                  <p className="text-muted-foreground">Interactive comfort map</p>
                  <p className="text-sm text-muted-foreground">
                    Click to add comfort or stress points
                  </p>
                </div>

                {/* Mock Markers */}
                <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-comfort rounded-full flex items-center justify-center shadow-button">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-stress rounded-full flex items-center justify-center shadow-button">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-comfort rounded-full flex items-center justify-center shadow-button">
                  <Heart className="w-4 h-4 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Points List */}
          <div className="space-y-6">
            {/* Comfort Points */}
            <Card className="p-6 rounded-2xl shadow-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-comfort flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Comfort Points</h3>
              </div>
              <div className="space-y-3">
                {comfortPoints.map((point) => (
                  <div
                    key={point.id}
                    className="p-4 rounded-xl bg-comfort/10 border border-comfort/30"
                  >
                    <p className="font-semibold text-foreground">{point.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{point.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stress Points */}
            <Card className="p-6 rounded-2xl shadow-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-stress flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Stress Points</h3>
              </div>
              <div className="space-y-3">
                {stressPoints.map((point) => (
                  <div
                    key={point.id}
                    className="p-4 rounded-xl bg-stress/10 border border-stress/30"
                  >
                    <p className="font-semibold text-foreground">{point.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{point.description}</p>
                  </div>
                ))}
              </div>
            </Card>

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
