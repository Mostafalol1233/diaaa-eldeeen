import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X } from "lucide-react";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  redirectOnSuccess?: boolean;
}

export default function AdminLogin({ isOpen, onClose, redirectOnSuccess = true }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return apiRequest("POST", "/api/auth/login", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel.",
      });
      onClose();
      if (redirectOnSuccess) {
        setLocation("/admin");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gaming-card border-gaming-border text-gaming-text max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">Admin Login</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gaming-text-secondary hover:text-gaming-text"
            >
              <X size={20} />
            </Button>
          </div>
          <div className="bg-gaming-card-hover border border-gaming-border rounded-lg p-3 mt-3">
            <p className="text-sm text-gaming-text-secondary">
              <span className="text-gaming-accent font-medium">Default credentials:</span><br/>
              Username: <span className="text-gaming-text font-mono">admin</span><br/>
              Password: <span className="text-gaming-text font-mono">admin123</span>
            </p>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gaming-text-secondary">Username</Label>
            <Input
              id="email"
              type="text"
              placeholder="admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gaming-card-hover border-gaming-border text-gaming-text focus:ring-gaming-accent"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gaming-text-secondary">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gaming-card-hover border-gaming-border text-gaming-text focus:ring-gaming-accent"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="w-full bg-gaming-accent hover:bg-gaming-accent/90 text-white"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
