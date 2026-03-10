// src/app/sign-in/page.tsx
import { Suspense } from "react";
import { SignInForm } from "./form";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}