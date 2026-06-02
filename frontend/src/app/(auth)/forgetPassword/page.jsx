"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { ENDPOINT, api } from '../../../lib/api'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const res = await api.post(ENDPOINT.forgetpassword, {
        email,
      })
      toast.success(res?.data?.message);
      router.push(`/verifyOtp/${res?.data?.userId}`);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md bg-stone-900 border-stone-800 px-4 py-6 m-5">
        <CardHeader className="py-3">
          <CardTitle className="text-4xl font-bold text-white">
            Forgot Password
          </CardTitle>

          <CardDescription className="text-stone-400">
            Enter your email to receive an OTP
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="block text-white mb-2"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="bg-black border-stone-700 text-white placeholder:text-stone-600 focus-visible:ring-red-400"
              disabled={isLoading}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white mt-2 p-5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </Button>

          <div className="flex items-center justify-center mt-3 text-sm">
            <Link
              href="/login"
              className="text-stone-400 hover:text-white transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}