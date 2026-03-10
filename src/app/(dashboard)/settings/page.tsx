// src/app/(dashboard)/settings/page.tsx
import { SettingsForm } from "./form";

export default async function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and API keys
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}