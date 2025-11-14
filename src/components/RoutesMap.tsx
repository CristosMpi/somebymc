import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import LocationMap from './LocationMap';
import { useToast } from '@/hooks/use-toast';

interface RoutesMapProps {
  dementiaUserId: string;
  selectedRouteId?: string | null;
  className?: string;
}

interface RouteData {
  id: string;
  name: string;
  path_data: any; // GeoJSON structure
  is_active: boolean | null;
}

const RoutesMap = ({ dementiaUserId, selectedRouteId, className = '' }: RoutesMapProps) => {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data, error } = await supabase
          .from('safe_routes')
          .select('id, name, path_data, is_active')
          .eq('dementia_user_id', dementiaUserId);

        if (error) throw error;
        if (data) {
          setRoutes(data);
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load routes',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [dementiaUserId, toast]);

  if (loading) {
    return (
      <div className={`bg-muted/30 rounded-2xl h-full flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">Loading routes...</p>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className={`bg-muted/30 rounded-2xl h-full flex items-center justify-center ${className}`}>
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No routes created yet</p>
          <p className="text-sm text-muted-foreground">Create a route to see it on the map</p>
        </div>
      </div>
    );
  }

  // Filter routes if a specific one is selected
  const displayRoutes = selectedRouteId
    ? routes.filter((r) => r.id === selectedRouteId)
    : routes;

  const mapRoutes = displayRoutes
    .filter((route) => route.path_data?.coordinates && Array.isArray(route.path_data.coordinates))
    .map((route) => ({
      id: route.id,
      coordinates: route.path_data.coordinates as [number, number][],
      color: route.is_active ? '#10b981' : '#6b7280',
    }));

  // Calculate center from all route coordinates
  const allCoordinates = displayRoutes
    .filter((r) => r.path_data?.coordinates && Array.isArray(r.path_data.coordinates))
    .flatMap((r) => r.path_data.coordinates as [number, number][]);
  const center: [number, number] = allCoordinates.length > 0
    ? [
        allCoordinates.reduce((sum, coord) => sum + coord[0], 0) / allCoordinates.length,
        allCoordinates.reduce((sum, coord) => sum + coord[1], 0) / allCoordinates.length,
      ]
    : [-0.1276, 51.5074];

  // Add markers for route start/end points
  const markers = displayRoutes
    .filter((route) => route.path_data?.coordinates && Array.isArray(route.path_data.coordinates))
    .flatMap((route) => {
      const coords = route.path_data.coordinates as [number, number][];
      if (coords.length === 0) return [];

      return [
        {
          id: `${route.id}-start`,
          coordinates: coords[0],
          color: '#10b981',
          label: `${route.name} - Start`,
        },
        {
          id: `${route.id}-end`,
          coordinates: coords[coords.length - 1],
          color: '#ef4444',
          label: `${route.name} - End`,
        },
      ];
    });

  return (
    <LocationMap
      center={center}
      zoom={14}
      routes={mapRoutes}
      markers={markers}
      className={className}
    />
  );
};

export default RoutesMap;
