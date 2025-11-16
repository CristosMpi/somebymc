import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LocationMap from './LocationMap';
import { MapPin, Trash2 } from 'lucide-react';
import { z } from 'zod';

const routeSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

interface CreateRouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dementiaUserId: string;
  caregiverId: string;
  onSuccess?: () => void;
}

const CreateRouteDialog = ({
  open,
  onOpenChange,
  dementiaUserId,
  caregiverId,
  onSuccess,
}: CreateRouteDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [waypoints, setWaypoints] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const { toast } = useToast();

  const handleMapClick = (lngLat: { lng: number; lat: number }) => {
    setWaypoints([...waypoints, [lngLat.lng, lngLat.lat]]);
  };

  const handleRemoveWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (waypoints.length < 2) {
      toast({
        title: 'Error',
        description: 'Please add at least 2 waypoints to create a route',
        variant: 'destructive',
      });
      return;
    }

    // Validate input
    const validation = routeSchema.safeParse({ name, description: description || undefined });
    if (!validation.success) {
      const fieldErrors: { name?: string; description?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as 'name' | 'description'] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const { error } = await supabase.from('safe_routes').insert({
        name: validation.data.name,
        description: validation.data.description || null,
        dementia_user_id: dementiaUserId,
        created_by: caregiverId,
        path_data: {
          type: 'LineString',
          coordinates: waypoints,
        },
        is_active: false,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Route created successfully',
      });

      setName('');
      setDescription('');
      setWaypoints([]);
      setErrors({});
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating route:', error);
      toast({
        title: 'Error',
        description: 'Failed to create route',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markers = waypoints.map((coord, index) => ({
    id: `waypoint-${index}`,
    coordinates: coord,
    color: index === 0 ? '#10b981' : index === waypoints.length - 1 ? '#ef4444' : '#3b82f6',
    label: index === 0 ? 'Start' : index === waypoints.length - 1 ? 'End' : `Point ${index + 1}`,
  }));

  const routes = waypoints.length > 1
    ? [
        {
          id: 'preview-route',
          coordinates: waypoints,
          color: '#3b82f6',
        },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Route</DialogTitle>
          <DialogDescription>
            Click on the map to add waypoints. Add at least 2 points to create a route.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="route-name">Route Name</Label>
              <Input
                id="route-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Morning Walk"
                required
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="route-description">Description (optional)</Label>
              <Textarea
                id="route-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this route..."
                rows={2}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label>Waypoints ({waypoints.length})</Label>
              {waypoints.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-2">
                  {waypoints.map((coord, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {index === 0 ? '🟢 Start' : index === waypoints.length - 1 ? '🔴 End' : `🔵 Point ${index + 1}`}: {coord[1].toFixed(6)}, {coord[0].toFixed(6)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveWaypoint(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Click on map to add waypoints</Label>
              <div className="rounded-lg h-[400px] overflow-hidden border-2 border-border">
                <LocationMap
                  markers={markers}
                  routes={routes}
                  onMapClick={handleMapClick}
                  className="h-full"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || waypoints.length < 2}>
              {loading ? 'Creating...' : 'Create Route'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRouteDialog;
