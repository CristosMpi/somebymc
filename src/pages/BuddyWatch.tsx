import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, UserPlus, Shield, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AddBuddyDialog from "@/components/AddBuddyDialog";

interface Buddy {
  id: string;
  name: string;
  relation: string | null;
  address: string | null;
  phone: string | null;
  is_verified: boolean | null;
  is_active: boolean | null;
}

const BuddyWatch = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [loadingBuddies, setLoadingBuddies] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const fetchBuddies = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('buddy_watch')
        .select('*')
        .eq('dementia_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBuddies(data || []);
    } catch (error: any) {
      console.error('Error fetching buddies:', error);
      toast({
        title: 'Failed to load buddies',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingBuddies(false);
    }
  };

  useEffect(() => {
    fetchBuddies();
  }, [user]);

  const toggleBuddyActive = async (buddyId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('buddy_watch')
        .update({ is_active: !currentStatus })
        .eq('id', buddyId);

      if (error) throw error;

      setBuddies(prev =>
        prev.map(b =>
          b.id === buddyId ? { ...b, is_active: !currentStatus } : b
        )
      );

      toast({
        title: 'Status updated',
        description: `Buddy is now ${!currentStatus ? 'active' : 'inactive'}.`,
      });
    } catch (error: any) {
      console.error('Error updating buddy status:', error);
      toast({
        title: 'Failed to update status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading || loadingBuddies) {
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
                <h1 className="text-3xl font-bold text-foreground">Buddy Watch Network</h1>
                <p className="text-muted-foreground mt-1">
                  Your community safety network
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setDialogOpen(true)}
              className="rounded-xl bg-gradient-calm text-primary-foreground hover:opacity-90 shadow-button"
            >
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
                      {buddies.filter((b) => b.is_active).length} buddies watching
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Buddies */}
            {buddies.length === 0 ? (
              <Card className="p-12 rounded-2xl shadow-card text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <Users className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">No buddies yet</h3>
                    <p className="text-muted-foreground mt-2">
                      Start building your safety network by adding trusted community members.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setDialogOpen(true)}
                    className="rounded-xl bg-gradient-calm text-primary-foreground"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add Your First Buddy
                  </Button>
                </div>
              </Card>
            ) : (
              buddies.map((buddy) => (
                <Card key={buddy.id} className="p-6 rounded-2xl shadow-card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-warm flex items-center justify-center text-2xl font-bold text-foreground">
                        {buddy.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-bold text-foreground">
                            {buddy.name}
                          </h3>
                          {buddy.is_verified && (
                            <Badge className="bg-secondary text-secondary-foreground">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-1">{buddy.relation || 'Community Member'}</p>
                        {buddy.address && (
                          <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{buddy.address}</span>
                          </div>
                        )}
                        {buddy.phone && (
                          <p className="text-sm text-muted-foreground mt-1">{buddy.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Switch 
                        checked={buddy.is_active || false} 
                        onCheckedChange={() => toggleBuddyActive(buddy.id, buddy.is_active)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {buddy.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
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
                    {buddies.filter((b) => b.is_active).length}
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

      {user && (
        <AddBuddyDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          userId={user.id}
          onSuccess={fetchBuddies}
        />
      )}
    </div>
  );
};

export default BuddyWatch;
