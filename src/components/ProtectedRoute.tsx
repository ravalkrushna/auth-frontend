import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { me } from "../api/auth";

type Props = {
  children: JSX.Element;
};

function ProtectedRoute({ children }: Props) {
  const { isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: me,
    retry: 0,
    staleTime: 1000 * 30, 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 font-medium">Checking session...</p>
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
