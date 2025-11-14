import { Link } from "react-router-dom";
import { Heart, Shield, Users, Map, ArrowRight, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-6">
        <div className="absolute inset-0 bg-gradient-hero opacity-40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            {/* Glassmorphic header card */}
            <div className="inline-block backdrop-blur-xl bg-card/30 border border-border/20 rounded-3xl px-12 py-6 shadow-elegant">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-br from-primary via-primary to-secondary bg-clip-text text-transparent">
                Soma
              </h1>
            </div>
            
            <p className="text-2xl md:text-4xl font-semibold text-foreground max-w-3xl mx-auto leading-tight">
              Compassionate navigation and safety for individuals living with dementia
            </p>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Guided routes, real-time monitoring, and intelligent prevention tools — all wrapped
              in a calming, dignified interface
            </p>
            
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-xl px-12 py-8 rounded-2xl bg-gradient-calm backdrop-blur-lg border border-primary/20 shadow-elegant hover:shadow-button hover:scale-105 transition-all duration-300 group"
              >
                <Link to="/auth">
                  Get Started
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="text-xl px-12 py-8 rounded-2xl backdrop-blur-xl bg-background/40 border-2 border-border/50 hover:bg-background/60 hover:border-primary/50 shadow-soft hover:shadow-elegant transition-all duration-300"
              >
                <Link to="/select-mode">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block backdrop-blur-sm bg-primary/5 rounded-full px-6 py-2 mb-4">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider">Features</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Safety Through Understanding
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Soma combines compassionate design with intelligent technology to provide peace of
              mind for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group backdrop-blur-xl bg-card/40 border border-border/50 rounded-3xl p-8 shadow-card hover:shadow-elegant hover:scale-105 hover:bg-card/60 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-calm flex items-center justify-center mb-6 shadow-soft group-hover:shadow-button transition-shadow">
                <Map className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Safe Routes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Caregivers define safe paths. Soma monitors in real-time and alerts on any
                deviation or confusion.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group backdrop-blur-xl bg-card/40 border border-border/50 rounded-3xl p-8 shadow-card hover:shadow-elegant hover:scale-105 hover:bg-card/60 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mb-6 shadow-soft group-hover:shadow-button transition-shadow">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Predictive AI</h3>
              <p className="text-muted-foreground leading-relaxed">
                Early-warning system analyzes patterns to predict wandering risk before it begins.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group backdrop-blur-xl bg-card/40 border border-border/50 rounded-3xl p-8 shadow-card hover:shadow-elegant hover:scale-105 hover:bg-card/60 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-comfort/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-soft group-hover:shadow-button transition-shadow border border-comfort/30">
                <Heart className="w-8 h-8 text-comfort" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Comfort Mapping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Map emotional landmarks — familiar shops, trusted neighbors — for routes that feel
                safe and reassuring.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group backdrop-blur-xl bg-card/40 border border-border/50 rounded-3xl p-8 shadow-card hover:shadow-elegant hover:scale-105 hover:bg-card/60 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-soft group-hover:shadow-button transition-shadow border border-accent/30">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Buddy Watch</h3>
              <p className="text-muted-foreground leading-relaxed">
                Privacy-safe community network alerts nearby volunteers only when help is truly
                needed.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group backdrop-blur-xl bg-card/40 border border-border/50 rounded-3xl p-8 shadow-card hover:shadow-elegant hover:scale-105 hover:bg-card/60 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 shadow-soft group-hover:shadow-button transition-shadow">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Peace of Mind</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time monitoring and instant alerts keep caregivers connected and confident.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group backdrop-blur-xl bg-card/40 border border-border/50 rounded-3xl p-8 shadow-card hover:shadow-elegant hover:scale-105 hover:bg-card/60 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-secondary/30 backdrop-blur-sm flex items-center justify-center mb-6 shadow-soft group-hover:shadow-button transition-shadow border border-secondary/30">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Dignity First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ultra-simple interface designed with cognitive accessibility and respect at the
                core.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="backdrop-blur-2xl bg-card/30 border border-border/30 rounded-3xl p-12 shadow-elegant">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Modern safety. Human dignity.
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Soma is here to help individuals with dementia maintain independence while giving
              caregivers the tools they need for peace of mind.
            </p>
            <Button
              asChild
              size="lg"
              className="text-xl px-12 py-8 rounded-2xl bg-gradient-calm backdrop-blur-lg border border-primary/20 shadow-button hover:shadow-elegant hover:scale-105 transition-all duration-300 group"
            >
              <Link to="/auth">
                Start Using Soma
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
