"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Experiment {
  id: string;
  iteration: number;
  commit: string;
  hypothesis: string;
  metric_value: number;
  memory_gb: number;
  status: "keep" | "discard" | "crash";
  description: string;
  inserted_at: string;
}

interface ExperimentLogProps {
  jobId: string;
}

export function ExperimentLog({ jobId }: ExperimentLogProps) {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Poll for updates
    const fetchExperiments = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}/experiments`);
        const data = await res.json();
        setExperiments(data.experiments || []);
      } catch (err) {
        console.error("Failed to fetch experiments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
    const interval = setInterval(fetchExperiments, 2000);
    return () => clearInterval(interval);
  }, [jobId]);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading experiments...</div>;
  }

  if (experiments.length === 0) {
    return <div className="text-sm text-muted-foreground">No experiments yet.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Experiment Log</span>
          <Badge variant="outline">{experiments.length} iterations</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {experiments.map((exp) => (
              <div
                key={exp.id}
                className="flex items-start gap-3 p-3 rounded-lg border text-sm"
              >
                <div className="mt-0.5">
                  {exp.status === "keep" && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {exp.status === "discard" && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  {exp.status === "crash" && (
                    <XCircle className="h-4 w-4 text-orange-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      #{exp.iteration}
                    </span>
                    <code className="text-xs bg-muted px-1 rounded">
                      {exp.commit}
                    </code>
                    <Badge
                      variant={exp.status === "keep" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {exp.status}
                    </Badge>
                  </div>
                  <p className="mt-1">{exp.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>metric: {exp.metric_value.toFixed(4)}</span>
                    <span>memory: {exp.memory_gb.toFixed(1)}GB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
