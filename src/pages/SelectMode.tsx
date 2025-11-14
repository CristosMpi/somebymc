import { Link } from "react-router-dom";
import { Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const SelectMode = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome to Soma
          </h1>
          <p className="text-xl text-muted-foreground">
            Please select how you'd like to use Soma today
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Dementia User Mode */}
          <Link to="/dementia-user" className="block">
            <div className="h-full bg-card rounded-3xl p-8 shadow-card hover:shadow-soft transition-all duration-300 border-2 border-transparent hover:border-primary">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-gradient-warm flex items-center justify-center shadow-button">
                  <Heart className="w-12 h-12 text-secondary-foreground" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-foreground">
                    I'm Taking a Walk
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Simple, easy navigation for your journey
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="w-full text-xl py-8 rounded-2xl bg-gradient-warm hover:opacity-90 text-foreground font-semibold shadow-button"
                >
                  Start Walking
                </Button>
              </div>
            </div>
          </Link>

          {/* Caregiver Mode */}
          <Link to="/caregiver" className="block">
            <div className="h-full bg-card rounded-3xl p-8 shadow-card hover:shadow-soft transition-all duration-300 border-2 border-transparent hover:border-primary">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-gradient-calm flex items-center justify-center shadow-button">
                  <Shield className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-foreground">
                    I'm a Caregiver
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Monitor routes, set comfort zones, and stay connected
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="w-full text-xl py-8 rounded-2xl bg-gradient-calm hover:opacity-90 text-primary-foreground font-semibold shadow-button"
                >
                  Open Dashboard
                </Button>
              </div>
            </div>
          </Link>
        </div>

        <div className="pt-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SelectMode;
