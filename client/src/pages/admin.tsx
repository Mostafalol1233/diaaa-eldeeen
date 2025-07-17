import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLogin from "@/components/admin-login";
import AdminDashboard from "@/components/admin-dashboard";
import type { User } from "@shared/schema";

export default function Admin() {
  const [, setLocation] = useLocation();

  const { data: authData, isLoading } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gaming-bg flex items-center justify-center">
        <div className="text-gaming-text">Loading...</div>
      </div>
    );
  }

  if (!authData?.user) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <AdminLogin 
          isOpen={true}
          onClose={() => setLocation("/")}
          redirectOnSuccess={false}
        />
      </div>
    );
  }

  return <AdminDashboard user={authData.user} />;
}
