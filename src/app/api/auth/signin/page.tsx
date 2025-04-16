'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('email', {
      email,
      callbackUrl: '/',
    });
    setSent(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-2">Login to RateMyTA</h1>
      <p className="mb-6 text-gray-600 text-center max-w-md">
        Enter your school email address and we’ll send you a magic login link.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        {!sent ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@school.edu"
              required
              className="border p-2 rounded w-72"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Send Magic Link
            </button>
          </>
        ) : (
          <p className="text-green-600 font-medium">Check your email for the login link!</p>
        )}
      </form>
    </div>
  );
}
