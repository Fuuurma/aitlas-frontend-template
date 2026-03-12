"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ImprovementFormProps {
  onSubmit: (data: {
    code: string;
    benchmark: string;
    goal: string;
    iterations: number;
  }) => void;
  isLoading?: boolean;
}

export function ImprovementForm({ onSubmit, isLoading }: ImprovementFormProps) {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`);
  const [benchmark, setBenchmark] = useState("node bench.js");
  const [goal, setGoal] = useState("performance");
  const [iterations, setIterations] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ code, benchmark, goal, iterations });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Improvement Job</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code to Improve</Label>
            <Textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={10}
              className="font-mono text-sm"
              placeholder="Paste your code here..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benchmark">Benchmark Command</Label>
            <Input
              id="benchmark"
              value={benchmark}
              onChange={(e) => setBenchmark(e.target.value)}
              placeholder="e.g., node bench.js or npm test"
            />
            <p className="text-xs text-muted-foreground">
              Command to run benchmark. Should output metrics like "time: 150ms"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Goal</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="quality">Code Quality</SelectItem>
                  <SelectItem value="coverage">Test Coverage</SelectItem>
                  <SelectItem value="bugs">Bug Hunting</SelectItem>
                  <SelectItem value="refactor">Refactoring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="iterations">Iterations</Label>
              <Input
                id="iterations"
                type="number"
                min={1}
                max={50}
                value={iterations}
                onChange={(e) => setIterations(parseInt(e.target.value))}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Starting..." : "Start Improvement Loop"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
