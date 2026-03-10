// src/app/(dashboard)/credits/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, History } from "lucide-react";

const PACKAGES = [
  { credits: 500, price: 5, popular: false },
  { credits: 1500, price: 12, popular: true },
  { credits: 5000, price: 35, popular: false },
];

export default async function CreditsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credits</h1>
        <p className="text-muted-foreground">
          Manage your credits and purchase more
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5" />
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">0 credits</div>
          <p className="text-sm text-muted-foreground mt-1">
            Credits are used for AI operations and agent tasks
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Purchase Credits</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <Card
              key={pkg.credits}
              className={`relative ${
                pkg.popular ? "border-primary" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                    Best Value
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {pkg.credits.toLocaleString()}
                </CardTitle>
                <CardDescription>credits</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold mb-4">
                  ${pkg.price}
                </div>
                <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                  <Plus className="size-4 mr-2" />
                  Purchase
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No transactions yet. Purchase credits to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}