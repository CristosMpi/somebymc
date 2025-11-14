import { useEffect, useState } from "react";
import { useGPSTracking, GPSPosition } from "@/hooks/useGPSTracking";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Activity } from "lucide-react";

interface GPSTrackerProps {
  enabled: boolean;
  onLocationUpdate?: (position: GPSPosition) => void;
}

const GPSTracker = ({ enabled, onLocationUpdate }: GPSTrackerProps) => {
  const { isTracking, currentPosition, error } = useGPSTracking({
    enabled,
    highAccuracy: true,
    updateInterval: 5000,
    onLocationUpdate,
  });

  const [trackingDuration, setTrackingDuration] = useState(0);

  useEffect(() => {
    if (!isTracking) {
      setTrackingDuration(0);
      return;
    }

    const interval = setInterval(() => {
      setTrackingDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!enabled) {
    return null;
  }

  return (
    <Card className="p-4 rounded-2xl shadow-card bg-card/80 backdrop-blur">
      <div className="space-y-3">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className={`w-5 h-5 ${isTracking ? "text-comfort animate-pulse" : "text-muted-foreground"}`} />
            <span className="font-semibold text-foreground">
              {isTracking ? "Tracking Active" : "Tracking Inactive"}
            </span>
          </div>
          {isTracking && (
            <Badge className="bg-comfort text-comfort-foreground">
              {formatDuration(trackingDuration)}
            </Badge>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Current Position Info */}
        {currentPosition && (
          <div className="space-y-2">
            <div className="flex items-start space-x-3 p-3 rounded-xl bg-muted/30">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-mono text-foreground truncate">
                  {currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="text-sm font-semibold text-foreground">
                  ±{Math.round(currentPosition.accuracy)}m
                </p>
              </div>

              {currentPosition.speed !== null && (
                <div className="p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Speed</p>
                      <p className="text-sm font-semibold text-foreground">
                        {(currentPosition.speed * 3.6).toFixed(1)} km/h
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tracking but no position yet */}
        {isTracking && !currentPosition && !error && (
          <div className="p-4 text-center">
            <Activity className="w-8 h-8 text-primary mx-auto mb-2 animate-pulse" />
            <p className="text-sm text-muted-foreground">Acquiring GPS signal...</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GPSTracker;
