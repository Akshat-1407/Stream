'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgetPassword() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-stone-900 rounded-lg p-8 border border-stone-800">
        <h1 className="text-3xl font-bold text-white-400 mb-2">Forget / Reset Password</h1>
        <p className="text-stone-400 mb-6">Enter your email to get OTP.</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="email" className="block text-white mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-stone-700 rounded-md px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>

          
          <button
            type="submit"
            dis abled={isLoading}
            className="w-full cursor-pointer bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold py-3 rounded-md mt-6 transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

      </div>
    </main>
  )
}
