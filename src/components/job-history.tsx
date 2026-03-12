"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface Job {
  id: string;
  tag: string;
  goal: string;
  status: "pending" | "running" | "completed" | "failed";
  iterations: number;
  improvement_percent: number;
  created_at: string;
}

export function JobHistory() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading jobs...</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No jobs yet. Start your first improvement above!
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-3">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-mono">
                  {job.tag}
                </CardTitle>
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
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Goal: {job.goal}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{job.iterations} iterations</span>
                </div>
                {job.status === "completed" && (
                  <div className="flex items-center gap-1">
                    {job.improvement_percent > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>
                      {job.improvement_percent > 0 ? "+" : ""}
                      {job.improvement_percent.toFixed(1)}% improvement
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <Link href={`/improve/${job.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  Download TSV
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}