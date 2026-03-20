// src/app/(auth)/layout.tsx
/**
 * Auth layout for sign-in, sign-up, forgot-password pages.
 * Centered card with gradient background.
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {children}
    </div>
  );
}