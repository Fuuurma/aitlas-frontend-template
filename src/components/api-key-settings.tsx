"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Key, Plus, Trash2 } from "lucide-react";

interface ApiKey {
  id: string;
  provider: string;
  key_preview: string;
  created_at: string;
}

export function ApiKeySettings() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newProvider, setNewProvider] = useState("openai");
  const [loading, setLoading] = useState(false);

  const handleAddKey = async () => {
    if (!newKey.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: newProvider, key: newKey }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setKeys([...keys, data.api_key]);
        setNewKey("");
      }
    } catch (err) {
      console.error("Failed to add key:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
      setKeys(keys.filter((k) => k.id !== id));
    } catch (err) {
      console.error("Failed to delete key:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Keys (BYOK)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Bring Your Own Key — use your own API keys. Keys are encrypted at rest.
        </p>

        <div className="space-y-3">
          {keys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline">{key.provider}</Badge>
                <code className="text-sm font-mono">{key.key_preview}</code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteKey(key.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>

        <div className="grid gap-3 pt-4 border-t">
          <Label>Add New Key</Label>
          <div className="flex gap-2">
            <Select value={newProvider} onValueChange={setNewProvider}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="password"
              placeholder="sk-..."
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddKey} disabled={loading || !newKey.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}