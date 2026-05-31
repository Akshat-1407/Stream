'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LoaderCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ENDPOINT, api } from '../../../lib/api'
import { useDispatch } from 'react-redux'
import { userLoggedInDetails } from '@/redux/userSlice'

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const signupHandler = async () => {

    setIsLoading(true);

    try {
      const res = await api.post(ENDPOINT.signup, {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });

      if (res?.data?.status === "success") {
        const loggedInUser = res?.data?.user;
        dispatch(userLoggedInDetails(loggedInUser))
        router.push("/");
      }
      
    } catch(err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      console.log("err: ", errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <Card className="w-full max-w-md bg-stone-900 border-stone-800 px-4 m-5">
        <CardHeader className='py-4'>
          <CardTitle className="text-4xl font-bold text-white">Sign Up</CardTitle>
          <CardDescription className="text-stone-400">
            Enter information to create your account.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* {error && (
            <div className="p-3 bg-red-900/20 border border-red-700 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )} */}
         
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-black border-stone-700 text-white focus-visible:ring-red-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-black border-stone-700 text-white focus-visible:ring-red-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" title="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-black border-stone-700 text-white focus-visible:ring-red-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" title="confirmPassword" className="text-white">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-black border-stone-700 text-white focus-visible:ring-red-400"
            />
          </div>

          <Button
            onClick={signupHandler}
            disabled={isLoading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white mt-2 p-5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <div className="mt-6 text-sm text-center">
            <span className="text-stone-400">Already have an account? </span>
            <Link href="/login" className="text-white underline hover:no-underline transition-colors">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}