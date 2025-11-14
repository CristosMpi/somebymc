import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import LocationMap from './LocationMap';
import { useToast } from '@/hooks/use-toast';

interface TrackingMapProps {
  dementiaUserId: string;
  className?: string;
}

interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy: number | null;
  is_on_route: boolean | null;
}

const TrackingMap = ({ dementiaUserId, className = '' }: TrackingMapProps) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch latest location
    const fetchLocation = async () => {
      try {
        const { data, error } = await supabase
          .from('location_tracking')
          .select('*')
          .eq('user_id', dementiaUserId)
          .order('timestamp', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setLocation(data);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        toast({
          title: 'Error',
          description: 'Failed to load location data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();

    // Subscribe to real-time location updates
    const channel = supabase
      .channel('location-tracking')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'location_tracking',
          filter: `user_id=eq.${dementiaUserId}`,
        },
        (payload) => {
          setLocation(payload.new as LocationData);
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
        <p className="text-muted-foreground">Loading location...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className={`bg-muted/30 rounded-2xl h-full flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">No location data available</p>
      </div>
    );
  }

  const markers = [
    {
      id: 'current-location',
      coordinates: [location.longitude, location.latitude] as [number, number],
      color: location.is_on_route ? '#10b981' : '#ef4444',
      label: `Current Location<br/>Accuracy: ${location.accuracy?.toFixed(0) || 'N/A'}m<br/>${
        location.is_on_route ? 'On Route ✓' : 'Off Route ⚠️'
      }`,
    },
  ];

  return (
    <LocationMap
      center={[location.longitude, location.latitude]}
      zoom={15}
      markers={markers}
      className={className}
    />
  );
};

export default TrackingMap;
