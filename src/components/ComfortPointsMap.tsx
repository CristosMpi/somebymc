import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import LocationMap from './LocationMap';
import { useToast } from '@/hooks/use-toast';

interface ComfortPointsMapProps {
  dementiaUserId: string;
  onPointClick?: (lngLat: { lng: number; lat: number }) => void;
  className?: string;
}

interface LocationPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  point_type: string;
  description: string | null;
}

const ComfortPointsMap = ({ dementiaUserId, onPointClick, className = '' }: ComfortPointsMapProps) => {
  const [points, setPoints] = useState<LocationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPoints = async () => {
      try {
        const { data, error } = await supabase
          .from('location_points')
          .select('*')
          .eq('dementia_user_id', dementiaUserId);

        if (error) throw error;
        if (data) {
          setPoints(data);
        }
      } catch (error) {
        console.error('Error fetching location points:', error);
        toast({
          title: 'Error',
          description: 'Failed to load location points',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchPoints();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('location-points')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'location_points',
          filter: `dementia_user_id=eq.${dementiaUserId}`,
        },
        () => {
          fetchPoints();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dementiaUserId, toast]);

  if (loading) {
    return (
      <div className={`bg-muted/30 rounded-2xl h-full flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className={`bg-muted/30 rounded-2xl h-full flex items-center justify-center ${className}`}>
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No locations marked yet</p>
          <p className="text-sm text-muted-foreground">Click "Add Location" to mark comfort or stress points</p>
        </div>
      </div>
    );
  }

  const getColorForType = (type: string): string => {
    switch (type) {
      case 'comfort':
        return '#10b981'; // comfort green
      case 'stress':
        return '#ef4444'; // stress red
      case 'safe':
        return '#3b82f6'; // safe blue
      default:
        return '#6b7280'; // neutral gray
    }
  };

  const markers = points.map((point) => ({
    id: point.id,
    coordinates: [point.longitude, point.latitude] as [number, number],
    color: getColorForType(point.point_type),
    label: `${point.name}<br/>${point.point_type}<br/>${point.description || ''}`,
  }));

  // Calculate center from all points
  const center: [number, number] = points.length > 0
    ? [
        points.reduce((sum, p) => sum + p.longitude, 0) / points.length,
        points.reduce((sum, p) => sum + p.latitude, 0) / points.length,
      ]
    : [-0.1276, 51.5074];

  return (
    <LocationMap
      center={center}
      zoom={13}
      markers={markers}
      onMapClick={onPointClick}
      className={className}
    />
  );
};

export default ComfortPointsMap;
