// app/(main)/layout.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user) redirect("/auth/sign-in");
  return <>{children}</>;
}
