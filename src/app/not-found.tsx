"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <h2 className="text-6xl font-bold mb-4">404</h2>
      <h3 className="text-2xl font-semibold mb-2">Page not found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="size-4 mr-2" />
          Go back
        </Button>
        <Button asChild>
          <Link href="/dashboard">
            <Home className="size-4 mr-2" />
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}