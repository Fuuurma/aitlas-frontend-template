"use client";

import { useState } from "react";
import { ImprovementForm } from "@/components/improvement-form";
import { ExperimentLog } from "@/components/experiment-log";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, FlaskConical, History } from "lucide-react";

export default function ImprovePage() {
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    code: string;
    benchmark: string;
    goal: string;
    iterations: number;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setActiveJob(result.job_id);
    } catch (err) {
      console.error("Failed to start job:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FlaskConical className="h-8 w-8" />
          f.improve
        </h1>
        <p className="text-muted-foreground mt-2">
          Autonomous code improvement. Inspired by karpathy/autoresearch.
        </p>
      </div>

      <Tabs defaultValue="new" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new">
            <Code2 className="h-4 w-4 mr-2" />
            New Job
          </TabsTrigger>
          <TabsTrigger value="active" disabled={!activeJob}>
            <FlaskConical className="h-4 w-4 mr-2" />
            Active
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <div className="grid gap-6 lg:grid-cols-2">
            <ImprovementForm onSubmit={handleSubmit} isLoading={isLoading} />
            
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">1. ANALYZE</h4>
                  <p className="text-muted-foreground">
                    Agent reads your code and runs baseline benchmark.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">2. HYPOTHESIZE</h4>
                  <p className="text-muted-foreground">
                    Agent proposes an improvement based on the goal.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">3. EXPERIMENT</h4>
                  <p className="text-muted-foreground">
                    Change is applied and benchmark runs.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">4. MEASURE</h4>
                  <p className="text-muted-foreground">
                    If metrics improve, keep. Otherwise discard.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">5. ITERATE</h4>
                  <p className="text-muted-foreground">
                    Repeat until improvement plateaus.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active">
          {activeJob ? (
            <ExperimentLog jobId={activeJob} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No active job. Start a new improvement above.
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="text-center py-12 text-muted-foreground">
            Job history coming soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
