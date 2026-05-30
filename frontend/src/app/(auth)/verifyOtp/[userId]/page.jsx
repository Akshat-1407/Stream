"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ENDPOINT, api } from "../../../../lib/api"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyOtp() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleVerify() {
    setIsLoading(true);
    try {
      const res = await api.post(ENDPOINT.verifyOtp, {
        userId, otp
      })

      /**
       * Store reset token temporarily.
       */
      sessionStorage.setItem(
        "resetToken",
        res.data.resetToken
      );

      router.push("/resetPassword");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
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
            Verify OTP
          </CardTitle>

          <CardDescription className="text-stone-400">
            Enter the 6-digit OTP sent to your email
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <Label className="block text-white mb-4">
              One-Time Password
            </Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="bg-black border-stone-700 text-white w-12 h-12 focus-visible:ring-red-400" />
                  <InputOTPSlot index={1} className="bg-black border-stone-700 text-white w-12 h-12 focus-visible:ring-red-400" />
                  <InputOTPSlot index={2} className="bg-black border-stone-700 text-white w-12 h-12 focus-visible:ring-red-400" />
                  <InputOTPSlot index={3} className="bg-black border-stone-700 text-white w-12 h-12 focus-visible:ring-red-400" />
                  <InputOTPSlot index={4} className="bg-black border-stone-700 text-white w-12 h-12 focus-visible:ring-red-400" />
                  <InputOTPSlot index={5} className="bg-black border-stone-700 text-white w-12 h-12 focus-visible:ring-red-400" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            onClick={handleVerify}
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white mt-2 p-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}