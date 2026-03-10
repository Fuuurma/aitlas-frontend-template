// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Aitlas</CardTitle>
          <CardDescription>
            Sovereign AI. Your keys. Your agents.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </CardContent>
      </Card>
    </main>
  );
}