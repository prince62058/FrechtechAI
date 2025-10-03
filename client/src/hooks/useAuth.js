import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export function useAuth() {
  const [, setLocation] = useLocation();
  
  const token = localStorage.getItem("token");

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const isAuthenticated = !!user && !!token;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocation("/login");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    token,
  };
}
