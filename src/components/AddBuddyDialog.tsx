import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';

const buddySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  relation: z.string().trim().max(50).optional(),
  address: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(20).optional(),
});

interface AddBuddyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSuccess?: () => void;
}

const AddBuddyDialog = ({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: AddBuddyDialogProps) => {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = buddySchema.safeParse({ name, relation, address, phone });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setError(undefined);
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('buddy_watch')
        .insert({
          dementia_user_id: userId,
          name: validation.data.name,
          relation: validation.data.relation || null,
          address: validation.data.address || null,
          phone: validation.data.phone || null,
        });

      if (insertError) throw insertError;

      toast({
        title: 'Buddy added successfully!',
        description: `${validation.data.name} has been added to your network.`,
      });

      setName('');
      setRelation('');
      setAddress('');
      setPhone('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error adding buddy:', error);
      toast({
        title: 'Failed to add buddy',
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
            <span>Add Buddy to Network</span>
          </DialogTitle>
          <DialogDescription>
            Add a trusted community member who can help keep you safe during your walks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(undefined);
                }}
                placeholder="e.g., Mary Johnson"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="relation">Relation</Label>
              <Input
                id="relation"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="e.g., Neighbor, Local Business"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., Next door, 123 Main St"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., (555) 123-4567"
                type="tel"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Buddy'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBuddyDialog;
