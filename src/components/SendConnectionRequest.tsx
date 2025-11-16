import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';

const requestSchema = z.object({
  identifier: z.string().trim().min(1, 'User ID is required'),
});

interface SendConnectionRequestProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caregiverId: string;
  onSuccess?: () => void;
}

const SendConnectionRequest = ({
  open,
  onOpenChange,
  caregiverId,
  onSuccess,
}: SendConnectionRequestProps) => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const validation = requestSchema.safeParse({ identifier });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setError(undefined);
    setLoading(true);

    try {
      // Use the identifier as User ID
      const dementiaUserId = validation.data.identifier.trim();

      // Verify the user exists and is a dementia user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, user_type, display_name')
        .eq('id', dementiaUserId)
        .single();

      if (profileError || !profile) {
        throw new Error('User not found with that ID. Please check and try again.');
      }

      if (profile.user_type !== 'dementia_user') {
        throw new Error('This user is not a dementia user. You can only connect with dementia users.');
      }

      // Check if connection already exists
      const { data: existing } = await supabase
        .from('caregiving_relationships')
        .select('id, status')
        .eq('caregiver_id', caregiverId)
        .eq('dementia_user_id', dementiaUserId)
        .maybeSingle();

      if (existing) {
        if (existing.status === 'pending') {
          throw new Error('You already have a pending connection request with this user.');
        } else if (existing.status === 'approved') {
          throw new Error('You are already connected with this user.');
        } else if (existing.status === 'rejected') {
          throw new Error('Your previous connection request was rejected. Please contact the user directly.');
        }
      }

      // Create connection request
      const { error: insertError } = await supabase
        .from('caregiving_relationships')
        .insert({
          caregiver_id: caregiverId,
          dementia_user_id: dementiaUserId,
          status: 'pending',
        });

      if (insertError) throw insertError;

      toast({
        title: 'Connection request sent!',
        description: `Request sent to ${profile.display_name}. They will be notified.`,
      });

      setIdentifier('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error sending connection request:', error);
      toast({
        title: 'Failed to send request',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Connect with Patient</span>
          </DialogTitle>
          <DialogDescription>
            Enter the patient's User ID to send a connection request. The patient must share their User ID with you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="identifier">Patient User ID</Label>
              <Input
                id="identifier"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError(undefined);
                }}
                placeholder="user-id-from-patient"
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm font-semibold text-foreground mb-2">How to get the User ID:</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Ask the patient to log into their Soma account</li>
                <li>They can find their User ID in their profile page</li>
                <li>They should share this ID with you securely</li>
                <li>Copy and paste the ID here to send a connection request</li>
              </ol>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendConnectionRequest;
