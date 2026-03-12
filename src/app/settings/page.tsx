"use client";

import { ApiKeySettings } from "@/components/api-key-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Zap, Clock } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure your f.improve experience.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ApiKeySettings />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Default Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-iterations">Default Iterations</Label>
              <Input
                id="default-iterations"
                type="number"
                defaultValue={10}
                min={1}
                max={50}
              />
              <p className="text-xs text-muted-foreground">
                Number of improvement iterations per job.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-goal">Default Goal</Label>
              <select
                id="default-goal"
                className="w-full px-3 py-2 rounded-md border bg-background"
                defaultValue="performance"
              >
                <option value="performance">Performance</option>
                <option value="quality">Code Quality</option>
                <option value="coverage">Test Coverage</option>
                <option value="bugs">Bug Hunting</option>
                <option value="refactor">Refactoring</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Rate Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg border">
                <p className="text-muted-foreground">improve_code</p>
                <p className="text-lg font-mono">10 credits</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-muted-foreground">quick_scan</p>
                <p className="text-lg font-mono">5 credits</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-muted-foreground">deep_improve</p>
                <p className="text-lg font-mono">50 credits</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-muted-foreground">get_experiments</p>
                <p className="text-lg font-mono">0 credits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}