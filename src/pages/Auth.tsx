import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Heart, Shield, Loader2 } from "lucide-react";
import { Session, User } from "@supabase/supabase-js";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().trim().min(1, 'Display name is required').max(100, 'Display name must be less than 100 characters'),
});

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userType, setUserType] = useState<"caregiver" | "dementia_user">("caregiver");
  const [errors, setErrors] = useState<{ email?: string; password?: string; displayName?: string }>({});

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const validation = signUpSchema.safeParse({ email, password, displayName });
    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string; displayName?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as 'email' | 'password' | 'displayName'] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: validation.data.email,
        password: validation.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: validation.data.displayName,
            user_type: userType,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to Soma. Redirecting...",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const validation = signInSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as 'email' | 'password'] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: validation.data.email,
        password: validation.data.password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-soft">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to Soma</h1>
          <p className="text-muted-foreground">Compassionate care, dignified support</p>
        </div>

        <Tabs defaultValue="signin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-6 bg-gradient-calm text-primary-foreground hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="rounded-xl"
                />
                {errors.displayName && <p className="text-sm text-destructive">{errors.displayName}</p>}
              </div>

              <div className="space-y-3">
                <Label>I am a...</Label>
                <RadioGroup value={userType} onValueChange={(value: any) => setUserType(value)}>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary transition-colors">
                    <RadioGroupItem value="caregiver" id="caregiver" />
                    <Label htmlFor="caregiver" className="flex items-center space-x-3 cursor-pointer flex-1">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">Caregiver</p>
                        <p className="text-sm text-muted-foreground">Monitor and support loved ones</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-secondary transition-colors">
                    <RadioGroupItem value="dementia_user" id="dementia_user" />
                    <Label htmlFor="dementia_user" className="flex items-center space-x-3 cursor-pointer flex-1">
                      <Heart className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-semibold">User</p>
                        <p className="text-sm text-muted-foreground">Navigate safely with support</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="rounded-xl"
                />
                {errors.password ? (
                  <p className="text-sm text-destructive">{errors.password}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-6 bg-gradient-warm text-foreground hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
