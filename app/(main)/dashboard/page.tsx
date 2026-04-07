// app/(main)/dashboard/page.tsximport { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import DashboardClient from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Fetch session on the server
  const session = await getServerSession();

  // Protect the route - redirect unauthenticated users
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Pass session data to the Client Component
  return (
    <div className="min-h-screen bg-background">
      <DashboardClient
        user={session.user}
        // You can pass more server-fetched data here in the future (e.g. habits, stats)
      />
    </div>
  );
}
