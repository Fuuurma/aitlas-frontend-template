"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExperimentLog } from "@/components/experiment-log";
import { CodeDiff } from "@/components/code-diff";
import { ArrowLeft, Download, Play } from "lucide-react";

interface Job {
  id: string;
  tag: string;
  code: string;
  benchmark: string;
  goal: string;
  iterations: number;
  status: string;
  best_code: string;
  improvement_percent: number;
  created_at: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${params.id}`);
        const data = await res.json();
        setJob(data.job);
      } catch (err) {
        console.error("Failed to fetch job:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-muted-foreground">Loading job...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-muted-foreground">Job not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold font-mono">{job.tag}</h1>
        <Badge
          variant={
            job.status === "completed"
              ? "default"
              : job.status === "running"
              ? "secondary"
              : "destructive"
          }
        >
          {job.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg capitalize">{job.goal}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Iterations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-mono">{job.iterations}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-lg font-mono ${job.improvement_percent > 0 ? "text-green-500" : "text-red-500"}`}>
              {job.improvement_percent > 0 ? "+" : ""}{job.improvement_percent.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="experiments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="code">Code Diff</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        <TabsContent value="experiments">
          <ExperimentLog jobId={job.id} />
        </TabsContent>

        <TabsContent value="code">
          <div className="space-y-6">
            <CodeDiff
              oldCode={job.code}
              newCode={job.best_code || job.code}
              title="Original vs. Best"
            />
          </div>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Benchmark Command</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-muted rounded-lg font-mono text-sm">
                {job.benchmark}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 mt-6">
        <Button onClick={() => window.open(`/api/experiments/${job.id}/tsv`)}>
          <Download className="h-4 w-4 mr-2" />
          Download TSV
        </Button>
        <Button variant="outline">
          <Play className="h-4 w-4 mr-2" />
          Run Again
        </Button>
      </div>
    </div>
  );
}