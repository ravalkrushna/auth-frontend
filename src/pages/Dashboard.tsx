import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { logout, me } from "../api/auth";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ShieldCheck,
  User,
  LogOut,
  KeyRound,
  Activity,
  Lock,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: me,
    retry: 0,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/login", { replace: true });
    },
    onError: () => {
      navigate("/login", { replace: true });
    },
  });

  const userEmail = data?.email || "Unknown User";

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f6f3ea] via-[#f3f0e6] to-[#efeadd]">
      {/* ✅ Top Header */}
      <header className="sticky top-0 z-10 border-b border-black/10 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left title */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#3a5a40] flex items-center justify-center text-white shadow-md">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[#1f2a1f]">
                Auth Learning
              </h1>
              <p className="text-sm text-[#5a6a5a]">
                Secure session via HTTPOnly Cookies 🌿
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/changepassword")}
              className="gap-2 border-black/15 bg-white/70 hover:bg-white"
            >
              <KeyRound size={16} />
              Change Password
            </Button>

            <Button
              variant="destructive"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="gap-2"
            >
              <LogOut size={16} />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      {/* ✅ Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#1f2a1f]">
              Dashboard
            </h2>
            <p className="text-sm text-[#5a6a5a] mt-1">
              Your secure space to manage account and security
            </p>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="gap-2 bg-[#e6efe6] text-[#2f4d35]"
            >
              <Activity size={14} />
              {isLoading ? "Checking session..." : "Session Active"}
            </Badge>

            <Badge className="gap-2 bg-[#3a5a40] text-white">
              <Lock size={14} />
              Cookie Auth
            </Badge>
          </div>
        </div>

        <Separator className="mb-8 bg-black/10" />

        {/* ✅ Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-sm bg-white/70 backdrop-blur-md">
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ✅ Error State */}
        {!isLoading && isError && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Session Error</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-red-700">
              Could not load user session. Please login again.
              <div className="mt-4">
                <Button onClick={() => navigate("/login")}>Go to Login</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ✅ Success State */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="shadow-sm bg-white/75 backdrop-blur-md hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-[#1f2a1f]">
                  Profile
                </CardTitle>
                <div className="h-10 w-10 rounded-xl bg-[#e6efe6] flex items-center justify-center">
                  <User size={18} className="text-[#2f4d35]" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-[#5a6a5a]">Signed in as:</p>
                <p className="font-medium break-all text-[#1f2a1f]">
                  {userEmail}
                </p>

                <div className="pt-2">
                  <Badge variant="outline" className="border-black/15">
                    Verified user ✅
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Login Status */}
            <Card className="shadow-sm bg-white/75 backdrop-blur-md hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-[#1f2a1f]">
                  Login Status
                </CardTitle>
                <div className="h-10 w-10 rounded-xl bg-[#e6efe6] flex items-center justify-center">
                  <Activity size={18} className="text-[#2f4d35]" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-[#5a6a5a]">
                  Current session state:
                </p>
                <p className="font-medium text-[#1f2a1f]">
                  You are logged in ✅
                </p>
                <Badge className="w-fit bg-[#3a5a40] text-white">
                  Active Session
                </Badge>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="shadow-sm bg-white/75 backdrop-blur-md hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-[#1f2a1f]">
                  Security
                </CardTitle>
                <div className="h-10 w-10 rounded-xl bg-[#e6efe6] flex items-center justify-center">
                  <Lock size={18} className="text-[#2f4d35]" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-[#5a6a5a]">Auth method:</p>

                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-[#1f2a1f]">HTTPOnly Cookie</p>
                  <Badge
                    variant="secondary"
                    className="bg-[#e6efe6] text-[#2f4d35]"
                  >
                    Enabled
                  </Badge>
                </div>

                <p className="text-xs text-[#5a6a5a]">
                  Secure cookies prevent token access via JavaScript.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
