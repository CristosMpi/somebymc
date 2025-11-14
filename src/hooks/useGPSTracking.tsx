import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GPSPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  timestamp: Date;
}

interface UseGPSTrackingOptions {
  enabled?: boolean;
  highAccuracy?: boolean;
  updateInterval?: number; // milliseconds
  onLocationUpdate?: (position: GPSPosition) => void;
  onError?: (error: string) => void;
}

export const useGPSTracking = ({
  enabled = false,
  highAccuracy = true,
  updateInterval = 5000,
  onLocationUpdate,
  onError,
}: UseGPSTrackingOptions = {}) => {
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<GPSPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const saveLocationToDatabase = async (position: GPSPosition) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No user logged in");
        return;
      }

      const { error: dbError } = await supabase
        .from("location_tracking")
        .insert({
          user_id: user.id,
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy: position.accuracy,
          heading: position.heading,
          speed: position.speed,
          timestamp: position.timestamp.toISOString(),
        });

      if (dbError) {
        console.error("Error saving location:", dbError);
      }
    } catch (err) {
      console.error("Failed to save location:", err);
    }
  };

  const handlePosition = (pos: GeolocationPosition) => {
    const now = Date.now();
    
    // Throttle updates based on updateInterval
    if (now - lastUpdateRef.current < updateInterval) {
      return;
    }
    
    lastUpdateRef.current = now;

    const position: GPSPosition = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      heading: pos.coords.heading,
      speed: pos.coords.speed,
      timestamp: new Date(pos.timestamp),
    };

    setCurrentPosition(position);
    setError(null);
    
    // Save to database
    saveLocationToDatabase(position);
    
    // Call callback if provided
    if (onLocationUpdate) {
      onLocationUpdate(position);
    }
  };

  const handleError = (err: GeolocationPositionError) => {
    let errorMessage = "Location error";
    
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = "Location permission denied. Please enable location access.";
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = "Location unavailable. Please check your device settings.";
        break;
      case err.TIMEOUT:
        errorMessage = "Location request timed out. Please try again.";
        break;
    }
    
    setError(errorMessage);
    
    toast({
      title: "Location Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    if (onError) {
      onError(errorMessage);
    }
  };

  useEffect(() => {
    if (!enabled) {
      // Stop tracking if disabled
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        setIsTracking(false);
      }
      return;
    }

    // Check if geolocation is available
    if (!navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by your browser";
      setError(errorMsg);
      toast({
        title: "Not Supported",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    // Start tracking
    setIsTracking(true);
    
    const options: PositionOptions = {
      enableHighAccuracy: highAccuracy,
      timeout: 10000,
      maximumAge: 0,
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      options
    );

    // Cleanup on unmount or when disabled
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        setIsTracking(false);
      }
    };
  }, [enabled, highAccuracy, updateInterval]);

  const requestPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return result.state;
    } catch (err) {
      console.error("Permission query failed:", err);
      return "prompt";
    }
  };

  return {
    isTracking,
    currentPosition,
    error,
    requestPermission,
  };
};
