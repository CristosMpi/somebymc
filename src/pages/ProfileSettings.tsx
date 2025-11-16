import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ConnectionRequests from '@/components/ConnectionRequests';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      toast({
        title: 'User ID copied!',
        description: 'You can now share this with your caregiver.',
      });
      setTimeout(() => setCopied(false), 2000);
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
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <Link to="/dementia-user">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile & Connections</h1>
              <p className="text-muted-foreground mt-1">Manage your account and caregivers</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Profile Info */}
        <Card className="p-6 rounded-2xl shadow-card">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-warm flex items-center justify-center">
                <User className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{profile?.display_name}</h2>
                <Badge className="mt-2 bg-secondary">Dementia User</Badge>
              </div>
            </div>
          </div>

          {/* User ID Section */}
          <div className="bg-muted/30 rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Your User ID</h3>
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg"
                onClick={copyUserId}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Share this ID with your caregiver so they can send you a connection request:
            </p>
            <code className="block bg-card p-3 rounded-lg border border-border text-sm font-mono break-all">
              {user?.id}
            </code>
          </div>

          <div className="mt-6 bg-amber-500/5 rounded-xl p-4 border border-amber-500/30">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Privacy & Security</p>
                <p>
                  Only caregivers you approve can access your location and routes. You have full
                  control over who can connect with you.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Connection Requests */}
        {user && <ConnectionRequests userId={user.id} />}
      </main>
    </div>
  );
};

export default ProfileSettings;
