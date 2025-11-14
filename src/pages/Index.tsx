import { Link } from "react-router-dom";
import { Heart, Shield, Users, Map, ArrowRight, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground">
              Soma
            </h1>
            <p className="text-2xl md:text-3xl text-primary-foreground/90 max-w-3xl mx-auto">
              Compassionate navigation and safety for individuals living with dementia
            </p>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Guided routes, real-time monitoring, and intelligent prevention tools — all wrapped
              in a calming, dignified interface
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="text-xl px-12 py-8 rounded-2xl bg-white text-primary hover:bg-white/90 shadow-soft"
                >
                  Sign In / Sign Up
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              <Link to="/select-mode">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xl px-12 py-8 rounded-2xl border-2 border-white text-primary-foreground hover:bg-white/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Safety Through Understanding
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Soma combines compassionate design with intelligent technology to provide peace of
              mind for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-soft transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-calm flex items-center justify-center mb-6">
                <Map className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Safe Routes</h3>
              <p className="text-muted-foreground">
                Caregivers define safe paths. Soma monitors in real-time and alerts on any
                deviation or confusion.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-soft transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Predictive AI</h3>
              <p className="text-muted-foreground">
                Early-warning system analyzes patterns to predict wandering risk before it begins.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-soft transition-all">
              <div className="w-16 h-16 rounded-2xl bg-comfort/20 flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-comfort" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Comfort Mapping</h3>
              <p className="text-muted-foreground">
                Map emotional landmarks — familiar shops, trusted neighbors — for routes that feel
                safe and reassuring.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-soft transition-all">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Buddy Watch</h3>
              <p className="text-muted-foreground">
                Privacy-safe community network alerts nearby volunteers only when help is truly
                needed.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-soft transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Peace of Mind</h3>
              <p className="text-muted-foreground">
                Real-time monitoring and instant alerts keep caregivers connected and confident.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-soft transition-all">
              <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Dignity First</h3>
              <p className="text-muted-foreground">
                Ultra-simple interface designed with cognitive accessibility and respect at the
                core.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Modern safety. Human dignity.
          </h2>
          <p className="text-xl text-muted-foreground">
            Soma is here to help individuals with dementia maintain independence while giving
            caregivers the tools they need for peace of mind.
          </p>
          <Link to="/select-mode">
            <Button
              size="lg"
              className="text-xl px-12 py-8 rounded-2xl bg-gradient-calm text-primary-foreground hover:opacity-90 shadow-button"
            >
              Start Using Soma
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
