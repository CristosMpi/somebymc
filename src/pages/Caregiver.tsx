import { Link } from "react-router-dom";
import { Map, Heart, Users, Bell, Settings, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Caregiver = () => {
  const recentAlerts = [
    { id: 1, type: "info", message: "Morning walk completed successfully", time: "2 hours ago" },
    { id: 2, type: "warning", message: "Slight route deviation detected", time: "Yesterday" },
    { id: 3, type: "success", message: "Safe return home confirmed", time: "Yesterday" },
  ];

  const activeRoute = {
    name: "Morning Walk",
    status: "active",
    progress: 65,
    comfortLevel: "high",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Caregiver Dashboard</h1>
              <p className="text-muted-foreground mt-1">Monitor and support with care</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/select-mode">
                <Button variant="outline" size="lg" className="rounded-xl">
                  Switch Mode
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-calm text-primary-foreground rounded-2xl shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Now</p>
                <p className="text-3xl font-bold mt-1">Walking</p>
              </div>
              <Activity className="w-10 h-10 opacity-80" />
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Safe Routes</p>
                <p className="text-3xl font-bold text-foreground mt-1">3</p>
              </div>
              <Map className="w-10 h-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Comfort Points</p>
                <p className="text-3xl font-bold text-foreground mt-1">12</p>
              </div>
              <Heart className="w-10 h-10 text-comfort" />
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Buddy Watch</p>
                <p className="text-3xl font-bold text-foreground mt-1">5</p>
              </div>
              <Users className="w-10 h-10 text-accent" />
            </div>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Active Route & Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Route */}
            <Card className="p-6 rounded-2xl shadow-card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Active Route</h2>
                  <p className="text-muted-foreground mt-1">{activeRoute.name}</p>
                </div>
                <Badge className="bg-comfort text-comfort-foreground px-4 py-2 text-sm rounded-full">
                  {activeRoute.progress}% Complete
                </Badge>
              </div>

              {/* Mock Map */}
              <div className="bg-muted/30 rounded-2xl h-96 flex items-center justify-center border-2 border-border">
                <div className="text-center space-y-2">
                  <Map className="w-16 h-16 text-primary mx-auto" />
                  <p className="text-muted-foreground">Live tracking map</p>
                  <p className="text-sm text-muted-foreground">
                    Current location: Near Central Park
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Link to="/caregiver/routes" className="block">
                  <Button className="w-full rounded-xl py-6" variant="outline">
                    Manage Routes
                  </Button>
                </Link>
                <Link to="/caregiver/comfort-map" className="block">
                  <Button className="w-full rounded-xl py-6 bg-gradient-calm text-primary-foreground hover:opacity-90">
                    View Comfort Map
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Right Column - Alerts & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <Card className="p-6 rounded-2xl shadow-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
                <Bell className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-xl bg-muted/30 border border-border"
                  >
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 rounded-xl">
                View All Alerts
              </Button>
            </Card>

            {/* Predictive Insights */}
            <Card className="p-6 rounded-2xl shadow-card bg-warning/10 border-warning/30">
              <div className="flex items-start space-x-3">
                <Activity className="w-6 h-6 text-warning mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Wander Risk: Low</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pattern stable. Next high-risk window predicted tomorrow at 2 PM.
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 rounded-2xl shadow-card">
              <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/caregiver/routes">
                  <Button variant="outline" className="w-full justify-start rounded-xl py-6">
                    <Map className="w-5 h-5 mr-3" />
                    Create New Route
                  </Button>
                </Link>
                <Link to="/caregiver/buddy-watch">
                  <Button variant="outline" className="w-full justify-start rounded-xl py-6">
                    <Users className="w-5 h-5 mr-3" />
                    Manage Buddy Watch
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start rounded-xl py-6">
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Caregiver;
