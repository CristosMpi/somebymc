import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddComfortPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coordinates: { lng: number; lat: number } | null;
  dementiaUserId: string;
  onSuccess?: () => void;
}

const AddComfortPointDialog = ({
  open,
  onOpenChange,
  coordinates,
  dementiaUserId,
  onSuccess,
}: AddComfortPointDialogProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'comfort' | 'stress' | 'safe'>('comfort');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordinates) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('location_points').insert({
        name,
        point_type: type,
        description: description || null,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        dementia_user_id: dementiaUserId,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Comfort point added successfully',
      });

      setName('');
      setDescription('');
      setType('comfort');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error adding comfort point:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comfort point',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Comfort Point</DialogTitle>
          <DialogDescription>
            Create a new emotional landmark at the selected location.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Favorite Park"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comfort">Comfort</SelectItem>
                  <SelectItem value="stress">Stress</SelectItem>
                  <SelectItem value="safe">Safe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this location..."
                rows={3}
              />
            </div>
            {coordinates && (
              <div className="text-sm text-muted-foreground">
                Location: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Point'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddComfortPointDialog;
