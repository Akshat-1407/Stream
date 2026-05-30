"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { ENDPOINT, api } from '../../../lib/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleReset() {

    setIsLoading(true);
    try {
      const resetToken = sessionStorage.getItem("resetToken");

      const res = await api.patch(ENDPOINT.resetPassword, {
        resetToken, password, confirmPassword
      })

      if (res.status === 200) {
        sessionStorage.removeItem("resetToken");
        router.push("/login");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      console.log("err: ", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md bg-stone-900 border-stone-800 px-4 py-6 m-5">
        <CardHeader className="py-3">
          <CardTitle className="text-4xl font-bold text-white">
            Reset Password
          </CardTitle>

          <CardDescription className="text-stone-400">
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label
              htmlFor="password"
              className="block text-white mb-2"
            >
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-black border-stone-700 text-white placeholder:text-stone-600 focus-visible:ring-red-400"
            />
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-white mb-2"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="bg-black border-stone-700 text-white placeholder:text-stone-600 focus-visible:ring-red-400"
            />
          </div>

          <Button
            className="w-full bg-rose-500 hover:bg-rose-600 text-white mt-2 p-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleReset}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}