export default function VerifyRequestPage() {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">📬 Check your email</h1>
          <p className="text-gray-600 mb-2">
            We’ve sent you a sign-in link. Please check your inbox to complete the login.
          </p>
          <p className="text-sm text-gray-400">It may take a few moments to arrive. Be sure to check your spam folder!</p>
        </div>
      </main>
    )
  }
  