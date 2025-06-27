import { useAuth } from "@/hooks/useAuth";
import { useCredentialAuth } from "@/hooks/useCredentialAuth";
import { ReactNode } from "react";

interface CredentialAuthWrapperProps {
  children: ReactNode;
}

export default function CredentialAuthWrapper({ children }: CredentialAuthWrapperProps) {
  const replitAuth = useAuth();
  const credentialAuth = useCredentialAuth();

  // Use Replit Auth if available, otherwise fall back to credential auth
  const isAuthenticated = replitAuth.isAuthenticated || credentialAuth.isAuthenticated;
  const isLoading = replitAuth.isLoading || credentialAuth.isLoading;
  const user = replitAuth.user || credentialAuth.user;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
}