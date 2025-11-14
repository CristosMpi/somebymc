import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Map, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CaregiverRoutes = () => {
  const routes = [
    {
      id: 1,
      name: "Morning Walk",
      distance: "0.8 miles",
      duration: "15-20 min",
      comfortPoints: 5,
      stressPoints: 1,
      status: "active",
    },
    {
      id: 2,
      name: "Afternoon Stroll",
      distance: "1.2 miles",
      duration: "25-30 min",
      comfortPoints: 8,
      stressPoints: 2,
      status: "saved",
    },
    {
      id: 3,
      name: "Quick Loop",
      distance: "0.4 miles",
      duration: "8-10 min",
      comfortPoints: 3,
      stressPoints: 0,
      status: "saved",
    },
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
                <h1 className="text-3xl font-bold text-foreground">Safe Routes</h1>
                <p className="text-muted-foreground mt-1">Create and manage walking routes</p>
              </div>
            </div>
            <Button className="rounded-xl bg-gradient-calm text-primary-foreground hover:opacity-90 shadow-button">
              <Plus className="w-5 h-5 mr-2" />
              Create New Route
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Route List */}
          <div className="lg:col-span-2 space-y-6">
            {routes.map((route) => (
              <Card key={route.id} className="p-6 rounded-2xl shadow-card hover:shadow-soft transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-calm flex items-center justify-center">
                      <Map className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{route.name}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Map className="w-4 h-4" />
                          <span className="text-sm">{route.distance}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{route.duration}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`rounded-full px-4 py-1 ${
                      route.status === "active"
                        ? "bg-comfort text-comfort-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {route.status === "active" ? "Active Now" : "Saved"}
                  </Badge>
                </div>

                {/* Mock Map Preview */}
                <div className="bg-muted/30 rounded-xl h-48 mb-4 flex items-center justify-center border border-border">
                  <p className="text-muted-foreground">Route map preview</p>
                </div>

                {/* Route Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-comfort"></div>
                      <span className="text-sm text-muted-foreground">
                        {route.comfortPoints} Comfort Points
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-stress"></div>
                      <span className="text-sm text-muted-foreground">
                        {route.stressPoints} Stress Points
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="rounded-lg">
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-lg bg-gradient-calm text-primary-foreground hover:opacity-90"
                    >
                      {route.status === "active" ? "Active" : "Activate"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Create Route Guide */}
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
        </div>
      </main>
    </div>
  );
};

export default CaregiverRoutes;
