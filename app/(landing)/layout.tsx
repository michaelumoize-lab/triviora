// app/(landing)/layout.tsx
import LandingNavbar from "@/components/Landing/LandingNavbar";
// import ScrollToTop from "@/components/Shared/ScrollToTop";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <ScrollToTop /> */}
      <LandingNavbar />
      <main>{children}</main>
    </>
  );
}
