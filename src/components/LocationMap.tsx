import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    coordinates: [number, number];
    color?: string;
    label?: string;
  }>;
  routes?: Array<{
    id: string;
    coordinates: [number, number][];
    color?: string;
  }>;
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  className?: string;
}

const LocationMap = ({
  center = [-0.1276, 51.5074], // Default to London
  zoom = 13,
  markers = [],
  routes = [],
  onMapClick,
  className = '',
}: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
    if (!token) {
      console.error('Mapbox token not found');
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    if (onMapClick) {
      map.current.on('click', (e) => {
        onMapClick(e.lngLat);
      });
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = markerData.color || '#3b82f6';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(markerData.coordinates)
        .addTo(map.current!);

      if (markerData.label) {
        marker.setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`<p>${markerData.label}</p>`)
        );
      }

      markersRef.current.push(marker);
    });
  }, [markers, mapLoaded]);

  // Update routes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    routes.forEach((route, index) => {
      const sourceId = `route-${route.id}`;
      const layerId = `route-layer-${route.id}`;

      // Remove existing layer and source
      if (map.current!.getLayer(layerId)) {
        map.current!.removeLayer(layerId);
      }
      if (map.current!.getSource(sourceId)) {
        map.current!.removeSource(sourceId);
      }

      // Add new route
      map.current!.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route.coordinates,
          },
        },
      });

      map.current!.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': route.color || '#3b82f6',
          'line-width': 4,
          'line-opacity': 0.8,
        },
      });
    });
  }, [routes, mapLoaded]);

  // Update center
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    map.current.flyTo({ center, zoom });
  }, [center, zoom, mapLoaded]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-2xl" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-2xl">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
