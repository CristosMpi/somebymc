import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Map, Clock, CheckCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import RoutesMap from "@/components/RoutesMap";
import CreateRouteDialog from "@/components/CreateRouteDialog";
import SendConnectionRequest from "@/components/SendConnectionRequest";

interface RouteData {
  id: string;
  name: string;
  description: string | null;
  distance_meters: number | null;
  estimated_duration_minutes: number | null;
  is_active: boolean | null;
  path_data: any;
}

const CaregiverRoutes = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [dementiaUserId, setDementiaUserId] = useState<string | null>(null);
  const [createRouteOpen, setCreateRouteOpen] = useState(false);
  const [connectionRequestOpen, setConnectionRequestOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

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
        .eq('status', 'approved')
        .limit(1)
        .maybeSingle();

      if (data) {
        setDementiaUserId(data.dementia_user_id);
      }
    };

    fetchDementiaUser();
  }, [user, refreshKey]);

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!dementiaUserId) return;

      try {
        const { data, error } = await supabase
          .from('safe_routes')
          .select('id, name, description, distance_meters, estimated_duration_minutes, is_active, path_data')
          .eq('dementia_user_id', dementiaUserId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setRoutes(data);
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoadingRoutes(false);
      }
    };

    fetchRoutes();
  }, [dementiaUserId, refreshKey]);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const toggleRouteActive = async (routeId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('safe_routes')
        .update({ is_active: !currentActive })
        .eq('id', routeId);

      if (error) throw error;
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error toggling route:', error);
    }
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
                <h1 className="text-3xl font-bold text-foreground">Safe Routes</h1>
                <p className="text-muted-foreground mt-1">Create and manage walking routes</p>
              </div>
            </div>
            <Button 
              className="rounded-xl bg-gradient-calm text-primary-foreground hover:opacity-90 shadow-button"
              disabled={!dementiaUserId || !user}
              onClick={() => setCreateRouteOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Route
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
                <Map className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">No Patient Connected</h3>
                <p className="text-muted-foreground mb-4">
                  To create and manage routes, you need to establish a caregiving relationship with a dementia user first. 
                  Routes are created specifically for patients to help them navigate safely.
                </p>
                <div className="bg-card/50 rounded-xl p-4 border border-border">
                  <p className="text-sm font-semibold text-foreground mb-2">How to connect with a patient:</p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Click "Send Connection Request" below</li>
                    <li>Enter the patient's User ID (they'll find this in their profile)</li>
                    <li>Wait for the patient to approve your request</li>
                    <li>Once approved, you can create and manage routes for them</li>
                  </ol>
                  <Button
                    className="mt-4 w-full rounded-xl bg-gradient-calm text-primary-foreground"
                    onClick={() => setConnectionRequestOpen(true)}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Send Connection Request
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Routes Map */}
        <div className="mb-8">
          <Card className="p-6 rounded-2xl shadow-card">
            <h2 className="text-2xl font-bold text-foreground mb-4">Routes Overview</h2>
            {dementiaUserId ? (
              <div className="rounded-2xl h-[500px] overflow-hidden border-2 border-border">
                <RoutesMap 
                  key={refreshKey} 
                  dementiaUserId={dementiaUserId} 
                  selectedRouteId={selectedRouteId}
                  className="h-full" 
                />
              </div>
            ) : (
              <div className="bg-muted/30 rounded-2xl h-[500px] flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center">
                    <Map className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Map Unavailable</p>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Connect with a patient to view and create routes on the map
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Routes List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingRoutes ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Loading routes...</p>
            </div>
          ) : routes.length === 0 && dementiaUserId ? (
            <div className="col-span-full text-center py-12">
              <Map className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">No routes created yet</p>
              <p className="text-sm text-muted-foreground mt-2">Click "Create New Route" above to create your first safe route</p>
            </div>
          ) : routes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Connect with a patient to create routes</p>
            </div>
          ) : (
            routes.map((route) => {
              const distanceKm = route.distance_meters ? (route.distance_meters / 1000).toFixed(2) : 'N/A';
              const distanceMiles = route.distance_meters ? (route.distance_meters / 1609.34).toFixed(2) : 'N/A';
              const duration = route.estimated_duration_minutes || 'N/A';
              const isSelected = selectedRouteId === route.id;

              return (
                <Card 
                  key={route.id} 
                  className={`p-6 rounded-2xl shadow-card hover:shadow-lg transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedRouteId(isSelected ? null : route.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{route.name}</h3>
                      {route.description && (
                        <p className="text-sm text-muted-foreground mt-1">{route.description}</p>
                      )}
                      <div className="flex items-center space-x-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Map className="w-4 h-4 mr-1" />
                          {distanceMiles} mi
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {duration} min
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={
                        route.is_active
                          ? "bg-success text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {route.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        "Saved"
                      )}
                    </Badge>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button 
                      variant={isSelected ? "default" : "outline"} 
                      className="flex-1 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRouteId(isSelected ? null : route.id);
                      }}
                    >
                      {isSelected ? 'Hide' : 'Preview'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRouteActive(route.id, route.is_active || false);
                      }}
                    >
                      {route.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Right Sidebar */}
        <div className="mt-8 max-w-md">
          {/* Route Tips */}
            <Card className="p-6 rounded-2xl shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Creating a Safe Route
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-comfort mt-0.5" />
                  <p>Draw or select the walking path on the map</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-comfort mt-0.5" />
                  <p>Mark comfort points along the way</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-comfort mt-0.5" />
                  <p>Identify any stress zones to avoid</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-comfort mt-0.5" />
                  <p>Set expected duration and checkpoints</p>
                </div>
              </div>
            </Card>

            {/* Route Tips */}
            <Card className="p-6 rounded-2xl shadow-card bg-accent/10 border-accent/30">
              <h3 className="text-lg font-bold text-foreground mb-3">Tips</h3>
              <p className="text-sm text-muted-foreground">
                Routes with more comfort points and fewer stress zones reduce confusion and
                provide better support during walks.
              </p>
            </Card>
          </div>
      </main>

      {dementiaUserId && user && (
        <CreateRouteDialog
          open={createRouteOpen}
          onOpenChange={setCreateRouteOpen}
          dementiaUserId={dementiaUserId}
          caregiverId={user.id}
          onSuccess={handleSuccess}
        />
      )}

      {user && (
        <SendConnectionRequest
          open={connectionRequestOpen}
          onOpenChange={setConnectionRequestOpen}
          caregiverId={user.id}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default CaregiverRoutes;
