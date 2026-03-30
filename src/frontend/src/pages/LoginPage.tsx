import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Flame } from "lucide-react";
import { useState } from "react";
import type { User } from "../types";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginEmail || !loginPassword) {
      setError("Please fill in all fields.");
      return;
    }
    const user: User = { name: loginEmail.split("@")[0], email: loginEmail };
    localStorage.setItem("campusbite_user", JSON.stringify(user));
    onLogin(user);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setError("Passwords do not match.");
      return;
    }
    const user: User = { name: signupName, email: signupEmail };
    localStorage.setItem("campusbite_user", JSON.stringify(user));
    onLogin(user);
  };

  return (
    <div className="min-h-screen gradient-orange-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mb-4">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Campus<span className="text-secondary">Bite</span>
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Your college canteen, pre-order ready
          </p>
        </div>

        <div
          className="bg-white rounded-2xl shadow-card-hover p-6 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <Tabs defaultValue="login">
            <TabsList className="w-full mb-6 bg-muted rounded-xl">
              <TabsTrigger
                value="login"
                className="flex-1 rounded-lg"
                data-ocid="login.tab"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="flex-1 rounded-lg"
                data-ocid="login.tab"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="student@university.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="rounded-xl h-11"
                    data-ocid="login.email_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPw ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="rounded-xl h-11 pr-10"
                      data-ocid="login.password_input"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowLoginPw(!showLoginPw)}
                    >
                      {showLoginPw ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="login.error_state"
                  >
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn-orange w-full mt-2"
                  data-ocid="login.submit_button"
                >
                  Login
                </button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Rahul Sharma"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="rounded-xl h-11"
                    data-ocid="login.name_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="student@university.edu"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="rounded-xl h-11"
                    data-ocid="login.signup_email_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-pw">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-pw"
                      type={showSignupPw ? "text" : "password"}
                      placeholder="Create a password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="rounded-xl h-11 pr-10"
                      data-ocid="login.signup_password_input"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowSignupPw(!showSignupPw)}
                    >
                      {showSignupPw ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Re-enter password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    className="rounded-xl h-11"
                    data-ocid="login.confirm_password_input"
                  />
                </div>
                {error && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="login.error_state"
                  >
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn-orange w-full mt-2"
                  data-ocid="login.signup_submit_button"
                >
                  Create Account
                </button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-white/60 text-xs mt-4">
          &copy; {new Date().getFullYear()}. Built with &hearts; using
          caffeine.ai
        </p>
      </div>
    </div>
  );
}
