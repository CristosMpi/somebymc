import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, UserPlus, Shield, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const BuddyWatch = () => {
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

  const buddies = [
    {
      id: 1,
      name: "Mary Johnson",
      relation: "Neighbor",
      address: "Next door",
      verified: true,
      active: true,
    },
    {
      id: 2,
      name: "Corner Cafe Staff",
      relation: "Local Business",
      address: "123 Main St",
      verified: true,
      active: true,
    },
    {
      id: 3,
      name: "Park Volunteer Team",
      relation: "Community Group",
      address: "Central Park",
      verified: true,
      active: false,
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
                <h1 className="text-3xl font-bold text-foreground">Buddy Watch Network</h1>
                <p className="text-muted-foreground mt-1">
                  Your community safety network
                </p>
              </div>
            </div>
            <Button className="rounded-xl bg-gradient-calm text-primary-foreground hover:opacity-90 shadow-button">
              <UserPlus className="w-5 h-5 mr-2" />
              Add Buddy
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Buddy List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Network Status */}
            <Card className="p-6 rounded-2xl shadow-card bg-gradient-calm text-primary-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Network Active</h3>
                    <p className="opacity-90 mt-1">
                      {buddies.filter((b) => b.active).length} buddies watching
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Buddies */}
            {buddies.map((buddy) => (
              <Card key={buddy.id} className="p-6 rounded-2xl shadow-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-warm flex items-center justify-center text-2xl font-bold text-foreground">
                      {buddy.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-bold text-foreground">{buddy.name}</h3>
                        {buddy.verified && (
                          <Badge className="bg-comfort text-comfort-foreground rounded-full">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{buddy.relation}</p>
                      <div className="flex items-center space-x-2 mt-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{buddy.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-3">
                    <Switch checked={buddy.active} />
                    <span className="text-xs text-muted-foreground">
                      {buddy.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* How It Works */}
            <Card className="p-6 rounded-2xl shadow-card">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-foreground">How Buddy Watch Works</h3>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground mb-1">Privacy First</p>
                  <p>
                    Buddies only receive alerts when help is actually needed, never continuous
                    tracking.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Location-Based</p>
                  <p>
                    Only buddies near the current location receive alerts, ensuring fast response.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">You Control</p>
                  <p>All buddies must be approved by you and can be removed anytime.</p>
                </div>
              </div>
            </Card>

            {/* Adding Buddies Guide */}
            <Card className="p-6 rounded-2xl shadow-card bg-accent/10 border-accent/30">
              <h3 className="text-lg font-bold text-foreground mb-3">Who to Add</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Trusted neighbors</li>
                <li>• Local shop owners</li>
                <li>• Community volunteers</li>
                <li>• Park rangers or security</li>
                <li>• Faith community members</li>
              </ul>
            </Card>

            {/* Stats */}
            <Card className="p-6 rounded-2xl shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Network Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Buddies</span>
                  <span className="font-semibold text-foreground">{buddies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Now</span>
                  <span className="font-semibold text-foreground">
                    {buddies.filter((b) => b.active).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coverage Area</span>
                  <span className="font-semibold text-foreground">0.5 miles</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuddyWatch;
