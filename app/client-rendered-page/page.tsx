"use client";

import { authClient } from "@/lib/auth-client";

export default function ClientRenderedPage() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  if (isPending) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <p className="text-gray-400 animate-pulse">Loading session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-3">
        <p className="text-red-500 font-medium">Session error</p>
        <p className="text-sm text-gray-500">
          Unable to load session. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Client Rendered Page</h1>

      <p className="text-gray-400">
        Authenticated:{" "}
        <span className={session ? "text-green-500" : "text-red-500"}>
          {session ? "Yes" : "No"}
        </span>
      </p>

      {session?.user && (
        <p className="text-gray-400">User ID: {session.user.id}</p>
      )}

      <button
        onClick={() => refetch()}
        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        Refetch Session
      </button>

      <p className="font-medium text-gray-700 dark:text-gray-200">
        Session and User Data:
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
