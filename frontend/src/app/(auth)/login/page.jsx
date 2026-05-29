'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ENDPOINT, api } from '../../../lib/api'
import { useAppDispatch } from '@/redux/hooks'
import { userLoggedInDetails } from '@/redux/userSlice'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch();
  const router = useRouter();

  const loginHandler = async () => {
    setIsLoading(true)

    try {
      const res = await api.post(ENDPOINT.login, {
        email: email,
        password: password,
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
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md bg-stone-900 border-stone-800 px-4 py-6 m-5">
        <CardHeader className='py-3'>
          <CardTitle className="text-4xl font-bold text-white">
            Login
          </CardTitle>

          <CardDescription className="text-stone-400">
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>

        <CardContent className={'space-y-4'}>

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
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-black border-stone-700 text-white placeholder:text-stone-600 focus-visible:ring-cyan-400 focus-visible:border-cyan-400"
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-white mb-2"
            >
              Password
            </Label>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-black border-stone-700 text-white placeholder:text-stone-600 focus-visible:ring-cyan-400 focus-visible:border-cyan-400"
            />
          </div>

          <Button
            onClick={loginHandler}
            disabled={isLoading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white mt-2 p-5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Logging In...
              </>
            ) : (
              "Login"
            )}
          </Button>


          <div className="flex items-center justify-between mt-6 text-sm">
            <Link
              href="/forgetPassword"
              className="text-stone-400 hover:text-white transition-colors"
            >
              Forgot Password?
            </Link>

            <div>
              <span className="text-stone-400">
                Need an account?{' '}
              </span>

              <Link
                href="/signup"
                className="text-white underline hover:no-underline transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}