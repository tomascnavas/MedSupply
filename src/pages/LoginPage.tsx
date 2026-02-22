import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import medsupplyLogo from "@/assets/medsupply-logo.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl border border-border shadow-sm p-8">
          {/* Logo */}
           <div className="flex flex-col items-center mb-8">
            <img src={medsupplyLogo} alt="MedSupply" className="h-20 mb-2" />
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs font-medium text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              INTERNAL TOOL
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@medsupplyco.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot Password?
            </a>
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Need access? Contact{" "}
            <a href="#" className="text-foreground underline">
              IT Support
            </a>
            .
          </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        © 2024 MedSupply Co. Authorized Personnel Only.
      </p>
    </div>
  );
}
