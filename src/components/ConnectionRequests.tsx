import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, UserX, Clock, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ConnectionRequest {
  id: string;
  caregiver_id: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  caregiver: {
    display_name: string;
  };
}

interface ConnectionRequestsProps {
  userId: string;
}

const ConnectionRequests = ({ userId }: ConnectionRequestsProps) => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();

    // Subscribe to changes
    const channel = supabase
      .channel('connection_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'caregiving_relationships',
          filter: `dementia_user_id=eq.${userId}`,
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('caregiving_relationships')
        .select(`
          id,
          caregiver_id,
          status,
          requested_at,
          caregiver:profiles!caregiving_relationships_caregiver_id_fkey(display_name)
        `)
        .eq('dementia_user_id', userId)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: string, action: 'approved' | 'rejected') => {
    setProcessingId(requestId);
    try {
      const { error } = await supabase
        .from('caregiving_relationships')
        .update({
          status: action,
          responded_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: action === 'approved' ? 'Connection approved!' : 'Connection rejected',
        description:
          action === 'approved'
            ? 'The caregiver can now access your information.'
            : 'The connection request has been rejected.',
      });

      fetchRequests();
    } catch (error) {
      console.error('Error handling request:', error);
      toast({
        title: 'Error',
        description: 'Failed to process request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 rounded-2xl shadow-card">
        <p className="text-muted-foreground text-center">Loading connection requests...</p>
      </Card>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const historyRequests = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card className="p-6 rounded-2xl shadow-card border-2 border-amber-500/50 bg-amber-500/5">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="text-xl font-bold text-foreground">Pending Requests</h3>
            <Badge className="bg-amber-500">{pendingRequests.length}</Badge>
          </div>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-card rounded-xl p-4 border border-border flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-calm flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {request.caregiver.display_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Requested {formatDistanceToNow(new Date(request.requested_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg"
                    onClick={() => handleRequest(request.id, 'rejected')}
                    disabled={processingId === request.id}
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-lg bg-gradient-calm text-primary-foreground"
                    onClick={() => handleRequest(request.id, 'approved')}
                    disabled={processingId === request.id}
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* History */}
      {historyRequests.length > 0 && (
        <Card className="p-6 rounded-2xl shadow-card">
          <h3 className="text-xl font-bold text-foreground mb-4">Connection History</h3>
          <div className="space-y-2">
            {historyRequests.map((request) => (
              <div
                key={request.id}
                className="bg-muted/30 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {request.caregiver.display_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(request.requested_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={request.status === 'approved' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {request.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* No Requests */}
      {requests.length === 0 && (
        <Card className="p-8 rounded-2xl shadow-card text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No connection requests yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Caregivers can send you connection requests to help monitor your safety
          </p>
        </Card>
      )}
    </div>
  );
};

export default ConnectionRequests;
